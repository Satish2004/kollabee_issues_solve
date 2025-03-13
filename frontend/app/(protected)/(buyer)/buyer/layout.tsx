"use client";
import React, { useEffect } from 'react';
import { SellerSidebar } from "@/components/buyer/buyer-sidebar";
import SellerLayoutHeader from "@/components/buyer/layout-header";
import { useRouter } from "next/navigation";
import { IntroTour } from '@/components/tour/IntroTour';

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
        <SellerSidebar />
      </div>

      {/*This is Scrollable Content Area, currently it's keeping the header */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-50">
          <SellerLayoutHeader />
        </div>

        <main className="flex-1 p-4 bg-gray-50">
          {children}
        </main>
      </div>

      <IntroTour />
    </div>
  );
}