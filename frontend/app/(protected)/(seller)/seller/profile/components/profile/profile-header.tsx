"use client";

import { Button } from "@/components/ui/button";
// Assuming you use shadcn Button
import { AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";

// For icons

type ProfileHeaderProps = {
  stepsToBeCompleted: number[];
  getPendingStepNames: () => string[];
  setActiveStep: (step: number) => void;
  approvalStatus?: {
    approvalRequested: boolean;
    approvalRequestedAt: Date | null;
    isApproved: boolean;
    message?: string;
  };
  isSubmittingApproval?: boolean;
  requestApproval?: () => Promise<void>;
  profileData: any; // Consider defining a more specific type for profileData
  isLoading: boolean;
  visibleStepsCount: number;
  steps: string[]; // Declare the steps variable
};

export const ProfileHeader = ({
  stepsToBeCompleted,
  getPendingStepNames,
  setActiveStep, // Not used directly in this component's rendering logic, but kept for prop consistency
  approvalStatus,
  isSubmittingApproval,
  requestApproval,
  isLoading,
  visibleStepsCount, // Not directly used in this version, but kept for prop consistency
  steps, // Use the steps variable
}: ProfileHeaderProps) => {
  const pendingStepNames = getPendingStepNames();

  if (isLoading) {
    return (
      <div className="bg-white border-b rounded-t-lg">
        <div className="px-4 py-5 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
          <span className="text-gray-700">Loading profile information...</span>
        </div>
      </div>
    );
  }

  // All steps completed, show approval status or request approval button
  if (stepsToBeCompleted.length === 0) {
    return (
      <div className="bg-white border-b rounded-t-lg">
        {" "}
        {/* Ensure rounded-t-lg if it's the top part of a card */}
        <div className="px-4 py-3">
          {approvalStatus?.isApproved === true ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Profile Approved</span>
            </div>
          ) : approvalStatus?.approvalRequested === true ? (
            approvalStatus.message &&
            approvalStatus.message.toLowerCase().includes("rejected") ? (
              <div className="flex flex-col items-start text-red-600">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Approval Rejected</span>
                </div>
                <span className="text-sm ml-7">{approvalStatus.message}</span>
              </div>
            ) : (
              <div className="flex items-center text-blue-600">
                <Info className="h-5 w-5 mr-2" />
                <span className="font-medium">Approval Pending</span>
                {approvalStatus.approvalRequestedAt && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Submitted on{" "}
                    {new Date(
                      approvalStatus.approvalRequestedAt
                    ).toLocaleDateString()}
                    )
                  </span>
                )}
              </div>
            )
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-green-600 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  Profile Complete - Ready for Approval
                </span>
              </div>
              {requestApproval && (
                <Button
                  onClick={requestApproval}
                  disabled={isSubmittingApproval}
                  size="sm"
                  variant="default" // Or your preferred variant
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmittingApproval ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Request Approval"
                  )}
                </Button>
              )}
            </div>
          )}
          {/* Progress bar showing 100% completion */}
          <div className="w-full bg-gray-200 h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-full transition-all duration-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Steps are pending
  const displayedPendingSteps = pendingStepNames.slice(0, visibleStepsCount);
  const remainingPendingStepsCount =
    pendingStepNames.length - displayedPendingSteps.length;

  return (
    <div className="bg-white border-b px-4 py-3 rounded-t-lg">
      {" "}
      {/* Ensure rounded-t-lg */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Complete Your Profile
          </h2>
          <p className="text-sm text-gray-600">
            Please complete the following sections:{" "}
            <span className="font-medium text-red-600">
              {displayedPendingSteps.join(", ")}
              {remainingPendingStepsCount > 0 &&
                ` and ${remainingPendingStepsCount} more...`}
            </span>
          </p>
        </div>
        {/* Optionally, add a button to jump to the first pending step */}
        {stepsToBeCompleted.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveStep(stepsToBeCompleted[0] - 1)}
          >
            Go to Next Step
          </Button>
        )}
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5 mt-3 rounded-full overflow-hidden">
        <div
          className="bg-yellow-500 h-full transition-all duration-500"
          style={{
            width: `${
              ((steps.length - stepsToBeCompleted.length) / steps.length) * 100
            }%`,
          }}
        ></div>
      </div>
    </div>
  );
};
