"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginApi } from "@/helper/api";
import { LoginUserType } from "@/types/userType";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const schema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Must have at least 8 character" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const res = await LoginApi(data as LoginUserType);
    if (res?.status != 200) {
      return;
    }
    alert("Login Successfully...");
    const email = encodeURIComponent(data.email);
    router.push(`/auth/verify?email=${email}`);
    reset();
  });

  return (
    <main>
      <Card className="w-[400px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login to your Account</CardTitle>
          <CardDescription>
            Enter your credentials below to log in your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
            <form onSubmit={onSubmit} className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors?.email?.message && (
                  <p className="text-red-500 font-2xl">
                    {errors?.email?.message.toString()}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors?.password?.message && (
                  <p className="text-red-500">
                    {errors?.password?.message.toString()}
                  </p>
                )}
              </div>
              <Button className="w-full" type="submit">
                Login to your account
              </Button>
            </form>
          </>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div>
            <p>
              {"Don't have an account?"}
              <Link href="/auth/register" className="underline">
                Register
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
