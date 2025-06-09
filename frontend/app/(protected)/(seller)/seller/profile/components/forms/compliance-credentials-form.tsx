"use client";

import { Button } from "@/components/ui/button";
// Added
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Added
import MultiSelectDropdown from "@/components/ui/multi-select-dropdown";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
// Assuming this exists
import {
  Upload,
  X,
  AlertCircle,
  FileText,
  FileIcon,
  ImageIcon,
} from "lucide-react";
// Added FileIcon alias, ImageIcon
import type React from "react";
import { useEffect, useRef, useState } from "react";

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
  "Other",
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
  disabled?: boolean;
};

const requiredFields = [
  "certificationTypes",
  "businessRegistration",
  // Add more required fields as needed
];

const ComplianceCredentialsForm = ({
  formState,
  onChange,
  // onSave, hasChanges, isSaving, // These props are not used directly in this component's rendering
  onFileUpload,
  onDeleteFile,
  uploadProgress = {},
  disabled = false,
}: ComplianceCredentialsFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const businessRegFileInputRef = useRef<HTMLInputElement>(null);
  const certificationFileInputRef = useRef<HTMLInputElement>(null);
  // const clientLogoFileInputRef = useRef<HTMLInputElement>(null); // This ref was for the old client logos section, now handled within Notable Clients or a separate improved section
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [customCertifications, setCustomCertifications] = useState<string[]>(
    formState.customCertifications || []
  );

  useEffect(() => {
    validateFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  const validateFields = () => {
    const newErrors: Record<string, string> = { ...errors };
    requiredFields.forEach((field) => {
      if (
        !formState[field] ||
        (Array.isArray(formState[field]) && formState[field].length === 0)
      ) {
        newErrors[field] = "This field is required.";
      } else {
        delete newErrors[field];
      }
    });
    setErrors(newErrors);
  };

  const handleCertificationTypesChange = (selectedCertifications: string[]) => {
    onChange({
      ...formState,
      certificationTypes: selectedCertifications.filter(
        (cert) => cert !== "Other"
      ),
      otherCertSelected: selectedCertifications.includes("Other"),
    });
    if (selectedCertifications.length > 0)
      setErrors((prev) => ({ ...prev, certificationTypes: "" }));
  };

  const handleCustomCertificationsChange = (
    newCustomCertifications: string[]
  ) => {
    setCustomCertifications(newCustomCertifications);
    onChange({
      ...formState,
      customCertifications: newCustomCertifications,
    });
  };

  const validateFile = (
    file: File,
    fieldName: string,
    currentErrors: Record<string, string>
  ) => {
    const validDocImageTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const typesToUse =
      fieldName === "clientLogos" || fieldName.startsWith("notableClients_")
        ? validImageTypes
        : validDocImageTypes;
    const typeErrorMsg =
      fieldName === "clientLogos" || fieldName.startsWith("notableClients_")
        ? "Please upload valid image files (JPEG, PNG, GIF, WEBP)"
        : "Please upload a valid document (PDF, DOC, DOCX) or image file (JPEG, PNG, GIF, WEBP)";

    if (!typesToUse.includes(file.type)) {
      setErrors({ ...currentErrors, [fieldName]: typeErrorMsg });
      return false;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 5) {
      setErrors({
        ...currentErrors,
        [fieldName]: "File size exceeds the maximum limit of 5MB",
      });
      return false;
    }
    setErrors({ ...currentErrors, [fieldName]: "" }); // Clear error for this field
    return true;
  };

  // Update: allow multiple business registration docs
  const handleBusinessRegUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      let newFiles = [...(formState.businessRegistration || [])];
      let errorsCopy = { ...errors };
      setIsUploading({ ...isUploading, businessReg: true });

      for (const file of files) {
        if (!validateFile(file, "businessReg", errorsCopy)) continue;

        // Show preview (optional, not tracked for each file here)
        // Upload file
        try {
          const fileUrl = await onFileUpload(file, "businessRegistration");
          if (fileUrl) {
            newFiles.push(fileUrl);
          }
        } catch (error) {
          errorsCopy.businessReg = "Failed to upload. Please try again.";
        }
      }
      setErrors(errorsCopy);
      onChange({
        ...formState,
        businessRegistration: newFiles,
        businessRegPreview: null,
      });
      setIsUploading({ ...isUploading, businessReg: false });
      if (businessRegFileInputRef.current)
        businessRegFileInputRef.current.value = "";
      // After successful upload:
      if (newFiles.length > 0)
        setErrors((prev) => ({ ...prev, businessRegistration: "" }));
    }
  };

  const handleCertificationUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const currentCount =
        (formState.certifications || []).length +
        (formState.certificationPreviews?.length || 0);
      const availableSlots = 10 - currentCount;

      if (files.length > availableSlots) {
        setErrors({
          ...errors,
          certifications: `You can upload ${
            availableSlots > 0 ? `up to ${availableSlots} more` : "no more"
          } certifications (max 10).`,
        });
        return;
      }

      setIsUploading({ ...isUploading, certifications: true });
      let newPreviews: any[] = formState.certificationPreviews || [];
      let newUploadedUrls: string[] = formState.certifications || [];

      for (const file of files) {
        if (!validateFile(file, "certifications", errors)) continue;

        const reader = new FileReader();
        const previewPromise = new Promise<string>((resolve) => {
          reader.onload = (event) => resolve(event.target?.result as string);
        });
        reader.readAsDataURL(file);
        const previewDataUrl = await previewPromise;

        newPreviews.push({
          file,
          preview: previewDataUrl,
          name: file.name,
          type: file.type,
        });
        onChange({ ...formState, certificationPreviews: [...newPreviews] }); // Update previews immediately

        try {
          const fileUrl = await onFileUpload(file, "certifications");
          if (fileUrl) {
            newUploadedUrls.push(fileUrl);
            // Remove corresponding preview
            newPreviews = newPreviews.filter((p) => p.file !== file);
          }
        } catch (error) {
          console.error("Error uploading certification:", error);
          setErrors({
            ...errors,
            certifications: "Failed to upload one or more. Please try again.",
          });
        }
      }
      onChange({
        ...formState,
        certifications: newUploadedUrls,
        certificationPreviews: newPreviews,
      });
      setIsUploading({ ...isUploading, certifications: false });
      if (certificationFileInputRef.current)
        certificationFileInputRef.current.value = "";
    }
  };

  const triggerBusinessRegFileInput = () =>
    businessRegFileInputRef.current?.click();
  const triggerCertificationFileInput = () =>
    certificationFileInputRef.current?.click();

  const removeBusinessReg = (fileUrl: string, idx: number) => {
    onDeleteFile(fileUrl, "businessRegistration");
    const updated = [...(formState.businessRegistration || [])];
    updated.splice(idx, 1);
    onChange({
      ...formState,
      businessRegistration: updated,
    });
  };

  const removeCertificationPreview = (index: number) => {
    const updatedPreviews = [...(formState.certificationPreviews || [])];
    updatedPreviews.splice(index, 1);
    onChange({ ...formState, certificationPreviews: updatedPreviews });
  };

  const deleteExistingCertification = (fileUrl: string, index: number) => {
    onDeleteFile(fileUrl, "certifications");
    const updatedCertifications = [...(formState.certifications || [])];
    updatedCertifications.splice(index, 1);
    onChange({ ...formState, certifications: updatedCertifications });
  };

  const getFilePreviewElement = (
    fileUrlOrPreview: string,
    fileType?: string,
    fileName?: string
  ) => {
    const isDataUrl = fileUrlOrPreview.startsWith("data:");
    const effectiveFileType =
      isDataUrl && fileType ? fileType : getFileTypeFromUrl(fileUrlOrPreview);

    if (effectiveFileType.startsWith("image/")) {
      return (
        <img
          src={fileUrlOrPreview || "/placeholder.svg"}
          alt={fileName || "Preview"}
          className="w-full h-full object-contain p-1"
        />
      );
    } else if (effectiveFileType === "application/pdf") {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else {
      return <FileIcon className="h-10 w-10 text-blue-500" />;
    }
  };

  const getFileTypeFromUrl = (url: string): string => {
    if (url.startsWith("data:")) {
      return url.substring(url.indexOf(":") + 1, url.indexOf(";"));
    }
    const extension = url.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "doc":
      case "docx":
        return "application/msword"; // Simplified
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      default:
        return "application/octet-stream"; // Fallback
    }
  };

  // Notable Clients logic
  const handleNotableClientChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedClients = [...(formState.notableClients || [])];
    updatedClients[index] = { ...updatedClients[index], [field]: value };
    onChange({ ...formState, notableClients: updatedClients });
  };

  const handleAddNotableClient = () => {
    const currentClients = formState.notableClients || [];
    if (currentClients.length >= 5) {
      setErrors({
        ...errors,
        notableClients: "You can add a maximum of 5 notable clients.",
      });
      return;
    }
    onChange({
      ...formState,
      notableClients: [
        ...currentClients,
        { name: "", logo: "", description: "" },
      ],
    });
    setErrors({ ...errors, notableClients: "" }); // Clear error if any
  };

  const handleRemoveNotableClient = (index: number) => {
    const updatedClients = [...(formState.notableClients || [])];
    if (updatedClients[index]?.logo) {
      onDeleteFile(updatedClients[index].logo, `notableClients_${index}_logo`);
    }
    updatedClients.splice(index, 1);
    onChange({ ...formState, notableClients: updatedClients });
  };

  const handleNotableClientLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fieldName = `notableClients_${index}`;
      if (!validateFile(file, fieldName, errors)) return;

      setIsUploading({ ...isUploading, [fieldName]: true });
      try {
        const imageUrl = await onFileUpload(
          file,
          `notableClients_${index}_logo`
        );
        if (imageUrl) {
          const updatedClients = [...(formState.notableClients || [])];
          // If there was an old logo, delete it from storage
          if (updatedClients[index]?.logo) {
            onDeleteFile(
              updatedClients[index].logo,
              `notableClients_${index}_logo_old`
            );
          }
          updatedClients[index] = { ...updatedClients[index], logo: imageUrl };
          onChange({ ...formState, notableClients: updatedClients });
        }
      } catch (error) {
        setErrors({
          ...errors,
          [fieldName]: "Failed to upload logo. Please try again.",
        });
      } finally {
        setIsUploading({ ...isUploading, [fieldName]: false });
        if (e.target) e.target.value = ""; // Reset file input
      }
    }
  };

  const totalCertifications =
    (formState.certifications?.length || 0) +
    (formState.certificationPreviews?.length || 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Business Registration */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="businessRegUpload"
                className="text-sm font-bold flex items-center "
              >
                Business Registration
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <p className="text-sm font-futura italic text-gray-600">
                Upload your official business registration document (e.g.,
                incorporation certificate, GST, Udyam, etc.)
              </p>
            </div>
            <input
              type="file"
              id="businessRegUpload"
              ref={businessRegFileInputRef}
              onChange={handleBusinessRegUpload}
              accept=".pdf,.doc,.docx,image/jpeg,image/png,image/gif,image/webp"
              multiple
              className="hidden"
              disabled={disabled}
            />
            {/* Show all uploaded business registration files */}
            <div className="flex flex-wrap gap-3">
              {formState.businessRegistration &&
                formState.businessRegistration.length > 0 &&
                formState.businessRegistration.map(
                  (fileUrl: string, idx: number) => (
                    <div
                      key={`business-reg-${idx}`}
                      className="relative w-32 h-24 border rounded-md overflow-hidden flex items-center justify-center p-2 bg-gray-50"
                    >
                      {getFilePreviewElement(fileUrl)}
                      <button
                        type="button"
                        onClick={() =>
                          !disabled && removeBusinessReg(fileUrl, idx)
                        }
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Remove business registration"
                        disabled={disabled}
                        tabIndex={disabled ? -1 : 0}
                        style={
                          disabled
                            ? { pointerEvents: "none", opacity: 0.5 }
                            : {}
                        }
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  )
                )}
            </div>
            {/* Upload button */}
            <div
              onClick={disabled ? undefined : triggerBusinessRegFileInput}
              className={`group w-full sm:w-64 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#a11770] transition-colors bg-gray-50 hover:bg-gray-100 p-4 mt-2 ${
                disabled ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {isUploading.businessReg ? (
                <>
                  <Upload className="h-8 w-8 text-[#a11770] animate-pulse mb-2" />
                  <p className="text-sm text-gray-600">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 group-hover:text-[#a11770] mb-2 transition-colors" />
                  <p className="text-sm font-medium text-gray-700">
                    Upload more
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, JPG, PNG etc. (Max 5MB each)
                  </p>
                </>
              )}
            </div>
            {/* No limit message needed, so no restriction or count shown */}
            {uploadProgress["businessRegistration"] !== undefined &&
              !isUploading.businessReg && (
                <div className="mt-2 space-y-1 w-full sm:w-64">
                  <div className="flex justify-between text-xs">
                    <span>Uploading...</span>
                    <span>{uploadProgress["businessRegistration"]}%</span>
                  </div>
                  <Progress
                    value={uploadProgress["businessRegistration"]}
                    className="h-1.5"
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
          <MultiSelectDropdown
            label="Showcase industry-standard certifications to boost buyer confidence"
            placeholder="Select Certifications Held"
            options={certificationOptions}
            selectedValues={
              formState.otherCertSelected
                ? [...(formState.certificationTypes || []), "Other"]
                : formState.certificationTypes || []
            }
            onChange={handleCertificationTypesChange}
            isRequired={true}
            error={errors.certificationTypes}
            allowCustomValues={true}
            customValuesLabel="Add other certifications:"
            customValueCategory="Other" // This prop might be specific to your MultiSelectDropdown
            customValues={customCertifications}
            onCustomValuesChange={handleCustomCertificationsChange}
            lableBold={true}
            disabled={disabled}
          />
         

          {/* Certification Documents */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-bold">
                Certification Documents
              </label>
              <p className="text-sm font-futura italic text-gray-600">
                Upload documents proving your certifications (up to 10 files).
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formState.certifications?.map(
                (fileUrl: string, index: number) => (
                  <div
                    key={`existing-cert-${index}`}
                    className="relative aspect-square border rounded-md overflow-hidden group flex items-center justify-center bg-gray-50"
                  >
                    {getFilePreviewElement(fileUrl)}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          !disabled &&
                          deleteExistingCertification(fileUrl, index)
                        }
                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                        aria-label={`Remove certification ${index + 1}`}
                        disabled={disabled}
                        tabIndex={disabled ? -1 : 0}
                        style={
                          disabled
                            ? { pointerEvents: "none", opacity: 0.5 }
                            : {}
                        }
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                )
              )}
              {formState.certificationPreviews?.map(
                (preview: any, index: number) => (
                  <div
                    key={`preview-cert-${index}`}
                    className="relative aspect-square border rounded-md overflow-hidden flex items-center justify-center bg-gray-50"
                  >
                    {getFilePreviewElement(
                      preview.preview,
                      preview.type,
                      preview.name
                    )}
                    {preview.name && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-1 truncate text-center">
                        {preview.name}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        !disabled && removeCertificationPreview(index)
                      }
                      className="absolute top-1.5 right-1.5 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                      aria-label={`Remove preview ${preview.name}`}
                      disabled={disabled}
                      tabIndex={disabled ? -1 : 0}
                      style={
                        disabled ? { pointerEvents: "none", opacity: 0.5 } : {}
                      }
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                )
              )}
              {totalCertifications < 10 && (
                <div
                  onClick={disabled ? undefined : triggerCertificationFileInput}
                  className={`group aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#a11770] transition-colors bg-gray-50 hover:bg-gray-100 p-2 ${
                    disabled ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <input
                    type="file"
                    ref={certificationFileInputRef}
                    onChange={handleCertificationUpload}
                    accept=".pdf,.doc,.docx,image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
                    disabled={disabled}
                  />
                  {isUploading.certifications ? (
                    <>
                      <Upload className="h-7 w-7 text-[#a11770] animate-pulse mb-1" />
                      <span className="text-xs text-gray-600">
                        Uploading...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-7 w-7 text-gray-400 group-hover:text-[#a11770] mb-1 transition-colors" />
                      <span className="text-xs font-medium text-gray-600">
                        Add Files
                      </span>
                      <span className="text-[10px] text-gray-500">
                        ({10 - totalCertifications} left)
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            {uploadProgress["certifications"] !== undefined &&
              !isUploading.certifications && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Uploading certifications...</span>
                    <span>{uploadProgress["certifications"]}%</span>
                  </div>
                  <Progress
                    value={uploadProgress["certifications"]}
                    className="h-1.5"
                  />
                </div>
              )}
            {errors.certifications && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.certifications}</span>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, DOCX, JPEG, PNG, etc. (Max 5MB each).
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notable Clients */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-bold">
                Notable Clients or Collaborations
              </label>
              <p className="text-sm font-futura italic text-gray-600">
                List well-known brands or partners to build credibility.
              </p>
            </div>
            <div className="space-y-4">
              {(formState.notableClients || []).map(
                (client: any, idx: number) => (
                  <Card key={idx} className="overflow-hidden shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between py-2.5 px-4 bg-gray-50 border-b">
                      <CardTitle className="text-sm font-bold text-gray-800">
                        Client/Brand #{idx + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          !disabled && handleRemoveNotableClient(idx)
                        }
                        className="text-gray-500 hover:text-red-500 h-7 w-7"
                        aria-label={`Remove client ${idx + 1}`}
                        disabled={disabled}
                        tabIndex={disabled ? -1 : 0}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex flex-col items-center space-y-1.5 w-full sm:w-24 shrink-0">
                          <div className="w-20 h-20 flex items-center justify-center border rounded-md bg-gray-100 overflow-hidden p-1">
                            {isUploading[`notableClients_${idx}`] ? (
                              <Upload className="h-8 w-8 text-[#a11770] animate-pulse" />
                            ) : client.logo ? (
                              <img
                                src={client.logo || "/placeholder.svg"}
                                alt="Client Logo"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <ImageIcon className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="hidden"
                            id={`notable-client-logo-input-${idx}`}
                            onChange={(e) =>
                              handleNotableClientLogoUpload(e, idx)
                            }
                            disabled={disabled}
                          />
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="w-full text-xs py-1 h-auto"
                            disabled={disabled}
                          >
                            <label
                              htmlFor={`notable-client-logo-input-${idx}`}
                              className={`cursor-pointer ${
                                disabled ? "pointer-events-none opacity-50" : ""
                              }`}
                            >
                              {isUploading[`notableClients_${idx}`]
                                ? "Uploading..."
                                : client.logo
                                ? "Change Logo"
                                : "Upload Logo"}
                            </label>
                          </Button>
                        </div>
                        <div className="flex-1 space-y-2.5">
                          <Input
                            placeholder="Client/Brand Name"
                            value={client.name || ""}
                            onChange={(e) =>
                              handleNotableClientChange(
                                idx,
                                "name",
                                e.target.value
                              )
                            }
                            className="text-sm"
                            disabled={disabled}
                          />
                          <Textarea
                            placeholder="Short Description (e.g., project highlights - optional)"
                            value={client.description || ""}
                            onChange={(e) =>
                              handleNotableClientChange(
                                idx,
                                "description",
                                e.target.value
                              )
                            }
                            className="text-sm min-h-[60px] sm:min-h-[70px]"
                            rows={2}
                            disabled={disabled}
                          />
                        </div>
                      </div>
                      {errors[`notableClients_${idx}`] && (
                        <div className="text-xs text-red-500 flex items-center gap-1 pt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{errors[`notableClients_${idx}`]}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              )}
              {(formState.notableClients?.length || 0) < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-sm py-2 w-full sm:w-auto border-[#a11770] text-[#a11770] hover:bg-[#a11770]/10 hover:text-[#a11770]"
                  onClick={handleAddNotableClient}
                  disabled={disabled}
                >
                  + Add Client/Brand
                </Button>
              )}
              {errors.notableClients && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.notableClients}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Logos: JPEG, PNG, GIF, WEBP (Max 5MB each).
              <br />
              <span className="font-medium">Important:</span> Only upload logos
              with permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCredentialsForm;
