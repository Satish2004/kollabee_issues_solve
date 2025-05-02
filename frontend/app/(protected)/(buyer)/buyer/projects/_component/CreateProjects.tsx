"use client";

import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ArrowLeft } from "lucide-react";
import { ProgressStepper } from "@/components/onboarding/progress-stepper";
import Step0 from "./step0";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import LoadingScreen from "./loading-screen";
import SuccessScreen from "./success-screen";
import ConfirmationScreen from "./confirmation-screen";
import { useFormContext } from "./create-projects-context";
import type { Project } from "@/types/api";
import projectApi from "@/lib/api/project";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Step {
  number: string;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

const CreateProjects = ({
  setOpen,
  initialData,
}: {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  initialData?: Project;
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const { formData } = useFormContext();
  const [id, setId] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  // Get step labels based on selected service type
  const getStepLabels = () => {
    const serviceType = formData.selectedServices[0] || "";

    if (serviceType === "custom-manufacturing") {
      return ["Project Details", "Budget", "Timeline"];
    } else if (serviceType === "packaging-only") {
      return ["Packaging Details", "Budget", "Timeline"];
    } else if (serviceType === "services-brand-support") {
      return ["Service Details", "Budget", "Timeline"];
    }

    return [
      "Business Requirements",
      "Product Requirements",
      "Payment and Timeline",
    ];
  };

  const stepLabels = getStepLabels();

  const allSteps = [
    {
      number: "01",
      label: stepLabels[0],
      isActive: currentStage === 1,
      isCompleted: currentStage > 1,
    },
    {
      number: "02",
      label: stepLabels[1],
      isActive: currentStage === 2,
      isCompleted: currentStage > 2,
    },
    {
      number: "03",
      label: stepLabels[2],
      isActive: currentStage === 3,
      isCompleted: currentStage > 3,
    },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, any> = {};
    const serviceType = formData.selectedServices[0] || "";

    if (step === 0) {
      if (
        !formData.selectedServices ||
        formData.selectedServices.length === 0
      ) {
        newErrors.selectedServices = "Please select a service type.";
      }
    } else if (step === 1) {
      // Validation for Step 1 based on service type
      if (serviceType === "custom-manufacturing") {
        if (!formData.projectTitle)
          newErrors.projectTitle = "Project title is required.";
        if (!formData.productCategory || formData.productCategory.length === 0)
          newErrors.productCategory = "Select Atleast One Category.";
        if (!formData.productDescription)
          newErrors.productDescription = "Product description is required.";
        if (!formData.hasDesignOrFormula)
          newErrors.hasDesignOrFormula = "This field is required.";
        if (!formData.customizationLevel)
          newErrors.customizationLevel = "This field is required.";
        if (!formData.needsSample)
          newErrors.needsSample = "This field is required.";
        if (!formData.needsPackaging)
          newErrors.needsPackaging = "This field is required.";
        if (!formData.needsDesign)
          newErrors.needsDesign = "This field is required.";
      } else if (serviceType === "packaging-only") {
        if (!formData.projectTitle)
          newErrors.projectTitle = "Project title is required.";
        if (!formData.packagingCategory)
          newErrors.packagingCategory = "Packaging category is required.";
        if (!formData.packagingDescription)
          newErrors.packagingDescription = "Packaging description is required.";
        if (!formData.ecoFriendly)
          newErrors.ecoFriendly = "This field is required.";
        if (!formData.packagingDimensions)
          newErrors.packagingDimensions = "This field is required.";
        if (!formData.needsSample)
          newErrors.needsSample = "This field is required.";
      } else if (serviceType === "services-brand-support") {
        if (!formData.projectTitle)
          newErrors.projectTitle = "Project title is required.";
        if (!formData.projectDescription)
          newErrors.projectDescription = "Project description is required.";
        if (
          !formData.selectedServices ||
          formData.selectedServices.length <= 1
        ) {
          newErrors.selectedServices = "Please select at least one service.";
        }
        if (!formData.brandVision)
          newErrors.brandVision = "Brand vision is required.";
        if (!formData.brandStatus)
          newErrors.brandStatus = "This field is required.";
      }
    } else if (step === 2) {
      // Budget validation
      if (!formData.quantity || formData.quantity <= 0) {
        newErrors.quantity = "Quantity is required and must be greater than 0.";
      }
      if (!formData.budget || formData.budget <= 0) {
        newErrors.budget = "Budget is required and must be greater than 0.";
      }
      if (!formData.budgetType) {
        newErrors.budgetType = "Please select budget type.";
      }

      // Additional validation for services
      if (
        serviceType === "services-brand-support" &&
        !formData.budgetFlexibility
      ) {
        newErrors.budgetFlexibility =
          "Please select if your budget is fixed or flexible.";
      }
    } else if (step === 3) {
      // Timeline validation based on service type
      if (serviceType === "services-brand-support") {
        if (!formData.serviceStartDate)
          newErrors.serviceStartDate = "Start date is required.";
        if (!formData.serviceEndDate)
          newErrors.serviceEndDate = "End date is required.";
        if (
          formData.serviceStartDate &&
          formData.serviceEndDate &&
          new Date(formData.serviceEndDate) <
            new Date(formData.serviceStartDate)
        ) {
          newErrors.serviceEndDate = "End date cannot be before start date.";
        }
      } else {
        if (!formData.receiveDate)
          newErrors.receiveDate = "Receive date is required.";
      }

      if (!formData.supplierLocation)
        newErrors.supplierLocation = "Supplier location is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStage === 0) {
      setOpen && setOpen(false);
      return;
    }

    if (showSuppliers) {
      setShowSuppliers(false);
      setIsSuccess(true);
      return;
    }

    if (isSuccess) {
      setIsSuccess(false);
      setShowConfirmation(true);
      return;
    }

    if (showConfirmation) {
      setShowConfirmation(false);
      setCurrentStage(3);
      return;
    }

    setCurrentStage((curr) => curr - 1);
  };

  const handleNext = () => {
    if (validateStep(currentStage)) {
      setErrors({});
      if (currentStage === 3) {
        setCurrentStage(4);
        setShowConfirmation(true);
        return;
      }

      if (showConfirmation) {
        setShowConfirmation(false);
        setIsLoading(true);
        handleSubmit();
        return;
      }

      setCurrentStage((curr) => curr + 1);
    }
  };

  const handleViewSuppliers = () => {
    router.push(`/buyer/projects/${id}/supplier`);
  };

  const handleSubmit = async () => {
    console.log("Submitting form data:", formData);
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      if (initialData) {
        try {
          const response = await projectApi.updateProject(
            initialData?.id,
            formData
          );
          if (response.status < 200 || response.status >= 300) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          } else {
            setId(response?.id);
            setIsSuccess(true);
          }
          console.log("Project updated successfully:", response);
        } catch (error) {
          console.error("Failed to update project:", error);
          toast({
            title: "Error",
            description: "Failed to update project.",
            variant: "destructive",
          });
        }
      } else {
        try {
          const response = await projectApi.createProject(formData);
          if (response.status < 200 || response.status >= 300) {
            toast({
              title: "Error",
              description: "Failed to create project.",
              variant: "destructive",
            });
            throw new Error(`HTTP error! Status: ${response.status}`);
          } else {
            console.log("Project created successfully:", response);
            setId(response?.id);
            setIsSuccess(true);
          }
        } catch (error) {
          console.error("Failed to create project:", error);
          toast({
            title: "Error",
            description: "Failed to create project.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) return <LoadingScreen />;
  if (isSuccess) {
    return <SuccessScreen onViewSuppliers={handleViewSuppliers} />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <div className="p-8 text-center">
          <div className="text-lg font-medium mb-4">
            An error occurred while processing your request
          </div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}
    >
      {currentStage === 0 ? (
        <Step0 handleNext={handleNext} />
      ) : (
        <div className="h-full w-full flex flex-col gap-4">
          <div
            className="flex h-20 gap-1 text-[#EA3D4F] items-center px-6 rounded-md bg-white hover:cursor-pointer"
            onClick={handlePrev}
          >
            <ArrowLeft className="" />
            {"Back "}
          </div>

          <div className="bg-white w-full h-auto rounded-xl border flex flex-col p-8 gap-4">
            {!isLoading &&
              !isSuccess &&
              !showSuppliers &&
              !showConfirmation && (
                <div className="flex justify-center">
                  <ProgressStepper steps={allSteps} />
                </div>
              )}

            {showConfirmation && (
              <ConfirmationScreen
                onBack={handlePrev}
                onSubmit={handleSubmit}
                loading={isSubmitting}
              />
            )}

            {!isLoading &&
              !isSuccess &&
              !showSuppliers &&
              !showConfirmation && (
                <>
                  {currentStage === 1 && (
                    <Step1
                      handleNext={handleNext}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                  {currentStage === 2 && (
                    <Step2
                      handleNext={handleNext}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                  {currentStage === 3 && (
                    <Step3
                      handleNext={handleNext}
                      errors={errors}
                      setErrors={setErrors}
                    />
                  )}
                </>
              )}
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default CreateProjects;
