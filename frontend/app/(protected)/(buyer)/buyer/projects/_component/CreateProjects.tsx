"use client";

import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ArrowLeft } from "lucide-react";
import { ProgressStepper } from "@/components/onboarding/progress-stepper";
import Step0 from "./step0";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import LoadingScreen from "./loading-screen";
import SuccessScreen from "./success-screen";
// import SuppliersList from "./suppliers-list";
import ConfirmationScreen from "./confirmation-screen";
import { FormProvider, useFormContext } from "./create-projects-context";
import { Project } from "../../../../../../types/api";
import projectApi from "@/lib/api/project";

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

  useCallback(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const allSteps = [
    {
      number: "01",
      label: "Business Requirements",
      isActive: currentStage === 1,
      isCompleted: currentStage > 1,
    },
    {
      number: "02",
      label: "Product Requirements",
      isActive: currentStage === 2,
      isCompleted: currentStage > 2,
    },
    {
      number: "03",
      label: "Payment and Timeline",
      isActive: currentStage === 3,
      isCompleted: currentStage > 3,
    },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, any> = {};

    if (step === 1) {
      if (!formData.category) newErrors.category = "Category is required.";
      if (!formData.businessName)
        newErrors.businessName = "Business Name is required.";
      if (!formData.productType)
        newErrors.productType = "Product Type is required.";
    } else if (step === 2) {
      if (!formData.formulationType)
        newErrors.formulationType = "Formulation Type is required.";
      if (!formData.targetBenefit)
        newErrors.targetBenefit = "Target Benefit is required.";
      if (!formData.texturePreferences)
        newErrors.texturePreferences = "Texture Preferences are required.";
      if (!formData.colorPreferences)
        newErrors.colorPreferences = "Color Preferences are required.";
      if (!formData.fragrancePreferences)
        newErrors.fragrancePreferences = "Fragrance Preferences are required.";
      if (!formData.packagingType)
        newErrors.packagingType = "Packaging Type is required.";
      if (!formData.materialPreferences)
        newErrors.materialPreferences = "Material Preferences are required.";
      if (!formData.bottleSize)
        newErrors.bottleSize = "Bottle Size is required.";
      if (!formData.labelingNeeded)
        newErrors.labelingNeeded = "Labeling Needed is required.";
      if (!formData.minimumOrderQuantity)
        newErrors.minimumOrderQuantity = "Minimum Order Quantity is required.";
      if (!formData.certificationsRequired)
        newErrors.certificationsRequired =
          "Certifications Required is required.";
      if (!formData.sampleRequirements)
        newErrors.sampleRequirements = "Sample Requirements are required.";
    } else if (step === 3) {
      if (!formData.projectTimeline)
        newErrors.projectTimeline = "Project Timeline is required.";
      if (!formData.budget) newErrors.budget = "Budget is required.";
      if (!formData.pricingCurrency)
        newErrors.pricingCurrency = "Pricing Currency is required.";

      if (formData.milestones.length > 0) {
        newErrors.milestones = formData.milestones.map((milestone) => {
          const milestoneErrors: Record<string, string> = {};
          if (!milestone.name)
            milestoneErrors.name = "Milestone Name is required.";
          if (!milestone.description)
            milestoneErrors.description = "Milestone Description is required.";
          if (!milestone.paymentPercentage)
            milestoneErrors.paymentPercentage =
              "Milestone Payment Percentage is required.";
          if (!milestone.dueDate)
            milestoneErrors.dueDate = "Milestone Due Date is required.";
          return milestoneErrors;
        });

        console.log("test ");

        if (
          newErrors.milestones.length === 1 &&
          Object.keys(newErrors.milestones[0]).length === 0
        ) {
          console.log("hey bro ");
          delete newErrors.milestones;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStage === 0) {
      setOpen(false);
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
        return;
      }

      setCurrentStage((curr) => curr + 1);
    }
  };

  const handleViewSuppliers = () => {
    setIsSuccess(false);
    setShowSuppliers(true);
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
          console.log("Project updated successfully:", response.data);
        } catch (error) {
          console.error("Failed to update project:", error);
        }
      } else {
        try {
          const response = await projectApi.createProject(formData);
          console.log("Project created successfully:", response.data);
        } catch (error) {
          console.error("Failed to create project:", error);
        }
      }

      setIsSuccess(true);
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
        <div>
          <div> An error occurred: </div>
          <div onClick={() => window.location.reload()}>Try Again</div>
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

            {/* {showSuppliers && <SuppliersList />} */}
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
