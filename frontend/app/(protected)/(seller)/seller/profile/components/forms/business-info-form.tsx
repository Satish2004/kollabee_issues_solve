"use client";

import Star from "@/app/(auth)/signup/seller/onboarding/Star";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MultiSelectDropdown from "@/components/ui/multi-select-dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const businessCategories = Object.values(CategoryEnum).map((category) => ({
  value: category,
  label: category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "),
}));

const companyRoles = [
  "Founder/CEO",
  "Executive/Leadership",
  "Manager",
  "Team Member",
  "Intern",
  "Other",
];

type BusinessInfoFormProps = {
  formState: any;
  onChange: (newValue: any) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
};

export default function BusinessInfoForm({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
}: BusinessInfoFormProps) {
  const [errors, setErrors] = useState({
    businessName: "",
    businessDescription: "",
    websiteLink: "",
    businessAddress: "",
    businessTypes: "",
    businessCategories: "",
    rolesInCompany: "",
  });

  const [customCategories, setCustomCategories] = useState<string[]>(
    formState.customCategories || []
  );

  // Add state for custom business types
  const [customBusinessTypes, setCustomBusinessTypes] = useState<string[]>(
    formState.customBusinessTypes || []
  );

  const handleCustomCategoriesChange = (newCustomCategories: string[]) => {
    setCustomCategories(newCustomCategories);
    onChange({
      ...formState,
      customCategories: newCustomCategories,
    });
  };

  // Add handler for custom business types
  const handleCustomBusinessTypesChange = (
    newCustomBusinessTypes: string[]
  ) => {
    setCustomBusinessTypes(newCustomBusinessTypes);
    onChange({
      ...formState,
      customBusinessTypes: newCustomBusinessTypes,
    });
  };

  const handleBusinessTypeClick = (type: BusinessType) => {
    onChange({
      ...formState,
      businessTypes: formState.businessTypes?.includes(type)
        ? formState.businessTypes.filter((t: BusinessType) => t !== type)
        : [...(formState.businessTypes || []), type],
    });
  };

  const handleBusinessCategoryClick = (category: CategoryEnum) => {
    onChange({
      ...formState,
      businessCategories: formState.businessCategories?.includes(category)
        ? formState.businessCategories.filter(
            (c: CategoryEnum) => c !== category
          )
        : [...(formState.businessCategories || []), category],
    });
  };

  const businessCategoryOptions = businessCategories.map(({ label }) => label);

  const getSelectedCategoryLabels = () => {
    return (formState.businessCategories || []).map((value: CategoryEnum) => {
      const category = businessCategories.find((c) => c.value === value);
      return category ? category.label : value;
    });
  };

  const getSelectedBusinessTypeLabels = () => {
    return (formState.businessTypes || []).map((value: BusinessType) => {
      const businessType = businessTypes.find((bt) => bt.value === value);
      return businessType ? businessType.label : value;
    });
  };

  const handleBusinessCategoryChange = (selectedCategories: string[]) => {
    // Convert the display labels back to enum values
    const enumValues = selectedCategories.map((label) => {
      const category = businessCategories.find((c) => c.label === label);
      return category ? category.value : label;
    });

    onChange({
      ...formState,
      businessCategories: enumValues,
    });
  };

  return (
    <div className="space-y-8" id="business-info-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-1">
              <p>
                Business Name
                <Star />
              </p>
            </label>
            <p className="text-sm font-futura italic">
              Enter the official name of your business as it appears on legal
              documents and branding materials. This name will be visible to
              customers.
            </p>
            <Input
              placeholder="Enter your Business Name"
              value={formState.businessName || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  businessName: e.target.value,
                });
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-1">
              <span>
                Business Description
                <Star />
              </span>
            </label>
            <p className="text-sm font-futura italic">
              Enter your business description to help customers understand what
              you offer. This description will be visible to customers.
            </p>
            <Textarea
              placeholder="Enter your Business description"
              value={formState.businessDescription || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  businessDescription: e.target.value,
                });
              }}
              className="min-h-[100px] bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-1">
              <span>
                Business Website/Instagram
                <Star />
              </span>
            </label>
            <p className="text-sm font-futura italic">
              Enter the complete URL of your business website (e.g.,
              https://yourbusiness.com). Ensure the link is valid and accessible
              to customers.
            </p>
            <Input
              placeholder="Enter your Website Link"
              value={formState.websiteLink || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  websiteLink: e.target.value,
                });
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <MultiSelectDropdown
            label="Business Type"
            placeholder="Select one or more business types"
            options={businessTypes.map(({ label }) => label)}
            selectedValues={getSelectedBusinessTypeLabels()}
            onChange={(selectedLabels) => {
              // Convert the display labels back to enum values for the API
              const enumValues = selectedLabels.map((label) => {
                const businessType = businessTypes.find(
                  (bt) => bt.label === label
                );
                return businessType ? businessType.value : label;
              });

              onChange({
                ...formState,
                businessTypes: enumValues,
              });
            }}
            isRequired={true}
            error={errors.businessTypes}
            allowCustomValues={true}
            customValuesLabel="Add custom business types:"
            customValueCategory="Other"
            customValues={customBusinessTypes}
            onCustomValuesChange={handleCustomBusinessTypesChange}
            lableBold={true}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-1">
              <span>
                Business Address
                <Star />
              </span>
            </label>
            <p className="text-sm font-futura italic">
              Provide the full physical address of your business location,
              including street, city, state, and ZIP code. This helps customers
              find your business.
            </p>
            <Input
              placeholder="Enter your Business Address"
              value={formState.businessAddress || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  businessAddress: e.target.value,
                });
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <MultiSelectDropdown
            label="Business Category"
            placeholder="Select one or more business categories"
            options={businessCategoryOptions}
            selectedValues={getSelectedCategoryLabels()}
            onChange={handleBusinessCategoryChange}
            isRequired={true}
            error={errors.businessCategories}
            allowCustomValues={true}
            customValuesLabel="Add custom business categories:"
            customValueCategory="Other"
            customValues={customCategories}
            onCustomValuesChange={handleCustomCategoriesChange}
            lableBold={true}
          />

          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center ">
              Describe your Role within the Company
              <span className="text-destructive text-red-500">*</span>
            </label>
            <Select
              value={formState.roleInCompany || ""}
              onValueChange={(value) => {
                onChange({
                  ...formState,
                  roleInCompany: value,
                  otherRole: value !== "Other" ? "" : formState.otherRole,
                });
                setErrors({ ...errors, rolesInCompany: "" });
              }}
            >
              <SelectTrigger
                className={`w-full bg-[#fcfcfc] border ${
                  errors.rolesInCompany ? "border-red-500" : "border-[#e5e5e5]"
                } rounded-[6px]`}
              >
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-white z-10">
                {companyRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {formState.roleInCompany === "Other" && (
              <>
                <label className="text-sm font-bold">
                  Please specify your role
                </label>
                <Input
                  placeholder="example: Director, Chief, etc."
                  value={formState.otherRole || ""}
                  onChange={(e) => {
                    onChange({
                      ...formState,
                      otherRole: e.target.value,
                    });
                    setErrors({ ...errors, rolesInCompany: "" });
                  }}
                  className={`bg-[#fcfcfc] border ${
                    errors.rolesInCompany
                      ? "border-red-500"
                      : "border-[#e5e5e5]"
                  } rounded-[6px] placeholder:text-black/50`}
                />
              </>
            )}
            {errors.rolesInCompany && (
              <p className="text-sm text-red-500 mt-1">
                {errors.rolesInCompany}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
