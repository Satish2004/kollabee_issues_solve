"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./create-projects-context";

export default function Step2({
  handleNext,
  errors,
  setErrors,
}: {
  handleNext: () => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const { formData, updateFormData } = useFormContext();
  const [sections, setSections] = useState({
    formulation: true,
    physical: true,
    packaging: true,
    manufacturing: true,
    additional: true,
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const validateField = (field: string, value: string) => {
    if (!value) {
      setErrors((prev) => ({ ...prev, [field]: "This field is required." }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white">
      <div className="mb-6">
        <h1 className="text-xl font-medium">Product Requirements</h1>
        <p className="text-sm text-muted-foreground">
          Specify product details, materials, packaging, and other manufacturing
          needs.
        </p>
      </div>

      {/* Formulation Preferences */}
      <div className="border-t pt-4 pb-2">
        <div
          className="flex justify-between items-center cursor-pointer mb-4"
          onClick={() => toggleSection("formulation")}
        >
          <h2 className="text-base font-medium">Formulation Preferences</h2>
          {sections.formulation ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>

        {sections.formulation && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="formulation-type" className="text-sm">
                Formulation Type*
              </Label>
              <Select
                value={formData.formulationType}
                onValueChange={(value) => {
                  updateFormData("formulationType", value);
                  validateField("formulationType", value);
                }}
              >
                <SelectTrigger id="formulation-type">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent className="bg-white z-100">
                  <SelectItem value="cream">Cream</SelectItem>
                  <SelectItem value="lotion">Lotion</SelectItem>
                  <SelectItem value="serum">Serum</SelectItem>
                  <SelectItem value="oil">Oil</SelectItem>
                </SelectContent>
              </Select>
              {errors?.formulationType && (
                <p className="text-red-500 text-sm">{errors.formulationType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-benefit" className="text-sm">
                Target Benefit*
              </Label>
              <Select
                value={formData.targetBenefit}
                onValueChange={(value) => {
                  updateFormData("targetBenefit", value);
                  validateField("targetBenefit", value);
                }}
              >
                <SelectTrigger id="target-benefit">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent className="bg-white z-100">
                  <SelectItem value="hydration">Hydration</SelectItem>
                  <SelectItem value="anti-aging">Anti-aging</SelectItem>
                  <SelectItem value="brightening">Brightening</SelectItem>
                  <SelectItem value="soothing">Soothing</SelectItem>
                </SelectContent>
              </Select>
              {errors.targetBenefit && (
                <p className="text-red-500 text-sm">{errors.targetBenefit}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Physical Characteristics */}
      <div className="border-t pt-4 pb-2">
        <div
          className="flex justify-between items-center cursor-pointer mb-4"
          onClick={() => toggleSection("physical")}
        >
          <h2 className="text-base font-medium">Physical Characteristics</h2>
          {sections.physical ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>

        {sections.physical && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="texture-preferences" className="text-sm">
                  Texture Preferences*
                </Label>
                <Select
                  value={formData.texturePreferences}
                  onValueChange={(value) => {
                    updateFormData("texturePreferences", value);
                    validateField("texturePreferences", value);
                  }}
                >
                  <SelectTrigger id="texture-preferences">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-100">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="rich">Rich</SelectItem>
                    <SelectItem value="whipped">Whipped</SelectItem>
                  </SelectContent>
                </Select>
                {errors.texturePreferences && (
                  <p className="text-red-500 text-sm">
                    {errors.texturePreferences}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-preferences" className="text-sm">
                  Color Preferences*
                </Label>
                <Select
                  value={formData.colorPreferences}
                  onValueChange={(value) => {
                    updateFormData("colorPreferences", value);
                    validateField("colorPreferences", value);
                  }}
                >
                  <SelectTrigger id="color-preferences">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-100">
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                    <SelectItem value="colored">Colored</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                  </SelectContent>
                </Select>
                {errors.colorPreferences && (
                  <p className="text-red-500 text-sm">
                    {errors.colorPreferences}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fragrance-preferences" className="text-sm">
                Fragrance Preferences*
              </Label>
              <Select
                value={formData.fragrancePreferences}
                onValueChange={(value) => {
                  updateFormData("fragrancePreferences", value);
                  validateField("fragrancePreferences", value);
                }}
              >
                <SelectTrigger id="fragrance-preferences">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent className="bg-white z-100">
                  <SelectItem value="fragrance-free">Fragrance-free</SelectItem>
                  <SelectItem value="floral">Floral</SelectItem>
                  <SelectItem value="citrus">Citrus</SelectItem>
                  <SelectItem value="herbal">Herbal</SelectItem>
                </SelectContent>
              </Select>
              {errors.fragrancePreferences && (
                <p className="text-red-500 text-sm">
                  {errors.fragrancePreferences}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Packaging Requirements */}
      <div className="border-t pt-4 pb-2">
        <div
          className="flex justify-between items-center cursor-pointer mb-4"
          onClick={() => toggleSection("packaging")}
        >
          <h2 className="text-base font-medium">Packaging Requirements</h2>
          {sections.packaging ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>

        {sections.packaging && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packaging-type" className="text-sm">
                  Packaging Type*
                </Label>
                <Select
                  value={formData.packagingType}
                  onValueChange={(value) => {
                    updateFormData("packagingType", value);
                    validateField("packagingType", value);
                  }}
                >
                  <SelectTrigger id="packaging-type">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-100">
                    <SelectItem value="bottle">Bottle</SelectItem>
                    <SelectItem value="tube">Tube</SelectItem>
                    <SelectItem value="jar">Jar</SelectItem>
                    <SelectItem value="airless-pump">Airless Pump</SelectItem>
                  </SelectContent>
                </Select>
                {errors.packagingType && (
                  <p className="text-red-500 text-sm">{errors.packagingType}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="material-preferences" className="text-sm">
                  Material Preferences*
                </Label>
                <Select
                  value={formData.materialPreferences}
                  onValueChange={(value) => {
                    updateFormData("materialPreferences", value);
                    validateField("materialPreferences", value);
                  }}
                >
                  <SelectTrigger id="material-preferences">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-100">
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                    <SelectItem value="eco-friendly">Eco-friendly</SelectItem>
                    <SelectItem value="aluminum">Aluminum</SelectItem>
                  </SelectContent>
                </Select>
                {errors.materialPreferences && (
                  <p className="text-red-500 text-sm">
                    {errors.materialPreferences}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bottle-size" className="text-sm">
                  Bottle/Tube Size*
                </Label>
                <Select
                  value={formData.bottleSize}
                  onValueChange={(value) => {
                    updateFormData("bottleSize", value);
                    validateField("bottleSize", value);
                  }}
                >
                  <SelectTrigger id="bottle-size">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-100">
                    <SelectItem value="30ml">30ml</SelectItem>
                    <SelectItem value="50ml">50ml</SelectItem>
                    <SelectItem value="100ml">100ml</SelectItem>
                    <SelectItem value="200ml">200ml</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bottleSize && (
                  <p className="text-red-500 text-sm">{errors.bottleSize}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Labeling and Printing Needs*</Label>
                <RadioGroup
                  value={formData.labelingNeeded}
                  onValueChange={(value) => {
                    updateFormData("labelingNeeded", value);
                    validateField("labelingNeeded", value);
                  }}
                  className="flex space-x-4 pt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="label-yes" />
                    <Label htmlFor="label-yes" className="text-sm font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="label-no" />
                    <Label htmlFor="label-no" className="text-sm font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {errors.labelingNeeded && (
                  <p className="text-red-500 text-sm">
                    {errors.labelingNeeded}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manufacturing and Production */}
      <div className="border-t pt-4 pb-2">
        <div
          className="flex justify-between items-center cursor-pointer mb-4"
          onClick={() => toggleSection("manufacturing")}
        >
          <h2 className="text-base font-medium">
            Manufacturing and Production
          </h2>
          {sections.manufacturing ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>

        {sections.manufacturing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="minimum-order" className="text-sm">
                Minimum Order Quantity*
              </Label>
              <Select
                value={formData.minimumOrderQuantity}
                onValueChange={(value) => {
                  updateFormData("minimumOrderQuantity", value);
                  validateField("minimumOrderQuantity", value);
                }}
              >
                <SelectTrigger id="minimum-order">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent className="bg-white z-100">
                  <SelectItem value="100">100 units</SelectItem>
                  <SelectItem value="500">500 units</SelectItem>
                  <SelectItem value="1000">1,000 units</SelectItem>
                  <SelectItem value="5000">5,000+ units</SelectItem>
                </SelectContent>
              </Select>
              {errors.minimumOrderQuantity && (
                <p className="text-red-500 text-sm">
                  {errors.minimumOrderQuantity}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="certifications" className="text-sm">
                Certifications Required*
              </Label>
              <Select
                value={formData.certificationsRequired}
                onValueChange={(value) => {
                  updateFormData("certificationsRequired", value);
                  validateField("certificationsRequired", value);
                }}
              >
                <SelectTrigger id="certifications">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent className="bg-white z-100">
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="cruelty-free">Cruelty-free</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
              {errors.certificationsRequired && (
                <p className="text-red-500 text-sm">
                  {errors.certificationsRequired}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Additional Requirements */}
      <div className="border-t pt-4 pb-2">
        <div
          className="flex justify-between items-center cursor-pointer mb-4"
          onClick={() => toggleSection("additional")}
        >
          <h2 className="text-base font-medium">Additional Requirements</h2>
          {sections.additional ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>

        {sections.additional && (
          <div className="space-y-4 mb-4">
            <div className="space-y-2">
              <Label className="text-sm">
                Do you need Sample requirements?*
              </Label>
              <RadioGroup
                value={formData.sampleRequirements}
                onValueChange={(value) => {
                  updateFormData("sampleRequirements", value);
                  validateField("sampleRequirements", value);
                }}
                className="flex space-x-4 pt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="sample-no" />
                  <Label htmlFor="sample-no" className="text-sm font-normal">
                    No
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="sample-yes" />
                  <Label htmlFor="sample-yes" className="text-sm font-normal">
                    Yes
                  </Label>
                </div>
              </RadioGroup>
              {errors.sampleRequirements && (
                <p className="text-red-500 text-sm">
                  {errors.sampleRequirements}
                </p>
              )}
            </div>
          </div>
        )}
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
}
