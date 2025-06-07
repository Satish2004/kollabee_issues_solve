"use client";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  X,
  AlertCircle,
  Video,
  Globe,
  Linkedin,
  Instagram,
} from "lucide-react";
import type React from "react";
import { useState, useRef } from "react";

type BrandPresenceFormProps = {
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

const BrandPresenceForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
  onFileUpload,
  onDeleteFile,
  uploadProgress = {},
  disabled = false,
}: BrandPresenceFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const projectImageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [socialMedia, setSocialMedia] = useState<{
    instagram: string;
    linkedin: string;
    website: string;
  }>(() => {
    try {
      return formState.socialMediaLinks
        ? JSON.parse(formState.socialMediaLinks)
        : { instagram: "", linkedin: "", website: "" };
    } catch (e) {
      return { instagram: "", linkedin: "", website: "" };
    }
  });

  // Add validation functions
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateInstagramUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Don't validate empty fields
    return validateUrl(url) && url.toLowerCase().includes("instagram.com");
  };

  const validateLinkedInUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Don't validate empty fields
    return validateUrl(url) && url.toLowerCase().includes("linkedin.com");
  };

  const validateWebsiteUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Don't validate empty fields
    return validateUrl(url);
  };

  const handleProjectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Check if we're exceeding the limit of 10 project images
      const currentCount = (formState.projectImages || []).length;
      const availableSlots = 10 - currentCount;

      if (files.length > availableSlots) {
        setErrors({
          ...errors,
          projectImages: `You can only upload up to 10 project images. You have ${availableSlots} slots available.`,
        });
        return;
      }

      setIsUploading({ ...isUploading, projectImages: true });

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
            projectImages:
              "Please upload valid image files (JPEG, PNG, GIF, WEBP)",
          });
          continue;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 5) {
          setErrors({
            ...errors,
            projectImages: "File size exceeds the maximum limit of 5MB",
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
          projectImagePreviews: [
            ...(formState.projectImagePreviews || []),
            {
              file: file,
              preview: preview,
            },
          ],
        });

        try {
          // Upload the file and get the URL
          const imageUrl = await onFileUpload(file, "projectImages");

          if (imageUrl) {
            // Update the form state with the uploaded image URL
            onChange({
              ...formState,
              projectImages: [...(formState.projectImages || []), imageUrl],
            });
          }
        } catch (error) {
          console.error("Error uploading project image:", error);
          setErrors({
            ...errors,
            projectImages:
              "Failed to upload one or more images. Please try again.",
          });
        }
      }

      setIsUploading({ ...isUploading, projectImages: false });
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const validVideoTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
      ];
      if (!validVideoTypes.includes(file.type)) {
        setErrors({
          ...errors,
          video: "Please upload a valid video file (MP4, MOV, AVI)",
        });
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 50) {
        setErrors({
          ...errors,
          video: "File size exceeds the maximum limit of 50MB",
        });
        return;
      }

      // Create a preview URL immediately for UI feedback
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          ...formState,
          videoPreview: URL.createObjectURL(file),
        });
      };
      reader.readAsDataURL(file);

      setIsUploading({ ...isUploading, video: true });
      try {
        // Upload the file and get the URL
        const videoUrl = await onFileUpload(file, "brandVideo");
        // console.log("Video URL:", videoUrl);

        if (videoUrl) {
          // Update the form state with the uploaded video URL
          onChange({
            ...formState,
            brandVideo: videoUrl,
          });
        }
      } catch (error) {
        console.error("Error uploading video:", error);
        setErrors({
          ...errors,
          video: "Failed to upload video. Please try again.",
        });
      } finally {
        setIsUploading({ ...isUploading, video: false });
      }
    }
  };

  const triggerProjectImageFileInput = () => {
    projectImageFileInputRef.current?.click();
  };

  const triggerVideoFileInput = () => {
    videoFileInputRef.current?.click();
  };

  const removeProjectImagePreview = (index: number) => {
    if (disabled) return;
    const updatedPreviews = [...(formState.projectImagePreviews || [])];
    updatedPreviews.splice(index, 1);

    onChange({
      ...formState,
      projectImagePreviews: updatedPreviews,
    });
  };

  const removeVideoPreview = () => {
    if (disabled) return;
    onChange({
      ...formState,
      videoPreview: null,
      brandVideo: null,
    });
  };

  const deleteExistingProjectImage = (imageUrl: string, index: number) => {
    if (disabled) return;
    onDeleteFile(imageUrl, "projectImages");

    const updatedImages = [...(formState.projectImages || [])];
    updatedImages.splice(index, 1);

    onChange({
      ...formState,
      projectImages: updatedImages,
    });
  };

  const handleSocialMediaChange = (
    platform: keyof typeof socialMedia,
    value: string
  ) => {
    const updatedSocialMedia = { ...socialMedia, [platform]: value };
    setSocialMedia(updatedSocialMedia);

    // Clear previous errors for this field
    const newErrors = { ...errors };
    delete newErrors[platform];

    let isValid = true;

    // Validate the input only if there's a value
    if (value.trim()) {
      switch (platform) {
        case "instagram":
          if (!validateInstagramUrl(value)) {
            newErrors.instagram =
              "Please enter a valid Instagram URL (e.g., https://instagram.com/yourbrand)";
            isValid = false;
          }
          break;
        case "linkedin":
          if (!validateLinkedInUrl(value)) {
            newErrors.linkedin =
              "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/company/yourbrand)";
            isValid = false;
          }
          break;
        case "website":
          if (!validateWebsiteUrl(value)) {
            newErrors.website =
              "Please enter a valid website URL (e.g., https://yourbrand.com)";
            isValid = false;
          }
          break;
      }
    }

    setErrors(newErrors);

    // Only update parent form state if validation passes or field is empty
    if (isValid || !value.trim()) {
      onChange({
        ...formState,
        socialMediaLinks: JSON.stringify(updatedSocialMedia),
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          {/* Project Images */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-bold flex items-center  ">
                <p>
                  Project/Product Images
                  <span className="text-red-500 ml-0.5">*</span>
                </p>
              </label>
              <p className="text-sm font-futura italic">
                Upload at least 2 high-quality images showcasing your past
                projects or products. These images should highlight your
                capabilities and the quality of your work. (JPEG, PNG, GIF,
                WEBP, max 5MB each)
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {/* Existing project images */}
              {formState.projectImages?.map(
                (imageUrl: string, index: number) => (
                  <div
                    key={`existing-img-${index}`}
                    className="relative h-24 border rounded-md overflow-hidden group"
                  >
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Project ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {disabled ? null : (
                      <button
                        type="button"
                        onClick={() =>
                          deleteExistingProjectImage(imageUrl, index)
                        }
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                        disabled={disabled}
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                )
              )}

              {/* New project image previews */}
              {formState.projectImagePreviews?.map(
                (preview: any, index: number) => (
                  <div
                    key={`preview-img-${index}`}
                    className="relative h-24 border rounded-md overflow-hidden"
                  >
                    <img
                      src={preview.preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {disabled ? null : (
                      <button
                        type="button"
                        onClick={() => removeProjectImagePreview(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                        disabled={disabled}
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                )
              )}

              {/* Upload button - only show if less than 10 project images */}
              {(formState.projectImages?.length || 0) +
                (formState.projectImagePreviews?.length || 0) <
                10 && (
                <div
                  onClick={disabled ? undefined : triggerProjectImageFileInput}
                  className={`h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770] ${
                    disabled ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <input
                    type="file"
                    ref={projectImageFileInputRef}
                    onChange={handleProjectImageUpload}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
                    disabled={disabled}
                  />
                  {isUploading.projectImages ? (
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

            {uploadProgress["projectImages"] !== undefined && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress["projectImages"]}%</span>
                </div>
                <Progress
                  value={uploadProgress["projectImages"]}
                  className="h-1"
                />
              </div>
            )}

            {errors.projectImages && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.projectImages}</span>
              </div>
            )}
          </div>

          {/* Brand Video */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-bold flex items-center gap-1">
                Brand/Product Video
              </label>
              <p className="text-sm font-futura italic">
                Share a short video that introduces your brand, your values, and
                what makes you unique. This video can help buyers get to know
                your company better.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <input
                type="file"
                ref={videoFileInputRef}
                onChange={handleVideoUpload}
                accept="video/mp4,video/quicktime,video/x-msvideo"
                className="hidden"
                disabled={disabled}
              />
              {formState.videoPreview || formState.brandVideo ? (
                <div className="relative w-full max-w-md border rounded-md overflow-hidden">
                  <video
                    src={formState.brandVideo || formState.videoPreview}
                    controls
                    controlsList="nodownload"
                    className="w-full h-48 object-contain bg-black"
                    style={{ aspectRatio: "16/9" }}
                    onError={() => {
                      console.error("Video preview error");
                    }}
                    preload="metadata"
                  >
                    <source
                      src={formState.brandVideo || formState.videoPreview}
                      type="video/mp4"
                    />
                    <source
                      src={formState.brandVideo || formState.videoPreview}
                      type="video/quicktime"
                    />
                    <source
                      src={formState.brandVideo || formState.videoPreview}
                      type="video/x-msvideo"
                    />
                    Your browser does not support the video tag.
                  </video>
                  {disabled ? null : (
                    <button
                      type="button"
                      onClick={removeVideoPreview}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 shadow-md transition-colors"
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  onClick={disabled ? undefined : triggerVideoFileInput}
                  className={`w-full max-w-md h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770] ${
                    disabled ? "pointer-events-none opacity-50" : ""
                  }`}
                  style={{ aspectRatio: "16/9" }}
                >
                  {isUploading.video ? (
                    <div className="flex flex-col items-center">
                      <Upload className="h-6 w-6 text-gray-400 animate-pulse" />
                      <span className="text-xs text-gray-500 mt-1">
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <>
                      <Video className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">
                        Upload Video
                      </span>
                    </>
                  )}
                </div>
              )}
              <div className="text-sm text-gray-500">
                <p>Max size: 50MB</p>
                <p>Formats: MP4, MOV, AVI</p>
                <p>Recommended length: 30-90 seconds</p>
              </div>
            </div>

            {uploadProgress["brandVideo"] !== undefined && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Uploading...</span>
                  <span>{uploadProgress["brandVideo"]}%</span>
                </div>
                <Progress
                  value={uploadProgress["brandVideo"]}
                  className="h-1"
                />
              </div>
            )}

            {errors.video && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.video}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Social Media Links */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-bold flex items-center gap-1">
                Social Media Links
              </label>
              <p className="text-sm font-futura italic">
                Connect with your audience and show your brand's online presence
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5 text-[#a11770]" />
                  <Input
                    placeholder="https://instagram.com/yourbrand"
                    value={socialMedia.instagram}
                    onChange={(e) =>
                      handleSocialMediaChange("instagram", e.target.value)
                    }
                    className={`h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50 ${
                      errors.instagram ? "border-red-500" : ""
                    }`}
                    disabled={disabled}
                  />
                </div>
                {errors.instagram && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.instagram}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-[#a11770]" />
                  <Input
                    placeholder="https://yourbrand.com"
                    value={socialMedia.website}
                    onChange={(e) =>
                      handleSocialMediaChange("website", e.target.value)
                    }
                    className={`h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50 ${
                      errors.website ? "border-red-500" : ""
                    }`}
                    disabled={disabled}
                  />
                </div>
                {errors.website && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.website}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Linkedin className="h-5 w-5 text-[#a11770]" />
                  <Input
                    placeholder="https://linkedin.com/company/yourbrand"
                    value={socialMedia.linkedin}
                    onChange={(e) =>
                      handleSocialMediaChange("linkedin", e.target.value)
                    }
                    className={`h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50 ${
                      errors.linkedin ? "border-red-500" : ""
                    }`}
                    disabled={disabled}
                  />
                </div>
                {errors.linkedin && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-sm font-bold flex items-center gap-1">
                Additional Preferences/Notes
              </label>
              <p className="text-sm font-futura italic">
                Is there anything else you’d like buyers to know about your
                brand, products, or services?
              </p>
            </div>
            <Textarea
              placeholder="Enter Notes Here"
              value={formState.additionalNotes || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  additionalNotes: e.target.value,
                });
              }}
              className="min-h-[150px] bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPresenceForm;
