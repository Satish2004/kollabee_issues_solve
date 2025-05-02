"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import projectApi from "@/lib/api/project";

// Define the form data types with all possible fields
interface ProjectFormData {
  // Step 0
  selectedServices: string[];

  // Common fields
  projectTitle?: string;
  productCategory: string[];
  packagingCategory?: string;
  certifications?: string[];
  referenceFiles?: { url: string; publicId: string }[];

  // Custom Manufacturing fields
  productDescription?: string;
  hasDesignOrFormula?: string;
  customizationLevel?: string;
  hasTargetPrice?: string;
  targetPrice?: string;
  needsSample?: string;
  needsPackaging?: string;
  needsDesign?: string;

  // Packaging Only fields
  packagingDescription?: string;
  productForPackaging?: string;
  ecoFriendly?: string;
  packagingDimensions?: string;
  needsLabeling?: string;
  hasPackagingDesign?: string;

  // Services & Brand Support fields
  projectDescription?: string;
  brandVision?: string;
  brandStatus?: string;

  // Budget fields - Step 2
  quantity?: number;
  budget?: number;
  budgetType?: string;
  budgetFlexibility?: string;

  // Timeline fields - Step 3
  receiveDate?: Date | null;
  launchDate?: Date | null;
  serviceStartDate?: Date | null;
  serviceEndDate?: Date | null;
  supplierLocation?: string;
  additionalDetails?: string;

  // Legacy fields for compatibility
  category?: string;
  businessName?: string;
  formulationType?: string;
  targetBenefit?: string;
  texturePreferences?: string;
  colorPreferences?: string;
  fragrancePreferences?: string;
  packagingType?: string;
  materialPreferences?: string;
  bottleSize?: string;
  labelingNeeded?: string;
  minimumOrderQuantity?: string;
  certificationsRequired?: string;
  sampleRequirements?: string;
  projectTimelineFrom?: Date;
  projectTimelineTo?: Date;
  pricingCurrency?: string;
  milestones?: {
    id: number;
    name: string;
    description: string;
    paymentPercentage: string;
    dueDate?: Date;
  }[];
}

// Create initial state with default values
const initialFormData: ProjectFormData = {
  // Step 0
  selectedServices: [],

  // Legacy fields for compatibility
  milestones: [
    {
      id: 1,
      name: "",
      description: "",
      paymentPercentage: "",
      dueDate: undefined,
    },
  ],
};

// Create context with type safety
interface FormContextType {
  formData: ProjectFormData;
  updateFormData: (field: keyof ProjectFormData, value: any) => void;
  updateNestedFormData: (
    section: keyof ProjectFormData,
    field: string,
    value: any,
    id?: number
  ) => void;
  createProject: () => Promise<any>;
  updateProject: (id: string) => Promise<any>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  const updateFormData = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // For updating nested objects like milestones
  const updateNestedFormData = (
    section: keyof ProjectFormData,
    field: string,
    value: any,
    id?: number
  ) => {
    if (section === "milestones" && id !== undefined && formData.milestones) {
      setFormData((prev) => ({
        ...prev,
        milestones: prev.milestones?.map((milestone) =>
          milestone.id === id ? { ...milestone, [field]: value } : milestone
        ),
      }));
    } else {
      // For other nested objects if needed in the future
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  // Map new form data to the expected API format
  const mapFormDataToApiFormat = () => {
    // Start with the base data
    const apiData: any = { ...formData };

    // Map timeline dates
    if (formData.selectedServices.includes("services-brand-support")) {
      apiData.projectTimelineFrom = formData.serviceStartDate;
      apiData.projectTimelineTo = formData.serviceEndDate;
    } else {
      apiData.projectTimelineFrom = formData.receiveDate;
      apiData.projectTimelineTo = formData.launchDate || formData.receiveDate;
    }

    // Map category and product type
    if (formData.selectedServices.includes("custom-manufacturing")) {
      apiData.category = formData.productCategory || [];
    } else if (formData.selectedServices.includes("packaging-only")) {
      apiData.category = "PACKAGING";
    } else if (formData.selectedServices.includes("services-brand-support")) {
      apiData.category = "SERVICES";
    }

    // Set business name from project title
    apiData.businessName = formData.projectTitle || "Untitled Project";

    // Set other required fields with defaults if needed
    apiData.formulationType = formData.hasDesignOrFormula || "N/A";
    apiData.targetBenefit = formData.customizationLevel || "N/A";
    apiData.texturePreferences = "N/A";
    apiData.colorPreferences = "N/A";
    apiData.fragrancePreferences = "N/A";
    apiData.packagingType = formData.needsPackaging || "N/A";
    apiData.materialPreferences = formData.ecoFriendly || "N/A";
    apiData.bottleSize = "N/A";
    apiData.labelingNeeded = formData.needsLabeling || "no";
    apiData.minimumOrderQuantity = formData.quantity?.toString() || "100";
    apiData.certificationsRequired =
      (formData.certifications || []).join(", ") || "None";
    apiData.sampleRequirements = formData.needsSample || "no";
    apiData.pricingCurrency = "USD";

    // Create a default milestone if none exists
    if (!apiData.milestones || apiData.milestones.length === 0) {
      apiData.milestones = [
        {
          id: 1,
          name: "Project Completion",
          description: "Full payment upon completion",
          paymentPercentage: "100",
          dueDate: apiData.projectTimelineTo,
        },
      ];
    }

    return apiData;
  };

  const createProject = async () => {
    try {
      const apiData = mapFormDataToApiFormat();
      const response = await projectApi.createProject(apiData);
      console.log("Project created successfully:", response.data);
      return response;
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  };

  const updateProject = async (id: string) => {
    try {
      const apiData = mapFormDataToApiFormat();
      const response = await projectApi.updateProject(id, apiData);
      console.log("Project updated successfully:", response.data);
      return response;
    } catch (error) {
      console.error("Failed to update project:", error);
      throw error;
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        updateNestedFormData,
        createProject: async () => await createProject(),
        updateProject: async (id: string) => await updateProject(id),
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

// Custom hook for using the context
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
