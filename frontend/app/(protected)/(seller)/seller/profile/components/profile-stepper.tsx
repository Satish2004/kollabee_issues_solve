"use client";

import { cn } from "@/lib/utils";
import { Check, AlertTriangle, Circle } from "lucide-react";
import type { RefObject } from "react";

// Changed AlertCircle to AlertTriangle for consistency

type Step = {
  id: string;
  label: string;
};

type ProfileStepperProps = {
  steps: Step[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  stepperContainerRef: RefObject<HTMLDivElement>;
  activeStepRef: RefObject<HTMLDivElement>;
  warningSteps: string[];
  stepsToBeCompleted: number[]; // This is 0-indexed array of step indices
};

const ProfileStepper = ({
  steps,
  activeStep, // 0-indexed
  setActiveStep,
  stepperContainerRef,
  activeStepRef,
  warningSteps, // array of step.id
  stepsToBeCompleted, // array of step numbers (1-indexed)
}: ProfileStepperProps) => {
  return (
    // Removed justify-center from the outer div to allow full width usage if needed
    // The inner div will handle centering of the steps themselves.
    <div className="w-full bg-white py-3">
      {" "}
      {/* Added padding and bg explicitly */}
      <div
        className="overflow-x-auto max-w-5xl mx-auto w-full pb-0 relative custom-scrollbar" // mx-auto for centering, max-w-5xl
        ref={stepperContainerRef}
      >
        <div className="flex justify-center min-w-max px-2">
          {" "}
          {/* Added padding to prevent cutting off edges */}
          {steps.map((step, index) => {
            // index is 0-indexed
            const isCurrentStep = activeStep === index;
            const isStepPassed = index < activeStep;
            const hasWarning = warningSteps.includes(step.id);
            // stepsToBeCompleted contains 1-indexed step numbers. Convert current index to 1-indexed for comparison.
            const isStepToBeCompleted = stepsToBeCompleted.includes(index + 1);
            const isStepCompletedSuccessfully =
              isStepPassed && !hasWarning && !isStepToBeCompleted;

            return (
              <div
                key={step.id}
                className="flex items-center" // Removed mt-6, manage vertical spacing from parent or stepper itself
                ref={index === activeStep ? activeStepRef : null}
              >
                <button
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "flex flex-col items-center justify-start relative group", // justify-start, added group
                    "w-[110px] sm:w-[120px] md:w-[140px]" // Responsive width
                  )}
                  aria-current={isCurrentStep ? "step" : undefined}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1.5 transition-all duration-200 ease-in-out transform group-hover:scale-110",
                      isCurrentStep
                        ? "bg-green-500 text-white border-2 border-green-600 shadow-md"
                        : hasWarning && isStepPassed // A passed step has a warning
                        ? "bg-red-100 text-red-600 border-2 border-red-400"
                        : isStepCompletedSuccessfully // A passed step, no warning, not pending
                        ? "bg-green-100 text-green-700 border-2 border-green-500"
                        : isStepToBeCompleted // Step is explicitly marked as to-be-completed (pending)
                        ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-500"
                        : "bg-gray-200 text-gray-600 border-2 border-gray-300 group-hover:bg-gray-300" // Default for future steps
                    )}
                  >
                    {hasWarning && isStepPassed ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : isStepCompletedSuccessfully ? (
                      <Check className="h-5 w-5" />
                    ) : isStepToBeCompleted && !isCurrentStep ? (
                      <Circle className="h-3 w-3 text-yellow-700 fill-current" /> // Indicate pending
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs text-center h-10 leading-tight max-w-[90px] sm:max-w-[100px] md:max-w-[120px]",
                      isCurrentStep
                        ? "text-green-600 font-semibold"
                        : hasWarning && isStepPassed
                        ? "text-red-600 font-medium"
                        : isStepCompletedSuccessfully
                        ? "text-green-700"
                        : isStepToBeCompleted
                        ? "text-yellow-700 font-medium"
                        : "text-gray-500 group-hover:text-gray-700"
                    )}
                  >
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-[20px] sm:w-[30px] md:w-[40px] -mt-10 transition-colors duration-300", // Responsive width, adjusted margin
                      isCurrentStep // Line leading to current step
                        ? "bg-green-500"
                        : hasWarning && isStepPassed
                        ? "bg-red-400"
                        : isStepCompletedSuccessfully
                        ? "bg-green-500"
                        : isStepToBeCompleted && isStepPassed // A passed step that is still "to be completed" (e.g. due to later changes)
                        ? "bg-yellow-400"
                        : "bg-gray-300"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileStepper;
