"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LookingForFormProps {
  formData: {
    lookingFor: string[];
    [key: string]: any;
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

export function LookingForForm({
  formData,
  setFormData,
  onSubmit,
  onPrevious,
  isSubmitting,
}: LookingForFormProps) {
  const [errors, setErrors] = useState<{
    lookingFor?: string;
  }>({});

  const options = [
    {
      id: "manufacturer",
      label:
        "I need a Manufacturer (Custom Products, Bulk Orders, Private Labeling)",
    },
    {
      id: "packaging",
      label:
        "I need Packaging Solutions (Custom, Sustainable, Design Services)",
    },
    {
      id: "ingredients",
      label:
        "I need Ingredients & Raw Materials (Flavors, Fragrances, Organic Extracts, etc.)",
    },
    {
      id: "services",
      label:
        "I need Business Services (Branding, Logistics, Web Development, etc.)",
    },
  ];

  const handleCheckboxChange = (id: string, checked: boolean) => {
    let updatedLookingFor = [...formData.lookingFor];

    if (checked) {
      updatedLookingFor.push(id);
    } else {
      updatedLookingFor = updatedLookingFor.filter((item) => item !== id);
    }

    setFormData({ ...formData, lookingFor: updatedLookingFor });
    setErrors({ ...errors, lookingFor: undefined });
  };

  return (
    <div className="space-y-8">
      <div className="text-start space-y-2">
        <h1 className="text-2xl font-bold">What Are You Looking For?</h1>
        <p className="text-muted-foreground">
          Tell us what you're looking for so we can match you with the best
          suppliers!
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base font-medium">
            Select Your Needs (Multi-Select Allowed)
          </Label>

          <div className="space-y-4 mt-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-start space-x-3">
                <Checkbox
                  id={option.id}
                  checked={formData.lookingFor.includes(option.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.id, checked as boolean)
                  }
                  className="mt-1 border-[#e5e5e5]"
                />
                <Label
                  htmlFor={option.id}
                  className="text-base font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          {errors.lookingFor && (
            <p className="text-sm text-red-500 mt-1">{errors.lookingFor}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          className="text-primary flex items-center gap-2"
          onClick={onPrevious}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          className="rounded-[6px] text-white px-8 py-2 button-bg"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Finishing..." : "Finish"}
        </Button>
      </div>
    </div>
  );
}
