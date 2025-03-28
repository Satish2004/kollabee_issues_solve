"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile, User, Phone, CheckCheckIcon, CheckIcon, SendHorizonal, Clock, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import data from "@emoji-mart/data"
// import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Message, User as UserType, Conversation } from "./types/chat"
import Spinner from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { chatApi } from "@/lib/api/chat"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChatWindowProps {
  messages: Message[]
  activeConversationId: string | null
  onSendMessage: (content: string, attachments: File[]) => void
  currentUser: UserType | null
  isLoading: boolean
  conversation: Conversation | undefined
}

export default function ChatWindow({
  messages,
  activeConversationId,
  onSendMessage,
  currentUser,
  isLoading,
  conversation,
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim() || attachments.length > 0) {
      onSendMessage(messageInput, attachments)
      setMessageInput("")
      setAttachments([])
      setPreviewUrls([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])

      // Create preview URLs for the files
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const handleEmojiSelect = (emoji: any) => {
    setMessageInput((prev) => prev + emoji.native)
  }

  const removeAttachment = (index: number) => {
    URL.revokeObjectURL(previewUrls[index])
    setAttachments((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

   // Handle accepting a conversation request
   const handleAcceptRequest = async () => {
    if (!activeConversationId) return

    try {
      await chatApi.acceptConversation(activeConversationId)

      toast({
        title: "Success",
        description: "Conversation request accepted",
      })
    } catch (error) {
      console.error("Failed to accept conversation:", error)
      toast({
        title: "Error",
        description: "Failed to accept conversation request",
        variant: "destructive",
      })
    }
  }

  // Handle declining a conversation request
  const handleDeclineRequest = async () => {
    if (!activeConversationId) return

    try {
      await chatApi.declineConversation(activeConversationId)

      toast({
        title: "Success",
        description: "Conversation request declined",
      })
    } catch (error) {
      console.error("Failed to decline conversation:", error)
      toast({
        title: "Error",
        description: "Failed to decline conversation request",
        variant: "destructive",
      })
    }
  }

  // Check if the current user can send messages in this conversation
  const canSendMessages = () => {
    if (!conversation || !currentUser) return false

    // If conversation is accepted, anyone can send messages
    if (conversation.status === "ACCEPTED") return true

    // If conversation is pending, only the initiator can send the first message
    if (conversation.status === "PENDING" && conversation.initiatedBy === currentUser.id) return true

    return false
  }


  // Render empty state if no conversation is selected
  if (!activeConversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Conversation Selected</h3>
          <p className="text-gray-500 mb-6">Select a conversation from the list to start chatting</p>
        </div>
      </div>
    )
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Spinner size="lg" />
        <p className="mt-2 text-gray-500">Loading conversation...</p>
      </div>
    )
  }

  if (conversation?.status === "PENDING" && conversation?.initiatedBy !== currentUser?.id) {
    return (
      <div className="flex-1 flex flex-col h-full">
        {/* Conversation Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="mr-2">
              {conversation?.participantAvatar ? (
                <AvatarImage src={conversation.participantAvatar} alt={conversation?.participantName || ""} />
              ) : (
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium">{conversation?.participantName || "Chat"}</h3>
              <div className="flex items-center text-xs text-gray-500">
                {conversation?.isOnline ? (
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </span>
                ) : (
                  <span>Offline</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <Alert className="max-w-md">
              <Clock className="h-4 w-4 mr-2" />
              <AlertDescription>
                <div className="text-center">
                  <p className="font-medium mb-2">Message Request</p>
                  <p className="text-sm mb-4">
                    {conversation?.participantName} wants to start a conversation with you.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" onClick={handleDeclineRequest}>
                      Decline
                    </Button>
                    <Button onClick={handleAcceptRequest}>Accept</Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Conversation Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="mr-2">
            {conversation?.participantAvatar ? (
              <AvatarImage src={conversation.participantAvatar} alt={conversation?.participantName || ""} />
            ) : (
              <AvatarFallback className="bg-neutral-200">
                <User className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium">{conversation?.participantName || "Chat"}</h3>
            <div className="flex items-center text-xs text-gray-500">
              {conversation?.isOnline ? (
                <div className="flex items-center space-x-1 bg-green-100 px-2 rounded-xl py-0.5">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                <span className="text-green-600">Online</span>
              </div>
              ) : (
                <div className="flex items-center space-x-1 bg-neutral-100 px-2 rounded-xl py-0.5">
                  <div className="h-1.5 w-1.5 bg-neutral-500 rounded-full"></div>
                  <span className="text-neutral-500">Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <Button variant="outline" size="sm">
          <Phone className="h-4 w-4 mr-1" />
          Call
        </Button> */}
      </div>  

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <>
            {/* Group messages by date */}
            {groupMessagesByDate(messages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="text-center text-xs text-gray-500 my-2">{date}</div>

                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 flex ${message.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${message.senderId === currentUser?.id ? "order-2" : "order-1"}`}
                    >
                      <div className="flex items-end">
                        {message.senderId !== currentUser?.id && (
                          <Avatar className="w-8 h-8 rounded-full mr-2 mb-1">
                            {conversation?.participantAvatar ? (
                              <AvatarImage
                                src={conversation.participantAvatar}
                                alt={conversation?.participantName || ""}
                              />
                            ) : (
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        )}

                        <div className={`flex flex-row items-center space-x-2 rounded-2xl ${
                              message.senderId === currentUser?.id
                                ? " bg-[#ea3d4f] px-2 py-2 text-white"
                                : "bg-stone-200 px-2 py-2 text-black"
                            }`}>
                          <div
                            className={`rounded-lg`}
                          >
                            {message.content && <p className="text-sm rounded-2xl">{message.content}</p>}

                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((url, index) => {
                                  const fileExt = url.split(".").pop()?.toLowerCase()
                                  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt || "")
                                  const isVideo = ["mp4", "webm", "ogg"].includes(fileExt || "")

                                  if (isImage) {
                                    return (
                                      <div key={index} className="relative rounded-lg overflow-hidden">
                                        <img
                                          src={url || "/placeholder.svg"}
                                          alt="Attachment"
                                          className="max-w-full h-auto max-h-40 rounded-lg"
                                        />
                                      </div>
                                    )
                                  } else if (isVideo) {
                                    return (
                                      <div key={index} className="relative rounded-lg overflow-hidden">
                                        <video src={url} controls className="max-w-full h-auto max-h-40 rounded-lg" />
                                      </div>
                                    )
                                  } else {
                                    return (
                                      <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-2 bg-gray-200 rounded"
                                      >
                                        <Paperclip className="h-4 w-4 mr-2" />
                                        <span className="truncate">{url.split("/").pop() || "file"}</span>
                                      </a>
                                    )
                                  }
                                })}
                              </div>
                            )}
                          </div>

                          <div
                            className={`text-[12px]  flex items-center ${
                              message.senderId === currentUser?.id ? "justify-end text-white" : "justify-start text-stone-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                            {message.senderId === currentUser?.id && (
                              <span className="ml-1">
                                {message.status === "pending"
                                  ? "⌛"
                                  : message.status === "sent"
                                    ? <CheckIcon className="h-4 w-4 text-green-300" />
                                    : message.status === "delivered"
                                      ? <CheckCheckIcon className="h-4 w-4 text-green-300" />
                                      : <CheckCheckIcon className="h-4 w-4 text-green-300" />}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-400 text-sm">Send a message to start the conversation</p>
          </div>
        )}
      </div>

      {/* File Preview Area */}
      {attachments.length > 0 && (
        <div className="p-2 border-t border-gray-200 flex gap-2 overflow-x-auto">
          {previewUrls.map((url, index) => {
            const file = attachments[index]
            const isImage = file.type.startsWith("image/")
            const isVideo = file.type.startsWith("video/")

            return (
              <div key={index} className="relative group h-16 min-w-16 rounded overflow-hidden border">
                {isImage ? (
                  <img src={url || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                ) : isVideo ? (
                  <video src={url} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <Paperclip className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <button
                  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  onClick={() => removeAttachment(index)}
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Message Input */}
      {canSendMessages() ? (
      <div className="m-4 rounded-xl bg-gray-100 pb-3 px-3 pt-2">
        <form onSubmit={handleSubmit} className="flex flex-col items-end gap-2">
          <input type="file" ref={fileInputRef} multiple onChange={handleFileChange} className="hidden" />

          <div className="w-full relative">
          <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} className="absolute">
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 pl-10 border-none text-wrap shadow-none"
          />
          </div>

          <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="bg-white p-1 rounded-full">
                <Smile className="h-6 w-6 text-neutral-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {/* <Picker data={data} onEmojiSelect={handleEmojiSelect} /> */}
            </PopoverContent>
          </Popover>


          <Button type="submit" className="border-none shadow-none text-white bg-[#ea3d4f] ">
            Send
            <SendHorizonal className="h-5 w-5" />
          </Button>
          </div>
        </form>
      </div>
      ) : conversation?.status === "PENDING" && conversation?.initiatedBy === currentUser?.id ? (
        <div className="p-4 border-t bg-gray-50">
          <div className="text-center text-sm text-gray-500">
            <Clock className="h-4 w-4 inline mr-1" />
            Waiting for {conversation?.participantName} to accept your message request
          </div>
        </div>
      ) : (
        <div className="p-4 border-t bg-gray-50">
          <div className="text-center text-sm text-gray-500">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            You cannot send messages in this conversation
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to format time
function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Helper function to group messages by date
function groupMessagesByDate(messages: Message[]): [string, Message[]][] {
  const groups: Record<string, Message[]> = {}

  messages.forEach((message) => {
    const date = new Date(message.createdAt)
    const dateString = date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })

    if (!groups[dateString]) {
      groups[dateString] = []
    }

    groups[dateString].push(message)
  })

  return Object.entries(groups)
}

