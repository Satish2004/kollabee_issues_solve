"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import InfoButton from "@/components/ui/IButton";
import {
  Upload,
  X,
  Trash2,
  AlertCircle,
  Video,
  Globe,
  Linkedin,
  Instagram,
} from "lucide-react";

type BrandPresenceFormProps = {
  formState: any;
  onChange: (newValue: any) => void;
  onSave: () => void;
  hasChanges: boolean;
  isSaving: boolean;
  onFileUpload: (file: File, field: string) => Promise<string | null>;
  onDeleteFile: (fileUrl: string, field: string) => void;
  uploadProgress?: Record<string, number>;
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
    const updatedPreviews = [...(formState.projectImagePreviews || [])];
    updatedPreviews.splice(index, 1);

    onChange({
      ...formState,
      projectImagePreviews: updatedPreviews,
    });
  };

  const removeVideoPreview = () => {
    onChange({
      ...formState,
      videoPreview: null,
      brandVideo: null,
    });
  };

  const deleteExistingProjectImage = (imageUrl: string, index: number) => {
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
    onChange({
      ...formState,
      socialMediaLinks: JSON.stringify(updatedSocialMedia),
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          {/* Project Images */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Project/Product Images
              <span className="text-red-500 ml-0.5">*</span>
              <InfoButton text="Upload images of your products or completed projects" />
            </label>
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
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          deleteExistingProjectImage(imageUrl, index)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                    <button
                      type="button"
                      onClick={() => removeProjectImagePreview(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                )
              )}

              {/* Upload button - only show if less than 10 project images */}
              {(formState.projectImages?.length || 0) +
                (formState.projectImagePreviews?.length || 0) <
                10 && (
                <div
                  onClick={triggerProjectImageFileInput}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770]"
                >
                  <input
                    type="file"
                    ref={projectImageFileInputRef}
                    onChange={handleProjectImageUpload}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    multiple
                    className="hidden"
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

            <p className="text-xs text-gray-500">
              Upload at least 2 images of your products or completed projects
              (JPEG, PNG, GIF, WEBP, max 5MB each)
            </p>
          </div>

          {/* Brand Video */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Brand/Product Video (Optional)
              <InfoButton text="Upload a video showcasing your brand or products" />
            </label>
            <div className="flex items-start gap-4">
              <input
                type="file"
                ref={videoFileInputRef}
                onChange={handleVideoUpload}
                accept="video/mp4,video/quicktime,video/x-msvideo"
                className="hidden"
              />
              {formState.videoPreview || formState.brandVideo ? (
                <div className="relative w-40 h-24 border rounded-md overflow-hidden">
                  {formState.videoPreview ? (
                    <video
                      src={formState.videoPreview}
                      controls
                      className="w-full h-full object-cover"
                      onError={() => {
                        console.error("Video preview error");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Video className="h-10 w-10 text-gray-400" />
                      <span className="text-xs text-gray-500 ml-2">
                        Video uploaded
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={removeVideoPreview}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={triggerVideoFileInput}
                  className="w-40 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#a11770]"
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
                <p>
                  Upload a short video showcasing your brand, products, or
                  manufacturing process
                </p>
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
            <label className="text-sm font-medium flex items-center gap-1">
              Social Media Links (Optional)
              <InfoButton text="Connect with your audience and show your brand's online presence" />
            </label>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Instagram className="h-5 w-5 text-[#a11770]" />
                <Input
                  placeholder="https://instagram.com/yourbrand"
                  value={socialMedia.instagram}
                  onChange={(e) =>
                    handleSocialMediaChange("instagram", e.target.value)
                  }
                  className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Linkedin className="h-5 w-5 text-[#a11770]" />
                <Input
                  placeholder="https://linkedin.com/company/yourbrand"
                  value={socialMedia.linkedin}
                  onChange={(e) =>
                    handleSocialMediaChange("linkedin", e.target.value)
                  }
                  className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-[#a11770]" />
                <Input
                  placeholder="https://yourbrand.com"
                  value={socialMedia.website}
                  onChange={(e) =>
                    handleSocialMediaChange("website", e.target.value)
                  }
                  className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Additional Notes (Optional)
              <InfoButton text="Add any other information you'd like buyers to know" />
            </label>
            <Textarea
              placeholder="Share any additional information about your brand, products, or services that would be valuable for potential buyers"
              value={formState.additionalNotes || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  additionalNotes: e.target.value,
                });
              }}
              className="min-h-[150px] bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPresenceForm;
