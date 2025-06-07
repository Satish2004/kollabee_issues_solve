"use client";

import React from "react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

interface GoogleLoginButtonProps {
  role: string;
  isLoading?: boolean;
  className?: string;
}

export function GoogleLoginButton({
  role,
  isLoading = false,
  className = "",
}: GoogleLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Redirect to Google OAuth with role parameter
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?role=${role}`;
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={isLoading || loading}
      className={`w-full flex items-center justify-start gap-2 py-5 ${className}`}
    >
      <FcGoogle className="h-8 w-8" />
      <span className="font-sans w-full text-base">{loading ? "Connecting..." : "Continue with Google"}</span>
    </Button>
  );
}
