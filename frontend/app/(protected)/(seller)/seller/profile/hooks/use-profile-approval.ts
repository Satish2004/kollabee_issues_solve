"use client";

import { sellerApi } from "@/lib/api/seller";
// Assuming this is your API utility
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// Or your preferred toast library

type UseProfileApprovalProps = {
  stepsToBeCompleted: number[];
};

// This interface should match the structure of the approvalStatus state
// and the relevant parts of your API response for getApproval
interface ApprovalState {
  approvalRequested: boolean;
  approvalRequestedAt: Date | null;
  isApproved: boolean;
  message?: string; // To store messages like rejection reasons
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

  const requestApproval = useCallback(async () => {
    if (stepsToBeCompleted.length > 0) {
      toast.error(
        "Please complete all profile steps before requesting approval"
      );
      return;
    }

    setIsSubmittingApproval(true);
    try {
      await sellerApi.reqApproval(); // Assuming this API call doesn't return the full status, but just confirms submission
      // After successful submission, we might want to re-fetch the status or optimistically update
      setApprovalStatus((prev) => ({
        ...prev,
        approvalRequested: true,
        approvalRequestedAt: new Date(),
        isApproved: false, // Stays false until actually approved
        message: "Approval requested, waiting for admin approval", // Optimistic message
      }));
      toast.success("Profile submitted for approval");
      // It's good practice to call getApproval() here to get the latest status from the server
      // after a short delay or immediately if the backend updates instantly.
      // For now, I'll leave it as an optimistic update.
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

      // Assuming response.data contains the actual payload if your sellerApi wraps responses
      // If sellerApi.getApproval() directly returns the JSON body, use response directly.
      // Let's assume response is the direct JSON body for now.
      // e.g., response = { message: "Approved", approvalStatus: true, ..., isApproved: true }

      if (response) {
        // Check if response is not undefined/null
        setApprovalStatus({
          approvalRequested: response.approvalRequested || false,
          approvalRequestedAt: response.approvalRequestedAt
            ? new Date(response.approvalRequestedAt)
            : null,
          // 'isApproved' should be the definitive boolean status from your API.
          // Your API returns 'approvalStatus' as a boolean in some cases and 'isApproved' as well.
          // Ensure you pick the one that truly represents if the seller is approved.
          // Let's assume 'isApproved' is the primary field for this.
          isApproved: response.isApproved || false,
          message: response.message || "", // Store the message from the API
        });
      } else {
        // This case might occur if sellerApi.getApproval() doesn't throw an error for non-200
        // but returns something falsy, or if the expected structure is missing.
        // console.error(
        //   "Failed to fetch approval status: Invalid response structure"
        // );
        toast.error("Failed to fetch approval status: Invalid response");
      }
    } catch (error: any) {
      // Catch block to handle errors from sellerApi.getApproval()
      // console.error("Error fetching approval status:", error);
      // If the error object has a response from the server (e.g., from Axios)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch approval status";
      toast.error(errorMessage);
      // Optionally, reset status or set an error message in the state
      setApprovalStatus((prev) => ({
        ...prev,
        message: errorMessage,
        isApproved: false, // Ensure isApproved is false on error
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
    setApprovalStatus, // Crucial for parent component if it needs to manually set status
    isSubmittingApproval,
    getApproval,
    requestApproval,
  };
};
