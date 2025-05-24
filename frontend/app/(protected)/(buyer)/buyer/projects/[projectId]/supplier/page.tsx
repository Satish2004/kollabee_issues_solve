"use client";

import { ActiveFilters } from "./components/active-filters";
import { SupplierFilters } from "./components/supplier-filters";
import { SupplierGrid } from "./components/supplier-grid";
import { SupplierTabs } from "./components/supplier-tabs";
import { SupplierProvider } from "./context/supplier-context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProjectSellersPage({
  params,
}: {
  params: { projectId: string };
}) {
  // Unwrap params with React.use() to fix the excessive requests issue
  const { projectId } = React.use(params);

  return (
    <SupplierProvider projectId={projectId}>
      <div className="md:px-6">
        <div className="w-full bg-gray-50 min-h-screen ">
          {/* Header */}
          <div className="bg-white border-b p-4 sticky top-0 z-10">
            <div className="w-full flex flex-col justify-between md:flex-row items-start md:items-center gap-4">
              <Link
                href={`/buyer/projects`}
                className="text-[#e00261] flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Link>

              <div className="flex flex-wrap items-center  gap-2 w-full md:w-auto">
                <SupplierTabs />
                <SupplierFilters />
              </div>
            </div>
          </div>

          {/* Suppliers Grid */}
          <div className="max-w-7xl mx-auto p-4 md:p-6 ">
            <ActiveFilters />
            <SupplierGrid />
          </div>
        </div>
      </div>
    </SupplierProvider>
  );
}
