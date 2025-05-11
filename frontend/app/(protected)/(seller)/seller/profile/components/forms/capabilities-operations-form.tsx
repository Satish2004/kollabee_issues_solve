"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import InfoButton from "@/components/ui/IButton";
import { Upload, X, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import MultiSelectDropdown from "@/components/ui/multi-select-dropdown";
import { countries } from "@/app/(auth)/signup/seller/onboarding/signup-form";

const servicesOptions = [
  "White Label Products",
  "Private Labeling",
  "Custom Manufacturing",
  "Ready-to-Ship Products",
  "Co-Packing",
  "Product Development",
  "Packaging Design",
  "Assembly & Fulfillment",
  "Custom Formulations",
  "Labeling & Compliance Services",
  "Quality Control",
  "Supply Chain Management",
  "Market Research & Trend Analysis",
  "Consultation Services",
  "Sustainability Consulting",
  "Product Photography & Videography",
  "Other",
];

const productionModelOptions = [
  "In-House Production",
  "Outsourced",
  "Hybrid (In-house + Outsourced)",
];

const countryOptions = countries.map((c) => c.name);

type CapabilitiesOperationsFormProps = {
  formState: any;
  onChange: (newValue: any) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  onFileUpload: (file: File, field: string) => Promise<string | null>;
  onDeleteImage: (imageUrl: string, field: string) => void;
  uploadProgress?: Record<string, number>;
};

const CapabilitiesOperationsForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
  onFileUpload,
  onDeleteImage,
  uploadProgress = {},
}: CapabilitiesOperationsFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [customServices, setCustomServices] = useState<string[]>(
    formState.customServices || []
  );
  const [customCountries, setCustomCountries] = useState<string[]>(
    formState.customCountries || []
  );

  const handleServicesChange = (selectedServices: string[]) => {
    onChange({
      ...formState,
      servicesProvided: selectedServices.filter(
        (service) => service !== "Other"
      ),
      otherServiceSelected: selectedServices.includes("Other"),
    });
  };

  const handleCustomServicesChange = (newCustomServices: string[]) => {
    setCustomServices(newCustomServices);
    onChange({
      ...formState,
      customServices: newCustomServices,
    });
  };

  const handleProductionModelChange = (selectedModels: string[]) => {
    // For radio-like behavior, we only keep the last selected value
    const productionModel =
      selectedModels.length > 0
        ? selectedModels[selectedModels.length - 1]
        : "";
    onChange({
      ...formState,
      productionModel,
    });
  };

  const handleCountriesChange = (selectedCountries: string[]) => {
    onChange({
      ...formState,
      productionCountries: selectedCountries.filter(
        (country) => country !== "Other"
      ),
      otherCountrySelected: selectedCountries.includes("Other"),
    });
  };

  const handleCustomCountriesChange = (newCustomCountries: string[]) => {
    setCustomCountries(newCustomCountries);
    onChange({
      ...formState,
      customCountries: newCustomCountries,
    });
  };

  const handleFactoryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Check if we're exceeding the limit of 5 images
      const currentCount = (formState.factoryImages || []).length;
      const availableSlots = 5 - currentCount;

      if (files.length > availableSlots) {
        setErrors({
          ...errors,
          factoryImages: `You can only upload up to 5 factory images. You have ${availableSlots} slots available.`,
        });
        return;
      }

      setIsUploading(true);

      // Process each file
      for (const file of files) {
        // Validate file type
        const validImageTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!validImageTypes.includes(file.type)) {
          setErrors({
            ...errors,
            factoryImages:
              "Please upload valid image files (JPEG, PNG, GIF, WEBP)",
          });
          continue;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
          setErrors({
            ...errors,
            factoryImages: "File size exceeds the maximum limit of 5MB",
          });
          continue;
        }

        // Create a preview URL immediately for UI feedback
        const reader = new FileReader();
        const previewPromise = new Promise<string>((resolve) => {
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
        });
        reader.readAsDataURL(file);

        const preview = await previewPromise;

        // Add preview to state
        onChange({
          ...formState,
          factoryImagePreviews: [
            ...(formState.factoryImagePreviews || []),
            {
              file: file,
              preview: preview,
            },
          ],
        });

        try {
          // Upload the file and get the URL
          const imageUrl = await onFileUpload(file, "factoryImages");

          if (imageUrl) {
            // Update the form state with the uploaded image URL
            onChange({
              ...formState,
              factoryImages: [...(formState.factoryImages || []), imageUrl],
            });
          }
        } catch (error) {
          console.error("Error uploading factory image:", error);
          setErrors({
            ...errors,
            factoryImages:
              "Failed to upload one or more images. Please try again.",
          });
        }
      }

      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFactoryImagePreview = (index: number) => {
    const updatedPreviews = [...(formState.factoryImagePreviews || [])];
    updatedPreviews.splice(index, 1);

    onChange({
      ...formState,
      factoryImagePreviews: updatedPreviews,
    });
  };

  // Update the deleteExistingFactoryImage function to properly call the API
  const deleteExistingFactoryImage = async (
    imageUrl: string,
    index: number
  ) => {
    if (typeof imageUrl !== "string") {
      console.error("Invalid imageUrl:", imageUrl);
      setErrors({
        ...errors,
        factoryImages: "Invalid image URL. Cannot delete image.",
      });
      return;
    }

    try {
      console.log("Deleting factory image:", imageUrl);

      // Call the API to delete the image
      await onDeleteImage(imageUrl, "factoryImages");

      // Update the UI after successful deletion
      const updatedImages = [...(formState.factoryImages || [])];
      updatedImages.splice(index, 1);

      onChange({
        ...formState,
        factoryImages: updatedImages,
      });

      toast.success("Factory image deleted successfully");
    } catch (error) {
      console.error("Error deleting factory image:", error);
      setErrors({
        ...errors,
        factoryImages: "Failed to delete factory image. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          {/* Services Provided - Using MultiSelectDropdown */}
          <MultiSelectDropdown
            label="Services Provided"
            placeholder="Select services you provide"
            options={servicesOptions}
            selectedValues={
              formState.otherServiceSelected
                ? [...(formState.servicesProvided || []), "Other"]
                : formState.servicesProvided || []
            }
            onChange={handleServicesChange}
            isRequired={true}
            error={errors.servicesProvided}
            allowCustomValues={true}
            customValuesLabel="Add other services:"
            customValueCategory="Other"
            customValues={customServices}
            onCustomValuesChange={handleCustomServicesChange}
          />

          {/* Minimum Order Quantity (MOQ) */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Minimum Order Quantity (MOQ)
              <span className="text-red-500 ml-0.5">*</span>
              <InfoButton text="Enter the minimum quantity a buyer must order" />
            </label>
            <Input
              placeholder="Enter numeric value or range"
              value={formState.minimumOrderQuantity || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  minimumOrderQuantity: e.target.value,
                });
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          {/* MOQ Flexibility */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                MOQ Flexibility
                <InfoButton text="Indicate if you're willing to work with lower order quantities" />
              </label>
              <Switch
                checked={formState.lowMoqFlexibility || false}
                onCheckedChange={(checked) => {
                  onChange({
                    ...formState,
                    lowMoqFlexibility: checked,
                  });
                }}
                className="data-[state=checked]:bg-[#a11770]"
              />
            </div>
            <p className="text-sm text-gray-500 ml-1">
              Willing to work with low MOQs
            </p>
          </div>

          {/* Production Model - Using MultiSelectDropdown */}
          <MultiSelectDropdown
            label="Production Model"
            placeholder="Select your production model"
            options={productionModelOptions}
            selectedValues={
              formState.productionModel ? [formState.productionModel] : []
            }
            onChange={handleProductionModelChange}
            isRequired={true}
            error={errors.productionModel}
          />
        </div>

        <div className="space-y-6">
          {/* Production Countries - Using MultiSelectDropdown */}
          <MultiSelectDropdown
            label="Production Countries"
            placeholder="Select countries where production takes place"
            options={countryOptions}
            selectedValues={
              formState.otherCountrySelected
                ? [...(formState.productionCountries || []), "Other"]
                : formState.productionCountries || []
            }
            onChange={handleCountriesChange}
            isRequired={false}
            error={errors.productionCountries}
            allowCustomValues={true}
            customValuesLabel="Add other countries:"
            customValueCategory="Other"
            customValues={customCountries}
            onCustomValuesChange={handleCustomCountriesChange}
          />

          {/* Sample & Production Timelines */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-1">
                Do you provide samples?
                <InfoButton text="Indicate if you provide product samples to potential buyers" />
              </label>
              <Switch
                checked={formState.providesSamples || false}
                onCheckedChange={(checked) => {
                  onChange({
                    ...formState,
                    providesSamples: checked,
                  });
                }}
                className="data-[state=checked]:bg-[#a11770]"
              />
            </div>

            {formState.providesSamples && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">
                  Post-Purchase Sample Dispatch Time
                </label>
                <Input
                  placeholder="e.g., 3–5 business days"
                  value={formState.sampleDispatchTime}
                  type="date"
                  onChange={(e) => {
                    onChange({
                      ...formState,
                      sampleDispatchTime: e.target.value,
                    });
                  }}
                  className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                />
              </div>
            )}

            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium">Production Timeline</label>
              <Input
                placeholder="e.g., 2–4 weeks"
                value={formState.productionTimeline}
                type="date"
                onChange={(e) => {
                  onChange({
                    ...formState,
                    productionTimeline: e.target.value,
                  });
                }}
                className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
              />
              <p className="text-xs text-gray-500">
                How long does it typically take to complete full production
                after confirming the order?
              </p>
            </div>
          </div>

          {/* Factory Images */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Factory Images (Optional)
            </label>

            <div className="grid grid-cols-3 gap-3">
              {/* Existing images */}
              {formState.factoryImages?.map(
                (imageUrl: string, index: number) => (
                  <div
                    key={`existing-${index}`}
                    className="relative h-24 border rounded-md overflow-hidden group"
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Factory ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          deleteExistingFactoryImage(imageUrl, index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}

              {/* New image previews */}
              {formState.factoryImagePreviews?.map(
                (preview: any, index: number) => (
                  <div
                    key={`preview-${index}`}
                    className="relative h-24 border rounded-md overflow-hidden"
                  >
                    <img
                      src={preview.preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFactoryImagePreview(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                )
              )}

              {/* Upload button - only show if less than 5 images */}
              {(formState.factoryImages?.length || 0) +
                (formState.factoryImagePreviews?.length || 0) <
                5 && (
                <div
                  onClick={triggerFileInput}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770]"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFactoryImageUpload}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-gray-400 animate-pulse" />
                      <span className="text-xs text-gray-500 mt-1">
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">
                        Upload Image
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {uploadProgress["factoryImages"] !== undefined && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress["factoryImages"]}%</span>
                </div>
                <Progress
                  value={uploadProgress["factoryImages"]}
                  className="h-1"
                />
              </div>
            )}

            {errors.factoryImages && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.factoryImages}</span>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Upload up to 5 photos of your factory or production facility
              (JPEG, PNG, GIF, WEBP, max 5MB each)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapabilitiesOperationsForm;
