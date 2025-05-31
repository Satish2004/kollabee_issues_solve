"use client";

import { uploadApi } from "@/lib/api/upload";
import { useState } from "react";
import { toast } from "sonner";

export const useFileManagement = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  // Handle file upload
  const handleFileUpload = async (file: File, field: string) => {
    try {
      setIsUploading((prev) => ({ ...prev, [field]: true }));
      setUploadProgress((prev) => ({ ...prev, [field]: 0 }));

      // Validate file size
      const maxSizeMB = field === "brandVideo" ? 50 : 5; // 50MB for videos, 5MB for other files
      const fileSizeMB = file.size / (1024 * 1024);

      if (fileSizeMB > maxSizeMB) {
        toast.error(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
        return null;
      }

      // Validate file type
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const validDocTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const validVideoTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
      ];

      let isValidType = false;

      if (
        field === "businessLogo" ||
        field === "factoryImages" ||
        field === "projectImages" ||
        field === "clientLogos"
      ) {
        isValidType = validImageTypes.includes(file.type);
        if (!isValidType) {
          toast.error(
            "Please upload a valid image file (JPEG, PNG, GIF, WEBP)"
          );
          return null;
        }
      } else if (
        field === "businessRegistration" ||
        field === "certifications"
      ) {
        isValidType = [...validImageTypes, ...validDocTypes].includes(
          file.type
        );
        if (!isValidType) {
          toast.error(
            "Please upload a valid document or image file (PDF, DOC, DOCX, JPEG, PNG)"
          );
          return null;
        }
      } else if (field === "brandVideo") {
        console.log("Validating video type:", file.type);
        isValidType = validVideoTypes.includes(file.type);
        if (!isValidType) {
          toast.error("Please upload a valid video file (MP4, MOV, AVI)");
          return null;
        }
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const currentProgress = prev[field] || 0;
          if (currentProgress < 90) {
            return { ...prev, [field]: currentProgress + 10 };
          }
          return prev;
        });
      }, 300);

      let response;

      // Determine which upload function to use based on the file type and field
      if (file.type.startsWith("image/")) {
        if (
          field === "businessLogo" ||
          field === "factoryImages" ||
          field === "clientLogos" ||
          field === "projectImages"
        ) {
          response = await uploadApi.uploadProductImage(file);
        } else {
          response = await uploadApi.uploadProfileImage(file);
        }
      } else if (
        file.type === "application/pdf" ||
        field === "businessRegistration" ||
        field === "certifications"
      ) {
        response = await uploadApi.uploadPDF(file);
      } else if (field === "brandVideo") {
        // For video uploads, we'll use the PDF upload endpoint as a placeholder
        response = await uploadApi.uploadAnyFile(file);
      }

      console.log("Upload response:", response);

      clearInterval(progressInterval);
      setUploadProgress((prev) => ({ ...prev, [field]: 100 }));

      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[field];
          return newProgress;
        });
        setIsUploading((prev) => {
          const newUploading = { ...prev };
          delete newUploading[field];
          return newUploading;
        });
      }, 1000);

      // Return the URL from the response
      return response?.url || response?.imageUrl || response?.fileUrl;
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
      toast.error(
        `Failed to upload ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
      );

      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[field];
        return newProgress;
      });
      setIsUploading((prev) => {
        const newUploading = { ...prev };
        delete newUploading[field];
        return newUploading;
      });

      return null;
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (fileUrl: string, field: string) => {
    try {
      // Extract public ID from Cloudinary URL
      const urlParts = fileUrl.split("/");
      const filenameWithExtension = urlParts[urlParts.length - 1];
      const publicId = filenameWithExtension.split(".")[0];

      await uploadApi.deleteImage(publicId);
      toast.success("File deleted successfully");
      return true;
    } catch (error) {
      console.error(`Error deleting ${field}:`, error);
      toast.error(
        `Failed to delete ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
      );
      return false;
    }
  };

  return {
    uploadProgress,
    isUploading,
    handleFileUpload,
    handleDeleteFile,
  };
};

export default useFileManagement;
