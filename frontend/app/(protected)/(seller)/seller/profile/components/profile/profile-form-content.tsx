"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CategoriesForm from "../forms/categories-form";
import ProductionServicesForm from "../forms/production-services-form";
import ProductionManagedForm from "../forms/production-managed-form";
import ProductionManufacturedForm from "../forms/production-manufactured-form";
import BusinessCapabilitiesForm from "../forms/business-capabilities-form";
import TargetAudienceForm from "../forms/target-audience-form";
import TeamSizeForm from "../forms/team-size-form";
import AnnualRevenueForm from "../forms/annual-revenue-form";
import MinimumOrderForm from "../forms/minimum-order-form";
import CommentsNotesForm from "../forms/comments-notes-form";
import CertificatesForm from "../forms/certificates-form";
import BusinessInfoForm from "../forms/business-info-form";
import GoalsMetricsForm from "../forms/goals-metrics-form";

type ProfileFormContentProps = {
  activeStep: number;
  steps: any[];
  sections: any;
  formStates: any;
  sectionLoading: string | null;
  isSaving: boolean;
  handleFormChange: (sectionId: string, value: any) => void;
  handleEnhancedSectionUpdate: (sectionId: string) => Promise<void>;
  hasFormChanges: (sectionId: string) => boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  onAddCertificate: () => void;
  handleRemoveCertificate: (certificateId: string) => Promise<void>;
};

export const ProfileFormContent = ({
  activeStep,
  steps,
  sections,
  formStates,
  sectionLoading,
  isSaving,
  handleFormChange,
  handleEnhancedSectionUpdate,
  hasFormChanges,
  handlePrevious,
  handleNext,
  onAddCertificate,
  handleRemoveCertificate,
}: ProfileFormContentProps) => {
  const renderStepContent = () => {
    const currentStep = steps[activeStep].id;
    const currentFormState = formStates[currentStep];

    if (sectionLoading === currentStep) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    if (!currentFormState) {
      return null;
    }

    switch (currentStep) {
      case "business-info":
        return (
          <BusinessInfoForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("business-info", newValue)}
            onSave={() => handleEnhancedSectionUpdate("business-info")}
            hasChanges={hasFormChanges("business-info")}
            isSaving={isSaving}
          />
        );
      case "categories":
        return (
          <CategoriesForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("categories", newValue)}
            onSave={() => handleEnhancedSectionUpdate("categories")}
            hasChanges={hasFormChanges("categories")}
            isSaving={isSaving}
          />
        );
      case "production-services":
        return (
          <ProductionServicesForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("production-services", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("production-services")}
            hasChanges={hasFormChanges("production-services")}
            isSaving={isSaving}
          />
        );
      case "production-managed":
        return (
          <ProductionManagedForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("production-managed", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("production-managed")}
            hasChanges={hasFormChanges("production-managed")}
            isSaving={isSaving}
          />
        );
      case "production-manufactured":
        return (
          <ProductionManufacturedForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("production-manufactured", newValue)
            }
            onSave={() =>
              handleEnhancedSectionUpdate("production-manufactured")
            }
            hasChanges={hasFormChanges("production-manufactured")}
            isSaving={isSaving}
          />
        );
      case "business-capabilities":
        return (
          <BusinessCapabilitiesForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("business-capabilities", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("business-capabilities")}
            hasChanges={hasFormChanges("business-capabilities")}
            isSaving={isSaving}
          />
        );
      case "target-audience":
        return (
          <TargetAudienceForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("target-audience", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("target-audience")}
            hasChanges={hasFormChanges("target-audience")}
            isSaving={isSaving}
          />
        );
      case "team-size":
        return (
          <TeamSizeForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("team-size", newValue)}
            onSave={() => handleEnhancedSectionUpdate("team-size")}
            hasChanges={hasFormChanges("team-size")}
            isSaving={isSaving}
          />
        );
      case "annual-revenue":
        return (
          <AnnualRevenueForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("annual-revenue", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("annual-revenue")}
            hasChanges={hasFormChanges("annual-revenue")}
            isSaving={isSaving}
          />
        );
      case "minimum-order":
        return (
          <MinimumOrderForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("minimum-order", newValue)}
            onSave={() => handleEnhancedSectionUpdate("minimum-order")}
            hasChanges={hasFormChanges("minimum-order")}
            isSaving={isSaving}
          />
        );
      case "comments-notes":
        return (
          <CommentsNotesForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("comments-notes", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("comments-notes")}
            hasChanges={hasFormChanges("comments-notes")}
            isSaving={isSaving}
          />
        );
      case "certificates":
        return (
          <CertificatesForm
            formState={currentFormState}
            onAddCertificate={onAddCertificate}
            onRemoveCertificate={handleRemoveCertificate}
            isSaving={isSaving}
          />
        );
      case "goals-metrics":
        return (
          <GoalsMetricsForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("goals-metrics", newValue)}
            onSave={() => handleEnhancedSectionUpdate("goals-metrics")}
            hasChanges={hasFormChanges("goals-metrics")}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-md p-4">
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            {sections[steps[activeStep].id]?.title}
          </h3>
          <p className="text-sm text-gray-500">
            {sections[steps[activeStep].id]?.description}
          </p>
        </div>
      </div>
      <div className="px-4 pb-4">{renderStepContent()}</div>
      <div className={`p-4 border-t flex justify-between items-center`}>
        <div className="flex-1 flex justify-start">
          {activeStep > 0 && (
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={activeStep === 0 || isSaving}
              className="flex items-center bg-[#a11770] text-white hover:bg-[#a11770]/70"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex-1 flex justify-center">
          {hasFormChanges(steps[activeStep].id) && (
            <Button
              onClick={() => handleEnhancedSectionUpdate(steps[activeStep].id)}
              disabled={isSaving}
              className="flex items-center bg-[#a11770] text-white hover:bg-[#a11770]/70"
            >
              Save Changes
            </Button>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          {activeStep < steps.length - 1 && (
            <Button
              type="button"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1 || isSaving}
              className="flex items-center bg-[#a11770] text-white hover:bg-[#a11770]/70"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
