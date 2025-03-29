"use client"

import { useState, useEffect, useRef, use } from "react"
import { io, type Socket } from "socket.io-client"
import type { Message, Conversation } from "./types/chat"
import ChatWindow from "./chat-window"
import ContactList from "./contact-list"
import { authApi } from "@/lib/api/auth"
import { chatApi } from "@/lib/api/chat"
import { useToast } from "@/hooks/use-toast"



export default function ChatModule() {
    const [activeTab, setActiveTab] = useState< "user" | "admin">("user")
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
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
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:2000", {
        withCredentials: true,
        })
    
        socketRef.current = socket
    
        socket.on("connect", () => {
        console.log("Socket connected")

      if (user?.id) {
        socket.emit("identify", { userId: user.id })
      }
    
        fetchConversations()
        })
    
        socket.on("disconnect", () => {
        console.log("Socket disconnected")
        })
    
        socket.on("new_message", (message: Message) => {
        if (message.conversationId === activeConversation) {
            setMessages((prev) => [...prev, message]);
        
            // THis will check if theres a corimed message and replace a pending mesage
            const tempId = tempMessageIdRef.current;
            if (tempId) {
              setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
              tempMessageIdRef.current = null;
            }
          }

    
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
    
        if (message.conversationId !== activeConversation) {
            toast({
            title: `New message from ${message.senderName}`,
            description: message.content.length > 30 ? `${message.content.substring(0, 30)}...` : message.content,
            })
        }
        })
    
        socket.on("user_status_change", ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
        setConversations((prev) => prev.map((conv) => (conv.participantId === userId ? { ...conv, isOnline } : conv)))
        })

        // Listen for conversation status updates
        socket.on("conversation_updated", ({ conversationId, status, updatedBy }) => {
        setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, status } : conv)))
  
        // Show toast for accepted conversation
        if (status === "ACCEPTED") {
          const conversation = conversations.find((c) => c.id === conversationId)
          if (conversation) {
            toast({
              title: "Conversation Accepted",
              description: `${conversation.participantName} accepted your message request`,
            })
          }
        }

        if (status === "declined") {
            const conversation = conversations.find((c) => c.id === conversationId)
            if (conversation) {
              toast({
                title: "Conversation Declined",
                description: `${conversation.participantName} declined your message request`,
                variant: "destructive",
              })
    
              // Remove the declined conversation from the list
              setConversations((prev) => prev.filter((c) => c.id !== conversationId))
    
              // If this was the active conversation, clear it
              if (activeConversation === conversationId) {
                setActiveConversation(null)
                setMessages([])
              }
            }
          }
      })
    
        return () => {
        if (socketRef.current) {
            socketRef.current.disconnect()
        }
        }
    }, [activeConversation, toast, user])
    
    // Fetch conversations from API
    const fetchConversations = async () => {
        try {
        const userType = "BUYER"
        const response = await chatApi.getConversations(userType as "BUYER" | "SELLER")
    
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
    
        // THis is for marking as read
        if (socketRef.current) {
            socketRef.current.emit("mark_as_read", { conversationId })
        }
    
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
    
    const sendMessage = async (content: string, attachments: File[] = []) => {
        if (!activeConversation || !socketRef.current || (!content.trim() && attachments.length === 0)) return
    
        try {
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
        tempMessageIdRef.current = tempId;
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
    const createConversation = async (participantId: string, participantType: "BUYER" | "SELLER") => {
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

    useEffect(() => { 
        if(activeTab === "user"){
            const participant =  user?.role === "BUYER" ? "SELLER" : "BUYER"
            setFilteredConversations(conversations.filter((c) => c.participantType === participant))
        }
        else if(activeTab === "admin"){
            console.log(conversations)
            setFilteredConversations([])
        }
    }, [activeTab, user])
    
    return (
        <div className="flex flex-col rounded-lg shadow-sm overflow-hidden h-[570px]">
        <div className="flex rounded-xl px-6 py-4 bg-white mb-6 ">
            <div className="flex space-x-8">
            <button
                className={`py-1 text-sm ${
                activeTab === "user" ? "border-b-2 border-primary font-medium text-primary" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("user")}
            >
                {user?.role === "BUYER" ? "Seller Messages" : "Buyer Messages"}
            </button>
            <button
                className={`py-1 text-sm ${
                activeTab === "admin" ? "border-b-2 border-primary font-medium text-primary" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("admin")}
            >
                Admin Messages
            </button>
            </div>
        </div>
    
        <div className="flex-1 flex  space-x-6">
            <ContactList
            conversations={filteredConversations}
            activeConversationId={activeConversation}
            onSelectConversation={handleConversationChange}
            isLoading={isLoading}
            currentUserId={user?.id || ""}
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
      