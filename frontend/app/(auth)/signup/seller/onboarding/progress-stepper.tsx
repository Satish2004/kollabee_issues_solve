import React from "react";
import { Check } from "lucide-react";

interface Step {
  number: string;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

interface ProgressStepperProps {
  steps: Step[];
}

export function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-center w-full">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.isCompleted
                  ? "bg-pink-500 border-pink-500"
                  : step.isActive
                  ? "border-pink-500 text-pink-500"
                  : "border-gray-300 text-gray-300"
              }`}
            >
              {step.isCompleted ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                step.number
              )}
            </div>
            <p
              className={`mt-2 text-xs ${
                step.isActive || step.isCompleted
                  ? "text-pink-500"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                step.isCompleted ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
