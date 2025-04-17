"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useToast } from "../../../hooks/use-toast"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import  Spinner  from "../../../components/ui/spinner"
import { CheckCircle } from "lucide-react"
import { chatApi } from "../../../lib/api/chat"
import type { BlockedCommunication } from "../types/chat"

export default function BlockedCommunications() {
  const [blockedCommunications, setBlockedCommunications] = useState<BlockedCommunication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchBlockedCommunications()
  }, [])

  const fetchBlockedCommunications = async () => {
    try {
      setIsLoading(true)
      const response = await chatApi.getBlockedCommunications()
      setBlockedCommunications(response.data.blockedCommunications)
    } catch (error) {
      console.error("Failed to fetch blocked communications:", error)
      toast({
        title: "Error",
        description: "Failed to load blocked communications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnblock = async (initiatorId: string, targetId: string) => {
    try {
      await chatApi.unblockCommunication({ initiatorId, targetId })
      toast({
        title: "Success",
        description: "Communication unblocked successfully",
      })
      // Refresh the list
      fetchBlockedCommunications()
    } catch (error) {
      console.error("Failed to unblock communication:", error)
      toast({
        title: "Error",
        description: "Failed to unblock communication",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Communications</CardTitle>
      </CardHeader>
      <CardContent>
        {blockedCommunications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No blocked communications found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Initiator</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Blocked On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedCommunications.map((block) => (
                <TableRow key={block.id}>
                  <TableCell>
                    <div className="font-medium">{block.initiator.name}</div>
                    <div className="text-sm text-gray-500">{block.initiator.role}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{block.target.name}</div>
                    <div className="text-sm text-gray-500">{block.target.role}</div>
                  </TableCell>
                  <TableCell>{block.reason || "No reason provided"}</TableCell>
                  <TableCell>{new Date(block.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnblock(block.initiatorId, block.targetId)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Unblock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
