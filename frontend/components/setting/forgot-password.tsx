"use client";

import React, { memo } from "react";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/app/(protected)/(seller)/seller/settings/page";

const ForgotPassword = memo(() => {
  const {
    formData,
    isLoading,
    emailSent,
    handleInputChange,
    handleForgotPasswordSubmit,
  } = useSettings();

  return (
    <div className="p-6">
      {emailSent ? (
        <div className="text-center">
          <p className="text-green-500 font-semibold">
            Password reset link sent to your email.
          </p>
          <p>
            Please check your inbox and follow the instructions to reset your
            password.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address*
            </label>
            <input
              type="email"
              name="email"
              defaultValue={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <button
              onClick={handleForgotPasswordSubmit}
              disabled={isLoading}
              className={`bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px] ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

ForgotPassword.displayName = "ForgotPassword";

export default ForgotPassword;
