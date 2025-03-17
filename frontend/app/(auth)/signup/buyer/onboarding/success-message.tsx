"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  userType?: "buyer" | "seller";
  onContinue?: () => void;
}

export function SuccessMessage({
  userType = "buyer",
  onContinue,
}: SuccessMessageProps) {
  const buttonText =
    userType === "buyer"
      ? "Go to Dashboard & Find Suppliers"
      : "Go to Dashboard";

  return (
    <div className="bg-white rounded-lg p-10 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">You're In! 🚀</h1>
      <p className="text-lg mb-8">
        Welcome aboard! We're thrilled to have you join us.
      </p>

      <div className="space-y-4 text-left mb-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>Your profile is set up!</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>Start browsing suppliers right away.</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>Refine your preferences anytime in your dashboard.</span>
        </div>
      </div>

      <Button
        className="w-full py-6 rounded-[6px] text-white bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
        onClick={onContinue}
      >
        {buttonText}
      </Button>
    </div>
  );
}
