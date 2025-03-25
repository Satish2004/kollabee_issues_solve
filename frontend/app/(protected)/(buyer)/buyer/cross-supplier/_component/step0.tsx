"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useFormContext } from "./create-projects-context";
import { useEffect } from "react";

const Step0 = ({ handleNext }: { handleNext: () => void }) => {
  const { formData, updateFormData } = useFormContext();
  const { selectedServices } = formData;

  const toggleService = (value: string) => {
    updateFormData(
      "selectedServices",
      selectedServices.includes(value)
        ? selectedServices.filter((item) => item !== value)
        : [...selectedServices, value]
    );
  };




  return (
    <div className="h-full w-full rounded-xl gap-4 bg-white flex flex-col items-center justify-center">
      <h1 className="font-bold text-5xl">What are you looking for?</h1>
      <p className="text-[#78787A] text-sm">
        Choose the product you're looking to create
      </p>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-gradient-to-r from-pink-50 to-amber-50 p-8 rounded-3xl">
          <div className="space-y-6">
            {/* Custom Manufacturing */}
            <div className="flex">
              <div className="flex items-start">
                <Checkbox
                  id="custom-manufacturing"
                  checked={selectedServices.includes("custom-manufacturing")}
                  onCheckedChange={() => toggleService("custom-manufacturing")}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-primary"
                />
              </div>
              <div className="ml-3">
                <Label
                  htmlFor="custom-manufacturing"
                  className="text-base font-medium text-gray-900"
                >
                  Custom Manufacturing
                </Label>
                <p className="text-gray-500 text-sm mt-1">
                  From custom formulation to bulk manufacturing — perfect for
                  product development.
                </p>
              </div>
            </div>

            {/* Packaging Only */}
            <div className="flex">
              <div className="flex items-start">
                <Checkbox
                  id="packaging-only"
                  checked={selectedServices.includes("packaging-only")}
                  onCheckedChange={() => toggleService("packaging-only")}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-primary"
                />
              </div>
              <div className="ml-3">
                <Label
                  htmlFor="packaging-only"
                  className="text-base font-medium text-gray-900"
                >
                  Packaging Only
                </Label>
                <p className="text-gray-500 text-sm mt-1">
                  Eco-friendly, premium, or standard packaging solutions for
                  your products.
                </p>
              </div>
            </div>

            {/* End-to-End Product Development */}
            <div className="flex">
              <div className="flex items-start">
                <Checkbox
                  id="end-to-end"
                  checked={selectedServices.includes("end-to-end")}
                  onCheckedChange={() => toggleService("end-to-end")}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-primary"
                />
              </div>
              <div className="ml-3">
                <Label
                  htmlFor="end-to-end"
                  className="text-base font-medium text-gray-900"
                >
                  End-to-End Product Development
                </Label>
                <p className="text-gray-500 text-sm mt-1">
                  Complete solution including manufacturing, packaging, and
                  private labeling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="w-48 flex items-center gap-2 justify-center py-2 text-[#e00261] font-semibold border-2 border-[#e00261] rounded-lg transition-colors"
        onClick={handleNext}
      >
        <span>Next</span>
        <ArrowRight className="w-5 h-5 text-[#e00261]" />
      </button>
    </div>
  );
};

export default Step0;
