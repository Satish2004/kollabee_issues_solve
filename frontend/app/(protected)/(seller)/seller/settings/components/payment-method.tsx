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

const REQUIRED_FIELDS = [
  "country",
  "fullName",
  "bankName",
  "bankType",
  "cvCode",
  "zipCode",
  "accountNumber",
];

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
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>(
      {}
    );

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

    // Validation for required fields and numeric fields
    const validateFields = () => {
      const errors: { [key: string]: string } = {};
      REQUIRED_FIELDS.forEach((field) => {
        const value = bankDetails[field as keyof BankDetails]?.toString() || "";
        if (!value.trim()) {
          errors[field] = "This field is required";
        }
      });

      // CVV: only numbers, 3-4 digits
      const cvCode = bankDetails.cvCode || "";
      if (cvCode && !/^\d{3,4}$/.test(cvCode)) {
        errors.cvCode = "CVV must be 3 or 4 digits";
      }

      // Zip Code: only numbers, 3-6 digits
      const zipCode = bankDetails.zipCode || "";
      if (zipCode && !/^\d{3,6}$/.test(zipCode)) {
        errors.zipCode = "Zip code must be 3 to 6 digits";
      }

      // Account Number: only numbers, 6-18 digits (typical range)
      const accountNumber = bankDetails.accountNumber || "";
      if (accountNumber && !/^\d{6,18}$/.test(accountNumber)) {
        errors.accountNumber = "Account number must be 6 to 18 digits";
      }

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
    };

    // Check if all required fields are filled
    const isFormValid = useMemo(() => {
      return REQUIRED_FIELDS.every(
        (field) =>
          bankDetails[field as keyof BankDetails] &&
          bankDetails[field as keyof BankDetails].toString().trim() !== ""
      );
    }, [bankDetails]);

    // Show error on blur or on save attempt
    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      if (REQUIRED_FIELDS.includes(name) && (!value || value.trim() === "")) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: "This field is required",
        }));
      } else {
        setFieldErrors((prev) => {
          const copy = { ...prev };
          delete copy[name];
          return copy;
        });
      }
    };

    const handleSave = () => {
      if (!validateFields()) {
        // Scroll to first error field
        const firstErrorField = REQUIRED_FIELDS.find(
          (field) => fieldErrors[field]
        );
        if (firstErrorField) {
          const el = document.querySelector(`[name="${firstErrorField}"]`);
          if (el) (el as HTMLElement).focus();
        }
        return;
      }
      updateBankDetails();
    };

    // Restrict input for numeric fields
    const handleNumberInput = (
      e: React.ChangeEvent<HTMLInputElement>,
      maxLength: number
    ) => {
      const { name, value } = e.target;
      // Only allow digits, trim to maxLength
      const digits = value.replace(/\D/g, "").slice(0, maxLength);
      handleBankDetailsChange({
        target: { name, value: digits },
      } as any);
    };

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
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-lg ${
                fieldErrors.country ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Country</option>
              <option value="india">India</option>
              <option value="us">US</option>
            </select>
            {fieldErrors.country && (
              <div className="text-red-500 text-xs mt-1">
                {fieldErrors.country}
              </div>
            )}
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
                onBlur={handleBlur}
                placeholder="Enter your Full Name"
                className={`w-full px-3 py-2 border rounded-lg ${
                  fieldErrors.fullName ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.fullName && (
                <div className="text-red-500 text-xs mt-1">
                  {fieldErrors.fullName}
                </div>
              )}
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
              <SelectTrigger
                className={fieldErrors.bankName ? "border-red-500" : ""}
              >
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
            {fieldErrors.bankName && (
              <div className="text-red-500 text-xs mt-1">
                {fieldErrors.bankName}
              </div>
            )}
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
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-lg ${
                fieldErrors.bankType ? "border-red-500" : ""
              }`}
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
            {fieldErrors.bankType && (
              <div className="text-red-500 text-xs mt-1">
                {fieldErrors.bankType}
              </div>
            )}
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
              onChange={(e) => handleNumberInput(e, 4)}
              onBlur={handleBlur}
              placeholder="XXX"
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-lg ${
                fieldErrors.cvCode ? "border-red-500" : ""
              }`}
              inputMode="numeric"
              pattern="\d*"
            />
            {fieldErrors.cvCode && (
              <div className="text-red-500 text-xs mt-1">
                {fieldErrors.cvCode}
              </div>
            )}
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
              onChange={(e) => handleNumberInput(e, 6)}
              onBlur={handleBlur}
              placeholder="XXXXX"
              maxLength={6}
              className={`w-full px-3 py-2 border rounded-lg ${
                fieldErrors.zipCode ? "border-red-500" : ""
              }`}
              inputMode="numeric"
              pattern="\d*"
            />
            {fieldErrors.zipCode && (
              <div className="text-red-500 text-xs mt-1">
                {fieldErrors.zipCode}
              </div>
            )}
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
              onChange={(e) => handleNumberInput(e, 18)}
              onBlur={handleBlur}
              placeholder="Enter your Account Number"
              maxLength={18}
              className={`w-full px-3 py-2 border rounded-lg ${
                fieldErrors.accountNumber ? "border-red-500" : ""
              }`}
              inputMode="numeric"
              pattern="\d*"
            />
            {fieldErrors.accountNumber && (
              <div className="text-red-500 text-xs mt-1">
                {fieldErrors.accountNumber}
              </div>
            )}
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
            onClick={handleSave}
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
