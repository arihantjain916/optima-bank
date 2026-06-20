import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfile } from "@/helper/api/dashboard";


export default function ProfileCard({ userData }: { userData: User }) {
  const schema = z.object({
    email: z.string().email({ message: "Invalid email" }),
    name: z.string().min(3, { message: "Name must have at least 3 characters" }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: userData?.email,
      name: userData?.name,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfile(userData?.id, {
        name: data.name,
        email: data.email,
      });
      if (res?.status !== 200) {
        return alert("Error updating profile");
      }
      alert("Profile updated successfully");
      reset();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile");
    }
  });

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col md:flex-row gap-4 space-y-1 items-center justify-center ">
            <Label>Account Number</Label>
            <Input value={userData.account_no ?? ""} disabled />
          </div>
          <div className="flex flex-col md:flex-row gap-4 space-y-1 items-center justify-center ">
            <Label>Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-red-500">{errors.name.message?.toString()}</p>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4 space-y-1 items-center justify-center ">
            <Label>Email</Label>
            <Input {...register("email")} />
            {errors.email && (
              <p className="text-red-500">{errors.email.message?.toString()}</p>
            )}
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
