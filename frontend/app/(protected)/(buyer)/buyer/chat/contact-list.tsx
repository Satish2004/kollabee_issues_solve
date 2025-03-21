"use client"

import { useState } from "react"
import { Search, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Conversation } from "./types/chat"

interface ContactListProps {
  conversations: Conversation[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
  isLoading: boolean
}

export default function ContactList({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading,
}: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="w-80 border-r h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center p-4 border-b">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer",
                activeConversationId === conversation.id && "bg-gray-50",
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex-shrink-0 relative">
                <Avatar>
                  {conversation.participantAvatar ? (
                    <AvatarImage src={conversation.participantAvatar} alt={conversation.participantName} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                {conversation.isOnline && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                )}
              </div>

              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{conversation.participantName}</span>
                  {conversation.lastMessageTime && (
                    <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                  )}
                </div>

                <div className="flex items-center">
                  <p className="text-sm text-gray-500 truncate flex-1">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                  {(conversation.unreadCount || 0) > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
            <p>No conversations found</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to format time
function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}

