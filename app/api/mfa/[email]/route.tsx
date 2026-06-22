import { EmailTemplate } from "@/components/emailTemplate";
import { NextRequest, NextResponse } from "next/server";
import { generateOTP } from "@/helper/generateRandomNumber";
import prisma from "@/lib/prisma";
import { isDateExpired } from "@/helper/checkOtpExp";
import axios from "axios";
import { encrypt, generateUniqueCardNumber } from "@/helper/encrypt";
import moment from "moment";
import { generateToken } from "@/helper/TokenHelper";

function isAuthenticatedMfaUser(req: NextRequest, email: string) {
  return req.headers.get("x-user-email") === email;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } },
) {
  // Data required
  // email id + OTP
  // here email coming from params and OTP coming from func
  try {
    if (!params.email || !isAuthenticatedMfaUser(req, params.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isUserExist = await prisma.user.findUnique({
      where: {
        email: params.email,
      },
    });

    if (!isUserExist) {
      return NextResponse.json(
        {
          data: "No user find with this credentials",
        },
        {
          status: 401,
        },
      );
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    const otp = isDevelopment ? "1234" : generateOTP();

    if (!isDevelopment) {
      var data = {
        service_id: process.env.EMAIL_SERVICE_ID,
        template_id: process.env.EMAIL_TEMPLATE_ID,
        user_id: process.env.EMAIL_USER_ID,
        template_params: {
          email: params.email,
          otp: otp,
        },
      };

      const res = await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res)
        return NextResponse.json(
          { error: "error sending email" },
          { status: 500 },
        );
    }

    // save Otp to DB
    // A fresh code supersedes every previously issued code for this user.
    // Keep the development code (1234) local-only, but give it the same
    // short lifetime and single-use behaviour as production codes.
    const Expdate = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.otp.deleteMany({
      where: { user_otp: params.email },
    });
    const saveOtp = await prisma.otp.create({
      data: {
        user_otp: params.email,
        otp: otp,
        otpExp: Expdate,
      },
    });
    if (!saveOtp)
      return NextResponse.json({ error: "error saving OTP" }, { status: 500 });

    return NextResponse.json(
      { data: "Please Check your email for the OTP", success: true },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { email: string } },
) {
  try {
    if (!isAuthenticatedMfaUser(req, params.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // data contains otp
    // params contains email
    const data = await req.json();
    const otp = String(data.otp ?? "");
    if (!/^\d{4}$/.test(otp)) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const fetchOtp = await prisma.otp.findFirst({
      where: {
        user_otp: params.email,
      },
      orderBy: { otpExp: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!fetchOtp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    if (isDateExpired(fetchOtp.otpExp)) {
      await prisma.otp.deleteMany({ where: { id: fetchOtp.id } });
      return NextResponse.json({ error: "OTP Expired" }, { status: 400 });
    }

    if (fetchOtp.otp !== otp) {
      // Limit guesses per issued code. On the fifth failed attempt the code is
      // removed, requiring the user to request a new one.
      const failedAttempt = await prisma.otp.updateMany({
        where: { id: fetchOtp.id, attempts: { lt: 4 } },
        data: { attempts: { increment: 1 } },
      });
      if (failedAttempt.count === 0) {
        await prisma.otp.deleteMany({ where: { id: fetchOtp.id } });
      }
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Delete before completing sign-in so the code cannot be replayed. The
    // conditional delete also ensures concurrent verification attempts only
    // let one request proceed.
    const consumedOtp = await prisma.otp.deleteMany({
      where: { id: fetchOtp.id, user_otp: params.email, otp },
    });
    if (consumedOtp.count !== 1) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const res = await generateCardForUsers(fetchOtp.sender);

    if (!res)
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );

    // OTP passed → mint the real session JWT now (also sets the cookie).
    const token = await generateToken(params.email, fetchOtp.sender.id);

    const response = NextResponse.json(
      { data: "OTP Verified", success: true, token },
      { status: 200 },
    );
    // Set the web session on this exact response. Mobile clients ignore this
    // cookie and use the returned token as an Authorization Bearer token.
    response.cookies.set({
      name: "authCookie",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.delete("mfaCookie");
    return response;
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

async function generateCardForUsers(user: any) {
  try {
    const generateString = generateUniqueCardNumber(
      user.id,
      process.env.ENCRYPT_TOKEN!,
      15, //always desired - 1
      "RuPay",
    );
    const { iv, data, tag } = encrypt(
      generateString,
      process.env.ENCRYPT_TOKEN!,
    );

    if (!data) {
      throw new Error("Error encrypting data");
    }

    const isCardAlreadyExist = await prisma.card.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (isCardAlreadyExist) {
      return true;
    }

    const expiryYear = moment(new Date()).add(10, "year").format("YYYY");
    const expiryMonth = moment(new Date()).add(10, "year").format("MM");
    const last4 = generateString.slice(-4);
    const card_holder_name = user?.name;
    const cvv_encrypted = "";

    const res = await prisma.card.create({
      data: {
        card_number_encrypted: data,
        card_holder_name,
        cvv_encrypted,
        expiry_month: expiryMonth,
        expiry_year: expiryYear,
        last4: last4,
        userId: user.id,
        encryptInfo: {
          create: {
            iv,
            tag,
          },
        },
      },
    });

    if (!res) return false;

    return true;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
