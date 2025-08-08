"use client";

import { ChatbotWidget } from "@/components/chatbot/ChatWidget";
import SellerLayoutHeader from "@/components/seller/layout-header";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { IntroTour } from "@/components/tour/IntroTour";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { Suspense, use, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token || token === "undefined") {
      router.push("/");
    }
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <div className="sticky top-0 left-0">
        <SellerSidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-100">
          <SellerLayoutHeader />
        </div>

        <main className="flex-1 px-2 md:px-10 py-3 bg-gray-100">
          {children}
          <ChatbotWidget />
        </main>
      </div>

      <IntroTour />
    </div>
  );
}
