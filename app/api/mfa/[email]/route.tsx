import { EmailTemplate } from "@/components/emailTemplate";
import { NextRequest, NextResponse } from "next/server";
import { generateOTP } from "@/helper/generateRandomNumber";
import prisma from "@/lib/prisma";
import { isDateExpired } from "@/helper/checkOtpExp";
import axios from "axios";
import { encrypt } from "@/helper/encrypt";
import moment from "moment";

export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } },
) {
  // Data required
  // email id + OTP
  // here email coming from params and OTP coming from func
  try {
    if (!params.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const isUserExist = await prisma.user.findUnique({
      where: {
        email: params.email,
      },
    });
    console.log(!isUserExist);

    if (!isUserExist) {
      return NextResponse.json(
        {
          data: "No user find with this credentials",
        },
        {
          status: 500,
        },
      );
    }

    let otp = "1234";

    if (process.env.NODE_ENV == "production") {
      otp = generateOTP();
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
    const Expdate = new Date(Date.now());
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
    // data contains otp
    // params contains email
    const data = await req.json();
    const fetchOtp = await prisma.otp.findFirst({
      where: {
        otp: data.otp,
        user_otp: params.email,
      },
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

    if (!isDateExpired(fetchOtp?.otpExp!))
      return NextResponse.json({ error: "OTP Expired" }, { status: 400 });

    const res = await generateCardForUsers(fetchOtp.sender);
    if (!res)
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );

    return NextResponse.json(
      { data: "OTP Verified", success: true },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

async function generateCardForUsers(user: any) {
  try {
    const generateString = generateOTP(16);
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
    console.log(e);
    throw new Error(e.message);
  }
}
