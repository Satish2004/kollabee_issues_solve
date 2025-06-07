"use client";

import type { PasswordResponse } from "@/types/settings";
import Star from "@/app/(auth)/signup/seller/onboarding/Star";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useMemo } from "react";

interface PasswordManagementProps {
  passwordResponse: PasswordResponse;
  originalPasswordResponse: PasswordResponse;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showNewPassword: boolean;
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  updatePassword: () => void;
  loading: boolean;
}

const PasswordManagement: React.FC<PasswordManagementProps> = React.memo(
  ({
    passwordResponse,
    originalPasswordResponse,
    showPassword,
    setShowPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handlePasswordChange,
    setForgotPassword,
    updatePassword,
    loading,
  }) => {
    // Check if there are changes
    const hasChanges = useMemo(() => {
      return (
        JSON.stringify(passwordResponse) !==
        JSON.stringify(originalPasswordResponse)
      );
    }, [passwordResponse, originalPasswordResponse]);

    return (
      <div className="p-6">
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
              <Star />
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordResponse.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border rounded-lg pr-10"
                placeholder="●●●"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <button
              className=" underline text-sm mt-2 ml-1"
              onClick={() => setForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
                <Star />
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordResponse.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg pr-10"
                  placeholder="●●●"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
                <Star />
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordResponse.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg pr-10"
                  placeholder="●●●"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 flex justify-end">
          <button
            disabled={loading || !hasChanges}
            onClick={updatePassword}
            className={`bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px] ${
              loading || !hasChanges ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    );
  }
);

PasswordManagement.displayName = "PasswordManagement";

export default PasswordManagement;
