"use client";

export const useProfileSections = () => {
  const steps = [
    { id: "business-info", label: "Business Info" },
    { id: "goals-metrics", label: "Goals & Metrics" },
    { id: "business-overview", label: "Business Overview" },
    { id: "capabilities-operations", label: "Capabilities & Operations" },
    { id: "compliance-credentials", label: "Compliance & Credentials" },
    { id: "brand-presence", label: "Brand Presence" },
    { id: "final-review", label: "Final Review & Submit" },
  ];

  const sections: Record<string, { title: string; description: string }> = {
    "business-info": {
      title: "Business Information",
      description:
        "Provide details about your business to help buyers understand your offerings.",
    },
    "goals-metrics": {
      title: "Goals & Metrics",
      description:
        "Help us understand your priorities so we can tailor the platform to your needs.",
    },
    "business-overview": {
      title: "Business Overview",
      description: "Confirm your contact and business info before continuing.",
    },
    "capabilities-operations": {
      title: "Capabilities & Operations",
      description: "Define what you offer and how you work.",
    },
    "compliance-credentials": {
      title: "Compliance & Credentials",
      description: "Help buyers trust your business.",
    },
    "brand-presence": {
      title: "Brand Presence",
      description: "Showcase your brand and past work.",
    },
    "final-review": {
      title: "Final Review & Submit",
      description: "Review all submitted information before final approval.",
    },
  };

  return { steps, sections };
};
