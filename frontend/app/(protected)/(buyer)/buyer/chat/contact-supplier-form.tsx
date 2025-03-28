"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Paperclip, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { chatApi } from "@/lib/api/chat"


interface ContactSupplierFormProps {
  supplierId: string
  supplierName: string
  onSuccess?: (conversationId: string) => void
  onCancel?: () => void
}

export default function ContactSupplierForm({
  supplierId,
  supplierName,
  onSuccess,
  onCancel,
}: ContactSupplierFormProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])

      // Create preview URLs for the files
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeAttachment = (index: number) => {
    URL.revokeObjectURL(previewUrls[index])
    setAttachments((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() && attachments.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a message or attach a file",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Handle file uploads first if there are any attachments
      let uploadedFiles: string[] = []

      if (attachments.length > 0) {
        const uploadResponse = await chatApi.uploadFiles(attachments)

        if (!uploadResponse.data.fileUrls) {
          throw new Error("Failed to upload files")
        }

        uploadedFiles = uploadResponse.data.fileUrls
      }

      // Create conversation with initial message
      const response = await chatApi.createConversation({
        participantId: supplierId,
        participantType: "seller",
        initialMessage: message,
        attachments: uploadedFiles,
      })

      toast({
        title: "Success",
        description: `Message sent to ${supplierName}`,
      })

      // Clean up preview URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url))

      // Call onSuccess callback with the new conversation ID
      if (onSuccess && response.data.conversation) {
        onSuccess(response.data.conversation.id)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contact {supplierName}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder={`Write a message to ${supplierName}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            {/* File attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="flex items-center p-2 border rounded bg-gray-50">
                      <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* File input */}
            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <Paperclip className="h-4 w-4 mr-1" />
                  <span>Attach files</span>
                </div>
                <input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

