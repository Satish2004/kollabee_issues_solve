import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressStepperProps {
  steps: {
    number: string;
    label: string;
    isCompleted?: boolean;
    isActive?: boolean;
  }[];
  className?: string;
}

export function ProgressStepper({ steps, className }: ProgressStepperProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* This wrapper ensures proper scrolling behavior */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        {/* Fixed width container to ensure proper centering */}
        <div className="flex items-center justify-center min-w-max mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center gap-1 sm:gap-2">
                <div
                  className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs",
                    step.isCompleted
                      ? "bg-[#00B981] text-white"
                      : step.isActive
                      ? "border-2 border-[#00B981] text-[#00B981]"
                      : "bg-[#F4F4F5] text-[#71717A]"
                  )}
                >
                  {step.isCompleted ? (
                    <Check className="p-1" size={24} />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs whitespace-nowrap",
                    step.isCompleted || step.isActive
                      ? "text-[#00B981]"
                      : "text-[#71717A]"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-[1px] w-3 sm:w-20 mx-1 sm:mx-2",
                    step.isCompleted ? "bg-[#00B981]" : "bg-[#E4E4E7]"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
