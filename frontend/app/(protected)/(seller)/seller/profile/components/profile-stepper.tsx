"use client"

import { cn } from "@/lib/utils"
import { Check, Cross, X } from "lucide-react"
import type { RefObject } from "react"

type Step = {
  id: string
  label: string
}

type ProfileStepperProps = {
  steps: Step[]
  activeStep: number
  setActiveStep: (step: number) => void
  stepperContainerRef: RefObject<HTMLDivElement>
  activeStepRef: RefObject<HTMLDivElement>
}

const ProfileStepper = ({
  steps,
  activeStep,
  setActiveStep,
  stepperContainerRef,
  activeStepRef,
}: ProfileStepperProps) => {
  return (
    <div className="overflow-x-auto max-w-vh custom-scrollbar  mx-auto py-6 relative bg-white rounded-xl" ref={stepperContainerRef}>
      <div className="flex">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center" ref={index === activeStep ? activeStepRef : null}>
            <button
              onClick={() => setActiveStep(index)}
              className={cn(
                "flex flex-col items-center justify-center relative",
                "w-[100px]", // Fixed width for consistent spacing
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                  activeStep === index
                    ? "bg-green-100 text-gray-800 border-2 border-green-500"
                    : index < activeStep && index != 3
                      ? "bg-green-500 text-white"
                      : index === 3 
                      ? "bg-red-400 text-white"
                      :"bg-gray-100 text-gray-500",
                )}
              >
                {index < activeStep && index !== 3 ? <Check className="w-4 h-4" /> : index === 3 ? "!" : "0" + (index + 1)}

                { index === 111 && (
                                  <div className="absolute top-0 right-9 animate-ping w-2 aspect-square bg-red-500 rounded-full flex items-center justify-center">
                                  <div className="w-1 aspect-square bg-red-900 rounded-full">
                                  </div>
                                </div>
                )}
              </div>
              <span
                className={cn(
                  "text-xs text-wrap h-10 text-ellipsis max-w-[90px]", // Prevent line breaks
                  activeStep === index ? "text-gray-800 font-medium" : "text-gray-500",
                )}
              >
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-[30px] -mt-6", // Fixed width for consistent spacing
                  index < activeStep ? "bg-green-500" : "bg-gray-200",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfileStepper

