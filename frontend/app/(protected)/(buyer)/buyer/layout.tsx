"use client";
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { IntroTour } from '@/components/tour/IntroTour';
import { BuyerSidebar } from '../../../../components/buyer/buyer-sidebar';
import  BuyerLayoutHeader  from '../../../../components/buyer/buyer-layout-header';
import { CheckoutProvider } from '@/contexts/checkout-context';
import { useAuth } from '@/contexts/auth-context';


export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

    const { user } = useAuth();
    console.log("User:", user)

    if(!user) {
      return null;
    }
  
    if (user?.role !== "BUYER") {
      router.push("/unauthorized");
    }

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
          <BuyerLayoutHeader/>
        </div>

        <main className="flex-1 px-10 py-3 bg-gray-100">
          {children}
        </main>
        </CheckoutProvider>
      </div>

      <IntroTour />
    </div>
  );
}