"use client";

import { useRouter } from "next/navigation";

type ProfileHeaderProps = {
  stepsToBeCompleted: number[];
  getPendingStepNames: () => string[];
  setActiveStep: (step: number) => void;
  // Props for approval status
  approvalStatus?: {
    approvalRequested: boolean;
    approvalRequestedAt: Date | null;
    isApproved: boolean; // This should reflect the actual approval status (true for approved, false for pending/rejected)
    message?: string; // To hold messages like "Approval request is rejected..."
  };
  isSubmittingApproval?: boolean;
  requestApproval?: () => Promise<void>;
  profileData: any;
  isLoading: boolean;
  visibleStepsCount: number; // Declare visibleStepsCount here
};

export const ProfileHeader = ({
  stepsToBeCompleted,
  getPendingStepNames,
  setActiveStep,
  // Destructure new props for approval status
  approvalStatus,
  isSubmittingApproval,
  requestApproval,
  isLoading,
  visibleStepsCount, // Destructure visibleStepsCount here
}: ProfileHeaderProps) => {
  const router = useRouter();
  const pendingStepNames = getPendingStepNames(); // Declare pendingStepNames here

  if (stepsToBeCompleted.length === 0) {
    // Show approval status when all steps are completed
    return (
      <div className="bg-white border-b rounded-lg">
        <div className="px-4 py-3">
          {approvalStatus && approvalStatus.isApproved === true ? (
            <div className="flex items-center text-green-600 mb-2">
              <span className="font-medium">✓ Profile Approved</span>
            </div>
          ) : approvalStatus && approvalStatus.approvalRequested === true ? (
            // If approval has been requested but not yet approved
            approvalStatus.message &&
            approvalStatus.message.toLowerCase().includes("rejected") ? (
              <div className="flex flex-col items-start text-red-600 mb-2">
                <span className="font-medium">✗ Approval Rejected</span>
                <span className="text-sm">{approvalStatus.message}</span>
                {/* Optionally, add a button to re-request or edit profile */}
              </div>
            ) : (
              <div className="flex items-center text-blue-600 mb-2">
                <span className="font-medium">⏳ Approval Pending</span>
                {approvalStatus.approvalRequestedAt && (
                  <span className="text-sm text-gray-500 ml-2">
                    Submitted on{" "}
                    {approvalStatus.approvalRequestedAt.toLocaleDateString()}
                  </span>
                )}
              </div>
            )
          ) : (
            // If approval has not been requested yet (and profile is complete)
            <div className="flex items-center justify-between">
              <div className="text-green-600">
                <span className="font-medium">
                  ✓ Profile Complete - Ready for Approval
                </span>
              </div>
              {requestApproval && (
                <button
                  onClick={requestApproval}
                  disabled={isSubmittingApproval}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingApproval ? "Submitting..." : "Request Approval"}
                </button>
              )}
            </div>
          )}
          {/* Progress bar showing 100% completion */}
          <div className="w-full bg-gray-200 h-1 mt-3">
            <div className="bg-green-500 h-1 w-full transition-all duration-500"></div>
          </div>
        </div>
      </div>
    );
  }

  const shouldShowExpandButton = pendingStepNames.length > visibleStepsCount;

  return (
    <div>
      {/* Placeholder for profile header content */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {/* Display steps to be completed */}
          {stepsToBeCompleted.length > 0 && (
            <div>Steps to be completed: {stepsToBeCompleted.join(", ")}</div>
          )}
          {/* Display expand button if needed */}
          {shouldShowExpandButton && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Expand Steps
            </button>
          )}
        </div>
      )}
    </div>
  );
};
