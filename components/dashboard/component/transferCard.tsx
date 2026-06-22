"use client";

import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { transferFund } from "@/helper/api/dashboard";
import { User } from "@prisma/client";
import { FundTransfer } from "@/types/fundTransfer";

export default function TransferCard({ userData }: { userData: User }) {
  const schema = z.object({
    receiver_acc_no: z
      .string()
      .min(10, { message: "Must have at least 10 characters" })
      .max(12, { message: "Must have at most 12 characters" }),
    amount: z.string().transform((value) => parseFloat(value)),
    type: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const sendData = {
      receiver_acc_no: data.receiver_acc_no,
      amount: data.amount,
      type: data.type,
    };

    const res = await transferFund(sendData as FundTransfer);
    if (res?.status != 200) {
      alert(res?.data.error);
      return;
    }
    alert("Fund Transfer Successful");
    reset();
  });
  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Fund Transfer</CardTitle>
        <CardDescription>Send Money to your friends and family</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <form className="grid gap-2" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="address">Receipnt Address</Label>
              <Input
                id="address"
                type="number"
                {...register("receiver_acc_no")}
              />
              {errors?.receiver_acc_no?.message && (
                <p className="text-red-500 font-2xl">
                  {errors?.receiver_acc_no?.message.toString()}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                {...register("amount")}
                step="1"
              />
              {errors?.amount?.message && (
                <p className="text-red-500">
                  {errors?.amount?.message.toString()}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type of Transfer</Label>
              <Controller
                name="type"
                control={control}
                defaultValue="IMPS"
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="IMPS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="NEFT">NEFT</SelectItem>
                      <SelectItem value="IMPS">IMPS</SelectItem>
                      <SelectItem value="RTGS">RTGS</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors?.type?.message && (
                <p className="text-red-500">
                  {errors?.type?.message.toString()}
                </p>
              )}
            </div>

            <Button className="w-full" type="submit">
              Transfer
            </Button>
          </form>
        </>
      </CardContent>
    </Card>
  );
}
