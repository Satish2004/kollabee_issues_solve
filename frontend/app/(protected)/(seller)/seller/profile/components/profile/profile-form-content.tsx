"use client";

import BrandPresenceForm from "../forms/brand-presence-form";
import BusinessInfoForm from "../forms/business-info-form";
import BusinessOverviewForm from "../forms/business-overview-form";
import CapabilitiesOperationsForm from "../forms/capabilities-operations-form";
import ComplianceCredentialsForm from "../forms/compliance-credentials-form";
import FinalReviewForm from "../forms/final-review-form";
import GoalsMetricsForm from "../forms/goals-metrics-form";
import {
  BrandPresenceFormSkeleton,
  BusinessInfoFormSkeleton,
  BusinessOverviewFormSkeleton,
  CapabilitiesOperationsFormSkeleton,
  ComplianceCredentialsFormSkeleton,
  FinalReviewFormSkeleton,
  GoalsMetricsFormSkeleton,
} from "./skeletons/form-skeletons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  approvalStatus: {
    approvalRequested: boolean;
    approvalRequestedAt: Date | null;
    isApproved: boolean;
    message?: string; // To hold messages like "Approval request is rejected..."
  };
  disabled?: boolean; // Add disabled prop
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
  approvalStatus,
  disabled = false, // Default to false
}: ProfileFormContentProps) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);

  // Determine which steps are completed (not in pendingStepNames)
  useEffect(() => {
    const completed = steps
      .map((step, index) =>
        !pendingStepNames.includes(step.id) ? index : null
      )
      .filter((index): index is number => index !== null);
    setCompletedSteps(completed);
  }, [pendingStepNames, steps]);

  // Show animation when a step is completed
  useEffect(() => {
    if (completedSteps.includes(activeStep) && !showCompletionAnimation) {
      setShowCompletionAnimation(true);
      const timer = setTimeout(() => {
        setShowCompletionAnimation(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [completedSteps, activeStep]);

  const renderStepContent = () => {
    const currentStep = steps[activeStep].id;
    const currentFormState = formStates[currentStep];

    if (sectionLoading === currentStep) {
      switch (currentStep) {
        case "business-info":
          return <BusinessInfoFormSkeleton />;
        case "goals-metrics":
          return <GoalsMetricsFormSkeleton />;
        case "business-overview":
          return <BusinessOverviewFormSkeleton />;
        case "capabilities-operations":
          return <CapabilitiesOperationsFormSkeleton />;
        case "compliance-credentials":
          return <ComplianceCredentialsFormSkeleton />;
        case "brand-presence":
          return <BrandPresenceFormSkeleton />;
        case "final-review":
          return <FinalReviewFormSkeleton />; // Assuming data for final review is also part of formStates
        default:
          // Fallback generic skeleton or null
          return (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading section...</span>
            </div>
          );
      }
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        );
      case "final-review":
        return (
          <FinalReviewForm
            profileData={currentFormState}
            onSubmitForApproval={onSubmitForApproval}
            isSubmitting={isSubmittingApproval}
            pendingSteps={pendingStepNames}
            approvalStatus={approvalStatus}
            disabled={disabled}
          />
        );

      default:
        return null;
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
      {/* Step indicator */}
      <div className=" border-b px-6 py-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {sections[steps[activeStep].id]?.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {sections[steps[activeStep].id]?.description}
              </p>
            </div>
            <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
              <span className="text-sm font-medium text-gray-500">Step</span>
              <span className="text-xl font-bold mx-2 text-[#9e1171]">
                {activeStep + 1}
              </span>
              <span className="text-sm font-medium text-gray-500">
                of {steps.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="p-6">{renderStepContent()}</div>

      {/* Navigation buttons */}
      <div className="p-6 border-t flex flex-wrap md:flex-nowrap gap-4 justify-between items-center">
        <div className="w-full md:w-auto">
          {activeStep > 0 && (
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={activeStep === 0 || isSaving}
              variant="outline"
              className="flex items-center w-full md:w-auto"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        {/* <div className="w-full md:w-auto flex justify-center">
          {hasFormChanges(steps[activeStep].id) &&
            steps[activeStep].id !== "final-review" && (
              <Button
                onClick={() =>
                  handleEnhancedSectionUpdate(steps[activeStep].id)
                }
                disabled={isSaving}
                className="flex items-center w-full md:w-auto bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white hover:opacity-90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            )}
        </div> */}

        <div className="w-full md:w-auto flex justify-end">
          {activeStep < steps.length - 1 && (
            <Button
              type="button"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1 || isSaving}
              className="flex items-center w-full md:w-auto bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white hover:opacity-90"
            >
              {isSaving ? "Saving..." : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
