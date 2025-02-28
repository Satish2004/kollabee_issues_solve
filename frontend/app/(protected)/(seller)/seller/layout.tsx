"use client";
import React, { useEffect } from 'react';
import { SellerSidebar } from "@/components/seller-sidebar";
import SellerLayoutHeader from "@/components/seller/layout-header";
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
    <div className="min-h-screen bg-gray-50">
      <SellerLayoutHeader />
      <div className="flex">
        <SellerSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <IntroTour />
    </div>
  );
}
