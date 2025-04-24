"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [errors, setErrors] = useState<{
    businessName?: string;
    businessType?: string;
    otherBusinessType?: string;
  }>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: undefined });
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
          <div className="flex items-start gap-2">
            <Label
              htmlFor="businessType"
              className="text-sm sm:text-base font-medium"
            >
              Who Are You?
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="bg-gray-200 max-w-[250px] sm:max-w-sm text-xs sm:text-sm p-2 sm:p-3"
                >
                  <p>
                    Select the option that best describes your role in the
                    business. This helps us tailor the experience based on your
                    business type
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                onChange={(e) =>
                  handleChange("otherBusinessType", e.target.value)
                }
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
          <div className="flex items-center gap-2">
            <Label
              htmlFor="businessName"
              className="text-sm sm:text-base font-medium"
            >
              Business Name<span className="text-destructive">*</span>
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="bg-gray-200 max-w-[250px] sm:max-w-sm text-xs sm:text-sm p-2 sm:p-3"
                >
                  <p>
                    Enter the official name of your business as registered. If
                    you don't have a registered business name, enter the name
                    you operate under.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="businessName"
            placeholder="Enter your Business Name"
            value={formData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            className="bg-[#fcfcfc] border border-[#e5e5e5] rounded-[6px] placeholder:text-[#bababb] max-w-md text-sm sm:text-base h-9 sm:h-10"
          />
          {errors.businessName && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              {errors.businessName}
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
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
