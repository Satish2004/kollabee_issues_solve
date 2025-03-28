"use client";

import { cn } from "@/lib/utils";
import type { RefObject } from "react";
import { Check, AlertCircle } from "lucide-react";

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
  stepsToBeCompleted: number[];
};

const ProfileStepper = ({
  steps,
  activeStep,
  setActiveStep,
  stepperContainerRef,
  activeStepRef,
  warningSteps,
  stepsToBeCompleted,
}: ProfileStepperProps) => {
  return (
    <div
      className="overflow-x-auto w-[75vw] mx-auto pb-4 relative custom-scrollbar"
      ref={stepperContainerRef}
    >
      <div className="flex">
        {steps.map((step, index) => {
          const hasWarning = warningSteps.includes(step.id);
          const isPassed = index < activeStep;
          const isCompleted = isPassed && !hasWarning;
          console.log(stepsToBeCompleted);
          const toBeCompleted = stepsToBeCompleted.includes(index + 1);

          return (
            <div
              key={step.id}
              className="flex items-center mt-6"
              ref={index === activeStep ? activeStepRef : null}
            >
              <button
                onClick={() => setActiveStep(index)}
                className={cn(
                  "flex flex-col items-center justify-center relative",
                  "w-[100px]" // Fixed width for consistent spacing
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                    activeStep === index
                      ? "bg-green-100 text-gray-800 border-2 border-green-500"
                      : hasWarning && isPassed
                      ? "bg-red-400 text-white"
                      : isCompleted && !toBeCompleted
                      ? "bg-green-500 text-white"
                      : toBeCompleted
                      ? "bg-red-100 border border-red-500"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {hasWarning ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : isCompleted && !toBeCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs text-wrap h-20 text-ellipsis max-w-[90px]", // Prevent line breaks
                    activeStep === index
                      ? "text-gray-800 font-medium"
                      : hasWarning && isPassed
                      ? "text-red-500"
                      : isCompleted && !toBeCompleted
                      ? "text-green-600"
                      : "text-gray-500"
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-[30px] -mt-16", // Fixed width for consistent spacing
                    hasWarning && isPassed
                      ? "bg-red-400"
                      : isCompleted
                      ? "bg-green-500"
                      : index < activeStep
                      ? "bg-[#e11d48]"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileStepper;
