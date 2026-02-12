import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let data;
  try {
    data = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Please enter some data" },
      { status: 400 },
    );
  }

  const requiredFields = ["sender_acc_no", "receiver_acc_no", "amount", "type"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missingFields.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    if (data.sender_acc_no == data.receiver_acc_no) {
      return NextResponse.json(
        { error: "Sender and Receiver cannot be same" },
        { status: 400 },
      );
    }
    // Check if both accounts exist
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { account_no: data.sender_acc_no } }),
      prisma.user.findUnique({ where: { account_no: data.receiver_acc_no } }),
    ]);

    if (!sender) {
      return NextResponse.json(
        { error: "Invalid Sender Account Number" },
        { status: 404 },
      );
    }
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
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { account_no: data.sender_acc_no },
        data: { currentBalance: { decrement: data.amount } },
      });

      await tx.user.update({
        where: { account_no: data.receiver_acc_no },
        data: {
          currentBalance: receiver.currentBalance + data.amount,
        },
      });

      // Create two transaction records: one for debit and one for credit
      await Promise.all([
        tx.transaction.create({
          data: {
            sender_acc_no: data.sender_acc_no,
            receiver_acc_no: data.receiver_acc_no,
            amount: data.amount,
            type: data.type,
            method: "DEBIT",
          },
        }),
        tx.transaction.create({
          data: {
            sender_acc_no: data.sender_acc_no,
            receiver_acc_no: data.receiver_acc_no,
            amount: data.amount,
            type: data.type,
            method: "CREDIT",
          },
        }),
      ]);
    });

    return NextResponse.json({ message: "Amount transferred successfully" });
  } catch (err) {
    console.error("Transaction failed:", err);
    return NextResponse.json(
      { data: "Transaction failed. Please try again later." },
      { status: 500 },
    );
  }
}
