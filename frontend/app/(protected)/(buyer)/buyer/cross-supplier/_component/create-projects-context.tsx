"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Define all the form data types
export interface FormData {
  // Step 0
  selectedServices: string[];

  // Step 1
  category: string;
  businessName: string;
  productType: string;

  // Step 2
  formulationType: string;
  targetBenefit: string;
  texturePreferences: string;
  colorPreferences: string;
  fragrancePreferences: string;
  packagingType: string;
  materialPreferences: string;
  bottleSize: string;
  labelingNeeded: string;
  minimumOrderQuantity: string;
  certificationsRequired: string;
  sampleRequirements: string;

  // Step 3
  projectTimeline: Date | undefined;
  budget: number;
  pricingCurrency: string;
  milestones: {
    id: number|string;
    name: string;
    description: string;
    paymentPercentage: string;
    dueDate: Date | undefined;
  }[];
}

// Create initial state with default values
const initialFormData: FormData = {
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
    {
      id: 2,
      name: "",
      description: "",
      paymentPercentage: "",
      dueDate: undefined,
    },
  ],
};

// Create context with type safety
interface FormContextType {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  updateNestedFormData: (
    section: keyof FormData,
    field: string,
    value: any,
    id?: number
  ) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // For updating nested objects like milestones
  const updateNestedFormData = (
    section: keyof FormData,
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

  return (
    <FormContext.Provider
      value={{ formData, updateFormData, updateNestedFormData }}
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
