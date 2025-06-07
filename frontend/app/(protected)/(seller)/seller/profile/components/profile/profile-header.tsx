"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";

// Skeleton for when profile steps are pending
const ProfileIncompleteSkeleton = () => (
  <div className="bg-white border-b px-4 py-3 rounded-t-lg animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>{" "}
        {/* Title: "Complete Your Profile" */}
        <div className="h-4 bg-gray-300 rounded w-72"></div>{" "}
        {/* Subtitle: "Please complete..." */}
      </div>
      {/* Optional button placeholder if you have one here */}
      {/* <div className="h-8 w-24 bg-gray-300 rounded-md"></div> */}
    </div>
    {/* Progress Bar */}
    <div className="w-full bg-gray-200 h-1.5 mt-3 rounded-full overflow-hidden">
      <div className="bg-gray-300 h-full w-1/2 rounded-full"></div>{" "}
      {/* Example: 50% progress */}
    </div>
  </div>
);

// Skeleton for when profile is complete (showing approval status)
const ProfileCompleteSkeleton = () => (
  <div className="bg-white border-b rounded-t-lg animate-pulse">
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-5 w-5 bg-gray-300 rounded-full mr-2"></div>{" "}
          {/* Icon placeholder */}
          <div className="h-5 bg-gray-300 rounded w-40"></div>{" "}
          {/* Status text placeholder */}
        </div>
        {/* Optional button placeholder (e.g., for "Request Approval") */}
        <div className="h-8 w-32 bg-gray-300 rounded-md"></div>
      </div>
      {/* Progress bar showing 100% completion */}
      <div className="w-full bg-gray-200 h-1.5 mt-3 rounded-full overflow-hidden">
        <div className="bg-gray-300 h-full w-full rounded-full"></div>
      </div>
    </div>
  </div>
);

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
  steps: string[];
};

export const ProfileHeader = ({
  stepsToBeCompleted,
  getPendingStepNames,
  setActiveStep,
  approvalStatus,
  isSubmittingApproval,
  requestApproval,
  isLoading,
  visibleStepsCount,
  steps,
}: ProfileHeaderProps) => {
  const pendingStepNames = getPendingStepNames();

  if (isLoading) {
    // Determine which skeleton to show based on an optimistic guess
    // If stepsToBeCompleted is not empty, it's likely the "incomplete" state.
    // Otherwise, it's likely the "complete" (approval status) state.
    // This assumes stepsToBeCompleted is somewhat initialized or defaults to an empty array if its own data is loading.
    if (stepsToBeCompleted && stepsToBeCompleted.length > 0) {
      return <ProfileIncompleteSkeleton />;
    }
    // If stepsToBeCompleted is empty or not yet defined reliably,
    // and we expect an approval status, show the complete skeleton.
    // If there's a chance it could still be incomplete, IncompleteSkeleton might be a safer default.
    // For this case, let's assume if stepsToBeCompleted is empty, it's the "complete" state.
    return <ProfileCompleteSkeleton />;
  }

  // All steps completed, show approval status or request approval button
  if (stepsToBeCompleted.length === 0) {
    return (
      <div className="bg-white border-b rounded-t-lg">
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
                  variant="default"
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
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1.5 mt-3 rounded-full overflow-hidden">
        <div
          className="bg-yellow-500 h-full transition-all duration-500"
          style={{
            width: `${
              ((steps?.length - stepsToBeCompleted?.length) /
                (steps?.length || 1)) * // Added steps?.length || 1 to prevent division by zero
              100
            }%`,
          }}
        ></div>
      </div>
    </div>
  );
};
