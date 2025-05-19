"use client";

import type React from "react";

import { memo, useEffect } from "react";
import ProfileImage from "./profile-image";
import CountryDropdown from "./country-dropdown";
import { debounce } from "../country-utils";
import { useSettings } from "@/app/(protected)/(seller)/seller/settings/page";

const AccountSettings = memo(() => {
  const {
    formData,
    isLoading,
    countryOptions,
    stateOptions,
    loading,
    handleInputChange,
    handleSelectChange,
    handleImageChange,
    handleDeleteImage,
    updateProfileData,
    setFormData,
    getUser,
  } = useSettings();

  // Fetch user data on component mount
  useEffect(() => {
    getUser();
  }, [getUser]);

  // Create debounced version of input handler
  const debouncedHandleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInputChange(e);
    },
    300
  );

  const handleCountrySelect = (country: string) => {
    setFormData((prev: any) => ({
      ...prev,
      country,
    }));
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-5 gap-8">
        {/* Profile Image Section */}
        <div className="col-span-2">
          <ProfileImage
            imageUrl={formData.imageUrl}
            isLoading={isLoading}
            onImageChange={handleImageChange}
            onDeleteImage={handleDeleteImage}
          />
        </div>

        {/* Form Fields */}
        <div className="col-span-3 space-y-4">
          <div className="w-full flex gap-4 items-center">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                defaultValue={formData.firstName}
                onChange={debouncedHandleInputChange}
                placeholder="Enter your First Name"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                defaultValue={formData.lastName}
                onChange={debouncedHandleInputChange}
                placeholder="Enter your Last Name"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Email Address*
            </label>
            <input
              type="email"
              name="email"
              defaultValue={formData.email}
              readOnly
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Re-enter your Business Email Address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Address*
            </label>
            <input
              type="text"
              name="address"
              defaultValue={formData.address || ""}
              onChange={debouncedHandleInputChange}
              placeholder="Create your Office Address"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <div className="flex">
              <CountryDropdown
                selectedCountry={formData.country}
                onSelect={handleCountrySelect}
              />
              <input
                type="tel"
                name="phoneNumber"
                defaultValue={formData.phoneNumber || ""}
                onChange={debouncedHandleInputChange}
                placeholder="1234567890"
                className="w-full px-3 py-2 border rounded-r-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country / Region*
            </label>
            <select
              name="country"
              defaultValue={formData.country || "Select"}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border rounded-lg bg-transparent"
            >
              {countryOptions}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                States*
              </label>
              <select
                name="state"
                defaultValue={formData.state || ""}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border rounded-lg bg-transparent"
              >
                {stateOptions}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code*
              </label>
              <input
                type="text"
                name="zipCode"
                defaultValue={formData.zipCode || ""}
                onChange={debouncedHandleInputChange}
                placeholder="Enter Zip Code"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <button
          disabled={loading}
          onClick={updateProfileData}
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px]"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
});

AccountSettings.displayName = "AccountSettings";

export default AccountSettings;
