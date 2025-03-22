"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  otp: string[];
  onOtpChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  onResend: () => void;
  isResendDisabled: boolean;
  countdown: number;
  isVerifying: boolean;
  error?: string;
}

export function OTPModal({
  isOpen,
  onClose,
  email,
  otp,
  onOtpChange,
  onKeyDown,
  onVerify,
  onResend,
  isResendDisabled,
  countdown,
  isVerifying,
  error,
}: OTPModalProps) {
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        countdown--;
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">
              Enter OTP Sent to your email address
            </DialogTitle>
          </div>
          <p className="text-sm text-[#00B981]">{email}</p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Input
                  key={i}
                  name={`otp-${i}`}
                  className="w-12 h-12 text-center text-lg bg-[#fdeced] border-none rounded-[6px] "
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                />
              ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
              <AlertTriangle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <div className="text-center">
            <Button
              variant="link"
              className="text-[#00B981] p-0 h-auto text-sm font-normal hover:no-underline"
              onClick={onResend}
              disabled={isResendDisabled}
            >
              {isResendDisabled ? (
                <span>
                  Resend OTP in{" "}
                  <span className="text-destructive">{countdown}s</span>
                </span>
              ) : (
                "Resend OTP"
              )}
            </Button>
          </div>

          <Button
            className="w-full button-bg text-white font-semibold hover:from-[#B01B1B]/90 hover:to-[#FF9900]/90"
            onClick={onVerify}
            disabled={otp.some((digit) => !digit) || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
