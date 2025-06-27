"use client";

import React from "react";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./create-projects-context";
import { format } from "date-fns";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b pb-4">
      <div
        className="flex justify-between items-center cursor-pointer py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-sm">{title}</h3>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {isOpen && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

interface FieldProps {
  label: string;
  value:
    | string
    | number
    | string[]
    | { url: string; publicId: string }[]
    | undefined
    | null;
  type?: "text" | "images" | "categories";
}

const Field: React.FC<FieldProps> = ({ label, value, type = "text" }) => {
  if (type === "images" && Array.isArray(value)) {
    return (
      <div className="flex flex-col col-span-2">
        <span className="text-[#78787A] text-xs font-normal">{label}:</span>
        {value.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {value.map((file: any, index) => (
              <div
                key={index}
                className="border rounded-md overflow-hidden h-16"
              >
                {file.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                  <img
                    src={file.url || "/placeholder.svg"}
                    alt="Reference"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-xs text-gray-500 p-1 truncate">
                    {file.url.split("/").pop()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="font-normal">No files uploaded</span>
        )}
      </div>
    );
  }

  if (type === "categories" && Array.isArray(value)) {
    return (
      <div className="flex flex-col col-span-2">
        <span className="text-[#78787A] text-xs font-normal">{label}:</span>
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {value.map((category: string, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full ${
                  category === "Other"
                    ? "bg-gray-100"
                    : category.startsWith("Custom:")
                    ? "bg-pink-50"
                    : "bg-gray-100"
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        ) : (
          <span className="font-normal">None selected</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-[#78787A] text-xs font-normal">{label}:</span>
      <span className="font-normal">
        {Array.isArray(value) ? value.join(", ") : value || "Not specified"}
      </span>
    </div>
  );
};

interface ConfirmationScreenProps {
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function ConfirmationScreen({
  onBack,
  onSubmit,
  loading,
}: ConfirmationScreenProps) {
  const { formData } = useFormContext();
  const serviceType = formData.selectedServices[0] || "";

  // Format date for display
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return "Not specified";
    return format(new Date(date), "dd/MM/yyyy");
  };

  // Render different confirmation screens based on project type
  const renderCustomManufacturingConfirmation = () => (
    <>
      <div>
        <h3 className="font-normal mb-3">Project Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-normal">
          <Field label="Project Title" value={formData.projectTitle} />
          <Field
            label="Product Category"
            value={formData.productCategory}
            type="categories"
          />
        </div>
      </div>

      <Section title="Product Information">
        <Field
          label="Product Description"
          value={formData.productDescription}
        />
        <Field
          label="Design or Formula"
          value={
            formData.hasDesignOrFormula === "yes"
              ? "Yes, I have a design or formula"
              : formData.hasDesignOrFormula === "no"
              ? "No, I need help developing"
              : formData.hasDesignOrFormula === "rebrand"
              ? "I want to rebrand an existing product"
              : "Not specified"
          }
        />
        <Field
          label="Customization Level"
          value={
            formData.customizationLevel === "slight"
              ? "Slight modifications"
              : formData.customizationLevel === "full"
              ? "Fully custom product"
              : formData.customizationLevel === "ready"
              ? "Ready-made with rebranding"
              : "Not specified"
          }
        />
        <Field
          label="Target Price"
          value={
            formData.hasTargetPrice === "yes"
              ? formData.targetPrice
              : "No target price specified"
          }
        />
        {formData.referenceFiles && formData.referenceFiles.length > 0 && (
          <Field
            label="Reference Files"
            value={formData.referenceFiles}
            type="images"
          />
        )}
      </Section>

      <Section title="Requirements">
        <Field
          label="Sample Required"
          value={
            formData.needsSample === "yes"
              ? "Yes, custom sample needed"
              : "No sample needed"
          }
        />
        <Field
          label="Packaging Required"
          value={
            formData.needsPackaging === "yes"
              ? "Yes, custom packaging needed"
              : formData.needsPackaging === "no"
              ? "No packaging needed"
              : formData.needsPackaging === "have"
              ? "Already have packaging designed"
              : "Not specified"
          }
        />
        <Field
          label="Design Services"
          value={
            formData.needsDesign === "yes"
              ? "Yes, design services needed"
              : "No design services needed"
          }
        />
        <Field
          label="Certifications"
          value={
            (formData.certifications || []).length > 0
              ? formData.certifications?.join(", ")
              : "None specified"
          }
        />
      </Section>

      <Section title="Budget & Quantity">
        <Field label="Quantity" value={formData.quantity} />
        <Field
          label="Budget"
          value={formData.budget}
        />
      </Section>

      <Section title="Timeline">
        <Field label="Receive Date" value={formatDate(formData.receiveDate)} />
        <Field label="Launch Date" value={formatDate(formData.launchDate)} />
        <Field label="Supplier Location" value={formData.supplierLocation} />
        <Field label="Additional Details" value={formData.additionalDetails} />
      </Section>
    </>
  );

  const renderPackagingOnlyConfirmation = () => (
    <>
      <div>
        <h3 className="font-semibold mb-3">Packaging Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Field label="Project Title" value={formData.projectTitle} />
          <Field
            label="Packaging Category"
            value={formData.packagingCategory}
          />
        </div>
      </div>

      <Section title="Packaging Information">
        <Field
          label="Packaging Description"
          value={formData.packagingDescription}
        />
        <Field
          label="Product For Packaging"
          value={formData.productForPackaging}
        />
        <Field
          label="Eco-Friendly Materials"
          value={
            formData.ecoFriendly === "yes"
              ? "Yes, sustainable materials"
              : formData.ecoFriendly === "no"
              ? "Standard materials"
              : formData.ecoFriendly === "open"
              ? "Open to both options"
              : "Not specified"
          }
        />
        <Field
          label="Dimensions & Requirements"
          value={formData.packagingDimensions}
        />
        {formData.referenceFiles && formData.referenceFiles.length > 0 && (
          <Field
            label="Reference Files"
            value={formData.referenceFiles}
            type="images"
          />
        )}
      </Section>

      <Section title="Additional Services">
        <Field
          label="Labeling & Printing"
          value={
            formData.needsLabeling === "yes" ? "Yes, needed" : "Not needed"
          }
        />
        <Field
          label="Packaging Design"
          value={
            formData.hasPackagingDesign === "yes"
              ? "Yes, I have a design ready"
              : formData.hasPackagingDesign === "no"
              ? "No, I need design services"
              : formData.hasPackagingDesign === "not-needed"
              ? "Not needed at this point"
              : "Not specified"
          }
        />
        <Field
          label="Sample Required"
          value={
            formData.needsSample === "yes"
              ? "Yes, custom sample needed"
              : "No sample needed"
          }
        />
        <Field
          label="Certifications"
          value={
            (formData.certifications || []).length > 0
              ? formData.certifications?.join(", ")
              : "None specified"
          }
        />
      </Section>

      <Section title="Budget & Quantity">
        <Field label="Quantity" value={formData.quantity} />
        <Field
          label="Budget"
          value={formData.budget}
        />
      </Section>

      <Section title="Timeline">
        <Field label="Receive Date" value={formatDate(formData.receiveDate)} />
        <Field label="Supplier Location" value={formData.supplierLocation} />
        <Field label="Additional Details" value={formData.additionalDetails} />
      </Section>
    </>
  );

  const renderServicesBrandSupportConfirmation = () => (
    <>
      <div>
        <h3 className="font-semibold mb-3">Service Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Field label="Project Title" value={formData.projectTitle} />
          <Field
            label="Brand Status"
            value={
              formData.brandStatus === "existing"
                ? "Existing brand"
                : "Starting from scratch"
            }
          />
        </div>
      </div>

      <Section title="Service Information">
        <Field
          label="Project Description"
          value={formData.projectDescription}
        />
        <Field label="Brand Vision" value={formData.brandVision} />
        <Field
          label="Services Requested"
          value={
            formData.selectedServices && formData.selectedServices.length > 1
              ? formData.selectedServices.slice(1).join(", ")
              : "None specified"
          }
        />
        {formData.referenceFiles && formData.referenceFiles.length > 0 && (
          <Field
            label="Reference Files"
            value={formData.referenceFiles}
            type="images"
          />
        )}
      </Section>

      <Section title="Budget">
        <Field label="Budget" value={formData.budget} />
        <Field
          label="Budget Type"
          value={
            formData.budgetFlexibility === "fixed"
              ? "Fixed budget"
              : "Flexible budget"
          }
        />
      </Section>

      <Section title="Timeline">
        <Field
          label="Service Start Date"
          value={formatDate(formData.serviceStartDate)}
        />
        <Field
          label="Service End Date"
          value={formatDate(formData.serviceEndDate)}
        />
        <Field label="Supplier Location" value={formData.supplierLocation} />
        <Field label="Additional Details" value={formData.additionalDetails} />
      </Section>
    </>
  );

  return (
    <div className="w-full">
      <div className="bg-pink-50 p-4 rounded-t-xl">
        <h2 className="text-center font-semibold text-lg">
          Review Your Project
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Service Type */}
        <div>
          <h3 className="font-semibold mb-3">Project Type</h3>
          <div className="text-sm">
            <Field
              label="Service Type"
              value={
                serviceType === "custom-manufacturing"
                  ? "Custom Product Manufacturing"
                  : serviceType === "packaging-only"
                  ? "Packaging Only"
                  : serviceType === "services-brand-support"
                  ? "Services & Brand Support"
                  : "Not specified"
              }
            />
          </div>
        </div>

        {/* Render different confirmation sections based on project type */}
        {serviceType === "custom-manufacturing" &&
          renderCustomManufacturingConfirmation()}
        {serviceType === "packaging-only" && renderPackagingOnlyConfirmation()}
        {serviceType === "services-brand-support" &&
          renderServicesBrandSupportConfirmation()}
      </div>

      <div className="flex justify-between items-center mt-6 px-6 pb-6">
        <Button
          variant="ghost"
          className="text-[#EA3D4F] flex items-center gap-1"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <Button
          className="bg-[#FF0066] hover:bg-[#E5005C] text-white px-8"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
