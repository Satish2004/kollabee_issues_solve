"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useFormContext } from "./create-projects-context";
import { useState } from "react";

const Step0 = ({ handleNext }: { handleNext: () => void }) => {
  const { formData, updateFormData } = useFormContext();
  const { selectedServices } = formData;
  const [error, setError] = useState("");

  const handleServiceSelect = (value: string) => {
    // Only allow one selection at a time
    updateFormData("selectedServices", [value]);
    setError(""); // Clear error when a service is selected
  };

  const handleNextStep = () => {
    if (selectedServices.length === 0) {
      setError("Please select a service type.");
      return;
    }
    handleNext();
  };

  return (
    <div className="h-full w-full rounded-xl gap-6 bg-white flex flex-col items-center justify-center p-8 font-futura">
      <h1 className="font-bold font-futura text-4xl sm:text-5xl text-center">
        What are you looking for?
      </h1>
      <p className="text-[#78787A] font-futura   text-sm font-normal text-center max-w-lg">
        Choose the product or service you're looking to create
      </p>

      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Custom Product Manufacturing */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-md font-normal ${
            selectedServices.includes("custom-manufacturing")
              ? "bg-gradient-to-r from-pink-50 to-amber-50 border-[#e00261]"
              : "bg-white"
          }`}
          onClick={() => handleServiceSelect("custom-manufacturing")}
        >
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="font-normal  text-lg  mb-2">
              Custom Product Manufacturing
            </h3>
            <p className=" text-sm font-normal text-gray-600 flex-grow">
              Create your own product from scratch or rebrand an existing
              product with your label (Private/White Label).
            </p>
          </CardContent>
        </Card>

        {/* Packaging Only */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedServices.includes("packaging-only")
              ? "bg-gradient-to-r from-pink-50 to-amber-50 border-[#e00261]"
              : "bg-white"
          }`}
          onClick={() => handleServiceSelect("packaging-only")}
        >
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="  text-lg  font-normal mb-2">Packaging Only</h3>
            <p className=" text-sm font-normal text-gray-600 flex-grow">
              Premium, sustainable, or standard packaging — tailored to fit your
              product.
            </p>
          </CardContent>
        </Card>

        {/* Services & Brand Support */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedServices.includes("services-brand-support")
              ? "bg-gradient-to-r from-pink-50 to-amber-50 border-[#e00261]"
              : "bg-white"
          }`}
          onClick={() => handleServiceSelect("services-brand-support")}
        >
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="  text-lg font-normal mb-2">
              Services & Brand Support
            </h3>
            <p className=" text-sm font-normal text-gray-600 flex-grow">
              Design, branding, web setup, and expert guidance to help bring
              your vision to life.
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <p className="text-red-500  text-sm font-normal mt-4">{error}</p>
      )}

      <button
        className="w-48 flex items-center gap-2 h-14 justify-center py-2 mt-6 font-normal border-2 rounded-lg gradient-border gradient-text"
        onClick={handleNextStep}
      >
        <span>Next</span>
        <ArrowRight className="w-5 h-5 text-[#e00261]" />
      </button>
    </div>
  );
};

export default Step0;
