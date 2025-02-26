"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { CategoryEnum, BusinessType } from '@/types/api';

const businessTypes = Object.values(BusinessType).map(type => ({
  value: type,
  label: type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}));

const businessCategories = Object.values(CategoryEnum).map(category => ({
  value: category,
  label: category.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}));

interface BusinessInfoFormProps {
  formData: {
    businessName: string;
    websiteLink: string;
    businessAddress: string;
    businessTypes: BusinessType[];
    businessCategories: CategoryEnum[];
  };
  setFormData: (data: (prev: BusinessInfoFormProps['formData']) => BusinessInfoFormProps['formData']) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function BusinessInfoForm({
  formData,
  setFormData,
  onNext,
  onPrevious,
}: BusinessInfoFormProps) {

  const handleBusinessTypeClick = (type: BusinessType) => {
    setFormData((prev) => ({
      ...prev,
      businessTypes: prev.businessTypes?.includes(type)
        ? prev.businessTypes.filter((t) => t !== type)
        : [...(prev.businessTypes || []), type]
    }));
  };

  const handleBusinessCategoryClick = (category: CategoryEnum) => {
    setFormData((prev) => ({
      ...prev,
      businessCategories: prev.businessCategories?.includes(category)
        ? prev.businessCategories.filter((c) => c !== category)
        : [...(prev.businessCategories || []), category]
    }));
  };

  const isFormValid = () => {
    return (
      formData.businessName.trim() !== "" &&
      formData.websiteLink.trim() !== "" &&
      formData.businessAddress.trim() !== "" &&
      formData.businessTypes.length > 0 &&
      formData.businessCategories.length > 0
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-start space-y-2">
        <h2 className="text-2xl font-bold">Business Information</h2>
        <p className="text-muted-foreground">
          Tell us about your business to unlock opportunities with the right buyers.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Name<span className="text-destructive">*</span>
              <Info className="w-4 h-4 text-muted-foreground" />
            </label>
            <Input
              placeholder="Enter your Business Name"
              value={formData.businessName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, businessName: e.target.value }))
              }
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Website Link<span className="text-destructive">*</span>
              <Info className="w-4 h-4 text-muted-foreground" />
            </label>
            <Input
              placeholder="Enter your Website Link"
              value={formData.websiteLink}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, websiteLink: e.target.value }))
              }
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50 "
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Business Type</label>
            <p className="text-sm text-muted-foreground">
              Match with the right buyers by selecting one or more categories that best describe your business.
            </p>
            <div className="flex flex-wrap gap-2">
              {businessTypes.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={formData.businessTypes?.includes(value) ? "default" : "outline"}
                  onClick={() => handleBusinessTypeClick(value)}
                  className={`rounded-md h-9 px-2 text-xs bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50 ${formData.businessTypes?.includes(value) ? "border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]" : "border-[#e5e5e5]"}`}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Address<span className="text-destructive">*</span>
              <Info className="w-4 h-4 text-muted-foreground" />
            </label>
            <Input
              placeholder="Enter your Business Address"
              value={formData.businessAddress}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, businessAddress: e.target.value }))
              }
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50   "
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Business Category</label>
            <p className="text-sm text-muted-foreground">
              Choose one or more categories your business primarily operates in.
            </p>
            <div className="flex flex-wrap gap-2">
              {businessCategories.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={formData.businessCategories?.includes(value) ? "default" : "outline"}
                  onClick={() => handleBusinessCategoryClick(value)}
                  className={`rounded-md h-9 px-2 text-xs bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50 ${formData.businessCategories?.includes(value) ? "border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]" : "border-[#e5e5e5]"}`}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
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
          className="rounded-[6px] text-white px-8 py-2  bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
          disabled={!isFormValid()}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
