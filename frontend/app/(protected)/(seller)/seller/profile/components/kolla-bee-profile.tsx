"use client"
import { useState, useEffect, useRef } from "react"
import { authApi } from "@/lib/api/auth"
import { profileApi } from "@/lib/api/profile"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useProfileSections } from "@/lib/hooks/use-profile-sections"
import { useProfileFormState } from "@/lib/hooks/use-profile-form-state"
import ProfileStepper from "@/components/profile/profile-stepper"
import ProfileChart from "@/components/profile/profile-chart"
import CertificateModal from "@/components/profile/certificate-modal"

// Individual form components
import CategoriesForm from "@/components/profile/forms/categories-form"
import ProductionServicesForm from "@/components/profile/forms/production-services-form"
import ProductionManagedForm from "@/components/profile/forms/production-managed-form"
import ProductionManufacturedForm from "@/components/profile/forms/production-manufactured-form"
import BusinessCapabilitiesForm from "@/components/profile/forms/business-capabilities-form"
import TargetAudienceForm from "@/components/profile/forms/target-audience-form"
import TeamSizeForm from "@/components/profile/forms/team-size-form"
import AnnualRevenueForm from "@/components/profile/forms/annual-revenue-form"
import MinimumOrderForm from "@/components/profile/forms/minimum-order-form"
import CommentsNotesForm from "@/components/profile/forms/comments-notes-form"
import CertificatesForm from "@/components/profile/forms/certificates-form"

const KollaBeeProfile = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [profileData, setProfileData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [sectionLoading, setSectionLoading] = useState<string | null>(null)
  const [certificateModalOpen, setCertificateModalOpen] = useState(false)
  const [newCertificate, setNewCertificate] = useState({ title: "", file: null })

  const stepperContainerRef = useRef<HTMLDivElement>(null)
  const activeStepRef = useRef<HTMLDivElement>(null)

  // Get steps and sections
  const { steps, sections } = useProfileSections()

  // Get form state management
  const { formStates, originalFormStates, loadSectionData, handleFormChange, hasFormChanges, handleSectionUpdate } =
    useProfileFormState({
      steps,
      setIsSaving,
      setSectionLoading,
    })

  // Fetch initial profile data
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await authApi.getCurrentUser()
        setProfileData(user)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast.error("Failed to load user data")
        setIsLoading(false)
      }
    }
    getUser()
  }, [])

  // Load data for the current step when it changes
  useEffect(() => {
    const currentStepId = steps[activeStep].id
    loadSectionData(currentStepId)
  }, [activeStep, steps, loadSectionData])

  // Handle certificate upload
  const handleCertificateUpload = async () => {
    if (!newCertificate.title || !newCertificate.file) {
      toast.error("Please provide both title and file")
      return
    }

    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append("title", newCertificate.title)
      formData.append("file", newCertificate.file as any)

      const response = await profileApi.uploadCertificate(formData)

      // Update certificates list
      const updatedCertificates = [...(formStates.certificates?.certificates || []), response.data]

      handleFormChange("certificates", {
        ...formStates.certificates,
        certificates: updatedCertificates,
      })

      setCertificateModalOpen(false)
      setNewCertificate({ title: "", file: null })
      toast.success("Certificate uploaded successfully")
    } catch (error) {
      console.error("Error uploading certificate:", error)
      toast.error("Failed to upload certificate")
    } finally {
      setIsSaving(false)
    }
  }

  // Handle certificate removal
  const handleRemoveCertificate = async (certificateId: string) => {
    setIsSaving(true)
    try {
      await profileApi.deleteCertificate(certificateId)

      // Update certificates list
      const updatedCertificates = formStates.certificates.certificates.filter((cert: any) => cert.id !== certificateId)

      handleFormChange("certificates", {
        ...formStates.certificates,
        certificates: updatedCertificates,
      })

      toast.success("Certificate removed successfully")
    } catch (error) {
      console.error("Error removing certificate:", error)
      toast.error("Failed to remove certificate")
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      // Save current section if there are changes
      const currentSectionId = steps[activeStep].id
      if (hasFormChanges(currentSectionId)) {
        handleSectionUpdate(currentSectionId)
      }
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      // Save current section if there are changes
      const currentSectionId = steps[activeStep].id
      if (hasFormChanges(currentSectionId)) {
        handleSectionUpdate(currentSectionId)
      }
      setActiveStep(activeStep - 1)
    }
  }

  // Content for each section
  const renderStepContent = () => {
    const currentStep = steps[activeStep].id
    const currentFormState = formStates[currentStep]

    if (sectionLoading === currentStep) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      )
    }

    if (!currentFormState) {
      return null
    }

    switch (currentStep) {
      case "categories":
        return (
          <CategoriesForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("categories", newValue)}
            onSave={() => handleSectionUpdate("categories")}
            hasChanges={hasFormChanges("categories")}
            isSaving={isSaving}
          />
        )
      case "production-services":
        return (
          <ProductionServicesForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("production-services", newValue)}
            onSave={() => handleSectionUpdate("production-services")}
            hasChanges={hasFormChanges("production-services")}
            isSaving={isSaving}
          />
        )
      case "production-managed":
        return (
          <ProductionManagedForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("production-managed", newValue)}
            onSave={() => handleSectionUpdate("production-managed")}
            hasChanges={hasFormChanges("production-managed")}
            isSaving={isSaving}
          />
        )
      case "production-manufactured":
        return (
          <ProductionManufacturedForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("production-manufactured", newValue)}
            onSave={() => handleSectionUpdate("production-manufactured")}
            hasChanges={hasFormChanges("production-manufactured")}
            isSaving={isSaving}
          />
        )
      case "business-capabilities":
        return (
          <BusinessCapabilitiesForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("business-capabilities", newValue)}
            onSave={() => handleSectionUpdate("business-capabilities")}
            hasChanges={hasFormChanges("business-capabilities")}
            isSaving={isSaving}
          />
        )
      case "target-audience":
        return (
          <TargetAudienceForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("target-audience", newValue)}
            onSave={() => handleSectionUpdate("target-audience")}
            hasChanges={hasFormChanges("target-audience")}
            isSaving={isSaving}
          />
        )
      case "team-size":
        return (
          <TeamSizeForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("team-size", newValue)}
            onSave={() => handleSectionUpdate("team-size")}
            hasChanges={hasFormChanges("team-size")}
            isSaving={isSaving}
          />
        )
      case "annual-revenue":
        return (
          <AnnualRevenueForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("annual-revenue", newValue)}
            onSave={() => handleSectionUpdate("annual-revenue")}
            hasChanges={hasFormChanges("annual-revenue")}
            isSaving={isSaving}
          />
        )
      case "minimum-order":
        return (
          <MinimumOrderForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("minimum-order", newValue)}
            onSave={() => handleSectionUpdate("minimum-order")}
            hasChanges={hasFormChanges("minimum-order")}
            isSaving={isSaving}
          />
        )
      case "comments-notes":
        return (
          <CommentsNotesForm
            formState={currentFormState}
            onChange={(newValue) => handleFormChange("comments-notes", newValue)}
            onSave={() => handleSectionUpdate("comments-notes")}
            hasChanges={hasFormChanges("comments-notes")}
            isSaving={isSaving}
          />
        )
      case "certificates":
        return (
          <CertificatesForm
            formState={currentFormState}
            onAddCertificate={() => setCertificateModalOpen(true)}
            onRemoveCertificate={handleRemoveCertificate}
            isSaving={isSaving}
          />
        )
      default:
        return null
    }
  }

  // Scroll active step into view and center it
  useEffect(() => {
    if (activeStepRef.current && stepperContainerRef.current) {
      const container = stepperContainerRef.current
      const activeElement = activeStepRef.current

      // Calculate the scroll position to center the active step
      const containerWidth = container.offsetWidth
      const activeElementLeft = activeElement.offsetLeft
      const activeElementWidth = activeElement.offsetWidth

      const scrollPosition = activeElementLeft - containerWidth / 2 + activeElementWidth / 2

      // Smooth scroll to the calculated position
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      })
    }
  }, [activeStep])

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Main content area */}
        <div className="flex-1 overflow-visible p-6">
          {/* Profile completion and updates */}
          <div className="space-y-6">
            {/* Stepper */}
            <ProfileStepper
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              stepperContainerRef={stepperContainerRef}
              activeStepRef={activeStepRef}
            />

            {/* Content and Chart in grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Content */}
              <div className="md:col-span-2">
                <div className="border rounded-md">
                  <div className="p-4">
                    <h3 className="font-semibold">{sections[steps[activeStep].id]?.title}</h3>
                    <p className="text-sm text-gray-500">{sections[steps[activeStep].id]?.description}</p>
                  </div>
                  <div className="px-4 pb-4">{renderStepContent()}</div>
                  <div className="p-4 border-t flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={activeStep === 0 || isSaving}
                      className="flex items-center"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {hasFormChanges(steps[activeStep].id) && (
                      <Button
                        onClick={() => handleSectionUpdate(steps[activeStep].id)}
                        disabled={isSaving}
                        className="flex items-center"
                      >
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    )}

                    <Button
                      onClick={handleNext}
                      disabled={activeStep === steps.length - 1 || isSaving}
                      className="flex items-center"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <ProfileChart />
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
  )
}

export default KollaBeeProfile

