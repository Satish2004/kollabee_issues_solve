"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api/products";
import SearchProductCard from "./SearchProductCard";
import SearchProductFilters, { SearchFilterState } from "./SearchProductFilters";
import { Skeleton } from "@/components/ui/skeleton";

const defaultFilters: SearchFilterState = {
  supplierFeatures: {
    verifiedSupplier: false,
    rating: false,
  },
  deliveryBy: {
    // Placeholder for future dynamic delivery options
  },
  storeReviews: {
    fourStars: false,
    fourPointFiveStars: false,
    fiveStars: false,
  },
  productFeatures: {
    paidSamples: false,
  },
  categories: {},
  price: {
    min: "",
    max: "",
  },
  minOrders: "",
};

export default function BuyerProductSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [filters, setFilters] = useState<SearchFilterState>(defaultFilters);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map filters to backend-supported params
  const getApiParams = () => {
    return {
      search: query,
      minPrice: filters.price.min ? Number(filters.price.min) : undefined,
      maxPrice: filters.price.max ? Number(filters.price.max) : undefined,
      minOrderQuantity: filters.minOrders ? Number(filters.minOrders) : undefined,
      // Add more mappings as your backend supports
    };
  };

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    productsApi
      .getProducts(getApiParams())
      .then((res) => setProducts(res.data))
      .catch(() => setError("Failed to fetch products."))
      .finally(() => setLoading(false));
  }, [query, filters]);

  const handleFilterChange = (newFilters: SearchFilterState) => setFilters(newFilters);
  const handleFilterApply = () => {};
  const handleFilterClear = () => setFilters(defaultFilters);

  return (
    <main className="min-h-screen px-0 md:px-7">
      <div className="max-w-7xl mx-auto py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Search Results */}
        <section className="md:col-span-3">
          <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
          {loading && (
            <div className="flex flex-col gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[220px] w-full bg-gray-200 flex flex-col gap-4 p-4" />
              ))}
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center py-8">{error}</div>
          )}
          {!loading && !error && products.length === 0 && (
            <div className="text-muted-foreground text-center py-8">No products found.</div>
          )}
          {!loading && !error && products.length > 0 && (
            <div className="flex flex-col gap-6">
              {products.map((product, idx) => (
                <SearchProductCard key={product.id || idx} product={product} />
              ))}
            </div>
          )}
        </section>
        {/* Filters on the right */}
        <aside className="md:col-span-1">
          <SearchProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={handleFilterApply}
            onClear={handleFilterClear}
          />
        </aside>
      </div>
    </main>
  );
} 