"use client";

import { useState, useCallback } from "react";

// Define validation rules for each section
type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  arrayMinLength?: number;
};

type ValidationRules = {
  [sectionId: string]: {
    [fieldName: string]: ValidationRule;
  };
};

// Validation rules for all sections
const validationRules: ValidationRules = {
  "business-info": {
    businessName: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    businessDescription: {
      required: true,
      minLength: 10,
      maxLength: 500,
    },
    websiteLink: {
      required: true,
      pattern: /^https?:\/\/.+\..+/,
      custom: (value: string) => {
        if (!value) return null;
        try {
          new URL(value);
          return null;
        } catch {
          return "Please enter a valid URL (e.g., https://example.com)";
        }
      },
    },
    businessAddress: {
      required: true,
      minLength: 10,
      maxLength: 200,
    },
    roleInCompany: {
      required: true,
    },
    businessTypes: {
      required: true,
      arrayMinLength: 1,
    },
    businessCategories: {
      required: true,
      arrayMinLength: 1,
    },
  },
  "goals-metrics": {
    selectedObjectives: {
      required: true,
      arrayMinLength: 1,
    },
    selectedChallenges: {
      required: true,
      arrayMinLength: 1,
    },
    selectedMetrics: {
      required: true,
      arrayMinLength: 1,
    },
    agreement: {
      required: true,
      custom: (value: boolean) => {
        return value ? null : "You must agree to the terms";
      },
    },
  },
  "business-overview": {
    businessName: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    businessDescription: {
      required: true,
      minLength: 10,
      maxLength: 500,
    },
    businessAddress: {
      required: true,
      minLength: 10,
      maxLength: 200,
    },
    websiteLink: {
      required: true,
      pattern: /^https?:\/\/.+\..+/,
    },
    yearFounded: {
      required: true,
      custom: (value: string) => {
        const year = Number.parseInt(value);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1800 || year > currentYear) {
          return `Please enter a valid year between 1800 and ${currentYear}`;
        }
        return null;
      },
    },
    teamSize: {
      required: true,
    },
    annualRevenue: {
      required: true,
    },
    businessTypes: {
      required: true,
      arrayMinLength: 1,
    },
    businessCategories: {
      required: true,
      arrayMinLength: 1,
    },
  },
  "capabilities-operations": {
    servicesProvided: {
      required: true,
      arrayMinLength: 1,
    },
    minimumOrderQuantity: {
      required: true,
      custom: (value: string) => {
        const num = Number.parseInt(value);
        if (isNaN(num) || num < 1) {
          return "Please enter a valid minimum order quantity";
        }
        return null;
      },
    },
    productionModel: {
      required: true,
    },
    productionCountries: {
      required: true,
      arrayMinLength: 1,
    },
    sampleDispatchTime: {
      required: true,
    },
    productionTimeline: {
      required: true,
    },
  },
  "compliance-credentials": {
    businessRegistration: {
      required: true,
    },
    certificationTypes: {
      required: true,
      arrayMinLength: 1,
    },
  },
  "brand-presence": {
    projectImages: {
      required: true,
      arrayMinLength: 2,
      custom: (value: any[]) => {
        if (!Array.isArray(value) || value.length < 2) {
          return "Please upload at least 2 project images";
        }
        return null;
      },
    },
    socialMediaLinks: {
      custom: (value: string) => {
        try {
          const links = JSON.parse(value || "{}");
          const hasAtLeastOne = Object.values(links).some(
            (link) => typeof link === "string" && link.trim() !== ""
          );
          if (!hasAtLeastOne) {
            return "Please provide at least one social media link";
          }
          return null;
        } catch {
          return "Invalid social media links format";
        }
      },
    },
  },
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );

  // Validate a single field
  const validateField = useCallback(
    (sectionId: string, fieldName: string, value: any): string | null => {
      const rule = validationRules[sectionId]?.[fieldName];
      if (!rule) return null;

      // Required validation
      if (rule.required) {
        if (value === null || value === undefined || value === "") {
          return `${fieldName
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} is required`;
        }
        if (Array.isArray(value) && value.length === 0) {
          return `${fieldName
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()} is required`;
        }
      }

      // Skip other validations if value is empty and not required
      if (
        !rule.required &&
        (value === null || value === undefined || value === "")
      ) {
        return null;
      }

      // Array minimum length validation
      if (rule.arrayMinLength && Array.isArray(value)) {
        if (value.length < rule.arrayMinLength) {
          return `Please select at least ${rule.arrayMinLength} option${
            rule.arrayMinLength > 1 ? "s" : ""
          }`;
        }
      }

      // String validations
      if (typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          return `Minimum ${rule.minLength} characters required`;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          return `Maximum ${rule.maxLength} characters allowed`;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          return "Invalid format";
        }
      }

      // Custom validation
      if (rule.custom) {
        return rule.custom(value);
      }

      return null;
    },
    []
  );

  // Validate entire section
  const validateSection = useCallback(
    (sectionId: string, formData: any): Record<string, string> => {
      const sectionErrors: Record<string, string> = {};
      const rules = validationRules[sectionId];

      if (!rules || !formData) return sectionErrors;

      Object.keys(rules).forEach((fieldName) => {
        const error = validateField(sectionId, fieldName, formData[fieldName]);
        if (error) {
          sectionErrors[fieldName] = error;
        }
      });

      // Handle special cases
      if (sectionId === "business-info" && formData.roleInCompany === "Other") {
        if (!formData.otherRole || formData.otherRole.trim() === "") {
          sectionErrors.otherRole = "Please specify your role";
        }
      }

      return sectionErrors;
    },
    [validateField]
  );

  // Check if section is valid
  const isSectionValid = useCallback(
    (sectionId: string, formData: any): boolean => {
      const sectionErrors = validateSection(sectionId, formData);
      return Object.keys(sectionErrors).length === 0;
    },
    [validateSection]
  );

  // Update errors for a section
  const updateSectionErrors = useCallback(
    (sectionId: string, formData: any) => {
      const sectionErrors = validateSection(sectionId, formData);
      setErrors((prev) => ({
        ...prev,
        [sectionId]: sectionErrors,
      }));
      return sectionErrors;
    },
    [validateSection]
  );

  // Clear errors for a section
  const clearSectionErrors = useCallback((sectionId: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[sectionId];
      return newErrors;
    });
  }, []);

  // Get errors for a specific field
  const getFieldError = useCallback(
    (sectionId: string, fieldName: string): string | undefined => {
      return errors[sectionId]?.[fieldName];
    },
    [errors]
  );

  // Check if a field has an error
  const hasFieldError = useCallback(
    (sectionId: string, fieldName: string): boolean => {
      return !!errors[sectionId]?.[fieldName];
    },
    [errors]
  );

  return {
    errors,
    validateField,
    validateSection,
    isSectionValid,
    updateSectionErrors,
    clearSectionErrors,
    getFieldError,
    hasFieldError,
  };
};
