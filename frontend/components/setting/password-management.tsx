"use client";

import { memo } from "react";
import PasswordInput from "./password-input";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/app/(protected)/(seller)/seller/settings/page";

const PasswordManagement = memo(() => {
  const {
    passwordResponse,
    handlePasswordChange,
    updatePassword,
    setForgotPassword,
    isLoading,
  } = useSettings();

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <PasswordInput
            name="currentPassword"
            value={passwordResponse.currentPassword}
            onChange={handlePasswordChange}
            label="Current Password*"
          />
          <button
            className="underline text-sm mt-2 ml-1"
            onClick={() => setForgotPassword(true)}
          >
            Forgot Password?
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* New Password */}
          <PasswordInput
            name="newPassword"
            value={passwordResponse.newPassword}
            onChange={handlePasswordChange}
            label="New Password*"
          />

          {/* Confirm Password */}
          <PasswordInput
            name="confirmPassword"
            value={passwordResponse.confirmPassword}
            onChange={handlePasswordChange}
            label="Confirm Password*"
          />
        </div>
      </div>
      <div className="pt-8 flex justify-end">
        <button
          onClick={updatePassword}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
});

PasswordManagement.displayName = "PasswordManagement";

export default PasswordManagement;
