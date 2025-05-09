"use client";

import { useEffect, useState } from "react";
import { useProfileSections } from "@/hooks/use-profile-sections";
import useProfileFormState from "@/hooks/use-profile-form-state";
import { useProfileData } from "./hooks/use-profile-data";
import { useStepNavigation } from "./hooks/use-step-navigation";
import { useCertificateManagement } from "./hooks/use-certificate-management";
import { useProfileApproval } from "./hooks/use-profile-approval";
import { useEnhancedSectionUpdate } from "./hooks/use-enhanced-section-update";
import { useFileManagement } from "./hooks/use-file-management";
import { ProfileHeader } from "./components/profile/profile-header";
import { ProfileFormContent } from "./components/profile/profile-form-content";
import ProfileStepper from "./components/profile-stepper";
import CertificateModal from "./components/certificate-modal";

const KollaBeeProfile = () => {
  // Get steps and sections
  const { steps, sections } = useProfileSections();

  // Profile data management
  const {
    profileData,
    setProfileData,
    isLoading,
    stepsToBeCompleted,
    setStepsToBeCompleted,
    loadProfileCompletion,
  } = useProfileData();

  // Form state management
  const [sectionLoading, setSectionLoading] = useState<string | null>(null);
  const {
    formStates,
    loadSectionData,
    handleFormChange,
    hasFormChanges,
    handleSectionUpdate,
  } = useProfileFormState({
    steps,
    setIsSaving: (value) => setIsSaving(value),
    setSectionLoading: (value) => setSectionLoading(value),
  });

  // File management
  const { uploadProgress, isUploading, handleFileUpload, handleDeleteFile } =
    useFileManagement();

  // Step navigation
  const {
    activeStep,
    setActiveStep,
    stepperContainerRef,
    activeStepRef,
    handleNext,
    handlePrevious,
    getWarningSteps,
  } = useStepNavigation({
    steps,
    hasFormChanges,
    handleSectionUpdate,
  });

  // Enhanced section update with optimistic UI
  const { handleEnhancedSectionUpdate } = useEnhancedSectionUpdate({
    steps,
    stepsToBeCompleted,
    setStepsToBeCompleted,
    handleSectionUpdate,
    loadProfileCompletion,
  });

  // Certificate management
  const {
    certificateModalOpen,
    setCertificateModalOpen,
    newCertificate,
    setNewCertificate,
    isSaving,
    setIsSaving,
    handleCertificateUpload,
    handleRemoveCertificate,
  } = useCertificateManagement({
    formStates,
    handleFormChange,
  });

  // Profile approval
  const {
    approvalStatus,
    setApprovalStatus,
    isSubmittingApproval,
    requestApproval,
  } = useProfileApproval({
    stepsToBeCompleted,
  });

  // Load data for the current step when it changes
  useEffect(() => {
    const currentStepId = steps[activeStep].id;
    // Only load if not already loaded
    if (formStates[currentStepId] === null) {
      loadSectionData(currentStepId);
    }
  }, [activeStep, steps, formStates, loadSectionData]);

  useEffect(() => {
    loadProfileCompletion();
  }, [activeStep]);

  useEffect(() => {
    console.log("Profile data updated:", profileData);
    setApprovalStatus({
      approvalRequested: profileData.seller?.approvalRequested,
      approvalRequestedAt: profileData.seller?.approvalRequestedAt,
      isApproved: profileData.seller?.approved,
    });
  }, [profileData]);

  // Get pending step names for display
  const getPendingStepNames = () => {
    return stepsToBeCompleted.map(
      (stepIndex) => steps[stepIndex - 1]?.label || `Step ${stepIndex}`
    );
  };

  return (
    <div className="flex flex-col">
      {/* Profile header with approval status */}
      <ProfileHeader
        profileData={profileData}
        isLoading={isLoading}
        stepsToBeCompleted={stepsToBeCompleted}
        approvalStatus={approvalStatus}
        isSubmittingApproval={isSubmittingApproval}
        requestApproval={requestApproval}
        getPendingStepNames={getPendingStepNames}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Main content area */}
        <div className="flex-1 overflow-visible">
          {/* Profile completion and updates */}
          <div className="space-y-6 w-full bg-white">
            {/* Stepper */}
            <ProfileStepper
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              stepperContainerRef={stepperContainerRef}
              activeStepRef={activeStepRef}
              warningSteps={getWarningSteps()}
              stepsToBeCompleted={stepsToBeCompleted}
            />

            {/* Content */}
            <div className="bg-white">
              <div className="md:col-span-2">
                <ProfileFormContent
                  activeStep={activeStep}
                  steps={steps}
                  sections={sections}
                  formStates={formStates}
                  sectionLoading={sectionLoading}
                  isSaving={isSaving}
                  isSubmittingApproval={isSubmittingApproval}
                  handleFormChange={handleFormChange}
                  handleEnhancedSectionUpdate={handleEnhancedSectionUpdate}
                  hasFormChanges={hasFormChanges}
                  handlePrevious={handlePrevious}
                  handleNext={handleNext}
                  onFileUpload={handleFileUpload}
                  onDeleteFile={handleDeleteFile}
                  onSubmitForApproval={requestApproval}
                  pendingStepNames={getPendingStepNames()}
                  onAddCertificate={() => setCertificateModalOpen(true)}
                  handleRemoveCertificate={handleRemoveCertificate}
                  uploadProgress={uploadProgress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Upload Modal */}
      <CertificateModal
        open={certificateModalOpen}
        setOpen={setCertificateModalOpen}
        newCertificate={newCertificate}
        setNewCertificate={setNewCertificate}
        handleUpload={handleCertificateUpload}
        isSaving={isSaving}
      />
    </div>
  );
};

export default KollaBeeProfile;
