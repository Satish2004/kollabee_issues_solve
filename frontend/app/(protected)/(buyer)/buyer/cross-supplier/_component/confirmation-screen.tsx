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
  value: string | number | undefined;
}

const Field: React.FC<FieldProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col">
      <span className="text-[#78787A] text-xs">{label}:</span>
      <span className="font-medium">{value || "Not specified"}</span>
    </div>
  );
};

interface ConfirmationScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export default function ConfirmationScreen({
  onBack,
  onSubmit,
}: ConfirmationScreenProps) {
  const { formData } = useFormContext();

  return (
    <div className="w-full">
      <div className="bg-pink-50 p-4 rounded-t-xl">
        <h2 className="text-center font-semibold text-lg">View Details</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Business Requirements */}
        <div>
          <h3 className="font-semibold mb-3">Business Requirements</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Field label="Category" value={formData.category} />
            <Field label="Product Type" value={formData.productType} />
          </div>
        </div>

        {/* Product Requirements */}
        <div>
          <h3 className="font-semibold mb-3">Product Requirements</h3>

          <Section title="Formulation Preferences">
            <Field label="Formulation Type" value={formData.formulationType} />
            <Field label="Target Benefits" value={formData.targetBenefit} />
          </Section>

          <Section title="Physical Characteristics">
            <Field
              label="Texture Preferences"
              value={formData.texturePreferences}
            />
            <Field
              label="Color Preferences"
              value={formData.colorPreferences}
            />
            <Field
              label="Fragrance Preferences"
              value={formData.fragrancePreferences}
            />
          </Section>

          <Section title="Packaging Requirements">
            <Field label="Packaging Type" value={formData.packagingType} />
            <Field
              label="Material Preferences"
              value={formData.materialPreferences}
            />
            <Field label="Bottle/Tube Size" value={formData.bottleSize} />
            <Field
              label="Labeling and Printing Needs"
              value={formData.labelingNeeded}
            />
          </Section>

          <Section title="Manufacturing and Production">
            <Field
              label="Minimum Order Quantity"
              value={formData.minimumOrderQuantity}
            />
            <Field
              label="Certifications Required"
              value={formData.certificationsRequired}
            />
          </Section>

          <Section title="Additional Requirements">
            <Field
              label="Do you need Sample requirements"
              value={formData.sampleRequirements}
            />
          </Section>
        </div>

        {/* Payment & Timeline */}
        <div>
          <h3 className="font-semibold mb-3">Payment & Timeline</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
            <Field
              label="Project Timeline"
              value={
                formData.projectTimeline
                  ? format(formData.projectTimeline, "dd/MM/yyyy")
                  : "DD/MM/YYYY"
              }
            />
            <Field label="Budget" value={formData.budget.toString()} />
            <Field label="Pricing Currency" value={formData.pricingCurrency} />
          </div>

          {/* Milestones */}
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-[#78787A] mb-2">
              <div>Milestone Name*</div>
              <div>Milestone Description*</div>
              <div>Payment Percentage*</div>
              <div>Due Date*</div>
            </div>

            {formData.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className="grid grid-cols-4 gap-2 text-sm py-2 border-t"
              >
                <div>{milestone.name || "Type Here"}</div>
                <div>{milestone.description || "Type Here"}</div>
                <div>
                  {milestone.paymentPercentage
                    ? `${milestone.paymentPercentage}%`
                    : "50%"}
                </div>
                <div>
                  {milestone.dueDate
                    ? format(milestone.dueDate, "dd/MM/yyyy")
                    : "DD/MM/YYYY"}
                </div>
              </div>
            ))}
          </div>
        </div>
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
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
