"use client";

import CertificateModal from "./components/certificate-modal";
import ProfileStepper from "./components/profile-stepper";
import { ProfileFormContent } from "./components/profile/profile-form-content";
import { ProfileHeader } from "./components/profile/profile-header";
import { useCertificateManagement } from "./hooks/use-certificate-management";
import { useEnhancedSectionUpdate } from "./hooks/use-enhanced-section-update";
import { useFileManagement } from "./hooks/use-file-management";
import { useProfileApproval } from "./hooks/use-profile-approval";
import { useProfileData } from "./hooks/use-profile-data";
import { useStepNavigation } from "./hooks/use-step-navigation";
import useProfileFormState from "@/hooks/use-profile-form-state";
import { useProfileSections } from "@/hooks/use-profile-sections";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const KollaBeeProfile = () => {
  const { steps, sections } = useProfileSections();
  const {
    profileData,
    setProfileData,
    isLoading,
    stepsToBeCompleted,
    setStepsToBeCompleted,
    loadProfileCompletion,
  } = useProfileData();

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

  const { uploadProgress, isUploading, handleFileUpload, handleDeleteFile } =
    useFileManagement();

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
    stepsToBeCompleted,
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
    lock,
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

  // Get pending step names for display
  const getPendingStepNames = () => {
    return stepsToBeCompleted.map(
      (stepIndex) => steps[stepIndex - 1]?.label || `Step ${stepIndex}`
    );
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Sticky header and ProfileHeader */}
      <div className="sticky top-0 z-40 ">
        <ProfileHeader
          profileData={profileData}
          setActiveStep={setActiveStep}
          steps={steps}
          isLoading={isLoading}
          stepsToBeCompleted={stepsToBeCompleted}
          approvalStatus={approvalStatus}
          isSubmittingApproval={isSubmittingApproval}
          requestApproval={requestApproval}
          getPendingStepNames={getPendingStepNames}
          visibleStepsCount={5}
          lock={lock} // Pass lock to header for possible messaging
        />
      </div>
      <div className="sticky top-[64px] z-30 bg-white border-b">
        {/* Adjust top-[64px] if your header height is different */}
        <ProfileStepper
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          stepperContainerRef={stepperContainerRef}
          activeStepRef={activeStepRef}
          warningSteps={getWarningSteps()}
          stepsToBeCompleted={stepsToBeCompleted}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-scroll relative">
        {/* Overlay when locked */}
       
        <div className="flex-1">
          <div className="bg-white">
            <div className="md:col-span-2 p-4 md:p-6">
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
                approvalStatus={approvalStatus}
                disabled={lock.isLocked} // Pass disabled prop to all forms
              />
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
        disabled={lock.isLocked}
      />
    </div>
  );
};

export default KollaBeeProfile;
