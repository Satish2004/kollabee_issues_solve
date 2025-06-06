"use client";

import type {
  FormData,
  Country as CountryType,
  ValidationErrors,
} from "@/types/settings";
import {
  countries,
  getCountryCode,
  getSpecialCaseCountryCode,
} from "@/lib/country";
import Star from "@/app/(auth)/signup/seller/onboarding/Star";
import { Country, State } from "country-state-city";
import { User, Loader2, AlertCircle } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
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
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

    // Validation functions
    const validateName = (name: string, fieldName: string): string => {
      if (!name.trim()) return `${fieldName} is required`;
      if (name.trim().length < 3)
        return `${fieldName} must be at least 3 characters`;
      if (name.trim().length > 50)
        return `${fieldName} cannot exceed 50 characters`;

      // Check if name contains only letters and spaces
      if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
        return `${fieldName} can only contain letters and spaces`;
      }

      // Check if name is only numbers
      if (/^\d+$/.test(name.trim())) {
        return `${fieldName} cannot be only numbers`;
      }

      // Check if name has repeated characters (like aaaaa, bbbb)
      const cleanName = name.trim().toLowerCase().replace(/\s/g, "");
      if (cleanName.length >= 3) {
        const firstChar = cleanName[0];
        if (cleanName.split("").every((char) => char === firstChar)) {
          return `${fieldName} cannot have all same characters`;
        }
      }

      return "";
    };

    const validatePhoneNumber = (phone: string): string => {
      if (!phone.trim()) return "Phone number is required";

      // Remove any spaces, hyphens, or other formatting
      const cleanPhone = phone.replace(/[\s\-$$$$]/g, "");

      // Check if it contains only digits
      if (!/^\d+$/.test(cleanPhone)) {
        return "Phone number can only contain digits";
      }

      // Check minimum length
      if (cleanPhone.length < 10) {
        return "Phone number must be at least 10 digits";
      }

      if (cleanPhone.length > 15) {
        return "Phone number cannot exceed 15 digits";
      }

      // Check for invalid patterns
      const invalidPatterns = [
        /^0+$/, // All zeros
        /^1+$/, // All ones
        /^2+$/, // All twos
        /^3+$/, // All threes
        /^4+$/, // All fours
        /^5+$/, // All fives
        /^6+$/, // All sixes
        /^7+$/, // All sevens
        /^8+$/, // All eights
        /^9+$/, // All nines
        /^1234567890/, // Sequential ascending
        /^0987654321/, // Sequential descending
        /^(\d)\1{9,}/, // Same digit repeated 10+ times
      ];

      for (const pattern of invalidPatterns) {
        if (pattern.test(cleanPhone)) {
          return "Please enter a valid phone number";
        }
      }

      // Check for sequential patterns
      let isSequential = true;
      for (let i = 1; i < cleanPhone.length; i++) {
        if (
          Number.parseInt(cleanPhone[i]) !==
          Number.parseInt(cleanPhone[i - 1]) + 1
        ) {
          isSequential = false;
          break;
        }
      }
      if (isSequential && cleanPhone.length >= 10) {
        return "Please enter a valid phone number";
      }

      // Check for reverse sequential patterns
      let isReverseSequential = true;
      for (let i = 1; i < cleanPhone.length; i++) {
        if (
          Number.parseInt(cleanPhone[i]) !==
          Number.parseInt(cleanPhone[i - 1]) - 1
        ) {
          isReverseSequential = false;
          break;
        }
      }
      if (isReverseSequential && cleanPhone.length >= 10) {
        return "Please enter a valid phone number";
      }

      return "";
    };

    const validateZipCode = (zipCode: string): string => {
      if (!zipCode.trim()) return "Zip code is required";

      // Check if it contains only digits
      if (!/^\d+$/.test(zipCode.trim())) {
        return "Zip code can only contain numbers";
      }

      // Check length (max 6 digits)
      if (zipCode.trim().length > 6) {
        return "Zip code cannot exceed 6 digits";
      }

      if (zipCode.trim().length < 3) {
        return "Zip code must be at least 3 digits";
      }

      return "";
    };

    // Real-time validation
    const validateField = (name: string, value: string): string => {
      switch (name) {
        case "firstName":
          return validateName(value, "First name");
        case "lastName":
          return validateName(value, "Last name");
        case "phoneNumber":
          return validatePhoneNumber(value);
        case "zipCode":
          return validateZipCode(value);
        default:
          return "";
      }
    };

    // Validate all fields
    const validateAllFields = (): ValidationErrors => {
      const newErrors: ValidationErrors = {};

      newErrors.firstName = validateName(
        formData.firstName || "",
        "First name"
      );
      newErrors.lastName = validateName(formData.lastName || "", "Last name");
      newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber || "");
      newErrors.zipCode = validateZipCode(formData.zipCode || "");

      // Remove empty errors
      Object.keys(newErrors).forEach((key) => {
        if (!newErrors[key]) delete newErrors[key];
      });

      return newErrors;
    };

    // Handle input change with validation
    const handleInputChangeWithValidation = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { name, value } = e.target;

      // For phone number, only allow digits
      if (name === "phoneNumber") {
        const digitsOnly = value.replace(/\D/g, "");
        // Update formData directly for phone number
        setFormData((prev) => ({
          ...prev,
          [name]: digitsOnly,
        }));
      } else if (name === "zipCode") {
        // For zip code, only allow digits
        const digitsOnly = value.replace(/\D/g, "");
        // Update formData directly for zip code
        setFormData((prev) => ({
          ...prev,
          [name]: digitsOnly,
        }));
      } else {
        // Call the original handler for other fields
        handleInputChange(e);
      }

      // Mark field as touched
      setTouchedFields((prev) => new Set(prev).add(name));

      // Validate the field with the processed value
      const processedValue =
        name === "phoneNumber" || name === "zipCode"
          ? value.replace(/\D/g, "")
          : value;
      const error = validateField(name, processedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    };

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

    // Check if form is valid
    const isFormValid = useMemo(() => {
      const currentErrors = validateAllFields();
      return Object.keys(currentErrors).length === 0;
    }, [formData]);

    // Update errors when formData changes (for touched fields only)
    useEffect(() => {
      const newErrors: ValidationErrors = {};

      touchedFields.forEach((fieldName) => {
        const error = validateField(
          fieldName,
          formData[fieldName as keyof FormData] || ""
        );
        if (error) {
          newErrors[fieldName] = error;
        }
      });

      setErrors(newErrors);
    }, [formData, touchedFields]);

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
                    <input title="Upload Image"
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
                  disabled={true}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter your First Name"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
                {errors.firstName && touchedFields.has("firstName") && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.firstName}</span>
                  </div>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                  <Star />
                </label>
                <input
                  disabled={true}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter your Last Name"
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.lastName
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
                {errors.lastName && touchedFields.has("lastName") && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.lastName}</span>
                  </div>
                )}
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
                disabled={true}
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
                  onChange={handleInputChangeWithValidation}
                  placeholder="1234567890"
                  className={`w-full px-3 py-2 border rounded-r-lg ${
                    errors.phoneNumber
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.phoneNumber && touchedFields.has("phoneNumber") && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.phoneNumber}</span>
                </div>
              )}
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
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Zip Code"
                  maxLength={6}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.zipCode
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
                {errors.zipCode && touchedFields.has("zipCode") && (
                  <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.zipCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <button
            disabled={loading || !hasChanges || !isFormValid}
            onClick={updateProfileData}
            className={`bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white px-6 py-2 rounded-[6px] ${
              loading || !hasChanges || !isFormValid
                ? "opacity-50 cursor-not-allowed"
                : ""
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

        {/* Form validation summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-2">
              <AlertCircle className="h-4 w-4" />
              Please fix the following errors:
            </div>
            <ul className="text-red-600 text-sm space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

AccountSettings.displayName = "AccountSettings";

export default AccountSettings;
