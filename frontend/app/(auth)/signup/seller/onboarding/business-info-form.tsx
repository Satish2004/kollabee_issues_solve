"use client";

import Star from "./Star";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiSelectDropdown from "@/components/ui/multi-select-dropdown";
import { Textarea } from "@/components/ui/textarea";
import { CategoryEnum, BusinessType } from "@/types/api";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const businessTypes = Object.values(BusinessType).map((type) => ({
  value: type,
  label: type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "),
}));

const newBusinesCat = Object.values(CategoryEnum).map((category) => ({
  value: category,
  label: category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "),
}));

const businessCategories = newBusinesCat.map((b) => {
  return {
    value: b.value,
    label: b.label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
  };
});

console.log("newBusinesCat : ", newBusinesCat);

// Convert business types to string array for the dropdown
const businessTypeOptions = businessTypes.map(({ label }) => label);

// Convert business categories to string array for the dropdown
const businessCategoryOptions = businessCategories.map(({ label }) => label);

interface BusinessInfoFormProps {
  formData: {
    businessName: string;
    businessDescription: string;
    websiteLink: string;
    businessAddress: string;
    businessTypes: BusinessType[];
    businessCategories: CategoryEnum[];
  };
  setFormData: (
    data: (
      prev: BusinessInfoFormProps["formData"]
    ) => BusinessInfoFormProps["formData"]
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function BusinessInfoForm({
  formData,
  setFormData,
  onNext,
  onPrevious,
}: BusinessInfoFormProps) {
  const [errors, setErrors] = useState({
    businessName: "",
    businessDescription: "",
    websiteLink: "",
    businessAddress: "",
    businessTypes: "",
    businessCategories: "",
  });

  // Add state for custom business types
  const [customBusinessTypes, setCustomBusinessTypes] = useState<string[]>([]);

  useEffect(() => {
    const handleResetValidation = () => {
      setErrors({
        businessName: "",
        businessDescription: "",
        websiteLink: "",
        businessAddress: "",
        businessTypes: "",
        businessCategories: "",
      });
    };

    document.addEventListener("reset-validation", handleResetValidation);
    return () => {
      document.removeEventListener("reset-validation", handleResetValidation);
    };
  }, []);

  // Update the handleBusinessTypeChange function to handle the "Other" option:
  const handleBusinessTypeChange = (selectedTypes: string[]) => {
    // Convert the display labels back to enum values for the API
    const enumValues = selectedTypes.map((label) => {
      const type = businessTypes.find((t) => t.label === label);
      return type ? type.value : label;
    });

    setFormData((prev) => ({
      ...prev,
      businessTypes: enumValues as BusinessType[],
    }));
  };

  const handleBusinessCategoryChange = (selectedCategories: string[]) => {
    // Convert the display labels back to enum values for the API
    const enumValues = selectedCategories.map((label) => {
      const category = businessCategories.find((c) => c.label === label);
      return category ? category.value : label;
    });

    setFormData((prev) => ({
      ...prev,
      businessCategories: enumValues as CategoryEnum[],
    }));
  };

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s]*$/; // At least one alphanumeric character, no leading spaces
    const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*$/; // Valid URL format

    const newErrors = {
      businessName:
        formData.businessName.trim().length < 3 ||
        !nameRegex.test(formData.businessName)
          ? "Business Name must be at least 3 characters long and cannot contain only numbers or special characters"
          : "",
      businessDescription:
        formData.businessDescription.trim().length < 10 ||
        !nameRegex.test(formData.businessDescription)
          ? "Business Description must be at least 10 characters long and cannot contain only numbers or special characters"
          : "",
      websiteLink:
        formData.websiteLink.trim() === "" ||
        !websiteRegex.test(formData.websiteLink)
          ? "Please enter a valid Website/Instagram link"
          : "",
      businessAddress:
        formData.businessAddress.trim() === ""
          ? "Business Address is required"
          : "",
      businessTypes:
        formData.businessTypes.length === 0
          ? "Select at least one Business Type"
          : "",
      businessCategories:
        formData.businessCategories.length === 0
          ? "Select at least one Business Category"
          : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  // Convert enum values to display labels for the dropdowns
  const getSelectedTypeLabels = () => {
    return (formData.businessTypes || []).map((value: BusinessType) => {
      const type = businessTypes.find((t) => t.value === value);
      return type ? type.label : value;
    });
  };

  const getSelectedCategoryLabels = () => {
    return (formData.businessCategories || []).map((value: CategoryEnum) => {
      const category = businessCategories.find((c) => c.value === value);
      return category ? category.label : value;
    });
  };

  return (
    <div className="space-y-8" id="business-info-form">
      <div className="text-start space-y-2">
        <h2 className="text-2xl font-bold">Business Information</h2>
        <p className="text-muted-foreground">
          Tell us about your business to unlock opportunities with the right
          buyers.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <p>
                Business Name
                <Star />
              </p>
            </label>
            <p className="text-sm font-futura italic">
              Enter the official name of your business as it appears on legal
              documents and branding materials. This name will be visible to
              customers
            </p>
          </div>
          <Input
            placeholder="Enter your Business Name"
            value={formData.businessName}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                businessName: e.target.value,
              }));
            }}
            className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
          />
          {errors.businessName && (
            <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Business Description - Full Width */}
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <p>
                Business Description
                <Star />
              </p>
            </label>
            <p className="text-sm font-futura italic">
              Enter your business description to help customers understand what
              you offer. This description will be visible to customers.
            </p>
          </div>
          <Textarea
            placeholder="Enter your Business description"
            value={formData.businessDescription}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                businessDescription: e.target.value,
              }));
            }}
            className="min-h-[100px] bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
          />
          {errors.businessDescription && (
            <p className="text-sm text-red-500 mt-1">
              {errors.businessDescription}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-1">
                Business Website/Instagram
              </label>
              <p className="text-sm font-futura italic">
                Enter the complete URL of your business website (e.g.,
                https://yourbusiness.com). Ensure the link is valid and
                accessible to customers.
              </p>
            </div>
            <Input
              placeholder="Enter your Website Link"
              value={formData.websiteLink}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  websiteLink: e.target.value,
                }));
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
            {errors.websiteLink && (
              <p className="text-sm text-red-500 mt-1">{errors.websiteLink}</p>
            )}
          </div>

          {/* Business Type - Using MultiSelectDropdown */}
          <MultiSelectDropdown
            label="Business Type"
            placeholder="Select one or more business types"
            options={businessTypeOptions}
            selectedValues={getSelectedTypeLabels()}
            onChange={handleBusinessTypeChange}
            isRequired={true}
            error={errors.businessTypes}
            infoText="Match with the right buyers by selecting one or more categories that best describe your business."
            allowCustomValues={true}
            customValueCategory="Other"
            customValues={customBusinessTypes}
            onCustomValuesChange={(values) => {
              setCustomBusinessTypes(values);

              // Update the form data with custom business types
              setFormData((prev) => {
                // Get existing business types excluding any custom ones
                const standardTypes = prev.businessTypes.filter(
                  (type) =>
                    !customBusinessTypes.includes(type as unknown as string)
                );

                // Add the new custom values as business types
                return {
                  ...prev,
                  businessTypes: [
                    ...standardTypes,
                    ...values.map((value) => value as unknown as BusinessType),
                  ],
                };
              });
            }}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-1">
                Business Address{" "}
              </label>
              <p className="text-sm font-futura italic">
                Provide the full physical address of your business location,
                including street, city, state, and ZIP code. This helps
                customers find your business.
              </p>
            </div>
            <Input
              placeholder="Enter your Business Address"
              value={formData.businessAddress}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  businessAddress: e.target.value,
                }));
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
            {errors.businessAddress && (
              <p className="text-sm text-red-500 mt-1">
                {errors.businessAddress}
              </p>
            )}
          </div>

          {/* Business Category - Using MultiSelectDropdown */}
          <MultiSelectDropdown
            label="Business Category"
            placeholder="Select one or more business categories"
            options={businessCategoryOptions}
            selectedValues={getSelectedCategoryLabels()}
            onChange={handleBusinessCategoryChange}
            isRequired={true}
            error={errors.businessCategories}
            helperText="Choose one or more categories your business primarily operates in."
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button
          onClick={onPrevious}
          variant="ghost"
          size="sm"
          className="text-primary -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          className="rounded-[6px] text-white px-8 py-2 bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
