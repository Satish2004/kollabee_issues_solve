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
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    <Card className="w-full max-w-[600px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-medium text-center">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center text-[15px] font-medium">
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
            <AlertTitle className="font-medium">{alert.message1}</AlertTitle>
            <AlertDescription>{alert.message2}</AlertDescription>
          </Alert>
        )}

        {!emailSent ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="m@example.com"
                className="bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#950a73] via-[#e36d5d] to-[#f1b56a] text-white hover:opacity-90 rounded-[6px] font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
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
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}
