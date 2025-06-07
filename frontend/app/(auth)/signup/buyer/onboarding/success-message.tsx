"use client";
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
    <div className="bg-white rounded-lg p-4 sm:p-6 md:p-10 max-w-xl mx-auto text-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
        You're In! 🚀
      </h1>
      <p className="text-base sm:text-lg mb-4 sm:mb-8">
        Welcome aboard! We're thrilled to have you join us.
      </p>

      <div className="space-y-3 sm:space-y-4 text-left mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          <span className="text-sm sm:text-base">Your profile is set up!</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          <span className="text-sm sm:text-base">
            Start browsing suppliers right away.
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          <span className="text-sm sm:text-base">
            Refine your preferences anytime in your dashboard.
          </span>
        </div>
      </div>

      <Button
        className=" p-3 h-auto text-wrap  rounded-[6px] text-white button-bg font-semibold text-sm sm:text-base"
        onClick={onContinue}
      >
        {buttonText}
      </Button>
    </div>
  );
}
