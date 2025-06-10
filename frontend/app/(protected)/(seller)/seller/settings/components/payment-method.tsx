"use client";

import BANKS from "./banks";
import Star from "@/app/(auth)/signup/seller/onboarding/Star";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { BankDetails } from "@/types/settings";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";

// Expanded bank lists for India and US

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

    // Get available banks for selected country
    const selectedCountry = bankDetails.country?.toLowerCase() || "";
    const allBanks = BANKS[selectedCountry] || [];
    const [bankSearch, setBankSearch] = useState("");
    const [isBankSelectOpen, setIsBankSelectOpen] = useState(false);

    // Filter banks by search
    const availableBanks = useMemo(() => {
      if (!bankSearch.trim()) return allBanks;
      return allBanks.filter((bank) =>
        bank.name.toLowerCase().includes(bankSearch.trim().toLowerCase())
      );
    }, [allBanks, bankSearch]);

    // Keyboard search handler
    React.useEffect(() => {
      if (!isBankSelectOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore navigation keys and Enter/Escape
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setBankSearch((prev) => prev + e.key);
        } else if (e.key === "Backspace") {
          setBankSearch((prev) => prev.slice(0, -1));
        } else if (e.key === "Escape") {
          setBankSearch("");
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isBankSelectOpen]);

    // Reset search when select closes
    React.useEffect(() => {
      if (!isBankSelectOpen) setBankSearch("");
    }, [isBankSelectOpen]);

    return (
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Country select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
              <Star />
            </label>
            <select
              name="country"
              value={bankDetails.country || ""}
              onChange={handleBankDetailsChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Country</option>
              <option value="india">India</option>
              <option value="us">US</option>
            </select>
          </div>
          <div className="w-full flex gap-4 items-center">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
                <Star />
              </label>
              <input
                type="text"
                name="fullName"
                value={bankDetails.fullName || ""}
                onChange={handleBankDetailsChange}
                placeholder="Enter your Full Name"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Holder
            </label>
            <input
              type="text"
              name="holderName"
              value={bankDetails.holderName || ""}
              onChange={handleBankDetailsChange}
              placeholder="Text Here"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          {/* Bank Name as select dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
              <Star />
            </label>
            <Select
              value={bankDetails.bankName}
              onValueChange={(value) =>
                handleBankDetailsChange({
                  target: { name: "bankName", value },
                } as any)
              }
              disabled={!selectedCountry}
              open={isBankSelectOpen}
              onOpenChange={setIsBankSelectOpen}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent className="max-h-56 z-100 bg-white overflow-y-auto">
                {/* Bank search input */}
                <div className="sticky top-0 z-10 bg-white px-2 py-2 border-b">
                  <input
                    type="text"
                    placeholder="Search bank..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                    autoFocus
                  />
                </div>
                <SelectItem value="null">Select Bank</SelectItem>
                {availableBanks.length === 0 ? (
                  <div className="px-3 py-2 text-gray-500 text-sm">
                    No banks found
                  </div>
                ) : (
                  availableBanks.map((bank) => (
                    <SelectItem key={bank.value} value={bank.value}>
                      {bank.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
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
              value={bankDetails.cvCode || ""}
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
              value={bankDetails.zipCode || ""}
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
              value={bankDetails.accountNumber || ""}
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
              value={bankDetails.upinId || ""}
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
