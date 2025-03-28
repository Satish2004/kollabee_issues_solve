"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "error" | "success";
    message1: string;
    message2: string;
  }>({
    show: false,
    type: "error",
    message1: "",
    message2: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ ...alert, show: false });

    try {
      await authApi.forgotPassword(email);
      setEmailSent(true);
      setAlert({
        show: true,
        type: "success",
        message1: "Reset link sent",
        message2: "Please check your email for the password reset link",
      });
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      setAlert({
        show: true,
        type: "error",
        message1: "Failed to send reset link",
        message2: error?.response?.data?.error || "Please try again later",
      });
      toast.error(error?.response?.data?.error || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto font-futura font-normal">
      <div className="mb-8">
        <div className="flex justify-center">
          <Image
            onClick={() => router.push("/")}
            src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/w0knrjcs0l7mqswxuway"
            alt="KollaBee Logo"
            width={160}
            height={42}
            className="mx-auto"
          />
        </div>
      </div>

      <Card className="w-full gradient-border-auth">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-normal">Reset Password</CardTitle>
          <CardDescription className="text-center text-[15px] font-normal">
            {!emailSent
              ? "Enter your email to receive a password reset link"
              : "Check your email for the password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alert.show && (
            <Alert
              className={cn(
                "mb-6 border-2",
                alert.type === "error"
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-green-500 bg-green-50 dark:bg-green-900/20"
              )}
            >
              <Info className="h-5 w-5" />
              <AlertTitle>{alert.message1}</AlertTitle>
              <AlertDescription>{alert.message2}</AlertDescription>
            </Alert>
          )}

          {!emailSent ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-normal">
                  Email Address*
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your Email Address"
                  className="bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-4 mt-6">
                <Button
                  type="submit"
                  className="rounded-[6px] w-full text-white font-normal px-8 py-2 button-bg"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>

              <div className="flex justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Forgot password?
                </Link>
                <div className="text-sm text-gray-600 ">
                  Don't have an account?
                  <Link
                    href="/signup"
                    className="ml-1 text-pink-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4">
                A password reset link has been sent to your email.
              </p>
              <p>
                Please check your inbox and click on the link to reset your
                password.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
