"use client"

import { useState, useEffect, useRef } from "react"

type UseStepNavigationProps = {
  steps: any[]
  hasFormChanges: (sectionId: string) => boolean
  handleSectionUpdate: (sectionId: string) => Promise<void>
}

export const useStepNavigation = ({ steps, hasFormChanges, handleSectionUpdate }: UseStepNavigationProps) => {
  const [activeStep, setActiveStep] = useState(0)
  const stepperContainerRef = useRef<HTMLDivElement>(null)
  const activeStepRef = useRef<HTMLDivElement>(null)

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

  const getWarningSteps = () => {
    const warningSteps: string[] = []

    steps.forEach((step, index) => {
      // Skip steps that haven't been visited yet
      if (index >= activeStep) return

      const stepId = step.id

      // Case 1: Step has unsaved changes
      if (hasFormChanges(stepId)) {
        warningSteps.push(stepId)
        return
      }
    })

    return warningSteps
  }

  return {
    activeStep,
    setActiveStep,
    stepperContainerRef,
    activeStepRef,
    handleNext,
    handlePrevious,
    getWarningSteps,
  }
}
