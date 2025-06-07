"use client"

import React from "react"

import { useState } from "react"
import { useToast } from "../../../hooks/use-toast"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { chatApi } from "../../../lib/api/chat"
import type { User } from "../types/chat"

interface BlockCommunicationFormProps {
  buyers: User[]
  sellers: User[]
  onSuccess?: () => void
}

export default function BlockCommunicationForm({ buyers, sellers, onSuccess }: BlockCommunicationFormProps) {
  const [initiatorId, setInitiatorId] = useState("")
  const [targetId, setTargetId] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!initiatorId || !targetId) {
      toast({
        title: "Error",
        description: "Please select both users",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await chatApi.blockCommunication({
        initiatorId,
        targetId,
        reason,
      })

      toast({
        title: "Success",
        description: "Communication blocked successfully",
      })

      // Reset form
      setInitiatorId("")
      setTargetId("")
      setReason("")

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Failed to block communication:", error)
      toast({
        title: "Error",
        description: "Failed to block communication",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Block Communication</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initiator">Buyer</Label>
            <Select value={initiatorId} onValueChange={setInitiatorId}>
              <SelectTrigger id="initiator">
                <SelectValue placeholder="Select a buyer" />
              </SelectTrigger>
              <SelectContent className="bg-white ">
                <SelectGroup>
                  <SelectLabel>Buyers</SelectLabel>
                  {buyers.map((buyer) => (
                    <SelectItem key={buyer.id} value={buyer.id}>
                      {buyer.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Seller</Label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger id="target">
                <SelectValue placeholder="Select a seller" />
              </SelectTrigger>
              <SelectContent className="bg-white ">
                <SelectGroup>
                  <SelectLabel>Sellers</SelectLabel>
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for blocking communication"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="button-bg text-white font-semibold">
            {isSubmitting ? "Blocking..." : "Block Communication"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
