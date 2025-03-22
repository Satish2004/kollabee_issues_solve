"use client"

import ChatModule from "./chat-module"

export default function ChatPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messaging Center</h1>
      <ChatModule />
    </main>
  )
}

