type UseEnhancedSectionUpdateProps = {
  steps: any[];
  stepsToBeCompleted: number[];
  setStepsToBeCompleted: (steps: number[]) => void;
  handleSectionUpdate: (sectionId: string) => Promise<void>;
  loadProfileCompletion: () => Promise<void>;
};

export const useEnhancedSectionUpdate = ({
  steps,
  stepsToBeCompleted,
  setStepsToBeCompleted,
  handleSectionUpdate,
  loadProfileCompletion,
}: UseEnhancedSectionUpdateProps) => {
  // Enhanced section update handler with optimistic UI updates
  const handleEnhancedSectionUpdate = async (sectionId: string) => {
    // Get the current step index (1-based)
    const currentStepIndex =
      steps.findIndex((step) => step.id === sectionId) + 1;

    // Check if this step is in the stepsToBeCompleted list
    const isStepCurrentlyIncomplete =
      stepsToBeCompleted.includes(currentStepIndex);

    // If the step is currently incomplete, optimistically update the UI
    if (isStepCurrentlyIncomplete) {
      // Create a new array without the current step
      const optimisticRemainingSteps = stepsToBeCompleted.filter(
        (step) => step !== currentStepIndex
      );

      // Update the UI immediately (optimistic update)
      setStepsToBeCompleted(optimisticRemainingSteps);
    }

    // Call the original update function
    await handleSectionUpdate(sectionId);

    // After the update completes, refresh the actual completion status
    loadProfileCompletion();
  };

  return { handleEnhancedSectionUpdate };
};
