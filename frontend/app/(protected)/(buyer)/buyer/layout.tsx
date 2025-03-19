"use client";
import React, { useEffect } from 'react';
import SellerLayoutHeader from "@/components/buyer/layout-header";
import { useRouter } from "next/navigation";
import { IntroTour } from '@/components/tour/IntroTour';
import { BuyerSidebar } from '../../../../components/buyer/buyer-sidebar';
import { CheckoutProvider } from '@/checkout-context';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if(!localStorage.getItem("token")){
      router.push("/login");
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
          <SellerLayoutHeader />
        </div>

        <main className="flex-1 px-10 py-6 bg-gray-100">
          {children}
        </main>
        </CheckoutProvider>
      </div>

      <IntroTour />
    </div>
  );
}