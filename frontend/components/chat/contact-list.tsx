"use client";

import type { Conversation } from "./types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { chatApi } from "@/lib/api/chat";
import { cn } from "@/lib/utils";
import { Clock, Search, User } from "lucide-react";
import { useState } from "react";

interface ContactListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isLoading: boolean;
  currentUserId: string;
}

export default function ContactList({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading,
  currentUserId,
}: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle accepting a conversation request
  const handleAcceptRequest = async (
    conversationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent triggering the conversation selection

    try {
      await chatApi.acceptConversation(conversationId);

      toast({
        title: "Success",
        description: "Conversation request accepted",
      });
    } catch (error) {
      console.error("Failed to accept conversation:", error);
      toast({
        title: "Error",
        description: "Failed to accept conversation request",
        variant: "destructive",
      });
    }
  };

  // Handle declining a conversation request
  const handleDeclineRequest = async (
    conversationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent triggering the conversation selection

    try {
      await chatApi.declineConversation(conversationId);

      toast({
        title: "Success",
        description: "Conversation request declined",
      });
    } catch (error) {
      console.error("Failed to decline conversation:", error);
      toast({
        title: "Error",
        description: "Failed to decline conversation request",
        variant: "destructive",
      });
    }
  };

  // Group conversations by status (move these out of JSX)
  const pendingRequests = filteredConversations.filter(
    (conv) => conv.status === "PENDING" && conv.initiatedBy !== currentUserId
  );
  const acceptedConversations = filteredConversations.filter(
    (conv) =>
      conv.status === "ACCEPTED" ||
      (conv.status === "PENDING" && conv.initiatedBy === currentUserId)
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <Spinner size="lg" />
            <span className="mt-2 text-gray-500 text-sm">
              Loading contacts...
            </span>
          </div>
        ) : (
          <>
            {/* Group conversations by status */}
            {pendingRequests.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message Requests ({pendingRequests.length})
                </div>

                {pendingRequests.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex flex-col p-4 border-b hover:bg-gray-50 cursor-pointer",
                      activeConversationId === conversation.id && "bg-gray-50"
                    )}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 relative">
                        <Avatar>
                          {conversation.participantAvatar ? (
                            <AvatarImage
                              src={conversation.participantAvatar}
                              alt={conversation.participantName}
                            />
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
                          <span className="font-medium">
                            {conversation.participantName}
                          </span>
                          <Badge
                            variant="outline"
                            className="flex items-center text-xs text-amber-600 bg-amber-100"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>

                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 truncate flex-1">
                            {conversation.lastMessage || "New message request"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex justify-end mt-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={(e) => handleDeclineRequest(conversation.id, e)}>
                        Decline
                      </Button>
                      <Button size="sm" onClick={(e) => handleAcceptRequest(conversation.id, e)}>
                        Accept
                      </Button>
                    </div> */}
                  </div>
                ))}
              </div>
            )}

            {/* Regular Conversations Section */}
            {acceptedConversations.length > 0 ? (
              <div>
                {pendingRequests.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversations
                  </div>
                )}

                {acceptedConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer",
                      activeConversationId === conversation.id && "bg-gray-50"
                    )}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="flex-shrink-0 relative">
                      <Avatar>
                        {conversation.participantAvatar ? (
                          <AvatarImage
                            src={conversation.participantAvatar}
                            alt={conversation.participantName}
                          />
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
                        <span className="font-medium">
                          {conversation.participantName}
                        </span>
                        {conversation.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
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
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                <p>No conversations found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Helper function to format time
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}
