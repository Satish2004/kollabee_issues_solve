"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import BusinessInfoForm from "../forms/business-info-form";
import GoalsMetricsForm from "../forms/goals-metrics-form";
import BusinessOverviewForm from "../forms/business-overview-form";
import CapabilitiesOperationsForm from "../forms/capabilities-operations-form";
import ComplianceCredentialsForm from "../forms/compliance-credentials-form";
import BrandPresenceForm from "../forms/brand-presence-form";
import FinalReviewForm from "../forms/final-review-form";

type ProfileFormContentProps = {
  activeStep: number;
  steps: any[];
  sections: any;
  formStates: any;
  sectionLoading: string | null;
  isSaving: boolean;
  isSubmittingApproval: boolean;
  handleFormChange: (sectionId: string, value: any) => void;
  handleEnhancedSectionUpdate: (sectionId: string) => Promise<void>;
  hasFormChanges: (sectionId: string) => boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  onFileUpload: (file: File, field: string) => Promise<string | null>;
  onDeleteFile: (fileUrl: string, field: string) => void;
  onSubmitForApproval: () => Promise<void>;
  pendingStepNames: string[];
  onAddCertificate?: () => void;
  handleRemoveCertificate?: (certificateId: string) => Promise<void>;
  uploadProgress?: Record<string, number>;
};

export const ProfileFormContent = ({
  activeStep,
  steps,
  sections,
  formStates,
  sectionLoading,
  isSaving,
  isSubmittingApproval,
  handleFormChange,
  handleEnhancedSectionUpdate,
  hasFormChanges,
  handlePrevious,
  handleNext,
  onFileUpload,
  onDeleteFile,
  onSubmitForApproval,
  pendingStepNames,
  onAddCertificate,
  handleRemoveCertificate,
  uploadProgress = {},
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
      case "business-overview":
        return (
          <BusinessOverviewForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("business-overview", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("business-overview")}
            hasChanges={hasFormChanges("business-overview")}
            isSaving={isSaving}
            onFileUpload={onFileUpload}
            uploadProgress={uploadProgress}
          />
        );
      case "capabilities-operations":
        return (
          <CapabilitiesOperationsForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("capabilities-operations", newValue)
            }
            onSave={() =>
              handleEnhancedSectionUpdate("capabilities-operations")
            }
            hasChanges={hasFormChanges("capabilities-operations")}
            isSaving={isSaving}
            onFileUpload={onFileUpload}
            onDeleteImage={onDeleteFile}
            uploadProgress={uploadProgress}
          />
        );
      case "compliance-credentials":
        return (
          <ComplianceCredentialsForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("compliance-credentials", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("compliance-credentials")}
            hasChanges={hasFormChanges("compliance-credentials")}
            isSaving={isSaving}
            onFileUpload={onFileUpload}
            onDeleteFile={onDeleteFile}
            uploadProgress={uploadProgress}
          />
        );
      case "brand-presence":
        return (
          <BrandPresenceForm
            formState={currentFormState}
            onChange={(newValue) =>
              handleFormChange("brand-presence", newValue)
            }
            onSave={() => handleEnhancedSectionUpdate("brand-presence")}
            hasChanges={hasFormChanges("brand-presence")}
            isSaving={isSaving}
            onFileUpload={onFileUpload}
            onDeleteFile={onDeleteFile}
            uploadProgress={uploadProgress}
          />
        );
      case "final-review":
        return (
          <FinalReviewForm
            profileData={currentFormState}
            onSubmitForApproval={onSubmitForApproval}
            isSubmitting={isSubmittingApproval}
            pendingSteps={pendingStepNames}
          />
        );
      case "certificates":
        if (onAddCertificate && handleRemoveCertificate) {
          return (
            <div className="certificates-form">
              {/* Placeholder for certificates form if needed */}
              <p>Certificates form would go here</p>
            </div>
          );
        }
        return null;
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
          {hasFormChanges(steps[activeStep].id) &&
            steps[activeStep].id !== "final-review" && (
              <Button
                onClick={() =>
                  handleEnhancedSectionUpdate(steps[activeStep].id)
                }
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
