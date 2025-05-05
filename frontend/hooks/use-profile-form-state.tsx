"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { profileApi } from "@/lib/api/profile";
import { sellerApi } from "@/lib/api/seller";

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
  categories: null,
  "production-services": null,
  "production-managed": null,
  "production-manufactured": null,
  "business-capabilities": null,
  "target-audience": null,
  "team-size": null,
  "annual-revenue": null,
  "minimum-order": null,
  "comments-notes": null,
  certificates: null,
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
          businessTypes: [],
          businessCategories: [],
        };
      case "goals-metrics":
        return {
          selectedObjectives: [],
          selectedChallenges: [],
          selectedMetrics: [],
          agreement1: false,
          agreement2: false,
        };
      case "categories":
        return {
          selectedCategories: [],
          subcategories: {},
        };
      case "production-services":
        return {
          services: [],
        };
      case "production-managed":
        return {
          managementType: "",
        };
      case "production-manufactured":
        return {
          locations: [],
        };
      case "business-capabilities":
        return {
          capabilities: [],
        };
      case "target-audience":
        return {
          audiences: [],
        };
      case "team-size":
        return {
          size: "",
        };
      case "annual-revenue":
        return {
          revenue: "",
        };
      case "minimum-order":
        return {
          minimumOrderQuantity: "",
        };
      case "comments-notes":
        return {
          notes: "",
        };
      case "certificates":
        return {
          certificates: [],
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
        case "categories":
          response = await profileApi.getCategories();
          break;
        case "production-services":
          response = await profileApi.getProductionServices();
          break;
        case "production-managed":
          response = await profileApi.getProductionManagement();
          break;
        case "production-manufactured":
          response = await profileApi.getManufacturingLocations();
          break;
        case "business-capabilities":
          response = await profileApi.getBusinessCapabilities();
          break;
        case "target-audience":
          response = await profileApi.getTargetAudience();
          break;
        case "team-size":
          response = await profileApi.getTeamSize();
          break;
        case "annual-revenue":
          response = await profileApi.getAnnualRevenue();
          break;
        case "minimum-order":
          response = await profileApi.getMinimumOrder();
          break;
        case "comments-notes":
          response = await profileApi.getCommentsNotes();
          break;
        case "certificates":
          response = await profileApi.getCertificates();
          break;
      }

      console.log("Response: ", response);
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
        case "categories":
          response = await profileApi.updateCategories(data);
          break;
        case "production-services":
          response = await profileApi.updateProductionServices(data);
          break;
        case "production-managed":
          response = await profileApi.updateProductionManagement(data);
          break;
        case "production-manufactured":
          response = await profileApi.updateManufacturingLocations(data);
          break;
        case "business-capabilities":
          response = await profileApi.updateBusinessCapabilities(data);
          break;
        case "target-audience":
          response = await profileApi.updateTargetAudience(data);
          break;
        case "team-size":
          response = await profileApi.updateTeamSize(data);
          break;
        case "annual-revenue":
          response = await profileApi.updateAnnualRevenue(data);
          break;
        case "minimum-order":
          response = await profileApi.updateMinimumOrder(data);
          break;
        case "comments-notes":
          response = await profileApi.updateCommentsNotes(data);
          break;
        case "certificates":
          // Certificate updates are handled separately
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

      case "categories":
        return data.selectedCategories && data.selectedCategories.length > 0;

      case "production-services":
        return data.services && data.services.length > 0;

      case "production-managed":
        return !!data.managementType;

      case "production-manufactured":
        return data.locations && data.locations.length > 0;

      case "business-capabilities":
        return data.capabilities && data.capabilities.length > 0;

      case "target-audience":
        return data.audiences && data.audiences.length > 0;

      case "team-size":
        return !!data.size;

      case "annual-revenue":
        return !!data.revenue;

      case "minimum-order":
        return !!data.minimumOrderQuantity;

      case "comments-notes":
        return !!data.notes && data.notes.trim() !== "";

      case "certificates":
        return data.certificates && data.certificates.length > 0;

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
  };
};

export default useProfileFormState;
