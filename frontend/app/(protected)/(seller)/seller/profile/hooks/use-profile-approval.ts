"use client"

import { useState } from "react"
import { toast } from "sonner"
import { sellerApi } from "@/lib/api/seller"

type UseProfileApprovalProps = {
  stepsToBeCompleted: number[]
}

export const useProfileApproval = ({ stepsToBeCompleted }: UseProfileApprovalProps) => {
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState({
    approvalRequested: false,
    approvalRequestedAt: null as Date | null,
    isApproved: false,
  })

  const requestApproval = async () => {
    if (stepsToBeCompleted.length > 0) {
      toast.error("Please complete all profile steps before requesting approval")
      return
    }

    setIsSubmittingApproval(true)
    try {
      await sellerApi.reqApproval()
      setApprovalStatus((prev) => ({
        ...prev,
        approvalRequested: true,
        approvalRequestedAt: new Date(),
      }))
      toast.success("Profile submitted for approval")
    } catch (error) {
      console.error("Error requesting approval:", error)
      toast.error("Failed to submit profile for approval")
    } finally {
      setIsSubmittingApproval(false)
    }
  }

  return {
    approvalStatus,
    setApprovalStatus,
    isSubmittingApproval,
    requestApproval,
  }
}
