export function useProfileSections() {
    const steps = [
      { id: "categories", label: "Categories" },
      { id: "production-services", label: "Production Services" },
      { id: "production-managed", label: "Production Managed" },
      { id: "production-manufactured", label: "Production Manufactured" },
      { id: "business-capabilities", label: "Business Capabilities" },
      { id: "target-audience", label: "Target Audience" },
      { id: "team-size", label: "Team Size" },
      { id: "annual-revenue", label: "Annual Revenue" },
      { id: "minimum-order", label: "Minimum Order Quantity" },
      { id: "comments-notes", label: "Comments & Notes" },
      { id: "certificates", label: "Certificates" },
    ]
  
    const sections: Record<string, { title: string; description: string }> = {
      categories: {
        title: "Define Your Categories",
        description: "Provide details about your business's unique attributes, subcategories, and target audience.",
      },
      "production-services": {
        title: "What Production Services Does Your Business Offer?",
        description: "Provide details about your business's unique attributes, subcategories, and target audience.",
      },
      "production-managed": {
        title: "How Is Your Production Managed?",
        description: "Provide insights into your production management to help buyers understand your capabilities.",
      },
      "production-manufactured": {
        title: "Where Are Your Products Manufactured?",
        description: "Specify your primary manufacturing locations to help buyers understand your production footprint",
      },
      "business-capabilities": {
        title: "Business Capabilities",
        description: "Match with the right buyers by selecting the category that best describes your business.",
      },
      "target-audience": {
        title: "Target Audience",
        description: "Choose the type of buyers you are looking to connect with. This helps us refine your experience",
      },
      "team-size": {
        title: "Team Size",
        description: "How many people work in the Company?",
      },
      "annual-revenue": {
        title: "Annual Revenue",
        description: "Help us to match your suitable suppliers",
      },
      "minimum-order": {
        title: "Minimum Order Quantity",
        description:
          "Set MOQs based on your production capabilities to help us connect you with the most appropriate clients.",
      },
      "comments-notes": {
        title: "Comments & Notes",
        description:
          "Share key details such as preferred proiect types, unique capabilities, or scheduling preferences to better match requests to your offering",
      },
      certificates: {
        title: "Certificates",
        description: "Upload your business certificates to verify your business credentials.",
      },
    }
  
    return { steps, sections }
  }
  
  