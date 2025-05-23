"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface AboutYouFormProps {
  formData: {
    businessName: string;
    businessType: string;
    otherBusinessType?: string;
    [key: string]: any;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function AboutYouForm({
  formData,
  setFormData,
  onNext,
  onPrevious,
}: AboutYouFormProps) {
  const [errors, setErrors] = useState({
    businessName: "",
    businessDescription: "",
    businessType: "",
    otherBusinessType: "",
  });

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const validateForm = () => {
    const newErrors = {
      businessName:
        formData.businessName.trim() === "" ? "Business Name is required" : "",
      businessDescription:
        formData.businessDescription.trim() === ""
          ? "Business Description is required"
          : "",
      otherBusinessType:
        formData.businessType === "Other" && !formData.otherBusinessType
          ? "Specify your Business Type"
          : "",

      businessType:
        formData.businessType.trim() === ""
          ? "Select one one Business Type"
          : "",
    };

    setErrors(newErrors);

    console.log("Form Errors:", newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const businessTypes = [
    { value: "Brand Owner", label: "Brand Owner" },
    { value: "Retailer", label: "Retailer" },
    { value: "Startup", label: "Startup" },
    { value: "Individual Entrepreneur", label: "Individual Entrepreneur" },
    { value: "Other", label: "Other (Specify)" },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-0 sm:space-y-8">
      <div className="text-start space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold">Tell Us About You</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Are you an individual entrepreneur, a brand, or a retailer?
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <Label
                htmlFor="businessType"
                className="text-sm sm:text-base font-medium"
              >
                Who Are You?
              </Label>
            </div>
            <p className="text-sm font-futura italic">
              Select the option that best describes your role in the business.
              This helps us tailor the experience based on your business type
            </p>
          </div>

          <RadioGroup
            value={formData.businessType}
            onValueChange={(value) => handleChange("businessType", value)}
            className="space-y-2 sm:space-y-3"
          >
            {businessTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={type.value}
                  id={type.value}
                  className="border-[#e5e5e5]"
                />
                <Label
                  htmlFor={type.value}
                  className="text-sm sm:text-base font-normal cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {formData.businessType === "Other" && (
            <div className="ml-6 mt-2">
              <Input
                placeholder="Please specify"
                value={formData.otherBusinessType || ""}
                onChange={(e) => {
                  handleChange("otherBusinessType", e.target.value);
                  validateForm();
                }}
                className="bg-[#fcfcfc] border border-[#e5e5e5] rounded-[6px] placeholder:text-[#bababb] max-w-md text-sm sm:text-base h-9 sm:h-10"
              />
              {errors.otherBusinessType && (
                <p className="text-xs sm:text-sm text-red-500 mt-1">
                  {errors.otherBusinessType}
                </p>
              )}
            </div>
          )}

          {errors.businessType && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              {errors.businessType}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="businessName"
                className="text-sm sm:text-base font-medium"
              >
                Business Name{" "}
              </Label>
            </div>
            <p className="text-sm font-futura italic">
              Enter the official name of your business as registered. If you
              don't have a registered business name, enter the name you operate
              under.
            </p>
          </div>
          <Input
            id="businessName"
            placeholder="Enter your Business Name"
            value={formData.businessName}
            onChange={(e) => {
              handleChange("businessName", e.target.value);
              validateForm();
            }}
            className="bg-[#fcfcfc] border border-[#e5e5e5] rounded-[6px] placeholder:text-[#bababb] max-w-md text-sm sm:text-base h-9 sm:h-10"
          />
          {errors.businessName && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              {errors.businessName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Description{" "}
            </label>
            <p className="text-sm font-futura italic">
              Enter your bussiness description to help customers understand what
              you offer. This description will be visible to customers.
            </p>
          </div>
          <Textarea
            placeholder="Enter your Business description"
            value={formData.businessDescription}
            onChange={(e) => {
              handleChange("businessDescription", e.target.value);
              validateForm();
            }}
            className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
          />
          {errors.businessDescription && (
            <p className="text-sm text-red-500 mt-1">
              {errors.businessDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          className="text-primary flex items-center gap-1 sm:gap-2 text-sm sm:text-base px-2 sm:px-4"
          onClick={onPrevious}
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          Back
        </Button>
        <Button
          className="rounded-[6px] text-white px-4 sm:px-8 py-1 sm:py-2 text-sm sm:text-base button-bg"
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
