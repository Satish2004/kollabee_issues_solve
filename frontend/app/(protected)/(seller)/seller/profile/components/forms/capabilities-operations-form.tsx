"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import InfoButton from "@/components/ui/IButton";
import { Upload, X, Trash2, AlertCircle } from "lucide-react";

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
];

const productionModelOptions = [
  "In-House Production",
  "Outsourced",
  "Hybrid (In-house + Outsourced)",
];

const countryOptions = [
  "United States",
  "China",
  "India",
  "Germany",
  "Japan",
  "United Kingdom",
  "France",
  "Italy",
  "Brazil",
  "Canada",
  "South Korea",
  "Australia",
  "Spain",
  "Mexico",
  "Indonesia",
  "Netherlands",
  "Saudi Arabia",
  "Turkey",
  "Switzerland",
  "Taiwan",
];

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

  const handleServiceToggle = (service: string) => {
    onChange({
      ...formState,
      servicesProvided: formState.servicesProvided?.includes(service)
        ? formState.servicesProvided.filter((s: string) => s !== service)
        : [...(formState.servicesProvided || []), service],
    });
  };

  const handleCountryToggle = (country: string) => {
    onChange({
      ...formState,
      productionCountries: formState.productionCountries?.includes(country)
        ? formState.productionCountries.filter((c: string) => c !== country)
        : [...(formState.productionCountries || []), country],
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

  const deleteExistingFactoryImage = (imageUrl: string, index: number) => {
    onDeleteImage(imageUrl, "factoryImages");

    const updatedImages = [...(formState.factoryImages || [])];
    updatedImages.splice(index, 1);

    onChange({
      ...formState,
      factoryImages: updatedImages,
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          {/* Services Provided */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Services Provided<span className="text-red-500 ml-0.5">*</span>
              <InfoButton text="Select the services your business offers to clients" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {servicesOptions.map((service) => (
                <div key={service} className="flex items-start space-x-2">
                  <Checkbox
                    id={`service-${service}`}
                    checked={formState.servicesProvided?.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                  />
                  <label
                    htmlFor={`service-${service}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {service}
                  </label>
                </div>
              ))}
              <div className="flex items-center space-x-2 col-span-2 mt-2">
                <Checkbox
                  id="service-other"
                  checked={formState.otherServiceSelected}
                  onCheckedChange={(checked) => {
                    onChange({
                      ...formState,
                      otherServiceSelected: checked === true,
                    });
                  }}
                />
                <label
                  htmlFor="service-other"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Other (please specify)
                </label>
              </div>
              {formState.otherServiceSelected && (
                <div className="col-span-2 mt-2">
                  <Input
                    placeholder="Enter other services"
                    value={formState.otherServices || ""}
                    onChange={(e) => {
                      onChange({
                        ...formState,
                        otherServices: e.target.value,
                      });
                    }}
                    className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                  />
                </div>
              )}
            </div>
          </div>

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
              />
            </div>
            <p className="text-sm text-gray-500 ml-1">
              Willing to work with low MOQs
            </p>
          </div>

          {/* Production Model */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Production Model<span className="text-red-500 ml-0.5">*</span>
              <InfoButton text="Select how your production is managed" />
            </label>
            <RadioGroup
              value={formState.productionModel || ""}
              onValueChange={(value) => {
                onChange({
                  ...formState,
                  productionModel: value,
                });
              }}
              className="space-y-2"
            >
              {productionModelOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`production-model-${option}`}
                  />
                  <Label
                    htmlFor={`production-model-${option}`}
                    className="text-sm"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-6">
          {/* Production Countries */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Production Countries
              <InfoButton text="Select the countries where your production takes place" />
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
              {countryOptions.map((country) => (
                <div key={country} className="flex items-start space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={formState.productionCountries?.includes(country)}
                    onCheckedChange={() => handleCountryToggle(country)}
                  />
                  <label
                    htmlFor={`country-${country}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {country}
                  </label>
                </div>
              ))}
              <div className="flex items-center space-x-2 col-span-2 mt-2">
                <Checkbox
                  id="country-other"
                  checked={formState.otherCountrySelected}
                  onCheckedChange={(checked) => {
                    onChange({
                      ...formState,
                      otherCountrySelected: checked === true,
                    });
                  }}
                />
                <label
                  htmlFor="country-other"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Other (please specify)
                </label>
              </div>
              {formState.otherCountrySelected && (
                <div className="col-span-2 mt-2">
                  <Input
                    placeholder="Enter other countries"
                    value={formState.otherCountries || ""}
                    onChange={(e) => {
                      onChange({
                        ...formState,
                        otherCountries: e.target.value,
                      });
                    }}
                    className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                  />
                </div>
              )}
            </div>
          </div>

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
              />
            </div>

            {formState.providesSamples && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium">
                  Post-Purchase Sample Dispatch Time
                </label>
                <Input
                  placeholder="e.g., 3–5 business days"
                  value={formState.sampleDispatchTime || ""}
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
                value={formState.productionTimeline || ""}
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
              <InfoButton text="Upload up to 5 photos showcasing your facility or production setup" />
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
