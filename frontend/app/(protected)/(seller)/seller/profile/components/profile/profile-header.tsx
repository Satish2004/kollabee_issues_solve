"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react"

type ProfileHeaderProps = {
  profileData: any
  isLoading: boolean
  stepsToBeCompleted: number[]
  approvalStatus: {
    approvalRequested: boolean
    approvalRequestedAt: Date | null
    isApproved: boolean
  }
  isSubmittingApproval: boolean
  requestApproval: () => Promise<void>
  getPendingStepNames: () => string[]
}

export const ProfileHeader = ({
  profileData,
  isLoading,
  stepsToBeCompleted,
  approvalStatus,
  isSubmittingApproval,
  requestApproval,
  getPendingStepNames,
}: ProfileHeaderProps) => {
  return (
    <div className="bg-white mb-8 rounded-lg shadow-sm border">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <div className="mr-4 bg-[#a11770]/10 p-3 rounded-full">
            <span className="text-xl font-semibold text-[#a11770]">
              {profileData?.name?.charAt(0) || profileData?.email?.charAt(0) || "P"}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Profile</h1>
            <p className="text-sm text-gray-500">{profileData?.name || profileData?.email}</p>
          </div>
        </div>

        {/* Approval status section */}
        <div>
          {isLoading ? (
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md">
              <Loader2 className="h-5 w-5 animate-spin text-[#a11770] mr-2" />
              <span className="text-sm">Loading profile status...</span>
            </div>
          ) : stepsToBeCompleted.length > 0 ? (
            <div className="flex flex-col">
              <div className="flex items-center text-amber-600 mb-2">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="font-medium">{stepsToBeCompleted.length} steps remaining to complete</span>
              </div>
              <div className="text-sm text-gray-600 ml-7">
                <span>Pending: </span>
                {getPendingStepNames()
                  .slice(0, 3)
                  .map((stepName, index) => (
                    <span
                      key={index}
                      className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded mr-1 mb-1"
                    >
                      {stepName}
                    </span>
                  ))}
                {stepsToBeCompleted.length > 3 && (
                  <span className="inline-block bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    +{stepsToBeCompleted.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ) : approvalStatus.isApproved ? (
            <div className="flex items-center bg-green-50 text-green-700 px-4 py-3 rounded-md border border-green-200">
              <CheckCircle className="h-5 w-5 mr-2" />
              <div>
                <span className="font-medium">Approved by admin</span>
                <p className="text-xs text-green-600">Your profile is now visible to potential clients</p>
              </div>
            </div>
          ) : approvalStatus.approvalRequested ? (
            <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-3 rounded-md border border-blue-200">
              <Clock className="h-5 w-5 mr-2" />
              <div>
                <span className="font-medium">Pending approval</span>
                <p className="text-xs text-blue-600">
                  Submitted{" "}
                  {approvalStatus.approvalRequestedAt
                    ? new Date(approvalStatus.approvalRequestedAt).toLocaleDateString()
                    : "recently"}
                </p>
              </div>
            </div>
          ) : (
            <Button
              onClick={requestApproval}
              disabled={isSubmittingApproval || stepsToBeCompleted.length > 0}
              className="bg-[#a11770] text-white hover:bg-[#a11770]/70 px-6 py-2 h-auto"
            >
              {isSubmittingApproval ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar for profile completion */}
      {!approvalStatus.isApproved && (
        <div className="w-full bg-gray-200 h-1">
          <div
            className="bg-[#a11770] h-1 transition-all duration-500"
            style={{
              width: `${Math.round(((11 - stepsToBeCompleted.length) / 11) * 100)}%`,
            }}
          ></div>
        </div>
      )}
    </div>
  )
}
