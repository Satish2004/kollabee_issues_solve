"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UseStepNavigationProps {
  steps: { id: string; label: string }[];
  hasFormChanges: (sectionId: string) => boolean;
  handleSectionUpdate: (sectionId: string) => Promise<void>;
  stepsToBeCompleted: number[]; // Pass this directly as a prop instead of importing useProfileData
}

export const useStepNavigation = ({
  steps,
  hasFormChanges,
  handleSectionUpdate,
  stepsToBeCompleted,
}: UseStepNavigationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State to track if we've redirected to the first pending step
  const [hasRedirectedToPendingStep, setHasRedirectedToPendingStep] =
    useState(false);

  // Get step from URL
  const getStepFromUrl = (): number | null => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const stepNumber = Number.parseInt(stepParam, 10);
      // Validate step number is within range
      if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= steps.length) {
        return stepNumber - 1; // Convert to 1-based index to 0-based
      }
    }
    return null;
  };

  // Initialize with step from URL or temporarily with 0
  const [activeStep, setActiveStepInternal] = useState(() => {
    const urlStep = getStepFromUrl();
    return urlStep !== null ? urlStep : 0;
  });

  const stepperContainerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);

  // Effect to handle redirection to first pending step
  useEffect(() => {
    // Only proceed if we haven't redirected yet and stepsToBeCompleted is available
    if (
      !hasRedirectedToPendingStep &&
      stepsToBeCompleted &&
      stepsToBeCompleted.length > 0
    ) {
      const urlStep = getStepFromUrl();

      // Only redirect if there's no step in the URL
      if (urlStep === null) {
        // Sort steps and get the first pending one (convert from 1-based to 0-based index)
        const sortedSteps = [...stepsToBeCompleted].sort((a, b) => a - b);
        const firstPendingStep = sortedSteps[0] - 1; // Convert to 0-based index

        console.log("Redirecting to first pending step:", firstPendingStep + 1);

        // Only update if it's a valid step index
        if (firstPendingStep >= 0 && firstPendingStep < steps.length) {
          setActiveStep(firstPendingStep);
          setHasRedirectedToPendingStep(true);
        }
      } else {
        // If there's a step in the URL, mark as redirected to avoid overriding
        setHasRedirectedToPendingStep(true);
      }
    }
  }, [stepsToBeCompleted, hasRedirectedToPendingStep, steps.length]);

  // Update URL when step changes
  const setActiveStep = (step: number) => {
    setActiveStepInternal(step);

    // Create new URL with updated step parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", (step + 1).toString()); // Convert to 1-based index for URL

    // Update URL without causing a navigation/reload
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Handle next step navigation
  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      const currentStepId = steps[activeStep].id;

      // If there are changes, save before proceeding
      if (hasFormChanges(currentStepId)) {
        await handleSectionUpdate(currentStepId);
      }

      setActiveStep(activeStep + 1);
    }
  };

  // Handle previous step navigation
  const handlePrevious = async () => {
    if (activeStep > 0) {
      const currentStepId = steps[activeStep].id;

      // If there are changes, save before proceeding
      if (hasFormChanges(currentStepId)) {
        await handleSectionUpdate(currentStepId);
      }

      setActiveStep(activeStep - 1);
    }
  };

  // Get warning steps (steps with unsaved changes)
  const getWarningSteps = () => {
    return steps
      .map((step, index) => (hasFormChanges(step.id) ? step.id : null))
      .filter(Boolean) as string[];
  };

  // Scroll to active step
  useEffect(() => {
    if (activeStepRef.current && stepperContainerRef.current) {
      const container = stepperContainerRef.current;
      const activeElement = activeStepRef.current;
      const containerWidth = container.offsetWidth;
      const activeElementLeft = activeElement.offsetLeft;
      const activeElementWidth = activeElement.offsetWidth;

      // Calculate the scroll position to center the active step
      const scrollPosition =
        activeElementLeft - containerWidth / 2 + activeElementWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeStep]);

  return {
    activeStep,
    setActiveStep,
    stepperContainerRef,
    activeStepRef,
    handleNext,
    handlePrevious,
    getWarningSteps,
  };
};
