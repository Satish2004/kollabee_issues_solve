"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Plus,
  AlertCircle,
  X,
  CheckCircle,
  Info,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ProductsHeaderProps {
  activeTab: "active" | "draft";
  setActiveTab: (tab: "active" | "draft") => void;
  remainingProfileSteps: number[];
  approvalStatus: {
    approvalRequested: boolean;
    approvalRequestedAt: Date | null;
    isApproved: boolean;
    message?: string;
  };
  isSubmittingApproval: boolean;
  requestApproval: () => Promise<void>;
  isProfileInitiallyComplete: boolean;
  profileCompletionIsLoading: boolean;
  approvalStatusIsLoading: boolean;
}

export default function ProductsHeader({
  activeTab,
  setActiveTab,
  remainingProfileSteps,
  approvalStatus,
  isSubmittingApproval,
  requestApproval,
  isProfileInitiallyComplete,
  profileCompletionIsLoading,
  approvalStatusIsLoading,
}: ProductsHeaderProps) {
  const [showProfileCompletionWarning, setShowProfileCompletionWarning] =
    useState(false);

  useEffect(() => {
    // Show warning if profile is not complete and not loading
    setShowProfileCompletionWarning(
      !isProfileInitiallyComplete && !profileCompletionIsLoading
    );
  }, [isProfileInitiallyComplete, profileCompletionIsLoading]);

  const canAddProducts =
    isProfileInitiallyComplete && approvalStatus.isApproved;
  let tooltipMessage = "";
  if (!isProfileInitiallyComplete) {
    tooltipMessage = `Complete your profile to add products. ${
      remainingProfileSteps.length
    } ${remainingProfileSteps.length === 1 ? "step" : "steps"} remaining.`;
    if (remainingProfileSteps.length > 0) {
      tooltipMessage += ` (Steps: ${remainingProfileSteps.join(", ")})`;
    }
  } else if (!approvalStatus.isApproved) {
    if (!approvalStatus.approvalRequested) {
      tooltipMessage =
        "Your profile is complete. Please request approval to add products. You can do this from the banner above or your profile page.";
    } else if (approvalStatus.message?.toLowerCase().includes("rejected")) {
      tooltipMessage = `Profile approval rejected: ${
        approvalStatus.message ||
        "Please check your profile or contact support."
      }`;
    } else {
      tooltipMessage =
        "Profile approval pending. You can add products once approved.";
    }
  }

  const renderApprovalStatusSection = () => {
    if (
      profileCompletionIsLoading ||
      (isProfileInitiallyComplete && approvalStatusIsLoading)
    ) {
      return (
        <div className="bg-slate-50 p-3 sm:p-4 border-b border-slate-100">
          <div className="flex items-center text-slate-600">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span className="text-sm">Loading profile status...</span>
          </div>
        </div>
      );
    }

    if (!isProfileInitiallyComplete) return null; // This case is handled by showProfileCompletionWarning

    // Profile is complete, now show approval status
    return (
      <div
        className={`p-3 sm:p-4 border-b ${
          approvalStatus.isApproved
            ? "bg-green-50 border-green-100"
            : approvalStatus.approvalRequested &&
              approvalStatus.message?.toLowerCase().includes("rejected")
            ? "bg-red-50 border-red-100"
            : approvalStatus.approvalRequested
            ? "bg-blue-50 border-blue-100"
            : "bg-amber-50 border-amber-100" // Ready for approval
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-start sm:items-center">
            {approvalStatus.isApproved ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
            ) : approvalStatus.approvalRequested &&
              approvalStatus.message?.toLowerCase().includes("rejected") ? (
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
            ) : approvalStatus.approvalRequested ? (
              <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
            )}
            <div>
              <p
                className={`text-sm font-medium ${
                  approvalStatus.isApproved
                    ? "text-green-700"
                    : approvalStatus.approvalRequested &&
                      approvalStatus.message?.toLowerCase().includes("rejected")
                    ? "text-red-700"
                    : approvalStatus.approvalRequested
                    ? "text-blue-700"
                    : "text-amber-700"
                }`}
              >
                {approvalStatus.isApproved
                  ? "Profile Approved"
                  : approvalStatus.approvalRequested &&
                    approvalStatus.message?.toLowerCase().includes("rejected")
                  ? `Approval Rejected: ${approvalStatus.message}`
                  : approvalStatus.approvalRequested
                  ? "Approval Pending"
                  : "Profile Complete - Ready for Approval"}
              </p>
              {approvalStatus.approvalRequested &&
                !approvalStatus.isApproved &&
                approvalStatus.approvalRequestedAt &&
                !approvalStatus.message?.toLowerCase().includes("rejected") && (
                  <p className="text-xs text-blue-600 mt-1">
                    Submitted on{" "}
                    {new Date(
                      approvalStatus.approvalRequestedAt
                    ).toLocaleDateString()}
                  </p>
                )}
            </div>
          </div>

          {!approvalStatus.isApproved &&
            !approvalStatus.approvalRequested &&
            isProfileInitiallyComplete && (
              <div className="sm:ml-auto">
                <Button
                  onClick={requestApproval}
                  disabled={isSubmittingApproval}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5"
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
              </div>
            )}
          {approvalStatus.approvalRequested &&
            approvalStatus.message?.toLowerCase().includes("rejected") && (
              <div className="sm:ml-auto">
                <Link
                  href="/seller/profile" // Or a specific page for addressing rejection
                  className="text-xs sm:text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-md transition-colors"
                >
                  Review Profile
                </Link>
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="border-b">
        {profileCompletionIsLoading && (
          <div className="bg-slate-50 p-3 sm:p-4 border-b border-slate-100">
            <div className="flex items-center text-slate-600">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span className="text-sm">Loading profile status...</span>
            </div>
          </div>
        )}
        {showProfileCompletionWarning && !isProfileInitiallyComplete && (
          <div className="bg-amber-50 p-3 sm:p-4 border-b border-amber-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start sm:items-center">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-sm text-amber-700">
                    Complete your profile to start selling products
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {remainingProfileSteps.length}{" "}
                    {remainingProfileSteps.length === 1 ? "step" : "steps"}{" "}
                    remaining
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-start sm:ml-auto">
                <Link
                  href="/seller/profile"
                  className="text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-md transition-colors"
                >
                  Complete Profile
                </Link>
                <button
                  className="sm:hidden ml-2 text-amber-700"
                  onClick={() => setShowProfileCompletionWarning(false)}
                  aria-label="Dismiss warning"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {isProfileInitiallyComplete && renderApprovalStatusSection()}

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="overflow-x-auto flex-1 border-b sm:border-b-0">
            <div className="flex space-x-4 px-4 py-3 sm:py-4 min-w-max">
              <button
                className={`px-1 py-1 text-sm font-medium border-b-2 ${
                  activeTab === "active"
                    ? "text-red-500 border-red-500"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("active")}
              >
                Active Products
              </button>
              <button
                className={`px-1 py-1 text-sm font-medium border-b-2 ${
                  activeTab === "draft"
                    ? "text-red-500 border-red-500"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("draft")}
              >
                Draft Products
              </button>
            </div>
          </div>

          <div className="px-4 pb-3 sm:py-0 sm:pr-4">
            <Tooltip
              open={!canAddProducts && tooltipMessage ? undefined : false}
            >
              <TooltipTrigger asChild>
                <div className="relative">
                  {" "}
                  {/* Ensure this div takes full width or button does */}
                  <Link
                    href={canAddProducts ? "/seller/products/add-product" : "#"}
                    className={cn(
                      "flex w-full sm:w-auto items-center justify-center space-x-2 px-4 py-2 rounded-[6px] gradient-border bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]",
                      !canAddProducts && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={(e) => !canAddProducts && e.preventDefault()}
                    aria-disabled={!canAddProducts}
                  >
                    <Plus className="w-4 h-4 text-pink-500" strokeWidth={3} />
                    <span className="gradient-text font-semibold">
                      Add Product
                    </span>
                  </Link>
                </div>
              </TooltipTrigger>
              {!canAddProducts && tooltipMessage && (
                <TooltipContent
                  side="top"
                  className="bg-zinc-900 text-white p-3 max-w-[280px] sm:max-w-[320px]"
                  sideOffset={5}
                >
                  <p className="text-sm">{tooltipMessage}</p>
                  {(!isProfileInitiallyComplete ||
                    (isProfileInitiallyComplete &&
                      approvalStatus.message
                        ?.toLowerCase()
                        .includes("rejected"))) && (
                    <div className="w-full flex justify-end mt-4">
                      <Link href="/seller/profile">
                        <Button className="bg-zinc-200 hover:bg-zinc-300 text-zinc-950 h-8 px-3">
                          Go to Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
