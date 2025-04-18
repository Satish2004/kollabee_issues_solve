"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import BlockCommunicationForm from "@/components/chat/admin/block-communication-form"
import BlockedCommunications from "@/components/chat/admin/blocked-communication"
import { redirect } from "next/navigation"
import { User } from "@/components/chat/types/chat"
import { useToast } from "@/hooks/use-toast"
import { chatApi } from "@/lib/api/chat"
import Spinner from "@/components/ui/spinner"

export default function AdminChatPage() {
  const [buyers, setBuyers] = useState<User[]>([])
  const [sellers, setSellers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const response: any = await chatApi.getCurrentUser()
      setUser(response)
      setUserLoading(false)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!userLoading && user?.role !== "ADMIN") {
      redirect("/")
    }
  }, [user, userLoading])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const [buyersResponse, sellersResponse] = await Promise.all([
        chatApi.getUsers("BUYER"),
        chatApi.getUsers("SELLER"),
      ])

      setBuyers(buyersResponse.data.users)
      setSellers(sellersResponse.data.users)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (user?.role !== "ADMIN") {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Chat Administration</h1>

      <Tabs defaultValue="blocked">
        <TabsList className="mb-4">
          <TabsTrigger value="blocked">Blocked Communications</TabsTrigger>
          <TabsTrigger value="block">Block Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="blocked">
          <BlockedCommunications />
        </TabsContent>

        <TabsContent value="block">
          {isLoading ? (
            <Card>
              <CardContent className="flex justify-center items-center h-64">
                <Spinner size="lg" />
              </CardContent>
            </Card>
          ) : (
            <BlockCommunicationForm buyers={buyers} sellers={sellers} onSuccess={() => fetchUsers()} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
