"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type ProfileHeaderProps = {
  stepsToBeCompleted: number[];
  getPendingStepNames: () => string[];
  setActiveStep: (step: number) => void;
};

export const ProfileHeader = ({
  stepsToBeCompleted,
  getPendingStepNames,
  setActiveStep,
}: ProfileHeaderProps) => {
  const router = useRouter();
  const [showAllPendingSteps, setShowAllPendingSteps] = useState(false);
  const [visibleStepsCount, setVisibleStepsCount] = useState(6); // Default to 6 steps for 2 lines
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePendingSteps = () => {
    setShowAllPendingSteps((prev) => !prev);
  };

  const pendingStepNames = getPendingStepNames();

  // Navigate to the specific step page
  const navigateToStep = (stepNumber: number) => {
    setActiveStep(stepNumber - 1);
    router.push(`?step=${stepNumber}`);
  };

  // Calculate how many steps can fit in 2 lines
  useEffect(() => {
    const calculateVisibleSteps = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Estimate step width: ~120px per step + gap
        const stepWidth = 130;
        const stepsPerLine = Math.floor(containerWidth / stepWidth);
        const maxStepsInTwoLines = Math.max(4, stepsPerLine * 2); // Minimum 4 steps
        setVisibleStepsCount(maxStepsInTwoLines);
      }
    };

    calculateVisibleSteps();
    window.addEventListener("resize", calculateVisibleSteps);

    return () => {
      window.removeEventListener("resize", calculateVisibleSteps);
    };
  }, []);

  if (stepsToBeCompleted.length === 0) {
    return null; // Don't render anything if there are no pending steps
  }

  const shouldShowExpandButton = pendingStepNames.length > visibleStepsCount;
  const stepsToShow = showAllPendingSteps
    ? pendingStepNames
    : pendingStepNames.slice(0, visibleStepsCount);

  return (
    <div className="bg-white border-b rounded-lg">
      <div className="px-4 py-3">
        <div className="flex items-center text-amber-600 mb-2">
          <span className="font-medium">
            {stepsToBeCompleted.length} steps remaining to complete
          </span>
        </div>

        <div ref={containerRef} className="space-y-2">
          {showAllPendingSteps ? (
            // Expanded view - show all steps with proper wrapping
            <div className="flex flex-wrap gap-2">
              {pendingStepNames.map((stepName, index) => (
                <button
                  key={index}
                  onClick={() => navigateToStep(stepsToBeCompleted[index])}
                  className="inline-block bg-amber-100 text-amber-800 px-3 py-1.5 rounded text-sm hover:bg-amber-200 transition-colors whitespace-nowrap"
                >
                  {stepName}
                </button>
              ))}
            </div>
          ) : (
            // Collapsed view - show maximum 2 lines
            <div
              className="flex flex-wrap gap-2"
              style={{ maxHeight: "4rem", overflow: "hidden" }}
            >
              {stepsToShow.map((stepName, index) => (
                <button
                  key={index}
                  onClick={() => navigateToStep(stepsToBeCompleted[index])}
                  className="inline-block bg-amber-100 text-amber-800 px-3 py-1.5 rounded text-sm hover:bg-amber-200 transition-colors whitespace-nowrap"
                >
                  {stepName}
                </button>
              ))}
            </div>
          )}

          {/* Show more/less button */}
          {shouldShowExpandButton && (
            <div className="mt-2">
              <button
                onClick={togglePendingSteps}
                className="inline-flex items-center bg-amber-100 text-amber-800 px-3 py-1.5 rounded cursor-pointer hover:bg-amber-200 transition-colors text-sm"
              >
                {showAllPendingSteps ? (
                  <>
                    Show less
                    <ChevronUp className="h-4 w-4 ml-1" />
                  </>
                ) : (
                  <>
                    +{pendingStepNames.length - visibleStepsCount} more
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Progress bar for profile completion */}
        <div className="w-full bg-gray-200 h-1 mt-3">
          <div
            className="bg-amber-500 h-1 transition-all duration-500"
            style={{
              width: `${Math.round(
                ((13 - stepsToBeCompleted.length) / 13) * 100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
