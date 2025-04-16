"use client"

import React from "react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Ban } from "lucide-react"

interface BlockedCommunicationNoticeProps {
  participantName: string
}

export default function BlockedCommunicationNotice({ participantName }: BlockedCommunicationNoticeProps) {
  return (
    <Alert variant="destructive" className="mx-auto max-w-md my-4">
      <Ban className="h-4 w-4" />
      <AlertTitle>Communication Blocked</AlertTitle>
      <AlertDescription>
        An administrator has blocked communication between you and {participantName}. Please contact support for more
        information.
      </AlertDescription>
    </Alert>
  )
}
