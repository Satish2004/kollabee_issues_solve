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
    hiredSuppliers,
    requestedSuppliers,
    project,
  } = useSuppliers();

  const getSuppliersForActiveTab = () => {
    switch (activeTab) {
      case "saved":
        return savedSuppliers;
      case "requested":
        return requestedSuppliers;
      case "hired":
        return hiredSuppliers;
      case "suggested":
      default:
        return filteredSuppliers;
    }
  };

  const suppliersToDisplay = getSuppliersForActiveTab();

  return (
    <>
      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Showing {suppliersToDisplay.length} suppliers
          {activeTab === "suggested"
            ? project?.category
              ? ` matched to your ${Array.isArray(project.category) ? project.category[0] : project.category} project`
              : " matched to your project"
            : activeTab === "saved"
              ? " you've saved"
              : activeTab === "requested"
                ? " you've sent requests to"
                : " you have hired"}
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suppliers grid */}
      {!loading && suppliersToDisplay.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliersToDisplay.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && suppliersToDisplay.length === 0 && (
        <EmptyState
          activeTab={activeTab}
          onAction={() => {
            if (activeTab === "suggested") {
              resetFilters();
            } else {
              setActiveTab("suggested");
            }
          }}
          projectCategory={project?.category}
        />
      )}
    </>
  );
}