"use client";
import { sendOTP, verifyOTP } from "@/helper/api/mfa";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export const OtpPage = (props: { email: string }) => {
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { email } = props;

  const schema = z.object({
    otp: z.string().length(4, {
      message: "OTP has to be 4 characters",
    }),
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const res = await verifyOTP(email, data.otp);
      if (res?.status !== 200) {
        setError(res?.data.data);
      } else {
        setMessage("OTP Verified");
        router.push(`/dashboard`);
        reset();
      }
    } catch (err: any) {
      setError(err.message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    const sendOtp = async () => {
      setLoading(true);
      try {
        const res = await sendOTP(email);
        if (res?.status === 200) {
          setOtpSent(true);
          setMessage(`OTP sent to ${email}`);
        } else {
          setError(res?.data.data);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while sending the OTP.");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      sendOtp();
    } else {
      console.log("Invalid email");
    }
  }, [email]);

  if (!email) return <h1>Invalid Page</h1>;

  return (
    <main>
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <form onSubmit={onSubmit}>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={4}
                {...field}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} {...field} />
                  <InputOTPSlot index={1} {...field} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={2} {...field} />
                  <InputOTPSlot index={3} {...field} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          <button type="submit" disabled={loading}>
            Submit OTP
          </button>
        </form>
      )}

      {errors.otp && <p>{errors.otp.message?.toString()}</p>}
    </main>
  );
};
