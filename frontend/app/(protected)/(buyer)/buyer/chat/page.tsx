"use client";

import ChatModule from "@/components/chat/chat-module";

export default function ChatPage() {
  return (
    <main className="container mx-auto">
      <ChatModule userType="BUYER" />
    </main>
  );
}
