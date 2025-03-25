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
// import SuppliersList from "./suppliers-list";
import ConfirmationScreen from "./confirmation-screen";
import { FormProvider } from "./create-projects-context";

interface Step {
  number: string;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

const CreateProjects = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handlePrev = () => {
    if (currentStage === 1) {
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
  };

  const handleViewSuppliers = () => {
    setIsSuccess(false);
    setShowSuppliers(true);
  };

  const handleSubmit = () => {
    setShowConfirmation(false);
    setIsLoading(true);
  };

  // Effect to handle the loading to success transition
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 3000); // Show loading screen for 3 seconds
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <FormProvider>
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

              {isLoading && <LoadingScreen />}
              {isSuccess && (
                <SuccessScreen onViewSuppliers={handleViewSuppliers} />
              )}
              {/* {showSuppliers && <SuppliersList />} */}
              {showConfirmation && (
                <ConfirmationScreen
                  onBack={handlePrev}
                  onSubmit={handleSubmit}
                />
              )}

              {!isLoading &&
                !isSuccess &&
                !showSuppliers &&
                !showConfirmation && (
                  <>
                    {currentStage === 1 && <Step1 handleNext={handleNext} />}
                    {currentStage === 2 && <Step2 handleNext={handleNext} />}
                    {currentStage === 3 && <Step3 handleNext={handleNext} />}
                  </>
                )}
            </div>
          </div>
        )}
      </ErrorBoundary>
    </FormProvider>
  );
};

export default CreateProjects;
