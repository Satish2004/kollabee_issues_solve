"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  number: string
  label: string
  isCompleted?: boolean
  isActive?: boolean
}

interface ProgressStepperProps {
  steps: Step[]
  className?: string
}

export function ProgressStepper({ steps, className }: ProgressStepperProps) {
  return (
    <div className={cn("flex justify-center items-center w-full", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                step.isCompleted ? "bg-[#00B981] text-white" : step.isActive ? "border-2 border-[#00B981] text-[#00B981]" : "bg-[#F4F4F5] text-[#71717A]"
              )}
            >
              {step.isCompleted ? <Check className="p-1" size={30} /> : step.number}
            </div>
            <span
              className={cn(
                "text-xs",
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
                "h-[1px] w-20 mx-2",
                step.isCompleted ? "bg-[#00B981]" : "bg-[#E4E4E7]"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
