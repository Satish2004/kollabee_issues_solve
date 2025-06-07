"use client";

import type React from "react";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "./create-projects-context";

const Step3 = ({
  handleNext,
  errors,
  setErrors,
}: {
  handleNext: () => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
  const { formData, updateFormData } = useFormContext();
  const [receiveDate, setReceiveDate] = useState<string>(
    formData.receiveDate
      ? format(new Date(formData.receiveDate), "yyyy-MM-dd")
      : ""
  );
  const [launchDate, setLaunchDate] = useState<string>(
    formData.launchDate
      ? format(new Date(formData.launchDate), "yyyy-MM-dd")
      : ""
  );
  const [serviceStartDate, setServiceStartDate] = useState<string>(
    formData.serviceStartDate
      ? format(new Date(formData.serviceStartDate), "yyyy-MM-dd")
      : ""
  );
  const [serviceEndDate, setServiceEndDate] = useState<string>(
    formData.serviceEndDate
      ? format(new Date(formData.serviceEndDate), "yyyy-MM-dd")
      : ""
  );

  const handleChange = (field: string, value: any) => {
    updateFormData(field, value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const locations = [
    "No preference",
    "United States",
    "Canada",
    "United Kingdom",
    "India",
    "China",
    "Vietnam",
    "Germany",
    "Japan",
    "Australia",
    "Brazil",
    "Mexico",
    "Other",
  ];

  // Get the appropriate date field label based on project type
  const getDateFieldLabel = () => {
    if (formData.selectedServices.includes("services-brand-support")) {
      return "When would you like to start the service?";
    } else if (formData.selectedServices.includes("custom-manufacturing")) {
      return "When do you need to receive your product?";
    } else if (formData.selectedServices.includes("packaging-only")) {
      return "When do you need to receive your packaging?";
    }
    return "Timeline";
  };

  // Handle date change based on project type
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (formData.selectedServices.includes("services-brand-support")) {
      setServiceStartDate(value);
      handleChange("serviceStartDate", value ? new Date(value) : null);
    } else {
      setReceiveDate(value);
      handleChange("receiveDate", value ? new Date(value) : null);
    }
  };

  // Get the current date value based on project type
  const getCurrentDateValue = () => {
    if (formData.selectedServices.includes("services-brand-support")) {
      return serviceStartDate;
    }
    return receiveDate;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white font-futura">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Timeline</h1>
        <p className="text-[#78787A] text-sm font-normal">
          Define your project timeline and supplier preferences
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="dateField" className="text-sm font-normal">
              {getDateFieldLabel()}
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <div className="flex items-center relative">
              <input
                type="date"
                id="dateField"
                className="w-full border rounded p-2 h-10 focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                value={getCurrentDateValue()}
                onChange={handleDateChange}
                placeholder="dd/mm/yy"
              />
              <CalendarIcon className="absolute right-3 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
            {errors.receiveDate &&
              formData.selectedServices.includes("custom-manufacturing") && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.receiveDate}
                </p>
              )}
            {errors.serviceStartDate &&
              formData.selectedServices.includes("services-brand-support") && (
                <p className="text-red-500 text-sm font-normal">
                  {errors.serviceStartDate}
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierLocation" className="text-sm font-normal">
              Location<span className="text-[#EA3D4F]">*</span>
            </Label>
            <Select
              value={formData.supplierLocation || ""}
              onValueChange={(value) => handleChange("supplierLocation", value)}
            >
              <SelectTrigger id="supplierLocation" className="w-full">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent className="bg-white z-100">
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.supplierLocation && (
              <p className="text-red-500 text-sm font-normal">
                {errors.supplierLocation}
              </p>
            )}
          </div>
        </div>

        {/* Secondary date field for specific project types */}
        {formData.selectedServices.includes("services-brand-support") && (
          <div className="space-y-2">
            <Label htmlFor="serviceEndDate" className="text-sm font-normal">
              When would you like the service to be completed?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <div className="flex items-center relative">
              <input
                type="date"
                id="serviceEndDate"
                className="w-full border rounded p-2 h-10 focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                value={serviceEndDate}
                onChange={(e) => {
                  setServiceEndDate(e.target.value);
                  handleChange(
                    "serviceEndDate",
                    e.target.value ? new Date(e.target.value) : null
                  );
                }}
              />
              <CalendarIcon className="absolute right-3 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
            {errors.serviceEndDate && (
              <p className="text-red-500 text-sm font-normal">
                {errors.serviceEndDate}
              </p>
            )}
          </div>
        )}

        {formData.selectedServices.includes("custom-manufacturing") && (
          <div className="space-y-2">
            <Label htmlFor="launchDate" className="text-sm font-normal">
              Do you have a specific launch date in mind?
            </Label>
            <div className="flex items-center relative">
              <input
                type="date"
                id="launchDate"
                className="w-full border rounded p-2 h-10 focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                value={launchDate}
                onChange={(e) => {
                  setLaunchDate(e.target.value);
                  handleChange(
                    "launchDate",
                    e.target.value ? new Date(e.target.value) : null
                  );
                }}
              />
              <CalendarIcon className="absolute right-3 h-4 w-4 opacity-50 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="additionalDetails" className="text-sm font-normal">
            Additional Details<span className="text-[#EA3D4F]">*</span>
          </Label>
          <Textarea
            id="additionalDetails"
            placeholder="Type here..."
            value={formData.additionalDetails || ""}
            onChange={(e) => handleChange("additionalDetails", e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      </div>

      <div className="flex justify-end mt-12">
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

export default Step3;
