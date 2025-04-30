"use client";
import React, { use, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import AdminLayoutHeader from "@/components/admin/admin-layout-header";
import { useRouter } from "next/navigation";
import { IntroTour } from "@/components/tour/IntroTour";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("kollabee_token")) {
      router.push("/login");
      console.log("Token not found");
    }
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="sticky top-0 left-0">
        <AdminSidebar />
      </div>

      {/*This is Scrollable Content Area, currently it's keeping the header */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-100">
          <AdminLayoutHeader />
        </div>

        <main className="flex-1 px-6 py-3 bg-gray-100">{children}</main>
      </div>

      <IntroTour />
    </div>
  );
}
