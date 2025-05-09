"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CategoryEnum, BusinessType } from "@/types/api";
import InfoButton from "@/components/ui/IButton";
import { X, ImageIcon, Upload, AlertCircle } from "lucide-react";

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
  "Under $100K",
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
];

type BusinessOverviewFormProps = {
  formState: any;
  onChange: (newValue: any) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  onFileUpload: (file: File, field: string) => Promise<string | null>;
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

  const handleLanguageToggle = (language: string) => {
    onChange({
      ...formState,
      languagesSpoken: formState.languagesSpoken?.includes(language)
        ? formState.languagesSpoken.filter((l: string) => l !== language)
        : [...(formState.languagesSpoken || []), language],
    });
  };

  const handleAttributeToggle = (attribute: string) => {
    onChange({
      ...formState,
      businessAttributes: formState.businessAttributes?.includes(attribute)
        ? formState.businessAttributes.filter((a: string) => a !== attribute)
        : [...(formState.businessAttributes || []), attribute],
    });
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

  const removeLogoPreview = () => {
    onChange({
      ...formState,
      logoPreview: null,
      businessLogo: null,
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          {/* Business Logo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Logo (Optional)
              <InfoButton text="Upload your company logo to enhance your brand presence" />
            </label>
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
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.logo}</span>
              </div>
            )}
          </div>

          {/* Pre-filled fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Name<span className="text-red-500 ml-0.5">*</span>
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
              Business Description<span className="text-red-500 ml-0.5">*</span>
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
              Website Link<span className="text-red-500 ml-0.5">*</span>
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

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Address<span className="text-red-500 ml-0.5">*</span>
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

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Type<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {businessTypes.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={
                    formState.businessTypes?.includes(value)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleBusinessTypeClick(value)}
                  className={`rounded-md h-8 sm:h-9 px-1 sm:px-2 text-[10px] sm:text-xs bg-[#fcfcfc] border-[#e5e5e5] placeholder:text-black/50 ${
                    formState.businessTypes?.includes(value)
                      ? "border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
                      : "border-[#e5e5e5]"
                  }`}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Category<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {businessCategories.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={
                    formState.businessCategories?.includes(value)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleBusinessCategoryClick(value)}
                  className={`rounded-md h-8 sm:h-9 px-1 sm:px-2 text-[10px] sm:text-xs bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50 ${
                    formState.businessCategories?.includes(value)
                      ? "border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
                      : "border-[#e5e5e5]"
                  }`}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Business Year Founded */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Year Founded
              <span className="text-red-500 ml-0.5">*</span>
            </label>
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

          {/* Business Team Size */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Team Size<span className="text-red-500 ml-0.5">*</span>
            </label>
            <RadioGroup
              value={formState.teamSize || ""}
              onValueChange={(value) => {
                onChange({
                  ...formState,
                  teamSize: value,
                });
              }}
              className="grid grid-cols-2 gap-2"
            >
              {teamSizeOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`team-size-${option}`} />
                  <Label htmlFor={`team-size-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Business Annual Revenue */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Annual Revenue
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <RadioGroup
              value={formState.annualRevenue || ""}
              onValueChange={(value) => {
                onChange({
                  ...formState,
                  annualRevenue: value,
                });
              }}
              className="grid grid-cols-2 gap-2"
            >
              {revenueOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`revenue-${option}`} />
                  <Label htmlFor={`revenue-${option}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Languages Spoken */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Languages Spoken (Optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language}`}
                    checked={formState.languagesSpoken?.includes(language)}
                    onCheckedChange={() => handleLanguageToggle(language)}
                  />
                  <label
                    htmlFor={`language-${language}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {language}
                  </label>
                </div>
              ))}
              <div className="flex items-center space-x-2 col-span-2 mt-2">
                <Checkbox
                  id="language-other"
                  checked={formState.otherLanguageSelected}
                  onCheckedChange={(checked) => {
                    onChange({
                      ...formState,
                      otherLanguageSelected: checked === true,
                    });
                  }}
                />
                <label
                  htmlFor="language-other"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Other (please specify)
                </label>
              </div>
              {formState.otherLanguageSelected && (
                <div className="col-span-2 mt-2">
                  <Input
                    placeholder="Enter other languages"
                    value={formState.otherLanguages || ""}
                    onChange={(e) => {
                      onChange({
                        ...formState,
                        otherLanguages: e.target.value,
                      });
                    }}
                    className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Business Attributes */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Attributes (Optional)
            </label>
            <p className="text-sm text-muted-foreground">
              Select all that apply:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {businessAttributeOptions.map((attribute) => (
                <div key={attribute} className="flex items-start space-x-2">
                  <Checkbox
                    id={`attribute-${attribute}`}
                    checked={formState.businessAttributes?.includes(attribute)}
                    onCheckedChange={() => handleAttributeToggle(attribute)}
                  />
                  <label
                    htmlFor={`attribute-${attribute}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {attribute}
                  </label>
                </div>
              ))}
              <div className="flex items-center space-x-2 col-span-2 mt-2">
                <Checkbox
                  id="attribute-other"
                  checked={formState.otherAttributeSelected}
                  onCheckedChange={(checked) => {
                    onChange({
                      ...formState,
                      otherAttributeSelected: checked === true,
                    });
                  }}
                />
                <label
                  htmlFor="attribute-other"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Other (please specify)
                </label>
              </div>
              {formState.otherAttributeSelected && (
                <div className="col-span-2 mt-2">
                  <Input
                    placeholder="Enter other attributes"
                    value={formState.otherAttributes || ""}
                    onChange={(e) => {
                      onChange({
                        ...formState,
                        otherAttributes: e.target.value,
                      });
                    }}
                    className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default BusinessOverviewForm;
