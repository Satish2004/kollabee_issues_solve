"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuppliers } from "../context/supplier-context";
import { SupplierCard } from "./supplier-card";
import { EmptyState } from "./empty-state";
import { useEffect } from "react";

export function SupplierGrid() {
  const {
    filteredSuppliers,
    loading,
    activeTab,
    setActiveTab,
    resetFilters,
    savedSuppliers,
  } = useSuppliers();

  // Add a useEffect to log the state for debugging
  useEffect(() => {
    if (activeTab === "saved") {
      console.log("Saved tab active, saved suppliers:", savedSuppliers);
    }
  }, [activeTab, savedSuppliers]);

  return (
    <>
      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Showing {filteredSuppliers.length} suppliers
          {activeTab === "suggested"
            ? " matched to your project"
            : activeTab === "saved"
            ? " you've saved"
            : activeTab === "requested"
            ? " you've sent requests to"
            : "You have hired"}
        </p>
      </div>

      {loading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredSuppliers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <SupplierCard key={supplier.id} supplier={supplier} />
              ))}
            </div>
          ) : (
            <EmptyState
              activeTab={activeTab}
              onAction={() => {
                if (activeTab !== "suggested") {
                  setActiveTab("suggested");
                } else {
                  resetFilters();
                }
              }}
            />
          )}
        </>
      )}
    </>
  );
}
