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
import { RegisterApi } from "@/helper/api";
import { RegisterUserType } from "@/types/userType";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter()
  const schema = z.object({
    firstname: z.string().min(1, { message: "Required" }),
    lastname: z.string().min(1, { message: "Required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Must have at least 8 character" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const { firstname, lastname, email, password } = data;
    const dataa = {
      name: `${firstname} ${lastname}`,
      email,
      password,
    };
    const res = await RegisterApi(dataa as RegisterUserType);
       if (res?.status != 200) {
      return;
    } 
    alert("Your account created successfully");
    reset()
    router.push("/auth/login")
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  {...register("firstname")}
                />
                {errors.firstname && (
                  <p className="text-red-500">
                    {errors.firstname.message?.toString()}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  required
                  {...register("lastname")}
                />
                {errors.lastname && (
                  <p className="text-red-500">
                    {errors.lastname.message?.toString()}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
