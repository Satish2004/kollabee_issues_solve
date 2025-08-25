"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AlertCircle, Plus, Loader2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import Pagination from "./components/pagination";
import ProductStats from "./components/product-stats";
import ProductsHeader from "./components/products-header";
import ProductsTable from "./components/products-table";
import SearchAndFilter from "./components/search-and-filter";
import { useDebounce } from "./hooks/use-debounce";
import { useProducts } from "./hooks/use-products";
import { useProfileCompletion } from "./hooks/use-profile-completion";
import { useCategories } from "./hooks/use-categories";
import { useProfileApproval } from "../profile/hooks/use-profile-approval";

export type ProductStatus = "active" | "DRAFT";

interface ProductsPageContentProps {
    remainingProfileSteps: number;
    isProfileInitiallyComplete: boolean;
    profileCompletionIsLoading: boolean;
}

function ProductsPageContent({
    remainingProfileSteps,
    isProfileInitiallyComplete,
    profileCompletionIsLoading,
}: ProductsPageContentProps) {
    const [activeTab, setActiveTab] = useState<ProductStatus>("active");
    const [inputValue, setInputValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [localError, setLocalError] = useState<string | null>(null);

    const debouncedSearchQuery = useDebounce(inputValue, 500);

    const {
        products,
        totalPages,
        stats,
        isLoading: productsLoading,
        error: productsError,
        deleteProduct,
    } = useProducts({
        status: activeTab,
        search: debouncedSearchQuery,
        page: currentPage,
        sortBy: sortField,
        sortOrder,
    });

    const { categories, isLoading: categoriesLoading } = useCategories(); // categories not used in this component, but kept for context

    // Handle errors from hooks
    useEffect(() => {
        if (productsError) {
            setLocalError(productsError);
            const timer = setTimeout(() => setLocalError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [productsError]);

    // Reset to first page when search query or tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, activeTab]);

    const handleSearchChange = (value: string) => {
        setInputValue(value);
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
            setLocalError("Failed to delete product. Please try again.");
            setTimeout(() => setLocalError(null), 5000);
        }
    };

    const overallLoading = productsLoading || profileCompletionIsLoading || categoriesLoading;

    return (
        <div className="min-h-screen bg-gray-50 rounded-md">
            <div className="max-w-7xl md:max-w-full mx-auto p-3 sm:p-4 md:p-6">
                {/* Error message */}
                {localError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{localError}</AlertDescription>
                    </Alert>
                )}

                {/* Stats Section */}
                <ProductStats stats={stats} />

                {/* Main Content */}
                <Card className="rounded-lg shadow overflow-hidden">
                    {/* Header with tabs */}
                    <ProductsHeader
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        remainingProfileSteps={remainingSteps}
                        isProfileInitiallyComplete={isProfileInitiallyComplete}
                        profileCompletionIsLoading={profileCompletionIsLoading}
                    />

                    {/* Search and Filter */}
                    <SearchAndFilter
                        searchQuery={inputValue}
                        onSearchChange={handleSearchChange}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                    />

                    {/* Loading State */}
                    {overallLoading ? (
                        <div className="p-6">
                            <div className="flex items-center justify-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Products Table */}
                            <ProductsTable
                                products={products || []}
                                onDelete={handleDelete}
                                isDraftView={activeTab === "DRAFT"}
                            />

                            {/* Empty State */}
                            {products?.length === 0 && (
                                <div className="py-16 px-4 text-center">
                                    <p className="text-gray-400 text-sm mb-6">
                                        {debouncedSearchQuery
                                            ? "No products found matching your search or filters."
                                            : activeTab === "active"
                                                ? "You don't have any active products yet."
                                                : "You don't have any draft products."}
                                    </p>
                                    {!debouncedSearchQuery && isProfileComplete && (
                                        <Link href="/seller/products/add-product" passHref>
                                            <Button variant="outline">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Your First Product
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {products && products.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages || 1}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
