"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import { ArrowLeft, Info, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  useEffect(() => {
    const tokenParam = searchParams?.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setAlert({
        show: true,
        type: "error",
        message1: "Invalid reset link",
        message2: "The password reset link is invalid or has expired",
      });
    }
  }, [searchParams]);

  // Password validation
  const hasMinLength = password.length >= 12;
  const hasNumber = /\d/.test(password);
  const hasCapital = /[A-Z]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";
  const isPasswordValid =
    hasMinLength && hasNumber && hasCapital && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ ...alert, show: false });

    if (!isPasswordValid) {
      setAlert({
        show: true,
        type: "error",
        message1: "Invalid password",
        message2: "Please make sure your password meets all requirements",
      });
      setIsLoading(false);
      return;
    }

    if (!token) {
      setAlert({
        show: true,
        type: "error",
        message1: "Missing token",
        message2: "The password reset token is missing",
      });
      setIsLoading(false);
      return;
    }

    try {
      await authApi.resetPassword({ token, newPassword: password });
      toast.success("Password reset successfully");

      // Show success message before redirecting
      setAlert({
        show: true,
        type: "success",
        message1: "Password reset successful",
        message2: "You will be redirected to the login page shortly",
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setAlert({
        show: true,
        type: "error",
        message1: "Failed to reset password",
        message2:
          error?.response?.data?.error ||
          "The link may have expired. Please try again.",
      });
      toast.error(error?.response?.data?.error || "Failed to reset password");
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
            width={240}
            height={42}
            className="mx-auto"
          />
        </div>
      </div>

      <Card className="w-full shadow-md hover:shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-normal">
            Create New Password
          </CardTitle>
          <CardDescription className="text-center text-[15px] font-normal">
            Enter a new password for your account
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-normal">
                New Password*
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your new password"
                className="bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {hasMinLength ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>At least 12 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasNumber ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>At least one number</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasCapital ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>At least one capital letter</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-normal">
                Confirm Password*
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm your new password"
                className="bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="flex items-center gap-2 text-sm">
                {passwordsMatch ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Passwords match</span>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <Button
                type="submit"
                className="rounded-[6px] w-full text-white font-normal px-8 py-2 button-bg"
                disabled={isLoading || !isPasswordValid || !token}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>

            <div className="flex justify-between">
              <div className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="ml-1 text-pink-600 hover:underline font-normal"
                >
                  Log in
                </Link>
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
