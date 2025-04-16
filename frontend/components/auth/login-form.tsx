"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import Link from "next/link";
import Image from "next/image";

interface LoginError {
  message: string;
  details?: string;
}

export function LoginForm({
  message,
  role,
}: {
  message?: string;
  role?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: "error";
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
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const response = await authApi.login({ email, password, role: role });
      const user = await response.user;

      toast.success("Signed in successfully");

      if (user.role === "BUYER") {
        router.push("/buyer");
      } else {
        router.push("/seller");
      }
    } catch (error: any) {
      const err = error as LoginError;
      setAlert({
        show: true,
        type: "error",
        message1: "Login failed",
        message2: err.message || "Invalid credentials",
      });
      toast.error(error?.response?.data?.error || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSwitch = () => {
    if (role === "BUYER") {
      router.push("/login/seller");
    } else {
      router.push("/login/buyer");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto font-futura">
      <div className="mb-8">
        <div className="flex justify-center">
          <Image
            onClick={() => router.push("/")}
            src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/w0knrjcs0l7mqswxuway"
            alt="KollaBee Logo"
            width={240}
            height={42}
            className="mx-auto cursor-pointer"
          />
        </div>
      </div>

      <Card className="w-full shadow-md hover:shadow-xl ">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-normal">
            {message ?? "Login"}
          </CardTitle>
          <CardDescription className="text-center text-[15px]">
            Fill in your details to login your account and get started with
            Kollabee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {alert.show && (
              <Alert
                className={cn(
                  "mb-6 border-2",
                  "border-red-500 bg-red-50 dark:bg-red-900/20"
                )}
              >
                <Info className="h-5 w-5" />
                <AlertTitle>{alert.message1}</AlertTitle>
                <AlertDescription>{alert.message2}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-normal ">
                Email Address*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your Email Address"
                className="bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-normal">
                Password*
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create your Password"
                className="bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
              />
            </div>

            <div className="space-y-4 mt-6">
              <Button
                type="submit"
                className="rounded-[6px] w-full text-white font-normal px-8 py-2 button-bg"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>

              <div className="flex flex-col space-y-2">
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
                  <button
                    type="button"
                    onClick={handleRoleSwitch}
                    className="text-sm text-pink-600 hover:underline"
                  >
                    {role === "BUYER" ? "Login as Supplier" : "Login as Buyer"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
