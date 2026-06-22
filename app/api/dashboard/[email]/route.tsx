import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { deleteToken } from "@/helper/TokenHelper";
import { currentUserId, unauthorized } from "@/lib/current-user";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { email: string };
  },
) {
  try {
    const userId = currentUserId();
    if (!userId) return unauthorized();
    const dashboard = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        password_updated_at: true,
        account_no: true,
        id: true,
        openingBalance: true,
        currentBalance: true,
      },
    });

    if (!dashboard)
      return NextResponse.json({ data: "User not found" }, { status: 404 });

    const [received, sent] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          receiver_acc_no: dashboard.account_no ?? "",
          method: "CREDIT",
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          sender_acc_no: dashboard.account_no ?? "",
          method: "DEBIT",
        },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json(
      {
        message: "Dashboard Content",
        data: {
          ...dashboard,
          totalReceived: received._sum.amount ?? 0,
          totalSent: sent._sum.amount ?? 0,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { email: string } },
) {
  try {
    const userId = currentUserId();
    if (!userId) return unauthorized();
    const data = await request.json();

    if (typeof data.old !== "string" || typeof data.new !== "string" || data.new.length < 8) {
      return NextResponse.json({ data: "Invalid password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ data: "User not found" }, { status: 404 });
    }

    const isPasswordValid = bcrypt.compareSync(data.old, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ data: "Invalid Password" }, { status: 400 });
    }

    const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_SALT!));
    const hashedPassword = bcrypt.hashSync(data.new, salt);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        password_updated_at: new Date(),
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { data: "Error updating password" },
        { status: 500 },
      );
    }

    await deleteToken();

    return NextResponse.json(
      { message: "Password Updated" },
      { status: 200 },
    );
  } catch (data: any) {
    return NextResponse.json({ data: data.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { email: string };
  },
) {
  try {
    const userId = currentUserId();
    if (!userId) return unauthorized();
    let data;
    try {
      data = await request.json();
    } catch (err: any) {
      return NextResponse.json(
        { data: "Please provide some data..." },
        { status: 500 },
      );
    }
    const allowed = ["name", "email"];
    if (!data || typeof data !== "object" || Object.keys(data).some((key) => !allowed.includes(key))) {
      return NextResponse.json({ data: "Invalid profile update" }, { status: 400 });
    }
    if (data.name !== undefined && (typeof data.name !== "string" || data.name.trim().length < 2)) {
      return NextResponse.json({ data: "Invalid name" }, { status: 400 });
    }
    if (data.email !== undefined && (typeof data.email !== "string" || !/^\S+@\S+\.\S+$/.test(data.email))) {
      return NextResponse.json({ data: "Invalid email" }, { status: 400 });
    }
    const CheckIsUserExist = await prisma.user.findUnique({ where: { id: userId } });

    if (!CheckIsUserExist)
      return NextResponse.json({ data: "User not found" }, { status: 404 });

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: data,
    });

    if (!updateUser)
      return NextResponse.json(
        { data: "Error updating user name" },
        { status: 500 },
      );

    return NextResponse.json(
      {
        message: "User Updated",
      },
      { status: 200 },
    );
  } catch (data: any) {
    return NextResponse.json({ data: data.message }, { status: 500 });
  }
}
