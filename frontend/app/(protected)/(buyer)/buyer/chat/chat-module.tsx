"use client"

import { useState, useEffect, useRef } from "react"
import { io, type Socket } from "socket.io-client"
import type { Message, Conversation } from "./types/chat"
import ChatWindow from "./chat-window"
import ContactList from "./contact-list"
import { authApi } from "@/lib/api/auth"
import { chatApi } from "@/lib/api/chat"
import { useToast } from "@/hooks/use-toast"



export default function ChatModule() {
    const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer")
    const [activeConversation, setActiveConversation] = useState<string | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const socketRef = useRef<Socket | null>(null)
    const { toast } = useToast()
    const [user, setUser] = useState<any>(null);
    const tempMessageIdRef = useRef<string | null>(null);


        useEffect(() => {
        const fetchUser = async () => {
            const response:any = await authApi.getCurrentUser();
            setUser(response);
        };
        fetchUser();
        }, []);

    
    useEffect(() => {
        // Initialize socket connection
        const socket = io("http://localhost:2000", {
        withCredentials: true,
        })
    
        socketRef.current = socket
    
        // Setup socket event listeners
        socket.on("connect", () => {
        console.log("Socket connected")

              // Identify the user to the server (without authentication)
      if (user?.id) {
        socket.emit("identify", { userId: user.id })
      }
    
        // Fetch conversations after socket connection is established
        fetchConversations()
        })
    
        socket.on("disconnect", () => {
        console.log("Socket disconnected")
        })
    
        socket.on("new_message", (message: Message) => {
        // Add new message to state if it belongs to the active conversation
        if (message.conversationId === activeConversation) {
            setMessages((prev) => [...prev, message])

            console.log
        if(tempMessageId) {
            console.log("Mila Mila", messages.find(msg => msg.id === tempMessageId))

            setMessages((prev) => prev.filter(msg => msg.id !== tempMessageId))
        }
        }

    
        // Update last message in conversation list
        setConversations((prev) =>
            prev.map((conv) =>
            conv.id === message.conversationId
                ? {
                    ...conv,
                    lastMessage: message.content,
                    lastMessageTime: message.createdAt,
                    unreadCount: conv.id === activeConversation ? 0 : (conv.unreadCount || 0) + 1,
                }
                : conv,
            ),
        )
    
        // Show toast for new message if conversation is not active
        if (message.conversationId !== activeConversation) {
            toast({
            title: `New message from ${message.senderName}`,
            description: message.content.length > 30 ? `${message.content.substring(0, 30)}...` : message.content,
            })
        }
        })
    
        socket.on("user_status_change", ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        // Update online status in conversations list
        setConversations((prev) => prev.map((conv) => (conv.participantId === userId ? { ...conv, isOnline } : conv)))
        })
    
        // Clean up on unmount
        return () => {
        if (socketRef.current) {
            socketRef.current.disconnect()
        }
        }
    }, [activeConversation, toast, user])
    
    // Fetch conversations from API
    const fetchConversations = async () => {
        try {
        const userType = "buyer"
        const response = await chatApi.getConversations(userType as "buyer" | "seller")
    
        if (response) {
            setConversations(response?.conversations)
        }
        setIsLoading(false)
        } catch (error) {
        console.error("Failed to fetch conversations:", error)
        toast({
            title: "Error",
            description: "Failed to load conversations",
            variant: "destructive",
        })
        setIsLoading(false)
        }
    }
    
    // Fetch messages for a conversation
    const fetchMessages = async (conversationId: string) => {
        try {
        setIsLoading(true)
        const response = await chatApi.getMessages(conversationId)
            console.log("Message", response.messages)
        if (response) {
            setMessages(response.messages)
        }
    
        // Mark conversation as read
        if (socketRef.current) {
            socketRef.current.emit("mark_as_read", { conversationId })
        }
    
        // Update conversation unread count
        setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
    
        setIsLoading(false)
        } catch (error) {
        console.error("Failed to fetch messages:", error)
        toast({
            title: "Error",
            description: "Failed to load messages",
            variant: "destructive",
        })
        setIsLoading(false)
        }
    }
    
    // Send a message
    const sendMessage = async (content: string, attachments: File[] = []) => {
        if (!activeConversation || !socketRef.current || (!content.trim() && attachments.length === 0)) return
    
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
    
        // Prepare message data
        const newMessage: Partial<Message> = {
            conversationId: activeConversation,
            content: content.trim(),
            senderId: user?.id || "",
            senderName: user?.name || "User",
            senderType: user?.role || "buyer",
            attachments: uploadedFiles,
            createdAt: new Date().toISOString(),
        }
    
        // Send message via socket
        socketRef.current.emit("send_message", newMessage)
    
        // Optimistically add to UI
        const tempId = `temp-${Date.now()}`
        const tempMessage: Message = {
            id: tempId,
            ...(newMessage as any),
            status: "pending",
        }
        setTempMessageId(tempId)
        setMessages((prev) => [...prev, tempMessage])
        } catch (error) {
        console.error("Failed to send message:", error)
        toast({
            title: "Error",
            description: "Failed to send message",
            variant: "destructive",
        })
        }
    }
    
    // Handle conversation change
    const handleConversationChange = (conversationId: string) => {
        setActiveConversation(conversationId)
        fetchMessages(conversationId)
    }
    
    // Create new conversation
    const createConversation = async (participantId: string, participantType: "buyer" | "seller") => {
        try {
        const response = await chatApi.createConversation({
            participantId,
            participantType,
        })
    
        if (!response.data.conversation) {
            throw new Error("Failed to create conversation")
        }
    
        // Add new conversation to state and set it as active
        setConversations((prev) => [response.data.conversation, ...prev])
        setActiveConversation(response.data.conversation.id)
        setMessages([])
        } catch (error) {
        console.error("Failed to create conversation:", error)
        toast({
            title: "Error",
            description: "Failed to create conversation",
            variant: "destructive",
        })
        }
    }
    
    return (
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
        <div className="flex border-b py-2 px-4">
            <div className="flex space-x-8">
            <button
                className={`py-1 text-sm ${
                activeTab === "buyer" ? "border-b-2 border-primary font-medium text-primary" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("buyer")}
            >
                Buyer Messages
            </button>
            <button
                className={`py-1 text-sm ${
                activeTab === "seller" ? "border-b-2 border-primary font-medium text-primary" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("seller")}
            >
                Seller Messages
            </button>
            </div>
        </div>
    
        <div className="flex h-[600px]">
            <ContactList
            conversations={conversations}
            activeConversationId={activeConversation}
            onSelectConversation={handleConversationChange}
            isLoading={isLoading}
            />
    
            <ChatWindow
            messages={messages}
            activeConversationId={activeConversation}
            onSendMessage={sendMessage}
            currentUser={user}
            isLoading={isLoading}
            conversation={conversations.find((c) => c.id === activeConversation)}
            />
        </div>
        </div>
    )
    }
      