"use client";

import { useProfileApproval } from "../profile/hooks/use-profile-approval";
import Pagination from "./components/pagination";
import ProductStats from "./components/product-stats";
import ProductsHeader from "./components/products-header";
import ProductsTable from "./components/products-table";
import SearchAndFilter from "./components/search-and-filter";
import { useCategories } from "./hooks/use-categories";
import { useDebounce } from "./hooks/use-debounce";
import { useProducts } from "./hooks/use-products";
import { useProfileCompletion } from "./hooks/use-profile-completion";
import { AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "draft">("active");
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearchQuery = useDebounce(inputValue, 500);

  const { products, totalPages, stats, deleteProduct, refetch } = useProducts({
    status: activeTab === "active" ? "active" : "DRAFT",
    search: debouncedSearchQuery,
    page: currentPage,
    sortBy: sortField,
    sortOrder,
  });

  const { categories } = useCategories();
  const {
    profileCompletion,
    remainingSteps,
    isProfileComplete,
    isLoading: profileCompletionIsLoading,
  } = useProfileCompletion();

  const {
    approvalStatus,
    isSubmittingApproval,
    requestApproval,
    getApproval,
    isLoading: approvalStatusIsLoading,
  } = useProfileApproval({
    stepsToBeCompleted: remainingSteps,
  });

  // state for delete confirmation modal
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // simulate loading skeleton
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab, debouncedSearchQuery, currentPage, sortField, sortOrder]);

  // reset page on search or tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeTab]);

  const handleSearchChange = (value: string) => setInputValue(value);

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const res = await deleteProduct(productToDelete);

      if (res?.success !== false) {
        toast.success("Product deleted successfully");
        if (refetch) await refetch();
      } else {
        throw new Error("API responded with failure");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product");
      setError("Failed to delete product. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-md">
      <div className="max-w-7xl md:max-w-full mx-auto p-3 sm:p-4 md:p-6">
        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <ProductStats stats={stats} />

        {/* Main content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ProductsHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            remainingProfileSteps={remainingSteps}
            approvalStatus={approvalStatus}
            isSubmittingApproval={isSubmittingApproval}
            requestApproval={requestApproval}
            isProfileInitiallyComplete={isProfileComplete}
            profileCompletionIsLoading={profileCompletionIsLoading}
            approvalStatusIsLoading={approvalStatusIsLoading}
          />

          <SearchAndFilter
            searchQuery={inputValue}
            onSearchChange={handleSearchChange}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Loading skeleton */}
          {isLoading ? (
            <div className="p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 py-4 border-b border-gray-100"
                >
                  <div className="rounded-md bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="hidden sm:block w-24">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="hidden md:block w-16">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="hidden lg:block w-16">
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <ProductsTable
                products={products || []}
                onDelete={confirmDelete}
                isDraftView={activeTab === "draft"}
              />

              {products?.length === 0 && (
                <div className="py-16 px-4 text-center">
                  <p className="text-gray-500 mb-2">No products found</p>
                  <p className="text-gray-400 text-sm mb-6">
                    {debouncedSearchQuery
                      ? "Try adjusting your search or filters"
                      : activeTab === "active"
                      ? "You don't have any active products yet"
                      : "You don't have any draft products"}
                  </p>

                  {!debouncedSearchQuery && isProfileComplete && (
                    <Link
                      href="/seller/products/add-product"
                      className="inline-flex items-center px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Link>
                  )}
                </div>
              )}

              {products?.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages || 1}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
