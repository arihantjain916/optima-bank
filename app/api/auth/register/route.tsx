import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
var bcrypt = require("bcryptjs");
import { generateUniqueAccountNumber } from "@/helper/generateRandomNumber";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { password, email, name } = data;
  var salt = await bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT!));
  var hash = await bcrypt.hashSync(password, salt);


  const saveData = {
    email,
    password: hash,
    name,
    account_no: "",
  };

  try {
    const checkExistingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (checkExistingUser)
      return NextResponse.json({
        status: 500,
        data: "User with same email already register",
      });

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
