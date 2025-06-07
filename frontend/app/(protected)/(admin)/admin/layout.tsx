"use client";

import AdminLayoutHeader from "@/components/admin/admin-layout-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { IntroTour } from "@/components/tour/IntroTour";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const token = Cookies.get("token");

  useEffect(() => {
    console.log("Token from cookies:", token);
    if (!token || token === "undefined") {
      router.push("/");
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
