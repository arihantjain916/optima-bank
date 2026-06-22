import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
var bcrypt = require("bcryptjs");

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { password, email, name } = data;
  if (
    typeof email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return NextResponse.json({ error: "Invalid registration details" }, { status: 400 });
  }
  var salt = await bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT!));
  var hash = await bcrypt.hashSync(password, salt);


  const saveData = {
    email,
    password: hash,
    password_updated_at: new Date(),
    name,
    account_no: null,
  };

  try {
    const checkExistingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkExistingUser)
      return NextResponse.json(
        { data: "User with same email already register" },
        { status: 409 },
      );

    const register = await prisma.user.create({
      data: saveData,
    });

    if (!register) {
      return NextResponse.json({
        status: 500,
        data: "Unable to register user",
      });
    }

    const data = {
      ...register,
      password: undefined,
    };

    return NextResponse.json({
      message: "Account Open Successfully!!",
      data: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
