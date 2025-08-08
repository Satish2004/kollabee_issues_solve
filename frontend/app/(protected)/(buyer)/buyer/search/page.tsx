"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api/products";
import SearchProductCard from "./SearchProductCard";
import SearchProductFilters, { SearchFilterState } from "./SearchProductFilters";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product/product-card";
import { cartApi, wishlistApi } from "@/lib/api";
import { useMarketplaceProducts, useWishlistProducts } from "../marketplace/hooks/use-marketplace";

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
  const router = useRouter();

  const [category, setCategory] = useState("all")
  const [tag, setTag] = useState("all")

  const {
    data: marketplaceProducts = [],
    isLoading: productsLoading,
    error: productsError
  } = useMarketplaceProducts({ category, tag })

  const {
    data: wishlistProducts = [],
  } = useWishlistProducts()

  useEffect(() => {
    const categoryParam = searchParams.get("category") || "all"
    const tagParam = searchParams.get("tag") || "all"
    setCategory(categoryParam)
    setTag(tagParam)
  }, [searchParams])

  const handleCategoryChange = (newCategory: string) => {
    if (productsLoading) return

    const params = new URLSearchParams(searchParams)
    params.set("category", newCategory)
    router.push(`?${params.toString()}`)
  }

  const handleTagChange = (newTag: string) => {
    if (productsLoading) return

    const params = new URLSearchParams(searchParams)
    params.set("tag", newTag)
    router.push(`?${params.toString()}`)
  }

  const isInCart = (productId: string) => {
    return products.findIndex((p: any) => p.product?.id === productId) > -1
  }

  const isInWishlist = (productId: string) => {
    return wishlistProducts.findIndex((p: any) => p.product.id === productId) > -1
  }

  const removeFromCart = (productId: string) => {
    const item = products.find((p: any) => p.product.id === productId)
    const itemId = item?.id
    if (itemId) {
      cartApi.removeFromCart(itemId)
      setProducts(products.filter((p: any) => p.id !== itemId))
    }
  }

  const removeFromWishlist = (productId: string) => {
    try {
      const item = wishlistProducts.find((p: any) => p.product.id === productId)
      const itemId = item?.id
      if (itemId) {
        wishlistApi.removeFromWishlist(itemId)
        // Note: In a real implementation, you'd invalidate the query here
        // queryClient.invalidateQueries({ queryKey: ["wishlist-products"] })
      }
    } catch {
      console.error('Failed to remove product from wishlist')
    }
  }


  const getApiParams = () => {
    return {
      search: query,
      minPrice: filters.price.min ? Number(filters.price.min) : undefined,
      maxPrice: filters.price.max ? Number(filters.price.max) : undefined,
      minOrderQuantity: filters.minOrders ? Number(filters.minOrders) : undefined,
      userId: undefined, // Not needed for public search
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
  const handleFilterApply = () => { };
  const handleFilterClear = () => setFilters(defaultFilters);

  const isInvalidQuery = (q: string) => !q.trim() || /^[^a-zA-Z0-9]+$/.test(q);

  return (
    <main className="min-h-screen px-0 md:px-7">
      <div className="max-w-7xl mx-auto py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Search Results */}
        <section className="md:col-span-3">
          <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
          {/* Validation for empty or invalid search */}
          {(!query || isInvalidQuery(query)) && (
            <div className="text-muted-foreground text-center py-8">
              {!query ? 'Please enter a search term.' : 'No results found.'}
            </div>
          )}
          {/* Only show results if query is valid */}
          {query && !isInvalidQuery(query) && (
            <>
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
                    <SearchProductCard
                      key={product?.id || idx}
                      product={product}
                      isInCart={isInCart}
                      isInWishlist={isInWishlist}
                      removeFromCart={removeFromCart}
                      removeFromWishlist={removeFromWishlist}
                      wishlistProducts={wishlistProducts}
                      setWishlistProducts={() => { }}
               />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
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