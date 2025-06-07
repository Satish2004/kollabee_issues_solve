"use client";

import { memo, useEffect } from "react";
import { useSettings } from "@/app/(protected)/(seller)/seller/settings/page";

const PaymentMethod = memo(() => {
  const {
    bankDetails,
    handleBankDetailsChange,
    updateBankDetails,
    getBankDetails,
  } = useSettings();

  // Fetch bank details on component mount
  useEffect(() => {
    getBankDetails();
  }, [getBankDetails]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="w-full flex gap-4 items-center">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name*
            </label>
            <input
              type="text"
              name="fullName"
              defaultValue={bankDetails.firstName}
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
            defaultValue={bankDetails.holderName}
            onChange={handleBankDetailsChange}
            placeholder="Text Here"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Bank*
          </label>
          <input
            type="text"
            name="bankName"
            defaultValue={bankDetails.bankName}
            onChange={handleBankDetailsChange}
            placeholder="Enter your Bank Name"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Type*
          </label>
          <select
            name="bankType"
            defaultValue={bankDetails.bankType}
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
            CV Code*
          </label>
          <input
            type="text"
            name="cvCode"
            defaultValue={bankDetails.cvCode}
            onChange={handleBankDetailsChange}
            placeholder="XXX"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zip Code*
          </label>
          <input
            type="text"
            name="zipCode"
            defaultValue={bankDetails.zipCode}
            onChange={handleBankDetailsChange}
            placeholder="XXXXX"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Number*
          </label>
          <input
            type="text"
            name="accountNumber"
            defaultValue={bankDetails.accountNumber}
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
            defaultValue={bankDetails.upinId}
            onChange={handleBankDetailsChange}
            placeholder="Text Here"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button
          onClick={updateBankDetails}
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
});

PaymentMethod.displayName = "PaymentMethod";

export default PaymentMethod;
