"use client";

import { Project } from "@/types/api";
import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios"; // Import axios for API calls
import projectApi from "@/lib/api/project";

// Define all the form data types

// Create initial state with default values
const initialFormData: Project = {
  // Step 0
  selectedServices: ["custom-manufacturing"],

  // Step 1
  category: "",
  businessName: "",
  productType: "",

  // Step 2
  formulationType: "",
  targetBenefit: "",
  texturePreferences: "",
  colorPreferences: "",
  fragrancePreferences: "",
  packagingType: "",
  materialPreferences: "",
  bottleSize: "",
  labelingNeeded: "no",
  minimumOrderQuantity: "",
  certificationsRequired: "",
  sampleRequirements: "no",

  // Step 3
  projectTimeline: undefined,
  budget: 0,
  pricingCurrency: "",
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
  formData: Project;
  updateFormData: (field: keyof Project, value: any) => void;
  updateNestedFormData: (
    section: keyof Project,
    field: string,
    value: any,
    id?: number
  ) => void;
  createProject: () => Promise<void>;
  updateProject: (id: string) => Promise<void>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<Project>(initialFormData);

  const updateFormData = (field: keyof Project, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // For updating nested objects like milestones
  const updateNestedFormData = (
    section: keyof Project,
    field: string,
    value: any,
    id?: number
  ) => {
    if (section === "milestones" && id !== undefined) {
      setFormData((prev) => ({
        ...prev,
        milestones: prev.milestones.map((milestone) =>
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

  const createProject = async () => {
    try {
      const response = await projectApi.createProject(formData);
      console.log("Project created successfully:", response.data);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const updateProject = async (id: string) => {
    try {
      const response = await projectApi.updateProject(id, formData);
      console.log("Project updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        updateNestedFormData,
        createProject,
        updateProject,
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
