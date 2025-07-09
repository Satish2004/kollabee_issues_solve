"use client"

import { useState, useEffect } from "react"
import { wishlistApi } from "@/lib/api/wishlist"
import { cartApi } from "@/lib/api/cart"
import { useCheckout } from "@/contexts/checkout-context"
import { toast } from "sonner"

export function useProductActions() {
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { products, fetchProducts, setProducts } = useCheckout()

  // Load both wishlist and cart on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const wishlistRes = await wishlistApi.getWishlist() as unknown as { items: any[] }
        setWishlistProducts(wishlistRes.items)
        await fetchProducts()
      } catch (err) {
        console.error("Failed to fetch products:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const isInCart = (productId: string) => {
    return products.findIndex((p: any) => p.product.id === productId) > -1
  }

  const isInWishlist = (productId: string) => {
    return wishlistProducts.findIndex((p: any) => p.product.id === productId) > -1
  }

  const removeFromCart = async (productId: string) => {
    const item = products.find((p: any) => p.product.id === productId)
    if (!item?.id) return

    await cartApi.removeFromCart(item.id)
    setProducts(products.filter((p: any) => p.id !== item.id))
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const item = wishlistProducts.find((p: any) => p.product.id === productId)
      if (!item?.id) {
        toast("Invalid item.")
        return
      }

      await wishlistApi.removeFromWishlist(item.id)
      setWishlistProducts(wishlistProducts.filter((p: any) => p.id !== item.id))
      toast("Removed from wishlist")
    } catch (err) {
      console.error("Failed to remove from wishlist:", err)
      toast("Failed to remove from wishlist")
    }
  }

  return {
    wishlistProducts,
    isLoading,
    isInCart,
    isInWishlist,
    removeFromCart,
    removeFromWishlist,
    setWishlistProducts
  }
}
