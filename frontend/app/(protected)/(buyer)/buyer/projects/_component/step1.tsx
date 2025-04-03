"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "./create-projects-context";

const category = [
  {
    id: 1,
    name: "Apparel & Fashion",
  },
  {
    id: 2,
    name: "Automobiles & Motorcycles",
  },
];

interface Step1Props {
  handleNext: () => void;
}

const Step1: React.FC<
  Step1Props & {
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  }
> = ({ handleNext, errors, setErrors }) => {
  const { formData, updateFormData } = useFormContext();
  const { category: selectedCategory, businessName, productType } = formData;

  const handleChange = (field: string, value: string) => {
    updateFormData(field, value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Business Requirements</h1>
        <p className="text-[#78787A] text-sm mt-2">
          Define the industry and category of the product to ensure accurate
          supplier matching.
        </p>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <label htmlFor="category" className="text-[#78787A] text-sm">
              Category
              <span className="text-[#EA3D4F]">*</span>
            </label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger className="w-full h-10 rounded-l-md bg-white border border-gray-300 px-3">
                <SelectValue placeholder="Select Category" />
                <SelectContent className="z-1000 bg-white">
                  {category.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
          <div>
            <label htmlFor="businessName" className="text-[#78787A] text-sm">
              Business Name
              <span className="text-[#EA3D4F]">*</span>
            </label>
            <input
              type="text"
              id="businessName"
              className="border border-[#D2D2D2] rounded-md p-2 w-full"
              placeholder="Type here..."
              value={businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
            />
            {errors.businessName && (
              <p className="text-red-500 text-sm">{errors.businessName}</p>
            )}
          </div>

          <div>
            <label htmlFor="productType" className="text-[#78787A] text-sm">
              Product Type
              <span className="text-[#EA3D4F]">*</span>
            </label>
            <Select
              value={productType}
              onValueChange={(value) => handleChange("productType", value)}
            >
              <SelectTrigger className="w-full h-10 rounded-l-md bg-white border border-gray-300 px-3">
                <SelectValue placeholder="Select Product Type" />
                <SelectContent>
                  {category.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
            {errors.productType && (
              <p className="text-red-500 text-sm">{errors.productType}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step1;
