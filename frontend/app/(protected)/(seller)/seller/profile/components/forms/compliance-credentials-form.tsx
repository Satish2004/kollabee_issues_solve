"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import InfoButton from "@/components/ui/IButton";
import { Upload, X, Trash2, AlertCircle, FileText, File } from "lucide-react";

const certificationOptions = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "ISO 22000",
  "GOTS",
  "OEKO-TEX",
  "Fair Trade",
  "BSCI",
  "GMP",
  "HACCP",
  "Organic",
  "Vegan",
  "Cruelty-Free",
  "FSC",
  "PEFC",
  "BRC",
  "IFS",
  "SEDEX",
  "WRAP",
  "SA8000",
];

type ComplianceCredentialsFormProps = {
  formState: any;
  onChange: (newValue: any) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  onFileUpload: (file: File, field: string) => Promise<string | null>;
  onDeleteFile: (fileUrl: string, field: string) => void;
  uploadProgress?: Record<string, number>;
};

const ComplianceCredentialsForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
  onFileUpload,
  onDeleteFile,
  uploadProgress = {},
}: ComplianceCredentialsFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const businessRegFileInputRef = useRef<HTMLInputElement>(null);
  const certificationFileInputRef = useRef<HTMLInputElement>(null);
  const clientLogoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  const handleCertificationTypeToggle = (certType: string) => {
    onChange({
      ...formState,
      certificationTypes: formState.certificationTypes?.includes(certType)
        ? formState.certificationTypes.filter((c: string) => c !== certType)
        : [...(formState.certificationTypes || []), certType],
    });
  };

  const handleBusinessRegUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          businessReg:
            "Please upload a valid document (PDF, DOC, DOCX) or image file (JPEG, PNG, GIF, WEBP)",
        });
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 5) {
        setErrors({
          ...errors,
          businessReg: "File size exceeds the maximum limit of 5MB",
        });
        return;
      }

      // Create a preview URL immediately for UI feedback
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          ...formState,
          businessRegPreview: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);

      setIsUploading({ ...isUploading, businessReg: true });
      try {
        // Upload the file and get the URL
        const fileUrl = await onFileUpload(file, "businessRegistration");

        if (fileUrl) {
          // Update the form state with the uploaded file URL
          onChange({
            ...formState,
            businessRegistration: fileUrl,
          });
        }
      } catch (error) {
        console.error("Error uploading business registration:", error);
        setErrors({
          ...errors,
          businessReg:
            "Failed to upload business registration. Please try again.",
        });
      } finally {
        setIsUploading({ ...isUploading, businessReg: false });
      }
    }
  };

  const handleCertificationUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Check if we're exceeding the limit of 10 certifications
      const currentCount = (formState.certifications || []).length;
      const availableSlots = 10 - currentCount;

      if (files.length > availableSlots) {
        setErrors({
          ...errors,
          certifications: `You can only upload up to 10 certifications. You have ${availableSlots} slots available.`,
        });
        return;
      }

      setIsUploading({ ...isUploading, certifications: true });

      // Process each file
      for (const file of files) {
        // Validate file type
        const validTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!validTypes.includes(file.type)) {
          setErrors({
            ...errors,
            certifications:
              "Please upload valid document (PDF, DOC, DOCX) or image files (JPEG, PNG, GIF, WEBP)",
          });
          continue;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
          setErrors({
            ...errors,
            certifications: "File size exceeds the maximum limit of 5MB",
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
          certificationPreviews: [
            ...(formState.certificationPreviews || []),
            {
              file: file,
              preview: preview,
              name: file.name,
              type: file.type,
            },
          ],
        });

        try {
          // Upload the file and get the URL
          const fileUrl = await onFileUpload(file, "certifications");

          if (fileUrl) {
            // Update the form state with the uploaded file URL
            onChange({
              ...formState,
              certifications: [...(formState.certifications || []), fileUrl],
            });
          }
        } catch (error) {
          console.error("Error uploading certification:", error);
          setErrors({
            ...errors,
            certifications:
              "Failed to upload one or more certifications. Please try again.",
          });
        }
      }

      setIsUploading({ ...isUploading, certifications: false });
    }
  };

  const handleClientLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Check if we're exceeding the limit of 5 client logos
      const currentCount = (formState.clientLogos || []).length;
      const availableSlots = 5 - currentCount;

      if (files.length > availableSlots) {
        setErrors({
          ...errors,
          clientLogos: `You can only upload up to 5 client logos. You have ${availableSlots} slots available.`,
        });
        return;
      }

      setIsUploading({ ...isUploading, clientLogos: true });

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
            clientLogos:
              "Please upload valid image files (JPEG, PNG, GIF, WEBP)",
          });
          continue;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
          setErrors({
            ...errors,
            clientLogos: "File size exceeds the maximum limit of 5MB",
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
          clientLogoPreviews: [
            ...(formState.clientLogoPreviews || []),
            {
              file: file,
              preview: preview,
            },
          ],
        });

        try {
          // Upload the file and get the URL
          const imageUrl = await onFileUpload(file, "clientLogos");

          if (imageUrl) {
            // Update the form state with the uploaded image URL
            onChange({
              ...formState,
              clientLogos: [...(formState.clientLogos || []), imageUrl],
            });
          }
        } catch (error) {
          console.error("Error uploading client logo:", error);
          setErrors({
            ...errors,
            clientLogos:
              "Failed to upload one or more client logos. Please try again.",
          });
        }
      }

      setIsUploading({ ...isUploading, clientLogos: false });
    }
  };

  const triggerBusinessRegFileInput = () => {
    businessRegFileInputRef.current?.click();
  };

  const triggerCertificationFileInput = () => {
    certificationFileInputRef.current?.click();
  };

  const triggerClientLogoFileInput = () => {
    clientLogoFileInputRef.current?.click();
  };

  const removeBusinessRegPreview = () => {
    onChange({
      ...formState,
      businessRegPreview: null,
      businessRegistration: null,
    });
  };

  const removeCertificationPreview = (index: number) => {
    const updatedPreviews = [...(formState.certificationPreviews || [])];
    updatedPreviews.splice(index, 1);

    onChange({
      ...formState,
      certificationPreviews: updatedPreviews,
    });
  };

  const removeClientLogoPreview = (index: number) => {
    const updatedPreviews = [...(formState.clientLogoPreviews || [])];
    updatedPreviews.splice(index, 1);

    onChange({
      ...formState,
      clientLogoPreviews: updatedPreviews,
    });
  };

  const deleteExistingCertification = (fileUrl: string, index: number) => {
    onDeleteFile(fileUrl, "certifications");

    const updatedCertifications = [...(formState.certifications || [])];
    updatedCertifications.splice(index, 1);

    onChange({
      ...formState,
      certifications: updatedCertifications,
    });
  };

  const deleteExistingClientLogo = (imageUrl: string, index: number) => {
    onDeleteFile(imageUrl, "clientLogos");

    const updatedLogos = [...(formState.clientLogos || [])];
    updatedLogos.splice(index, 1);

    onChange({
      ...formState,
      clientLogos: updatedLogos,
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return (
        <img
          src={fileType || "/placeholder.svg"}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      );
    } else if (fileType === "application/pdf") {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          {/* Business Registration */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Registration Document
              <span className="text-red-500 ml-0.5">*</span>
              <InfoButton text="Upload your business registration certificate or license" />
            </label>
            <div className="flex items-start gap-4">
              <input
                type="file"
                ref={businessRegFileInputRef}
                onChange={handleBusinessRegUpload}
                accept=".pdf,.doc,.docx,image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
              {formState.businessRegPreview ? (
                <div className="relative w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center">
                  {formState.businessRegPreview.startsWith("data:image") ? (
                    <img
                      src={formState.businessRegPreview || "/placeholder.svg"}
                      alt="Business registration preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FileText className="h-12 w-12 text-red-500" />
                  )}
                  <button
                    type="button"
                    onClick={removeBusinessRegPreview}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={triggerBusinessRegFileInput}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770]"
                >
                  {isUploading.businessReg ? (
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-gray-400 animate-pulse" />
                      <span className="text-xs text-gray-500 mt-1">
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">
                        Upload Document
                      </span>
                    </>
                  )}
                </div>
              )}
              <div className="text-sm text-gray-500">
                <p>
                  Business license, registration certificate, or other legal
                  document
                </p>
                <p>Max size: 5MB</p>
                <p>Formats: PDF, DOC, DOCX, JPEG, PNG</p>
              </div>
            </div>

            {uploadProgress["businessRegistration"] !== undefined && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress["businessRegistration"]}%</span>
                </div>
                <Progress
                  value={uploadProgress["businessRegistration"]}
                  className="h-1"
                />
              </div>
            )}

            {errors.businessReg && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.businessReg}</span>
              </div>
            )}
          </div>

          {/* Certification Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Certification Types (Optional)
              <InfoButton text="Select the certifications your business has obtained" />
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
              {certificationOptions.map((cert) => (
                <div key={cert} className="flex items-start space-x-2">
                  <Checkbox
                    id={`cert-${cert}`}
                    checked={formState.certificationTypes?.includes(cert)}
                    onCheckedChange={() => handleCertificationTypeToggle(cert)}
                  />
                  <label
                    htmlFor={`cert-${cert}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cert}
                  </label>
                </div>
              ))}
              <div className="flex items-center space-x-2 col-span-2 mt-2">
                <Checkbox
                  id="cert-other"
                  checked={formState.otherCertSelected}
                  onCheckedChange={(checked) => {
                    onChange({
                      ...formState,
                      otherCertSelected: checked === true,
                    });
                  }}
                />
                <label
                  htmlFor="cert-other"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Other (please specify)
                </label>
              </div>
              {formState.otherCertSelected && (
                <div className="col-span-2 mt-2">
                  <Input
                    placeholder="Enter other certifications"
                    value={formState.otherCertifications || ""}
                    onChange={(e) => {
                      onChange({
                        ...formState,
                        otherCertifications: e.target.value,
                      });
                    }}
                    className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Certification Documents */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Certification Documents (Optional)
              <InfoButton text="Upload documents proving your certifications" />
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Existing certifications */}
              {formState.certifications?.map(
                (
                  fileUrl: {
                    id: string;
                    image: string;
                  },
                  index: number
                ) => (
                  <div
                    key={`existing-cert-${index}`}
                    className="relative h-24 border rounded-md overflow-hidden group"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {fileUrl ? (
                        <img
                          src={fileUrl.image || "/placeholder.svg"}
                          alt={`Certification ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="h-12 w-12 text-red-500" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          deleteExistingCertification(fileUrl, index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}

              {/* New certification previews */}
              {formState.certificationPreviews?.map(
                (preview: any, index: number) => (
                  <div
                    key={`preview-cert-${index}`}
                    className="relative h-24 border rounded-md overflow-hidden"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {preview.type.startsWith("image/") ? (
                        <img
                          src={preview.preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : preview.type === "application/pdf" ? (
                        <FileText className="h-12 w-12 text-red-500" />
                      ) : (
                        <File className="h-12 w-12 text-blue-500" />
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                      {preview.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCertificationPreview(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                )
              )}

              {/* Upload button - only show if less than 10 certifications */}
              {(formState.certifications?.length || 0) +
                (formState.certificationPreviews?.length || 0) <
                10 && (
                <div
                  onClick={triggerCertificationFileInput}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770]"
                >
                  <input
                    type="file"
                    ref={certificationFileInputRef}
                    onChange={handleCertificationUpload}
                    accept=".pdf,.doc,.docx,image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
                  />
                  {isUploading.certifications ? (
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
                        Upload Certificate
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {uploadProgress["certifications"] !== undefined && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress["certifications"]}%</span>
                </div>
                <Progress
                  value={uploadProgress["certifications"]}
                  className="h-1"
                />
              </div>
            )}

            {errors.certifications && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.certifications}</span>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Upload up to 10 certification documents (PDF, DOC, DOCX, JPEG,
              PNG, max 5MB each)
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notable Clients */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Notable Clients (Optional)
              <InfoButton text="List your most significant clients or brands you've worked with" />
            </label>
            <Textarea
              placeholder="Enter names of notable clients or brands you've worked with"
              value={formState.notableClients || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  notableClients: e.target.value,
                });
              }}
              className="min-h-[100px] bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
            <p className="text-xs text-gray-500">
              Separate client names with commas
            </p>
          </div>

          {/* Client Logos */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Client Logos (Optional)
              <InfoButton text="Upload logos of your notable clients (with permission)" />
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Existing client logos */}
              {formState.clientLogos?.map((imageUrl: string, index: number) => (
                <div
                  key={`existing-logo-${index}`}
                  className="relative h-24 border rounded-md overflow-hidden group"
                >
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Client Logo ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteExistingClientLogo(imageUrl, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* New client logo previews */}
              {formState.clientLogoPreviews?.map(
                (preview: any, index: number) => (
                  <div
                    key={`preview-logo-${index}`}
                    className="relative h-24 border rounded-md overflow-hidden"
                  >
                    <img
                      src={preview.preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeClientLogoPreview(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                )
              )}

              {/* Upload button - only show if less than 5 client logos */}
              {(formState.clientLogos?.length || 0) +
                (formState.clientLogoPreviews?.length || 0) <
                5 && (
                <div
                  onClick={triggerClientLogoFileInput}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770]"
                >
                  <input
                    type="file"
                    ref={clientLogoFileInputRef}
                    onChange={handleClientLogoUpload}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
                  />
                  {isUploading.clientLogos ? (
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
                        Upload Logo
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {uploadProgress["clientLogos"] !== undefined && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress["clientLogos"]}%</span>
                </div>
                <Progress
                  value={uploadProgress["clientLogos"]}
                  className="h-1"
                />
              </div>
            )}

            {errors.clientLogos && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.clientLogos}</span>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Upload up to 5 client logos (JPEG, PNG, GIF, WEBP, max 5MB each)
              <br />
              <span className="font-medium">Important:</span> Only upload logos
              with permission from your clients
            </p>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default ComplianceCredentialsForm;
