"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CategoryEnum, BusinessType } from "@/types/api";
import InfoButton from "@/components/ui/IButton";
import { Textarea } from "@/components/ui/textarea";
import MultiSelectDropdown from "@/components/ui/multi-select-dropdown";

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

type BusinessInfoFormProps = {
  formState: any;
  onChange: (newValue: any) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
};

const BusinessInfoForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
}: BusinessInfoFormProps) => {
  const [errors, setErrors] = useState({
    businessName: "",
    businessDescription: "",
    websiteLink: "",
    businessAddress: "",
    businessTypes: "",
    businessCategories: "",
  });

  const [customCategories, setCustomCategories] = useState<string[]>(
    formState.customCategories || []
  );

  const handleCustomCategoriesChange = (newCustomCategories: string[]) => {
    setCustomCategories(newCustomCategories);
    onChange({
      ...formState,
      customCategories: newCustomCategories,
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Name{" "}
              <InfoButton
                text={
                  "Enter the official name of your business as it appears on legal documents and branding materials. This name will be visible to customers"
                }
              />
            </label>
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
            <label className="text-sm font-medium flex items-center gap-1">
              Business Description{" "}
              <InfoButton
                text={
                  "Enter your business description to help customers understand what you offer. This description will be visible to customers."
                }
              />
            </label>
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
            <label className="text-sm font-medium flex items-center gap-1">
              Website Link
              <InfoButton
                text={
                  "Enter the complete URL of your business website (e.g., https://yourbusiness.com). Ensure the link is valid and accessible to customers."
                }
              />
            </label>
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
            selectedValues={
              formState.businessTypes?.map((type: BusinessType) => {
                const businessType = businessTypes.find(
                  (bt) => bt.value === type
                );
                return businessType ? businessType.label : type;
              }) || []
            }
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
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Address{" "}
              <InfoButton
                text={
                  "Provide the full physical address of your business location, including street, city, state, and ZIP code. This helps customers find your business."
                }
              />
            </label>
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
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoForm;
