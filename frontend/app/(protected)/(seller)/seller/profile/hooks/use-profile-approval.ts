"use client";

import { sellerApi } from "@/lib/api/seller";
// Assuming this is your API utility
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Or your preferred toast library

type UseProfileApprovalProps = {
  stepsToBeCompleted: number[];
};

interface ApprovalState {
  approvalRequested: boolean;
  approvalRequestedAt: Date | null;
  isApproved: boolean;
  message?: string;
}

export const useProfileApproval = ({
  stepsToBeCompleted,
}: UseProfileApprovalProps) => {
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalState>({
    approvalRequested: false,
    approvalRequestedAt: null,
    isApproved: false,
    message: "",
  });

  const [lock, setLock] = useState({
    isLocked: false,
    lockedAt: null,
  }); // Assuming you might need a lock for some reason

  const requestApproval = useCallback(async () => {
    if (stepsToBeCompleted.length > 0) {
      toast.error(
        "Please complete all profile steps before requesting approval"
      );
      return;
    }

    setIsSubmittingApproval(true);
    try {
      await sellerApi.reqApproval();
      setApprovalStatus((prev) => ({
        ...prev,
        approvalRequested: true,
        approvalRequestedAt: new Date(),
        isApproved: false, // Stays false until actually approved
        message: "Approval requested, waiting for admin approval", // Optimistic message
      }));
      toast.success("Profile submitted for approval");
    } catch (error) {
      console.error("Error requesting approval:", error);
      toast.error("Failed to submit profile for approval");
    } finally {
      setIsSubmittingApproval(false);
    }
  }, [stepsToBeCompleted]);

  const getApproval = useCallback(async () => {
    try {
      const response = await sellerApi.getApproval(); // This should return the detailed status

      if (response) {
        // Check if response is not undefined/null
        setApprovalStatus({
          approvalRequested: response.approvalRequested || false,
          approvalRequestedAt: response.approvalRequestedAt
            ? new Date(response.approvalRequestedAt)
            : null,
          isApproved: response.isApproved || false,
          message: response.message || "", // Store the message from the API
        });

        setLock({
          isLocked: response.lockInfo?.isLocked || false,
          lockedAt: response?.lockInfo?.lockedAt
            ? new Date(response.lockInfo.lockedAt)
            : null,
        });
      } else {
        toast.error("Failed to fetch approval status: Invalid response");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch approval status";
      toast.error(errorMessage);
      setApprovalStatus((prev) => ({
        ...prev,
        message: errorMessage,
        isApproved: false,
      }));
    }
  }, []);

  useEffect(() => {
    if (stepsToBeCompleted.length === 0) {
      getApproval();
    }
  }, [stepsToBeCompleted, getApproval]);

  return {
    approvalStatus,
    lock,
    setApprovalStatus,
    isSubmittingApproval,
    getApproval,
    requestApproval,
  };
};
