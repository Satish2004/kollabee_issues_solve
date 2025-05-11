import { api } from "../axios";
import type { User } from "@/types/api";
import { removeToken } from "../utils/token";
import Cookies from "js-cookie";
// Add these functions to your existing profile API file

import { toast } from "sonner";

export interface ProfileUpdateData {
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
  companyWebsite?: string;
  imageUrl?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  address?: string;
  zipCode?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface BankDetailsData {
  accountHolder: string;
  bankName: string;
  bankType: string;
  accountNumber: string;
  cvvCode: string;
  upiId?: string;
  zipCode: string;
}

const authUrl = process.env.NEXT_PUBLIC_API_URL;

export const profileApi = {
  getCurrentUser: async () => {
    try {
      return await api.get(`${authUrl}/auth/me`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        removeToken();
        Cookies.remove("token");
      }
      throw error;
    }
  },

  updateProfile: async (data: ProfileUpdateData) => {
    return api.patch<User>("/users/profile", data);
  },

  updatePassword: async (data: PasswordUpdateData) => {
    return api.post("/auth/update-password", data);
  },

  updateBankDetails: async (data: BankDetailsData) => {
    return api.post("/payment/bank-details", data);
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post<{ imageUrl: string }>("/upload/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getBankDetails: async () => {
    return api.get("/payment/bank-details");
  },

  // Get seller profile details
  getSellerProfile: async () => {
    return api.get("/seller/profile");
  },

  // Business Info
  getBusinessInfo: async () => {
    try {
      const response = await api.get("/seller/profile/bussinessInfo");
      return response;
    } catch (error) {
      console.error("Error fetching business info:", error);
      throw error;
    }
  },

  updateBusinessInfo: async (data: any) => {
    try {
      const response = await api.put("/seller/profile/bussinessInfo", data);
      toast.success("Business information updated successfully");
      return response;
    } catch (error) {
      console.error("Error updating business info:", error);
      toast.error("Failed to update business information");
      throw error;
    }
  },

  // Goals and Metrics
  getGoalsMetrics: async () => {
    try {
      const response = await api.get("/seller/profile/goalsMetric");
      return response;
    } catch (error) {
      console.error("Error fetching goals and metrics:", error);
      throw error;
    }
  },

  updateGoalsMetrics: async (data: any) => {
    try {
      const response = await api.put("/seller/profile/goalsMetric", data);
      toast.success("Goals and metrics updated successfully");
      return response;
    } catch (error) {
      console.error("Error updating goals and metrics:", error);
      toast.error("Failed to update goals and metrics");
      throw error;
    }
  },

  // Step 4: Business Overview
  getBusinessOverview: async () => {
    try {
      const response = await api.get("/seller/profile/business-overview");
      return response;
    } catch (error) {
      console.error("Error fetching business overview:", error);
      throw error;
    }
  },

  updateBusinessOverview: async (data: any) => {
    try {
      // Handle file upload if there's a logo preview
      let formData = null;
      let logoFile = null;

      if (data.logoPreview && data.logoPreview.startsWith("data:")) {
        // Convert base64 to file
        const res = await fetch(data.logoPreview);
        const blob = await res.blob();
        logoFile = new File([blob], "logo.png", { type: "image/png" });
      }

      if (logoFile) {
        formData = new FormData();
        formData.append("logo", logoFile);

        // Add all other data as JSON
        const dataWithoutPreview = { ...data };
        delete dataWithoutPreview.logoPreview;
        formData.append("data", JSON.stringify(dataWithoutPreview));

        const response = await api.put(
          "/seller/profile/business-overview",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Business overview updated successfully");
        return response;
      } else {
        // No file to upload, just send the data
        const dataWithoutPreview = { ...data };
        delete dataWithoutPreview.logoPreview;

        const response = await api.put(
          "/seller/profile/business-overview",
          dataWithoutPreview
        );
        toast.success("Business overview updated successfully");
        return response;
      }
    } catch (error) {
      console.error("Error updating business overview:", error);
      toast.error("Failed to update business overview");
      throw error;
    }
  },

  // Step 5: Capabilities & Operations
  getCapabilitiesOperations: async () => {
    try {
      const response = await api.get("/seller/profile/capabilities-operations");
      return response;
    } catch (error) {
      console.error("Error fetching capabilities & operations:", error);
      throw error;
    }
  },

  updateCapabilitiesOperations: async (data: any) => {
    try {
      // Handle file uploads if there are factory image previews
      let formData = null;
      const factoryImageFiles = [];

      if (data.factoryImagePreviews && data.factoryImagePreviews.length > 0) {
        formData = new FormData();

        // Process each preview image
        for (let i = 0; i < data.factoryImagePreviews.length; i++) {
          const preview = data.factoryImagePreviews[i];
          if (preview.file) {
            formData.append("factoryImages", preview.file);
            factoryImageFiles.push(preview.file);
          }
        }

        // Add all other data as JSON
        const dataWithoutPreviews = { ...data };
        delete dataWithoutPreviews.factoryImagePreviews;
        formData.append("data", JSON.stringify(dataWithoutPreviews));

        const response = await api.put(
          "/seller/profile/capabilities-operations",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Capabilities & operations updated successfully");
        return response;
      } else {
        // No files to upload, just send the data
        const dataWithoutPreviews = { ...data };
        delete dataWithoutPreviews.factoryImagePreviews;

        const response = await api.put(
          "/seller/profile/capabilities-operations",
          dataWithoutPreviews
        );
        toast.success("Capabilities & operations updated successfully");
        return response;
      }
    } catch (error) {
      console.error("Error updating capabilities & operations:", error);
      toast.error("Failed to update capabilities & operations");
      throw error;
    }
  },

  // Step 6: Compliance & Credentials
  getComplianceCredentials: async () => {
    try {
      const response = await api.get("/seller/profile/compliance-credentials");
      return response;
    } catch (error) {
      console.error("Error fetching compliance & credentials:", error);
      throw error;
    }
  },

  updateComplianceCredentials: async (data: any) => {
    try {
      // Handle file uploads
      const formData = new FormData();
      let hasFiles = false;

      // Business registration document
      if (data.businessRegPreview) {
        // This would be handled by the onFileUpload function
        hasFiles = true;
      }

      // Certification documents
      if (data.certificationPreviews && data.certificationPreviews.length > 0) {
        // This would be handled by the onFileUpload function
        hasFiles = true;
      }

      // Client logos
      if (data.clientLogoPreviews && data.clientLogoPreviews.length > 0) {
        // This would be handled by the onFileUpload function
        hasFiles = true;
      }

      // Clean up data before sending
      const cleanData = { ...data };
      delete cleanData.businessRegPreview;
      delete cleanData.certificationPreviews;
      delete cleanData.clientLogoPreviews;

      if (hasFiles) {
        formData.append("data", JSON.stringify(cleanData));

        const response = await api.put(
          "/seller/profile/compliance-credentials",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Compliance & credentials updated successfully");
        return response;
      } else {
        const response = await api.put(
          "/seller/profile/compliance-credentials",
          cleanData
        );
        toast.success("Compliance & credentials updated successfully");
        return response;
      }
    } catch (error) {
      console.error("Error updating compliance & credentials:", error);
      toast.error("Failed to update compliance & credentials");
      throw error;
    }
  },

  // Step 7: Brand Presence
  getBrandPresence: async () => {
    try {
      const response = await api.get("/seller/profile/brand-presence");
      return response;
    } catch (error) {
      console.error("Error fetching brand presence:", error);
      throw error;
    }
  },

  updateBrandPresence: async (data: any) => {
    try {
      // Handle file uploads
      const formData = new FormData();
      let hasFiles = false;

      // Project images
      if (data.projectImagePreviews && data.projectImagePreviews.length > 0) {
        // This would be handled by the onFileUpload function
        hasFiles = true;
      }

      // Brand video
      if (data.videoPreview) {
        // This would be handled by the onFileUpload function
        hasFiles = true;
      }

      // Clean up data before sending
      const cleanData = { ...data };
      delete cleanData.projectImagePreviews;
      delete cleanData.videoPreview;

      if (hasFiles) {
        formData.append("data", JSON.stringify(cleanData));

        const response = await api.put(
          "/seller/profile/brand-presence",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Brand presence updated successfully");
        return response;
      } else {
        const response = await api.put(
          "/seller/profile/brand-presence",
          cleanData
        );
        toast.success("Brand presence updated successfully");
        return response;
      }
    } catch (error) {
      console.error("Error updating brand presence:", error);
      toast.error("Failed to update brand presence");
      throw error;
    }
  },

  // Step 8: Final Review & Submit
  getProfileSummary: async () => {
    try {
      const response = await api.get("/seller/profile/summary");
      return response;
    } catch (error) {
      console.error("Error fetching profile summary:", error);
      throw error;
    }
  },

  // Profile completion and approval
  getProfileCompletion: async () => {
    return api.get("/seller/profile/completion");
  },

  getPendingStepNames: async () => {
    return api.get("/seller/profile/pending-steps");
  },

  requestApproval: async () => {
    try {
      const response = await api.post("/seller/approval");
      toast.success("Profile submitted for approval successfully");
      return response;
    } catch (error) {
      console.error("Error requesting approval:", error);
      toast.error("Failed to submit profile for approval");
      throw error;
    }
  },
  // File upload helper
  uploadFile: async (file: File, field: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("field", field);

      const response = await api.post("/seller/profile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
      throw error;
    }
  },

  // Delete file helper
  deleteFile: async (fileUrl: string, field: string) => {
    try {
      const response = await api.delete("/seller/profile/file", {
        data: { fileUrl, field },
      });

      return response;
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
      throw error;
    }
  },
};
