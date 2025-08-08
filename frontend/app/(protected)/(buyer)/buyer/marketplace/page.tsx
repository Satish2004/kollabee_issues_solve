"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product/product-card"
import ProductCardSkeleton from "@/components/product/product-card-skeleton"
import { wishlistApi } from "@/lib/api/wishlist"
import { cartApi } from "@/lib/api/cart"
import { useCheckout } from "@/contexts/checkout-context"
import { useMarketplaceProducts, useWishlistProducts } from "./hooks/use-marketplace"
import { CATEGORY_OPTIONS } from "@/lib/data/category"
import CategoryCarouselSimple from "./category-carousel"


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
  const { products, setProducts } = useCheckout()

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
    <main className="min-h-screen px-0 md:px-7 overflow-x-hidden">
      <div className="bg-white mt-8 p-6 mx-auto rounded-xl max-w-[calc(100vw-32px)] md:max-w-full">
        <CategoryCarouselSimple
          category={category}
          handleCategoryChange={handleCategoryChange}
          productsLoading={productsLoading}
          CATEGORY_OPTIONS={CATEGORY_OPTIONS}
        />

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {tags.map((t) => (
            <Button
              key={t.id}
              onClick={() => handleTagChange(t.id)}
              disabled={productsLoading}
              className={`rounded-full shadow-none transition-all duration-200 flex-shrink-0 ${tag === t.id
                ? "bg-zinc-800 text-white hover:bg-zinc-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                } ${productsLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
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

      <div className="max-w-[calc(100vw-32px)] md:max-w-full mx-auto">
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
                setWishlistProducts={() => { }}
                wishlistProducts={wishlistProducts}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

