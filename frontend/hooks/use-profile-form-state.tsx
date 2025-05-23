"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { profileApi } from "@/lib/api/profile";
import { sellerApi } from "@/lib/api/seller";
import { uploadApi } from "@/lib/api/upload";

type Step = {
  id: string;
  label: string;
};

type ProfileFormProps = {
  steps: Step[];
  setIsSaving: (value: boolean) => void;
  setSectionLoading: (value: string | null) => void;
};

// Create initial form states with all sections including the new ones
const createInitialFormStates = () => ({
  "business-info": null,
  "goals-metrics": null,
  "business-overview": null,
  "capabilities-operations": null,
  "compliance-credentials": null,
  "brand-presence": null,
  "final-review": null,
});

const useProfileFormState = ({
  steps,
  setIsSaving,
  setSectionLoading,
}: ProfileFormProps) => {
  const [formStates, setFormStates] = useState<Record<string, any>>(
    createInitialFormStates()
  );
  const [originalFormStates, setOriginalFormStates] = useState<
    Record<string, any>
  >({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const sectionLoadingRef = useRef<string[]>([]);

  const updateFormState = useCallback(
    (sectionId: string, field: string, value: any) => {
      setFormStates((prev) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [field]: value,
        },
      }));
    },
    []
  );

  // Get default form state for a section
  const getDefaultFormState = (sectionId: string) => {
    switch (sectionId) {
      case "business-info":
        return {
          businessName: "",
          businessDescription: "",
          websiteLink: "",
          businessAddress: "",
          roleInCompany: "",
          businessTypes: [],
          businessCategories: [],
        };
      case "goals-metrics":
        return {
          selectedObjectives: [],
          selectedChallenges: [],
          selectedMetrics: [],
          agreement: false,
        };
      case "business-overview":
        return {
          businessName: "",
          businessDescription: "",
          businessAddress: "",
          websiteLink: "",
          businessTypes: [],
          businessCategories: [],
          businessLogo: null,
          logoPreview: null,
          yearFounded: "",
          teamSize: "",
          annualRevenue: "",
          languagesSpoken: [],
          businessAttributes: [],
          otherLanguageSelected: false,
          otherLanguages: "",
          otherAttributeSelected: false,
          otherAttributes: "",
        };
      case "capabilities-operations":
        return {
          servicesProvided: [],
          minimumOrderQuantity: "",
          lowMoqFlexibility: false,
          productionModel: "",
          productionCountries: [],
          providesSamples: false,
          sampleDispatchTime: "",
          productionTimeline: "",
          factoryImages: [],
          factoryImagePreviews: [],
          otherServiceSelected: false,
          otherServices: "",
          otherCountrySelected: false,
          otherCountries: "",
        };
      case "compliance-credentials":
        return {
          businessRegistration: null,
          businessRegPreview: null,
          certifications: [],
          certificationPreviews: [],
          certificationTypes: [],
          notableClients: "",
          clientLogos: [],
          clientLogoPreviews: [],
          otherCertSelected: false,
          otherCertifications: "",
        };
      case "brand-presence":
        return {
          projectImages: [],
          projectImagePreviews: [],
          brandVideo: null,
          videoPreview: null,
          socialMediaLinks: JSON.stringify({
            instagram: "",
            linkedin: "",
            website: "",
          }),
          additionalNotes: "",
        };
      case "final-review":
        return {
          // This will be populated with all profile data
        };
      default:
        return {};
    }
  };

  // Load section data from API
  const loadSectionData = async (sectionId: string) => {
    // If data is already loaded or a request is in progress, don't make another call
    if (
      formStates[sectionId] !== null ||
      sectionLoadingRef.current.includes(sectionId)
    )
      return;

    // Add this section to the loading tracker
    sectionLoadingRef.current = [...sectionLoadingRef.current, sectionId];

    setSectionLoading(sectionId);
    try {
      let response: any;

      switch (sectionId) {
        case "business-info":
          response = await profileApi.getBusinessInfo();
          break;
        case "goals-metrics":
          response = await profileApi.getGoalsMetrics();
          break;
        case "business-overview":
          response = await profileApi.getBusinessOverview();
          break;
        case "capabilities-operations":
          response = await profileApi.getCapabilitiesOperations();
          break;
        case "compliance-credentials":
          response = await profileApi.getComplianceCredentials();
          break;
        case "brand-presence":
          response = await profileApi.getBrandPresence();
          break;
        case "final-review":
          response = await profileApi.getProfileSummary();
          break;
      }

      console.log(`Response for ${sectionId}:`, response);
      if (response) {
        const newFormState = response || getDefaultFormState(sectionId);

        setFormStates((prev) => ({
          ...prev,
          [sectionId]: newFormState,
        }));

        setOriginalFormStates((prev) => ({
          ...prev,
          [sectionId]: JSON.parse(JSON.stringify(newFormState)), // Deep copy
        }));
      }
    } catch (error) {
      console.error(`Error loading ${sectionId} data:`, error);
      toast.error(`Failed to load ${sectionId.replace("-", " ")} data`);

      // Set default state on error
      const defaultState = getDefaultFormState(sectionId);
      setFormStates((prev) => ({
        ...prev,
        [sectionId]: defaultState,
      }));
      setOriginalFormStates((prev) => ({
        ...prev,
        [sectionId]: JSON.parse(JSON.stringify(defaultState)),
      }));
    } finally {
      sectionLoadingRef.current = sectionLoadingRef.current.filter(
        (id) => id !== sectionId
      );
      setSectionLoading(null);
    }
  };

  // Handle form changes
  const handleFormChange = (sectionId: string, newValue: any) => {
    setFormStates((prev) => ({
      ...prev,
      [sectionId]: newValue,
    }));
  };

  // Check if form has changes
  const hasFormChanges = (sectionId: string) => {
    if (!formStates[sectionId] || !originalFormStates[sectionId]) return false;

    return (
      JSON.stringify(formStates[sectionId]) !==
      JSON.stringify(originalFormStates[sectionId])
    );
  };

  // Handle file upload
  const handleFileUpload = async (file: File, field: string) => {
    try {
      setUploadProgress({ ...uploadProgress, [field]: 0 });

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
        // In a real implementation, you'd want a dedicated video upload endpoint
        response = await uploadApi.uploadPDF(file);
      }

      clearInterval(progressInterval);
      setUploadProgress((prev) => ({ ...prev, [field]: 100 }));

      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[field];
          return newProgress;
        });
      }, 1000);

      // Return the URL from the response
      return response?.data?.imageUrl || response?.data?.fileUrl;
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

      return null;
    }
  };

  // Handle section updates
  const handleSectionUpdate = async (sectionId: string) => {
    if (!hasFormChanges(sectionId)) {
      toast.info("No changes to save");
      return;
    }

    setIsSaving(true);
    try {
      let response: any;
      const data = formStates[sectionId];

      switch (sectionId) {
        case "business-info":
          response = await profileApi.updateBusinessInfo(data);
          break;
        case "goals-metrics":
          response = await profileApi.updateGoalsMetrics(data);
          break;
        case "business-overview":
          response = await profileApi.updateBusinessOverview(data);
          break;
        case "capabilities-operations":
          response = await profileApi.updateCapabilitiesOperations(data);
          break;
        case "compliance-credentials":
          response = await profileApi.updateComplianceCredentials(data);
          break;
        case "brand-presence":
          response = await profileApi.updateBrandPresence(data);
          break;
        case "final-review":
          // Final review doesn't have an update endpoint
          break;
      }

      if (response) {
        // Update original form state to match current state
        setOriginalFormStates((prev) => ({
          ...prev,
          [sectionId]: JSON.parse(JSON.stringify(formStates[sectionId])),
        }));

        toast.success(`${sectionId.replace(/-/g, " ")} updated successfully`);
      }
    } catch (error) {
      console.error(`Error updating ${sectionId}:`, error);
      toast.error(`Failed to update ${sectionId.replace(/-/g, " ")}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Check if a section has data
  const hasData = (sectionId: string): boolean => {
    const data = formStates[sectionId];
    if (!data) return false;

    // Check based on section type
    switch (sectionId) {
      case "business-info":
        return (
          !!data.businessName &&
          !!data.businessDescription &&
          !!data.websiteLink &&
          !!data.businessAddress &&
          !!data.roleInCompany &&
          data.businessTypes?.length > 0 &&
          data.businessCategories?.length > 0
        );

      case "goals-metrics":
        return (
          data.selectedObjectives?.length > 0 &&
          data.selectedChallenges?.length > 0 &&
          data.selectedMetrics?.length > 0 &&
          data.agreement === true
        );

      case "business-overview":
        return (
          !!data.businessName &&
          !!data.businessDescription &&
          !!data.businessAddress &&
          !!data.websiteLink &&
          !!data.yearFounded &&
          !!data.teamSize &&
          !!data.annualRevenue
        );

      case "capabilities-operations":
        return (
          data.servicesProvided?.length > 0 &&
          !!data.minimumOrderQuantity &&
          !!data.productionModel
        );

      case "compliance-credentials":
        return !!data.businessRegistration;

      case "brand-presence":
        return data.projectImages?.length >= 2;

      default:
        return false;
    }
  };

  return {
    formStates,
    updateFormState,
    loadSectionData,
    handleFormChange,
    hasFormChanges,
    handleSectionUpdate,
    hasData,
    uploadProgress,
    handleFileUpload,
  };
};

export default useProfileFormState;
