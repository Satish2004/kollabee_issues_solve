"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IntroTour } from "@/components/tour/IntroTour";
import { BuyerSidebar } from "../../../../components/buyer/buyer-sidebar";
import BuyerLayoutHeader from "../../../../components/buyer/buyer-layout-header";
import { CheckoutProvider } from "@/contexts/checkout-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("kollabee_token")) {
      router.push("/");
    }
  }, []);

  return (
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

          <main className="flex-1 px-4 py-3 bg-gray-100">{children}</main>
        </CheckoutProvider>
      </div>

      <IntroTour />
    </div>
  );
}
