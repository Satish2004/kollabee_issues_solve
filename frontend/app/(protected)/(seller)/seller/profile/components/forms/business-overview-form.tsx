"use client";

import { Input } from "@/components/ui/input";
import MultiSelectDropdown from "@/components/ui/multi-select-dropdown";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoryEnum, BusinessType } from "@/types/api";
import { X, ImageIcon, Upload, AlertCircle } from "lucide-react";
import type React from "react";
import { useState, useRef } from "react";
import { toast } from "sonner";

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

// Convert business categories to string array for the dropdown
const businessCategoryOptions = businessCategories.map(({ label }) => label);
// Add "Other" option to the categories
if (!businessCategoryOptions.includes("Other")) {
  businessCategoryOptions.push("Other");
}

const teamSizeOptions = [
  "1–10",
  "11–25",
  "26–50",
  "51–100",
  "101–250",
  "251–500",
  "500–1000",
  "1000–5000",
  "5000–10000",
  "10000+",
];

const revenueOptions = [
  "0 - $100K",
  "$100K – $500K",
  "$500K – $1M",
  "$1M – $5M",
  "$5M – $10M",
  "$10M – $50M",
  "$50M+",
];

const languageOptions = [
  "English",
  "Hindi",
  "Spanish",
  "Mandarin",
  "Arabic",
  "French",
  "German",
  "Portuguese",
  "Bengali",
  "Japanese",
  "Russian",
  "Tamil",
  "Urdu",
  "Korean",
  "Other",
];

const businessAttributeOptions = [
  "Sustainable / Eco-Friendly Practices",
  "Female-Owned",
  "Minority-Owned",
  "Low MOQ Flexibility",
  "Social Impact Driven",
  "Certified Organic",
  "Cruelty-Free",
  "Fair Trade Certified",
  "Vegan",
  "Plastic-Free Packaging",
  "Awarded for Sustainability",
  "Featured in Sustainability Media",
  "Recognized for Innovation in Manufacturing",
  "Other",
];

type BusinessOverviewFormProps = {
  formState: any;
  onChange: (newValue: any) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  onFileUpload: (
    file: File | null,
    field: string,
    url?: string
  ) => Promise<string | boolean | null>;
  uploadProgress?: Record<string, number>;
};

const BusinessOverviewForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
  onFileUpload,
  uploadProgress = {},
}: BusinessOverviewFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>(
    formState.customCategories || []
  );
  const [customLanguages, setCustomLanguages] = useState<string[]>(
    formState.customLanguages || []
  );
  const [customAttributes, setCustomAttributes] = useState<string[]>(
    formState.customAttributes || []
  );

  const handleBusinessTypeClick = (type: BusinessType) => {
    onChange({
      ...formState,
      businessTypes: formState.businessTypes?.includes(type)
        ? formState.businessTypes.filter((t: BusinessType) => t !== type)
        : [...(formState.businessTypes || []), type],
    });
  };

  const handleBusinessCategoryChange = (selectedCategories: string[]) => {
    // Convert the display labels back to enum values for the API
    const enumValues = selectedCategories.map((label) => {
      const category = businessCategories.find((c) => c.label === label);
      return category ? category.value : label;
    });

    onChange({
      ...formState,
      businessCategories: enumValues,
    });
  };

  const handleCustomCategoriesChange = (newCustomCategories: string[]) => {
    setCustomCategories(newCustomCategories);
    onChange({
      ...formState,
      customCategories: newCustomCategories,
    });
  };

  const handleLanguagesChange = (selectedLanguages: string[]) => {
    onChange({
      ...formState,
      languagesSpoken: selectedLanguages.filter((lang) => lang !== "Other"),
      otherLanguageSelected: selectedLanguages.includes("Other"),
    });
  };

  const handleCustomLanguagesChange = (newCustomLanguages: string[]) => {
    setCustomLanguages(newCustomLanguages);
    onChange({
      ...formState,
      customLanguages: newCustomLanguages,
    });
  };

  const handleAttributesChange = (selectedAttributes: string[]) => {
    onChange({
      ...formState,
      businessAttributes: selectedAttributes.filter((attr) => attr !== "Other"),
      otherAttributeSelected: selectedAttributes.includes("Other"),
    });
  };

  const handleCustomAttributesChange = (newCustomAttributes: string[]) => {
    setCustomAttributes(newCustomAttributes);
    onChange({
      ...formState,
      customAttributes: newCustomAttributes,
    });
  };

  // Add a function to handle logo deletion
  const handleDeleteLogo = async () => {
    if (!formState.businessLogo || typeof formState.businessLogo !== "string") {
      console.error("Invalid logo URL:", formState.businessLogo);
      setErrors({
        ...errors,
        logo: "Invalid logo URL. Cannot delete logo.",
      });
      return;
    }

    try {
      console.log("Deleting business logo:", formState.businessLogo);

      // Call the API to delete the logo
      const success = await onFileUpload(
        null,
        "deleteLogo",
        formState.businessLogo
      );

      if (success) {
        // Update the UI after successful deletion
        onChange({
          ...formState,
          logoPreview: null,
          businessLogo: null,
        });

        toast.success("Logo deleted successfully");
      } else {
        setErrors({
          ...errors,
          logo: "Failed to delete logo. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error deleting logo:", error);
      setErrors({
        ...errors,
        logo: "Failed to delete logo. Please try again.",
      });
    }
  };

  // Update the removeLogoPreview function to call the API if there's a businessLogo
  const removeLogoPreview = () => {
    if (formState.businessLogo) {
      handleDeleteLogo();
    } else {
      onChange({
        ...formState,
        logoPreview: null,
        businessLogo: null,
      });
    }
  };

  // Update the handleLogoUpload function to properly handle the API response
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create a preview URL immediately for UI feedback
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          ...formState,
          logoPreview: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);

      setIsUploading(true);
      try {
        // Upload the file and get the URL
        const imageUrl = await onFileUpload(file, "businessLogo");

        if (imageUrl) {
          // Update the form state with the uploaded image URL
          onChange({
            ...formState,
            businessLogo: imageUrl,
          });
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        setErrors({
          ...errors,
          logo: "Failed to upload logo. Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Convert enum values to display labels for the dropdown
  const getSelectedCategoryLabels = () => {
    return (formState.businessCategories || []).map((value: CategoryEnum) => {
      const category = businessCategories.find((c) => c.value === value);
      return category ? category.label : value;
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md: 2">
        <div className="space-y-6">
          {/* Business Logo Upload */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center  ">
                Business Logo (Optional)
              </label>
              <p className="text-sm font-futura italic">
                Upload your company logo to enhance your brand presence
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
              {formState.logoPreview ? (
                <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                  <img
                    src={formState.logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeLogoPreview}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770]"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-gray-400 animate-pulse" />
                      <span className="text-xs text-gray-500 mt-1">
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">
                        Upload Logo
                      </span>
                    </>
                  )}
                </div>
              )}
              <div className="text-sm text-gray-500">
                <p>Recommended size: 400x400px</p>
                <p>Max size: 5MB</p>
                <p>Formats: JPEG, PNG, GIF, WEBP</p>
              </div>
            </div>

            {uploadProgress["businessLogo"] !== undefined && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress["businessLogo"]}%</span>
                </div>
                <Progress
                  value={uploadProgress["businessLogo"]}
                  className="h-1"
                />
              </div>
            )}

            {errors.logo && (
              <div className="flex items-center   text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.logo}</span>
              </div>
            )}
          </div>

          {/* Pre-filled fields */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center  ">
                Business Name<span className="text-red-500 ml-0.5">*</span>
              </label>
            </div>
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
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center  ">
                Business Description
                <span className="text-red-500 ml-0.5">*</span>
              </label>
            </div>
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
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center  ">
                Website Link<span className="text-red-500 ml-0.5">*</span>
              </label>
            </div>
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

          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center  ">
                Business Address<span className="text-red-500 ml-0.5">*</span>
              </label>
            </div>
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

          {/* Business Type using the MultiSelectDropdown component */}
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

          {/* Business Category using the MultiSelectDropdown component */}
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

        <div className="space-y-6">
          {/* Business Year Founded */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center  ">
                Business Year Founded
                <span className="text-red-500 ml-0.5">*</span>
              </label>
            </div>
            <Input
              type="number"
              placeholder="e.g., 2010"
              value={formState.yearFounded || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  yearFounded: e.target.value,
                });
              }}
              min="1900"
              max={new Date().getFullYear()}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          {/* Business Team Size - Using MultiSelectDropdown */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center  ">
                Business Team Size<span className="text-red-500 ml-0.5">*</span>
              </label>
            </div>
            <Select
              value={formState.teamSize || ""}
              onValueChange={(value) => {
                onChange({
                  ...formState,
                  teamSize: value,
                });
              }}
            >
              <SelectTrigger className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50">
                <SelectValue placeholder="Select your team size" />
              </SelectTrigger>
              <SelectContent className="bg-white z-2">
                {teamSizeOptions.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teamSize && (
              <div className="text-sm text-red-500 mt-1">{errors.teamSize}</div>
            )}
          </div>

          {/* Business Annual Revenue - Using MultiSelectDropdown */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center  ">
                Business Annual Revenue
                <span className="text-red-500 ml-0.5">*</span>
              </label>
            </div>
            <Select
              value={formState.annualRevenue || ""}
              onValueChange={(value) => {
                onChange({
                  ...formState,
                  annualRevenue: value,
                });
              }}
            >
              <SelectTrigger className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50">
                <SelectValue placeholder="Select your annual revenue" />
              </SelectTrigger>
              <SelectContent className="bg-white z-2">
                {revenueOptions.map((revenue) => (
                  <SelectItem key={revenue} value={revenue}>
                    {revenue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.annualRevenue && (
              <div className="text-sm text-red-500 mt-1">
                {errors.annualRevenue}
              </div>
            )}
          </div>

          {/* Languages Spoken - Using MultiSelectDropdown */}
          <MultiSelectDropdown
            label="Languages Spoken"
            placeholder="Select languages spoken"
            options={languageOptions}
            selectedValues={
              formState.otherLanguageSelected
                ? [...(formState.languagesSpoken || []), "Other"]
                : formState.languagesSpoken || []
            }
            onChange={handleLanguagesChange}
            isRequired={false}
            error={errors.languagesSpoken}
            allowCustomValues={true}
            customValuesLabel="Add other languages:"
            customValueCategory="Other"
            customValues={customLanguages}
            onCustomValuesChange={handleCustomLanguagesChange}
          />

          {/* Business Attributes - Using MultiSelectDropdown */}
          <MultiSelectDropdown
            label="Business Attributes"
            placeholder="Select business attributes"
            options={businessAttributeOptions}
            selectedValues={
              formState.otherAttributeSelected
                ? [...(formState.businessAttributes || []), "Other"]
                : formState.businessAttributes || []
            }
            onChange={handleAttributesChange}
            isRequired={false}
            error={errors.businessAttributes}
            allowCustomValues={true}
            customValuesLabel="Add other attributes:"
            customValueCategory="Other"
            customValues={customAttributes}
            onCustomValuesChange={handleCustomAttributesChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessOverviewForm;
