"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ProductStats from "./components/product-stats";
import ProductsTable from "./components/products-table";
import ProductsHeader from "./components/products-header";
import SearchAndFilter from "./components/search-and-filter";
import Pagination from "./components/pagination";
import { useProducts } from "./hooks/use-products";
import { useCategories } from "./hooks/use-categories";
import { useProfileCompletion } from "./hooks/use-profile-completion";
import { LoadingSpinner } from "./components/loading-spinner";
import { useDebounce } from "./hooks/use-debounce";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "draft">("active");
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce the search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(inputValue, 500);

  const {
    products,
    isLoading,
    totalPages,
    stats,
    deleteProduct,
    refetchProducts,
  } = useProducts({
    status: activeTab === "active" ? "active" : "DRAFT",
    search: debouncedSearchQuery,
    page: currentPage,
    sortBy: sortField,
    sortOrder,
  });

  const { categories } = useCategories();
  const { profileCompletion, remainingSteps, isProfileComplete } =
    useProfileCompletion();

  // Reset to first page when search query or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, activeTab]);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    // The actual API call will be triggered after the debounce delay
  };

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc"); // Default to descending when changing fields
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Stats */}
        <ProductStats stats={stats} />

        {/* Product List */}
        <div className="bg-white rounded-lg shadow">
          <ProductsHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isProfileComplete={isProfileComplete}
            remainingSteps={remainingSteps}
          />

          {/* Search and Filter */}
          <SearchAndFilter
            searchQuery={inputValue}
            onSearchChange={handleSearchChange}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Table - Show skeleton loader or actual data */}
          {isLoading ? (
            <LoadingSpinner isDraftView={activeTab === "draft"} />
          ) : (
            <ProductsTable
              products={products}
              onDelete={handleDelete}
              isDraftView={activeTab === "draft"}
            />
          )}

          {/* Pagination - Only show when not loading and we have products */}
          {!isLoading && products.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
