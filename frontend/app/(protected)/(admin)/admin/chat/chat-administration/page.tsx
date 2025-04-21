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
import { Button } from "@/components/ui/button"
import Link from "next/link"

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

      setBuyers(buyersResponse)
      setSellers(sellersResponse)
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
    <div className="container mx-auto">
      <Tabs defaultValue="blocked" className="">
        <TabsList className="mb-4 w-full bg-white flex justify-between py-8 px-4">
          <div className="space-x-8">
          <TabsTrigger value="blocked" className="text-base rounded-none data-[state=active]:shadow-none  data-[state=active]:border-b-2 border-black px-0">Blocked Communications</TabsTrigger>
          <TabsTrigger value="block" className="text-base rounded-none data-[state=active]:shadow-none  data-[state=active]:border-b-2 border-black px-0">Block Communication</TabsTrigger>
          </div>

          <Link href="/admin/chat">
            <Button className="button-bg text-white font-semibold">Chats</Button>
          </Link>
        </TabsList>

        <TabsContent value="blocked" className="bg-white">
          <BlockedCommunications />
        </TabsContent>

        <TabsContent value="block" className="bg-white">
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
