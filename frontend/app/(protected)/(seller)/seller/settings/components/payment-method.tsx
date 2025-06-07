"use client";

import type { BankDetails } from "@/types/settings";
import Star from "@/app/(auth)/signup/seller/onboarding/Star";
import { Loader2 } from "lucide-react";
import React, { useMemo } from "react";

interface PaymentMethodProps {
  bankDetails: BankDetails;
  originalBankDetails: BankDetails;
  handleBankDetailsChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  updateBankDetails: () => void;
  loading: boolean;
}

const PaymentMethod: React.FC<PaymentMethodProps> = React.memo(
  ({
    bankDetails,
    originalBankDetails,
    handleBankDetailsChange,
    updateBankDetails,
    loading,
  }) => {
    // Check if there are changes
    const hasChanges = useMemo(() => {
      return (
        JSON.stringify(bankDetails) !== JSON.stringify(originalBankDetails)
      );
    }, [bankDetails, originalBankDetails]);

    return (
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="w-full flex gap-4 items-center">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
                <Star />
              </label>
              <input
                type="text"
                name="fullName"
                value={bankDetails.firstName}
                onChange={handleBankDetailsChange}
                placeholder="Enter your Full Name"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder (Optional)
            </label>
            <input
              type="text"
              name="holderName"
              value={bankDetails.holderName}
              onChange={handleBankDetailsChange}
              placeholder="Text Here"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bank
              <Star />
            </label>
            <input
              type="text"
              name="bankName"
              value={bankDetails.bankName}
              onChange={handleBankDetailsChange}
              placeholder="Enter your Bank Name"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Type
              <Star />
            </label>
            <select
              name="bankType"
              value={bankDetails.bankType}
              onChange={handleBankDetailsChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Type</option>
              {[
                { name: "Savings", value: "SAVINGS" },
                { name: "Current", value: "CURRENT" },
              ].map((bankType, index) => (
                <option key={index} value={bankType.value}>
                  {bankType.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV Code
              <Star />
            </label>
            <input
              type="text"
              name="cvCode"
              value={bankDetails.cvCode}
              onChange={handleBankDetailsChange}
              placeholder="XXX"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
              <Star />
            </label>
            <input
              type="text"
              name="zipCode"
              value={bankDetails.zipCode}
              onChange={handleBankDetailsChange}
              placeholder="XXXXX"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
              <Star />
            </label>
            <input
              type="text"
              name="accountNumber"
              value={bankDetails.accountNumber}
              onChange={handleBankDetailsChange}
              placeholder="Enter your Account Number"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add UPI Id
            </label>
            <input
              type="text"
              name="upinId"
              value={bankDetails.upinId}
              onChange={handleBankDetailsChange}
              placeholder="Text Here"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <button
            disabled={loading || !hasChanges}
            onClick={updateBankDetails}
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

PaymentMethod.displayName = "PaymentMethod";

export default PaymentMethod;
