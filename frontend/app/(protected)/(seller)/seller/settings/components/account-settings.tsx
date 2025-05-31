"use client";

import type { FormData, Country as CountryType } from "@/types/settings";
import {
  countries,
  getCountryCode,
  getSpecialCaseCountryCode,
} from "@/lib/country";
import Star from "@/app/(auth)/signup/seller/onboarding/Star";
import { Country, State } from "country-state-city";
import { User, Loader2 } from "lucide-react";
import React, { useMemo } from "react";
import ReactCountryFlag from "react-country-flag";

interface AccountSettingsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  originalFormData: FormData;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage: () => void;
  loading: boolean;
  updateProfileData: () => void;
  showCountryDropdown: boolean;
  setShowCountryDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filteredCountries: CountryType[];
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  isSelecting: boolean;
}

const AccountSettings: React.FC<AccountSettingsProps> = React.memo(
  ({
    formData,
    setFormData,
    originalFormData,
    isLoading,
    fileInputRef,
    handleInputChange,
    handleSelectChange,
    handleImageChange,
    handleDeleteImage,
    loading,
    updateProfileData,
    showCountryDropdown,
    setShowCountryDropdown,
    search,
    setSearch,
    filteredCountries,
    setIsSelecting,
    isSelecting,
  }) => {
    const countryOptions = useMemo(() => {
      return [
        <option key="none" value="">
          Select Country
        </option>,
        ...Country.getAllCountries().map((country, index) => (
          <option key={index} value={country.name}>
            {country.name}
          </option>
        )),
      ];
    }, []);

    const stateOptions = useMemo(() => {
      const selectedCountryObj = Country.getAllCountries().find(
        (c) => c.name === formData.country
      );
      const countryCode = selectedCountryObj?.isoCode;
      const states = countryCode ? State.getStatesOfCountry(countryCode) : [];
      return [
        <option key="none" value="">
          Select State
        </option>,
        ...states.map((state, index) => (
          <option key={index} value={state.name}>
            {state.name}
          </option>
        )),
      ];
    }, [formData.country]);

    // Check if there are changes
    const hasChanges = useMemo(() => {
      return JSON.stringify(formData) !== JSON.stringify(originalFormData);
    }, [formData, originalFormData]);

    return (
      <div className="p-6">
        <div className="grid grid-cols-5 gap-8">
          {/* Profile Image Section */}
          <div className="col-span-2">
            <div className="flex flex-col items-center space-y-4 border border-[#e4e7eb] rounded-lg p-4 h-full">
              <div className="relative">
                {isLoading ? (
                  <div className="flex items-center justify-center w-96 h-96">
                    <Loader2 className="w-10 h-10 animate-spin" />
                  </div>
                ) : formData.imageUrl ? (
                  <img
                    src={formData.imageUrl || "/placeholder.svg"}
                    alt="Profile"
                    className="w-96 h-96 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center w-96 h-96">
                    <User className="w-10 h-10 text-red-400" />
                  </div>
                )}
                <div className="mt-4 text-center text-[11px] text-gray-500">
                  Format: PNG, JPEG Size: 2MB
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button className="flex items-center text-red-500 hover:text-red-600">
                    <span
                      className="underline"
                      onClick={() => {
                        fileInputRef.current?.click();
                      }}
                    >
                      {formData.imageUrl ? "Change" : "Upload"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </button>
                  <button className="flex items-center text-red-500 hover:text-red-600">
                    <span className="underline" onClick={handleDeleteImage}>
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="col-span-3 space-y-4">
            <div className="w-full flex gap-4 items-center">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                  <Star />
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your First Name"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                  <Star />
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your Last Name"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <p>
                  Business Email
                  <Star />
                </p>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Re-enter your Business Email"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
                <Star />
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Create your Office Address"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
                <Star />
              </label>
              <div className="flex">
                <div className="relative country-dropdown-container">
                  <div
                    className="flex items-center justify-between bg-[#fcfcfc] border-l border-t border-b border-[#e5e5e5] rounded-l-[6px] px-2 py-2 w-[90px] cursor-pointer"
                    onClick={() => {
                      setShowCountryDropdown(!showCountryDropdown);
                      setIsSelecting(true);
                      setSearch("");
                    }}
                  >
                    <span className="flex items-center">
                      <ReactCountryFlag
                        countryCode={getCountryCode(
                          countries.find(
                            (c) =>
                              c.code === formData.country ||
                              c.name === formData.country
                          )?.code || "+1"
                        )}
                        svg
                        style={{
                          width: "1.5em",
                          height: "1.5em",
                          marginRight: "0.2em",
                        }}
                        title={
                          countries.find((c) => c.code === formData.country)
                            ?.code || "United States"
                        }
                      />
                      {countries.find((c) => c.name === formData.country)
                        ?.code || "+1"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      style={{ marginLeft: "1.2em" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>

                  {showCountryDropdown && (
                    <div className="absolute z-10 mt-1 w-[300px] max-h-[300px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="p-2">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search country..."
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                          value={search}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((country) => (
                            <div
                              key={country.name}
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  country: country.name,
                                });
                                setShowCountryDropdown(false);
                                setIsSelecting(false);
                                setSearch("");
                              }}
                            >
                              <ReactCountryFlag
                                countryCode={getSpecialCaseCountryCode(
                                  country.code,
                                  country.name
                                )}
                                svg
                                style={{
                                  width: "1.5em",
                                  height: "1.5em",
                                }}
                                title={country.name}
                              />
                              <span>{country.name}</span>
                              <span className="text-gray-500 ml-auto">
                                {country.code}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 p-2">
                            No countries found
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 border rounded-r-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">
                Country / Region
                <Star />
              </label>
              <select
                name="country"
                value={formData.country || "Select"}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border rounded-lg bg-transparent"
              >
                {countryOptions}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  States
                  <Star />
                </label>
                <select
                  name="state"
                  value={formData.state || ""}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border rounded-lg bg-transparent"
                >
                  {stateOptions}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                  <Star />
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode || ""}
                  onChange={handleInputChange}
                  placeholder="Enter Zip Code"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <button
            disabled={loading || !hasChanges}
            onClick={updateProfileData}
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

AccountSettings.displayName = "AccountSettings";

export default AccountSettings;
