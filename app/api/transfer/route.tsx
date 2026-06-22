import prisma from "@/lib/prisma";
import { currentUserId, unauthorized } from "@/lib/current-user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const userId = currentUserId();
  if (!userId) return unauthorized();
  let data;
  try {
    data = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Please enter some data" },
      { status: 400 },
    );
  }

  const requiredFields = ["receiver_acc_no", "amount", "type"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missingFields.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    if (
      typeof data.receiver_acc_no !== "string" ||
      !/^\d{10,12}$/.test(data.receiver_acc_no) ||
      !Number.isSafeInteger(data.amount) ||
      data.amount <= 0 ||
      !["UPI", "NEFT", "IMPS", "RTGS"].includes(data.type)
    ) {
      return NextResponse.json({ error: "Invalid transfer details" }, { status: 400 });
    }

    const sender = await prisma.user.findUnique({ where: { id: userId } });
    if (!sender?.account_no) return NextResponse.json({ error: "Sender account not available" }, { status: 400 });
    const senderAccountNumber = sender.account_no;

    if (senderAccountNumber === data.receiver_acc_no) {
      return NextResponse.json(
        { error: "Sender and Receiver cannot be same" },
        { status: 400 },
      );
    }
    const receiver = await prisma.user.findUnique({
      where: { account_no: data.receiver_acc_no },
      select: { id: true },
    });
    if (!receiver) {
      return NextResponse.json(
        { error: "Invalid Receiver Account Number" },
        { status: 404 },
      );
    }

    if (data.amount > sender.currentBalance) {
      return NextResponse.json(
        { error: "Insufficient Balance" },
        { status: 400 },
      );
    }

    // Perform the transaction
    const completed = await prisma.$transaction(async (tx) => {
      const debited = await tx.user.updateMany({
        where: { id: userId, currentBalance: { gte: data.amount } },
        data: { currentBalance: { decrement: data.amount } },
      });
      if (debited.count !== 1) return false;

      await tx.user.update({
        where: { account_no: data.receiver_acc_no },
        data: {
          currentBalance: { increment: data.amount },
        },
      });

      // Create two transaction records: one for debit and one for credit
      await Promise.all([
        tx.transaction.create({
          data: {
            sender_acc_no: senderAccountNumber,
            receiver_acc_no: data.receiver_acc_no,
            amount: data.amount,
            type: data.type,
            method: "DEBIT",
          },
        }),
        tx.transaction.create({
          data: {
            sender_acc_no: senderAccountNumber,
            receiver_acc_no: data.receiver_acc_no,
            amount: data.amount,
            type: data.type,
            method: "CREDIT",
          },
        }),
      ]);
      return true;
    });

    if (!completed) {
      return NextResponse.json({ error: "Insufficient Balance" }, { status: 400 });
    }

    return NextResponse.json({ message: "Amount transferred successfully" });
  } catch (err) {
    console.error("Transaction failed:", err);
    return NextResponse.json(
      { data: "Transaction failed. Please try again later." },
      { status: 500 },
    );
  }
}
