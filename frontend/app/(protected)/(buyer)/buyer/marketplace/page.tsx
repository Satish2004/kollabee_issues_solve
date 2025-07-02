"use client"

import React, { use, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { productsApi } from "@/lib/api/products"
import { Product } from "@/types/api"
import ProductCard from "@/components/product/product-card"
import ProductCardSkeleton from "@/components/product/product-card-skeleton"
import { wishlistApi } from "@/lib/api/wishlist"
import { cartApi } from "@/lib/api/cart"
import { useCheckout } from "@/contexts/checkout-context"
import { useMarketplaceProducts, useWishlistProducts } from "./hooks/use-marketplace"
import { CATEGORY_OPTIONS } from "@/app/(protected)/(seller)/seller/products/add-product"


const tags = [
  { id: "all", label: "All" },
  { id: "most-popular", label: "Most Popular" },
  { id: "hot-selling", label: "Hot Selling" },
]

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState("all")
  const [tag, setTag] = useState("all")
  const { products, fetchProducts, setProducts } = useCheckout()

  const { 
    data: marketplaceProducts = [], 
    isLoading: productsLoading, 
    error: productsError 
  } = useMarketplaceProducts({ category, tag })

  const { 
    data: wishlistProducts = [], 
    isLoading: wishlistLoading 
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
    return products.findIndex((p: any) => p.product.id === productId) > -1
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

  return (
    <main className="min-h-screen px-0 md:px-7">
      <div className=" bg-white mt-8 p-6 mx-auto rounded-xl">
        <Tabs value={category} className="w-full mb-6 border-b-2 border-gray-200 pb-6">
          <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent">
            {[{ value: "all", label: "All" }, ...CATEGORY_OPTIONS].map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                disabled={productsLoading}
                className={cn(
                  "data-[state=active]:border-b-4 border-orange-600 shadow-none transition-all duration-200",
                  productsLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-50"
                )}
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-4 mb-8">
          {tags.map((t) => (
            <Button
              key={t.id}
              onClick={() => handleTagChange(t.id)}
              disabled={productsLoading}
              className={`rounded-full shadow-none transition-all duration-200 ${
                tag === t.id 
                  ? "bg-zinc-800 text-white hover:bg-zinc-700" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } ${productsLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {productsLoading && tag === t.id ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t.label}
                </div>
              ) : (
                t.label
              )}
            </Button>
          ))}
        </div>
      </div>

      <div>
        {productsLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white mt-8 p-6 rounded-xl">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}
        {!productsLoading && productsError && (
          <div className="mt-8 p-6 bg-white rounded-xl min-h-[400px] flex items-center justify-center text-red-500">
            Error loading products. Please try again.
          </div>
        )}
        {!productsLoading && !productsError && marketplaceProducts.length === 0 && (
          <div className="mt-8 p-6 bg-white rounded-xl min-h-[400px] flex items-center justify-center text-muted-foreground">
            No products found
          </div>
        )}
        {!productsLoading && !productsError && marketplaceProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white mt-8 p-6 rounded-xl">
            {marketplaceProducts.map((product, index) => (
              <ProductCard
                key={index + 1}
                product={product}
                isInCart={isInCart}
                isInWishlist={isInWishlist}
                removeFromCart={removeFromCart}
                removeFromWishlist={removeFromWishlist}
                setWishlistProducts={() => {}} // This will be handled by React Query
                wishlistProducts={wishlistProducts}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

