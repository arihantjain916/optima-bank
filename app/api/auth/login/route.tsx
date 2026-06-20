import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generatePreAuthToken } from "@/helper/TokenHelper";
import { generateUniqueAccountNumber } from "@/helper/generateRandomNumber";

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    const login = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!login) {
      return NextResponse.json(
        {
          data: "No user find with this credentials",
        },
        {
          status: 401,
        },
      );
    }
    const pass = await bcrypt.compareSync(data.password, login.password);
    if (!pass)
      return NextResponse.json(
        {
          data: "Invalid Password!!",
        },
        {
          status: 401,
        },
      );

    const account_no = generateUniqueAccountNumber(
      login.id,
      process.env.ACCOUNT_TOKEN as string,
    );

    await prisma.user.update({
      where: {
        id: login.id,
      },
      data: {
        account_no: account_no,
      },
    });

    // Password verified, but NOT logged in yet — issue only a short-lived
    // pre-auth token that authorizes the MFA step. The session JWT is minted
    // after the OTP is verified.
    const token = await generatePreAuthToken(login.email, login.id);

    return NextResponse.json(
      {
        message: "OTP required",
        token,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
