"use client";

import BuyerLayoutHeader from "../../../../components/buyer/buyer-layout-header";
import { BuyerSidebar } from "../../../../components/buyer/buyer-sidebar";
import { ChatbotWidget } from "../../../../components/chatbot/ChatWidget";
import { IntroTour } from "@/components/tour/IntroTour";
import { CheckoutProvider } from "@/contexts/checkout-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const token = Cookies.get("token");

  useEffect(() => {
    // console.log("Token from cookies:", token);
    if (!token || token === "undefined") {
      router.push("/");
      console.log("Token not found");
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="h-screen bg-primary flex overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="sticky top-0 left-0">
          <BuyerSidebar />
        </div>

        {/*This is Scrollable Content Area, currently it's keeping the header */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <CheckoutProvider>
            <div className="sticky top-0 z-10 bg-gray-100">
              <BuyerLayoutHeader />
            </div>

            <main className="flex-1 px-4 py-3 bg-gray-100">
              {children}
              <ChatbotWidget />
            </main>
          </CheckoutProvider>
        </div>

        <IntroTour />
      </div>
    </SidebarProvider>
  );
}
