"use client";

import BlockedCommunicationNotice from "./blocked-communication-notice";
import MediaViewer from "./media-viewer";
import { useRecentEmojis } from "./recent-emojis";
import type { Message, User as UserType, Conversation } from "./types/chat";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import Spinner from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { chatApi } from "@/lib/api/chat";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Paperclip,
  Smile,
  User,
  CheckCheckIcon,
  CheckIcon,
  SendHorizonal,
  Clock,
  AlertCircle,
  Download,
  Maximize2,
  ExternalLink,
  Upload,
} from "lucide-react";
import type React from "react";
import { useState, useRef, useEffect } from "react";

interface ChatWindowProps {
  messages: Message[];
  activeConversationId: string | null;
  onSendMessage: (content: string, attachments: File[]) => void;
  currentUser: UserType | null;
  isLoading: boolean;
  conversation: Conversation | undefined;
  isBlocked?: boolean;
}

export default function ChatWindow({
  messages,
  activeConversationId,
  onSendMessage,
  currentUser,
  isLoading,
  conversation,
  isBlocked,
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { recentEmojis, addRecentEmoji } = useRecentEmojis();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrls, setViewerUrls] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() || attachments.length > 0) {
      onSendMessage(messageInput, attachments);
      setMessageInput("");
      setAttachments([]);
      setPreviewUrls([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);

      // Create preview URLs for the files
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    // Handle both emoji-mart objects and direct emoji strings
    const emojiChar = typeof emoji === "string" ? emoji : emoji.native;
    setMessageInput((prev) => prev + emojiChar);
    addRecentEmoji(emojiChar);
  };

  const removeAttachment = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const openMediaViewer = (urls: string[], index: number) => {
    setViewerUrls(urls);
    setViewerIndex(index);
    setViewerOpen(true);
  };

  // Handle accepting a conversation request
  const handleAcceptRequest = async () => {
    if (!activeConversationId) return;

    try {
      await chatApi.acceptConversation(activeConversationId);

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
  const handleDeclineRequest = async () => {
    if (!activeConversationId) return;

    try {
      await chatApi.declineConversation(activeConversationId);

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

  // Check if the current user can send messages in this conversation
  const canSendMessages = () => {
    if (!conversation || !currentUser || isBlocked) return false;

    // If conversation is accepted, anyone can send messages
    if (conversation.status === "ACCEPTED") return true;

    // If conversation is pending, only the initiator can send the first message
    if (
      conversation.status === "PENDING" &&
      conversation.initiatedBy === currentUser.id
    )
      return true;

    return false;
  };

  // Render empty state if no conversation is selected
  if (!activeConversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Conversation Selected
          </h3>
          <p className="text-gray-500 mb-6">
            Select a conversation from the list to start chatting
          </p>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-white max-h-[calc(100dvh-150px)] h-[calc(100dvh-150px)] overflow-hidden">
        {/* Conversation Header Skeleton */}
        <div className="p-4 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`flex ${
                  i % 2 === 0 ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-xs w-40 bg-gray-100 rounded-lg p-3 animate-pulse">
                  <div className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
        </div>
        {/* Input Skeleton */}
        <div className="p-4 border-t bg-gray-50">
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-full" />
        </div>
      </div>
    );
  }

  // Render blocked communication notice
  if (isBlocked && conversation) {
    return (
      <div className="flex-1 flex flex-col h-[480px] bg-white">
        {/* Conversation Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="mr-2">
              {conversation?.participantAvatar ? (
                <AvatarImage
                  src={conversation.participantAvatar || "/placeholder.svg"}
                  alt={conversation?.participantName || ""}
                />
              ) : (
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium">
                {conversation?.participantName || "Chat"}
              </h3>
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

        {/* Blocked Notice */}
        <div className="flex-1 flex items-center justify-center">
          <BlockedCommunicationNotice
            participantName={conversation.participantName}
          />
        </div>
      </div>
    );
  }

  if (
    conversation?.status === "PENDING" &&
    conversation?.initiatedBy !== currentUser?.id
  ) {
    return (
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Conversation Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="mr-2">
              {conversation?.participantAvatar ? (
                <AvatarImage
                  src={conversation.participantAvatar || "/placeholder.svg"}
                  alt={conversation?.participantName || ""}
                />
              ) : (
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium">
                {conversation?.participantName || "Chat"}
              </h3>
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
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-180px)]">
          {messages.length > 0 ? (
            <>
              {/* Group messages by date */}
              {groupMessagesByDate(messages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="text-center text-xs text-gray-500 my-2">
                    {date}
                  </div>

                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.senderId === currentUser?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${
                          message.senderId === currentUser?.id
                            ? "order-2"
                            : "order-1"
                        }`}
                      >
                        <div className="flex items-end">
                          {message.senderId !== currentUser?.id && (
                            <Avatar className="w-6 h-6 rounded-full mr-2 mb-1">
                              {conversation?.participantAvatar ? (
                                <AvatarImage
                                  src={
                                    conversation.participantAvatar ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={conversation?.participantName || ""}
                                />
                              ) : (
                                <AvatarFallback>
                                  <User className="h-4 w-4" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                          )}

                          <div>
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                message.senderId === currentUser?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-gray-100"
                              }`}
                            >
                              {message.content && <p>{message.content}</p>}

                              {message.attachments &&
                                message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    {message.attachments.map((url, index) => {
                                      const fileExt = url
                                        .split(".")
                                        .pop()
                                        ?.toLowerCase();
                                      const isImage = [
                                        "jpg",
                                        "jpeg",
                                        "png",
                                        "gif",
                                        "webp",
                                      ].includes(fileExt || "");
                                      const isVideo = [
                                        "mp4",
                                        "webm",
                                        "ogg",
                                      ].includes(fileExt || "");

                                      // Check if this attachment is still uploading
                                      const isUploading =
                                        message.uploadProgress &&
                                        message.uploadProgress[url] !==
                                          undefined &&
                                        message.uploadProgress[url] < 100;
                                      const uploadProgress =
                                        message.uploadProgress?.[url] || 0;

                                      if (isImage) {
                                        return (
                                          <div
                                            key={index}
                                            className="relative rounded-lg overflow-hidden group"
                                          >
                                            <img
                                              src={url || "/placeholder.svg"}
                                              alt="Attachment"
                                              className="max-w-full h-auto max-h-40 rounded-lg cursor-pointer"
                                              onClick={() =>
                                                !isUploading &&
                                                openMediaViewer(
                                                  message.attachments,
                                                  index
                                                )
                                              }
                                            />
                                            {isUploading && (
                                              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                                                <Upload className="h-6 w-6 text-white mb-2" />
                                                <div className="w-3/4">
                                                  <Progress
                                                    value={uploadProgress}
                                                    className="h-2"
                                                  />
                                                </div>
                                                <p className="text-white text-xs mt-1">
                                                  {Math.round(uploadProgress)}%
                                                </p>
                                              </div>
                                            )}
                                            {!isUploading && (
                                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <Button
                                                  size="icon"
                                                  variant="secondary"
                                                  className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(url, "_blank");
                                                  }}
                                                >
                                                  <Maximize2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  size="icon"
                                                  variant="secondary"
                                                  className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const downloadFile =
                                                      async () => {
                                                        try {
                                                          const response =
                                                            await fetch(url);
                                                          if (!response.ok)
                                                            throw new Error(
                                                              "Download failed"
                                                            );
                                                          const blob =
                                                            await response.blob();
                                                          const blobUrl =
                                                            URL.createObjectURL(
                                                              blob
                                                            );
                                                          const a =
                                                            document.createElement(
                                                              "a"
                                                            );
                                                          a.href = blobUrl;
                                                          a.download =
                                                            url
                                                              .split("/")
                                                              .pop() || "image";
                                                          document.body.appendChild(
                                                            a
                                                          );
                                                          a.click();
                                                          document.body.removeChild(
                                                            a
                                                          );
                                                          setTimeout(
                                                            () =>
                                                              URL.revokeObjectURL(
                                                                blobUrl
                                                              ),
                                                            100
                                                          );
                                                        } catch (error) {
                                                          console.error(
                                                            "Download error:",
                                                            error
                                                          );
                                                          toast({
                                                            title:
                                                              "Download failed",
                                                            description:
                                                              "Failed to download image",
                                                            variant:
                                                              "destructive",
                                                          });
                                                        }
                                                      };
                                                    downloadFile();
                                                  }}
                                                >
                                                  <Download className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      } else if (isVideo) {
                                        return (
                                          <div
                                            key={index}
                                            className="relative rounded-lg overflow-hidden group"
                                          >
                                            <video
                                              src={url}
                                              controls={!isUploading}
                                              className="max-w-full h-auto max-h-40 rounded-lg cursor-pointer"
                                              onClick={() =>
                                                !isUploading &&
                                                openMediaViewer(
                                                  message.attachments,
                                                  index
                                                )
                                              }
                                            />
                                            {isUploading && (
                                              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                                                <Upload className="h-6 w-6 text-white mb-2" />
                                                <div className="w-3/4">
                                                  <Progress
                                                    value={uploadProgress}
                                                    className="h-2"
                                                  />
                                                </div>
                                                <p className="text-white text-xs mt-1">
                                                  {Math.round(uploadProgress)}%
                                                </p>
                                              </div>
                                            )}
                                            {!isUploading && (
                                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                <Button
                                                  size="icon"
                                                  variant="secondary"
                                                  className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(url, "_blank");
                                                  }}
                                                >
                                                  <Maximize2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  size="icon"
                                                  variant="secondary"
                                                  className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const downloadFile =
                                                      async () => {
                                                        try {
                                                          const response =
                                                            await fetch(url);
                                                          if (!response.ok)
                                                            throw new Error(
                                                              "Download failed"
                                                            );
                                                          const blob =
                                                            await response.blob();
                                                          const blobUrl =
                                                            URL.createObjectURL(
                                                              blob
                                                            );
                                                          const a =
                                                            document.createElement(
                                                              "a"
                                                            );
                                                          a.href = blobUrl;
                                                          a.download =
                                                            url
                                                              .split("/")
                                                              .pop() || "video";
                                                          document.body.appendChild(
                                                            a
                                                          );
                                                          a.click();
                                                          document.body.removeChild(
                                                            a
                                                          );
                                                          setTimeout(
                                                            () =>
                                                              URL.revokeObjectURL(
                                                                blobUrl
                                                              ),
                                                            100
                                                          );
                                                        } catch (error) {
                                                          console.error(
                                                            "Download error:",
                                                            error
                                                          );
                                                          toast({
                                                            title:
                                                              "Download failed",
                                                            description:
                                                              "Failed to download video",
                                                            variant:
                                                              "destructive",
                                                          });
                                                        }
                                                      };
                                                    downloadFile();
                                                  }}
                                                >
                                                  <Download className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center p-2 bg-gray-200 rounded group"
                                          >
                                            <Paperclip className="h-4 w-4 mr-2" />
                                            <span className="truncate flex-1">
                                              {url.split("/").pop() || "file"}
                                            </span>
                                            {isUploading ? (
                                              <div className="flex items-center gap-2">
                                                <div className="w-16">
                                                  <Progress
                                                    value={uploadProgress}
                                                    className="h-2"
                                                  />
                                                </div>
                                                <span className="text-xs">
                                                  {Math.round(uploadProgress)}%
                                                </span>
                                              </div>
                                            ) : (
                                              <div className="flex gap-1 ml-2">
                                                <Button
                                                  size="icon"
                                                  variant="ghost"
                                                  className="h-6 w-6 hover:bg-gray-300"
                                                  onClick={() =>
                                                    window.open(url, "_blank")
                                                  }
                                                >
                                                  <ExternalLink className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                  size="icon"
                                                  variant="ghost"
                                                  className="h-6 w-6 hover:bg-gray-300"
                                                  onClick={() => {
                                                    const downloadFile =
                                                      async () => {
                                                        try {
                                                          const response =
                                                            await fetch(url);
                                                          if (!response.ok)
                                                            throw new Error(
                                                              "Download failed"
                                                            );
                                                          const blob =
                                                            await response.blob();
                                                          const blobUrl =
                                                            URL.createObjectURL(
                                                              blob
                                                            );
                                                          const a =
                                                            document.createElement(
                                                              "a"
                                                            );
                                                          a.href = blobUrl;
                                                          a.download =
                                                            url
                                                              .split("/")
                                                              .pop() || "file";
                                                          document.body.appendChild(
                                                            a
                                                          );
                                                          a.click();
                                                          document.body.removeChild(
                                                            a
                                                          );
                                                          setTimeout(
                                                            () =>
                                                              URL.revokeObjectURL(
                                                                blobUrl
                                                              ),
                                                            100
                                                          );
                                                        } catch (error) {
                                                          console.error(
                                                            "Download error:",
                                                            error
                                                          );
                                                          toast({
                                                            title:
                                                              "Download failed",
                                                            description:
                                                              "Failed to download file",
                                                            variant:
                                                              "destructive",
                                                          });
                                                        }
                                                      };
                                                    downloadFile();
                                                  }}
                                                >
                                                  <Download className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      }
                                    })}
                                  </div>
                                )}
                            </div>

                            <div
                              className={`text-xs text-gray-500 mt-1 flex items-center ${
                                message.senderId === currentUser?.id
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                              {message.senderId === currentUser?.id && (
                                <span className="ml-1">
                                  {message.status === "pending"
                                    ? "⌛"
                                    : message.status === "sent"
                                    ? "✓"
                                    : message.status === "delivered"
                                    ? "✓✓"
                                    : "✓✓"}
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
              <p className="text-gray-500">No messages in this request</p>
            </div>
          )}

          {/* Message Request Action Buttons */}
          <div className="mt-4">
            <Alert className="max-w-md mx-auto">
              <Clock className="h-4 w-4 mr-2" />
              <AlertDescription>
                <div className="text-center">
                  <p className="font-medium mb-2">Message Request</p>
                  <p className="text-sm mb-4">
                    {conversation?.participantName} wants to start a
                    conversation with you.
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
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white max-h-[calc(100dvh-150px)] h-full">
      {/* Conversation Header */}
      <div className="p-4 border-b flex justify-between items-center sticky top-0 z-10 bg-white">
        <div className="flex items-center">
          <Avatar className="mr-2">
            {conversation?.participantAvatar ? (
              <AvatarImage
                src={conversation.participantAvatar || "/placeholder.svg"}
                alt={conversation?.participantName || ""}
              />
            ) : (
              <AvatarFallback className="bg-neutral-200">
                <User className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium">
              {conversation?.participantName || "Chat"}
            </h3>
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
      <div className="flex-1 overflow-y-auto p-4 pt-10">
        {/* ↑↑↑ Add pt-8 for top padding to prevent overlap with sticky header */}
        {messages.length > 0 ? (
          <>
            {/* Group messages by date */}
            {groupMessagesByDate(messages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="text-center text-xs text-gray-500 my-2">
                  {date}
                </div>

                {dateMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2 flex ${
                      message.senderId === currentUser?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md ${
                        message.senderId === currentUser?.id
                          ? "order-2"
                          : "order-1"
                      }`}
                    >
                      <div className="flex items-end">
                        {message.senderId !== currentUser?.id && (
                          <Avatar className="w-8 h-8 rounded-full mr-2 mb-1">
                            {conversation?.participantAvatar ? (
                              <AvatarImage
                                src={
                                  conversation.participantAvatar ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg" ||
                                  "/placeholder.svg"
                                }
                                alt={conversation?.participantName || ""}
                              />
                            ) : (
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                        )}

                        <div
                          className={`flex flex-row items-center space-x-2 rounded-2xl ${
                            message.senderId === currentUser?.id
                              ? " bg-[#ea3d4f] px-2 py-2 text-white"
                              : "bg-stone-200 px-2 py-2 text-black"
                          }`}
                        >
                          <div className={`rounded-lg`}>
                            {message.content && (
                              <p className="text-sm rounded-2xl">
                                {message.content}
                              </p>
                            )}

                            {message.attachments &&
                              message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map((url, index) => {
                                    const fileExt = url
                                      .split(".")
                                      .pop()
                                      ?.toLowerCase();
                                    const isImage = [
                                      "jpg",
                                      "jpeg",
                                      "png",
                                      "gif",
                                      "webp",
                                    ].includes(fileExt || "");
                                    const isVideo = [
                                      "mp4",
                                      "webm",
                                      "ogg",
                                    ].includes(fileExt || "");

                                    // Check if this attachment is still uploading
                                    const isUploading =
                                      message.uploadProgress &&
                                      message.uploadProgress[url] !==
                                        undefined &&
                                      message.uploadProgress[url] < 100;
                                    const uploadProgress =
                                      message.uploadProgress?.[url] || 0;

                                    if (isImage) {
                                      return (
                                        <div
                                          key={index}
                                          className="relative rounded-lg overflow-hidden group"
                                        >
                                          <img
                                            src={url || "/placeholder.svg"}
                                            alt="Attachment"
                                            className="max-w-full h-auto max-h-40 rounded-lg cursor-pointer"
                                            onClick={() =>
                                              !isUploading &&
                                              openMediaViewer(
                                                message.attachments,
                                                index
                                              )
                                            }
                                          />
                                          {isUploading && (
                                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                                              <Upload className="h-6 w-6 text-white mb-2" />
                                              <div className="w-3/4">
                                                <Progress
                                                  value={uploadProgress}
                                                  className="h-2"
                                                />
                                              </div>
                                              <p className="text-white text-xs mt-1">
                                                {Math.round(uploadProgress)}%
                                              </p>
                                            </div>
                                          )}
                                          {!isUploading && (
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                              <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  window.open(url, "_blank");
                                                }}
                                              >
                                                <Maximize2 className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const downloadFile =
                                                    async () => {
                                                      try {
                                                        const response =
                                                          await fetch(url);
                                                        if (!response.ok)
                                                          throw new Error(
                                                            "Download failed"
                                                          );
                                                        const blob =
                                                          await response.blob();
                                                        const blobUrl =
                                                          URL.createObjectURL(
                                                            blob
                                                          );
                                                        const a =
                                                          document.createElement(
                                                            "a"
                                                          );
                                                        a.href = blobUrl;
                                                        a.download =
                                                          url
                                                            .split("/")
                                                            .pop() || "image";
                                                        document.body.appendChild(
                                                          a
                                                        );
                                                        a.click();
                                                        document.body.removeChild(
                                                          a
                                                        );
                                                        setTimeout(
                                                          () =>
                                                            URL.revokeObjectURL(
                                                              blobUrl
                                                            ),
                                                          100
                                                        );
                                                      } catch (error) {
                                                        console.error(
                                                          "Download error:",
                                                          error
                                                        );
                                                        toast({
                                                          title:
                                                            "Download failed",
                                                          description:
                                                            "Failed to download image",
                                                          variant:
                                                            "destructive",
                                                        });
                                                      }
                                                    };
                                                  downloadFile();
                                                }}
                                              >
                                                <Download className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    } else if (isVideo) {
                                      return (
                                        <div
                                          key={index}
                                          className="relative rounded-lg overflow-hidden group"
                                        >
                                          <video
                                            src={url}
                                            controls={!isUploading}
                                            className="max-w-full h-auto max-h-40 rounded-lg cursor-pointer"
                                            onClick={() =>
                                              !isUploading &&
                                              openMediaViewer(
                                                message.attachments,
                                                index
                                              )
                                            }
                                          />
                                          {isUploading && (
                                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                                              <Upload className="h-6 w-6 text-white mb-2" />
                                              <div className="w-3/4">
                                                <Progress
                                                  value={uploadProgress}
                                                  className="h-2"
                                                />
                                              </div>
                                              <p className="text-white text-xs mt-1">
                                                {Math.round(uploadProgress)}%
                                              </p>
                                            </div>
                                          )}
                                          {!isUploading && (
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                              <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  window.open(url, "_blank");
                                                }}
                                              >
                                                <Maximize2 className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const downloadFile =
                                                    async () => {
                                                      try {
                                                        const response =
                                                          await fetch(url);
                                                        if (!response.ok)
                                                          throw new Error(
                                                            "Download failed"
                                                          );
                                                        const blob =
                                                          await response.blob();
                                                        const blobUrl =
                                                          URL.createObjectURL(
                                                            blob
                                                          );
                                                        const a =
                                                          document.createElement(
                                                            "a"
                                                          );
                                                        a.href = blobUrl;
                                                        a.download =
                                                          url
                                                            .split("/")
                                                            .pop() || "video";
                                                        document.body.appendChild(
                                                          a
                                                        );
                                                        a.click();
                                                        document.body.removeChild(
                                                          a
                                                        );
                                                        setTimeout(
                                                          () =>
                                                            URL.revokeObjectURL(
                                                              blobUrl
                                                            ),
                                                          100
                                                        );
                                                      } catch (error) {
                                                        console.error(
                                                          "Download error:",
                                                          error
                                                        );
                                                        toast({
                                                          title:
                                                            "Download failed",
                                                          description:
                                                            "Failed to download video",
                                                          variant:
                                                            "destructive",
                                                        });
                                                      }
                                                    };
                                                  downloadFile();
                                                }}
                                              >
                                                <Download className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    } else {
                                      return (
                                        <div
                                          key={index}
                                          className="flex items-center p-2 bg-gray-200 rounded group"
                                        >
                                          <Paperclip className="h-4 w-4 mr-2" />
                                          <span className="truncate flex-1">
                                            {url.split("/").pop() || "file"}
                                          </span>
                                          {isUploading ? (
                                            <div className="flex items-center gap-2">
                                              <div className="w-16">
                                                <Progress
                                                  value={uploadProgress}
                                                  className="h-2"
                                                />
                                              </div>
                                              <span className="text-xs">
                                                {Math.round(uploadProgress)}%
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="flex gap-1 ml-2">
                                              <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 hover:bg-gray-300"
                                                onClick={() =>
                                                  window.open(url, "_blank")
                                                }
                                              >
                                                <ExternalLink className="h-3 w-3" />
                                              </Button>
                                              <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 hover:bg-gray-300"
                                                onClick={() => {
                                                  const downloadFile =
                                                    async () => {
                                                      try {
                                                        const response =
                                                          await fetch(url);
                                                        if (!response.ok)
                                                          throw new Error(
                                                            "Download failed"
                                                          );
                                                        const blob =
                                                          await response.blob();
                                                        const blobUrl =
                                                          URL.createObjectURL(
                                                            blob
                                                          );
                                                        const a =
                                                          document.createElement(
                                                            "a"
                                                          );
                                                        a.href = blobUrl;
                                                        a.download =
                                                          url
                                                            .split("/")
                                                            .pop() || "file";
                                                        document.body.appendChild(
                                                          a
                                                        );
                                                        a.click();
                                                        document.body.removeChild(
                                                          a
                                                        );
                                                        setTimeout(
                                                          () =>
                                                            URL.revokeObjectURL(
                                                              blobUrl
                                                            ),
                                                          100
                                                        );
                                                      } catch (error) {
                                                        console.error(
                                                          "Download error:",
                                                          error
                                                        );
                                                        toast({
                                                          title:
                                                            "Download failed",
                                                          description:
                                                            "Failed to download file",
                                                          variant:
                                                            "destructive",
                                                        });
                                                      }
                                                    };
                                                  downloadFile();
                                                }}
                                              >
                                                <Download className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              )}
                          </div>

                          <div
                            className={`text-[12px]  flex items-center ${
                              message.senderId === currentUser?.id
                                ? "justify-end text-white"
                                : "justify-start text-stone-500"
                            }`}
                          >
                            {formatTime(message.createdAt)}
                            {message.senderId === currentUser?.id && (
                              <span className="ml-1">
                                {message.status === "pending" ? (
                                  "⌛"
                                ) : message.status === "sent" ? (
                                  <CheckIcon className="h-4 w-4 text-green-300" />
                                ) : message.status === "delivered" ? (
                                  <CheckCheckIcon className="h-4 w-4 text-green-300" />
                                ) : (
                                  <CheckCheckIcon className="h-4 w-4 text-green-300" />
                                )}
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
            <p className="text-gray-400 text-sm">
              Send a message to start the conversation
            </p>
          </div>
        )}
      </div>

      {/* File Preview Area */}
      {attachments.length > 0 && (
        <div className="p-2 border-t border-gray-200 flex gap-2 overflow-x-auto sticky bottom-20 bg-white z-10 max-w-full">
          {previewUrls.map((url, index) => {
            const file = attachments[index];
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");

            return (
              <div
                key={index}
                className="relative group h-16 min-w-16 rounded overflow-hidden border"
              >
                {isImage ? (
                  <img
                    src={url || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
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
            );
          })}
        </div>
      )}

      {/* Message Input */}
      {canSendMessages() ? (
        <div className="m-4 rounded-xl bg-gray-100 pb-3 px-3 pt-2 sticky bottom-0 z-20 max-w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-end gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-full relative">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="absolute"
              >
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
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="bg-white p-1 rounded-full"
                  >
                    <Smile className="h-6 w-6 text-neutral-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Tabs defaultValue="all">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="full">All</TabsTrigger>
                    </TabsList>

                    <TabsContent value="full">
                      <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                    </TabsContent>
                  </Tabs>
                </PopoverContent>
              </Popover>

              <Button
                type="submit"
                className="border-none shadow-none text-white bg-[#ea3d4f] hover:bg-[#ea3d4f]/90"
              >
                Send
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      ) : conversation?.status === "PENDING" &&
        conversation?.initiatedBy === currentUser?.id ? (
        <div className="p-4 border-t bg-gray-50 sticky bottom-0 z-20 max-w-full">
          <div className="text-center text-sm text-gray-500">
            <Clock className="h-4 w-4 inline mr-1" />
            Waiting for {conversation?.participantName} to accept your message
            request
          </div>
        </div>
      ) : (
        <div className="p-4 border-t bg-gray-50 sticky bottom-0 z-20 max-w-full">
          <div className="text-center text-sm text-gray-500">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            You cannot send messages in this conversation
          </div>
        </div>
      )}
      {/* Media Viewer */}
      <MediaViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        mediaUrls={viewerUrls}
        initialIndex={viewerIndex}
      />
    </div>
  );
}

// Helper function to format time
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Helper function to group messages by date
function groupMessagesByDate(messages: Message[]): [string, Message[]][] {
  const groups: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt);
    const dateString = date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    if (!groups[dateString]) {
      groups[dateString] = [];
    }

    groups[dateString].push(message);
  });

  return Object.entries(groups);
}
