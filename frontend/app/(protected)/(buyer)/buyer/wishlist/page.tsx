"use client"
import React, { useEffect, useState } from 'react'
import ProductCard from '../../../../../components/product/product-card'
import { wishlistApi } from '@/lib/api/wishlist';
import { cartApi } from '@/lib/api/cart';
import { Skeleton } from '@/components/ui/skeleton';
import { useCheckout } from '@/contexts/checkout-context';
import { toast } from 'sonner';

export default function Page() {
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { products, fetchProducts, setProducts } = useCheckout()

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const response = await wishlistApi.getWishlist() as unknown as { items: any[] };
        setWishlistProducts(response.items)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    getProducts()
    fetchProducts()
  }, [])

  const isInCart = (productId: string) => {
    return products.findIndex((p: any) => p.product.id === productId) > -1
  }

  const isInWishlist = (productId: string) => {
    return wishlistProducts.findIndex((p: any) => p.product.id === productId) > -1
  }

  const removeFromCart = (productId: string) => {
    const item = products.find((p: any) => p.product.id === productId)
    const itemId = item?.id
    cartApi.removeFromCart(itemId as any)
    setProducts(products.filter((p: any) => p.id !== itemId))
  }

  const removeFromWishlist = (productId: string) => {
    try {
      const item = wishlistProducts.find((p: any) => p.product.id === productId)
      const itemId = item?.id
      if (typeof itemId !== 'string') {
        toast('Failed to remove from wishlist: Invalid item.');
        return;
      }
      const validItemId: string = itemId;
      wishlistApi.removeFromWishlist(validItemId)
      setWishlistProducts(wishlistProducts.filter((p: any) => p.id !== validItemId))
      toast('Removed from wishlist');
    } catch {
      console.error('Failed to remove product from wishlist')
      toast('Failed to remove from wishlist');
    }
  }

  if (!isLoading && wishlistProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-500 mb-6 text-center">No products found in your wishlist. Start shopping to add items.</p>
      </div>
    )
  }

  return (
    <div className="px-0 md:px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-40 w-full bg-gray-200 rounded-md" />
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/2 bg-gray-200" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16 bg-gray-200" />
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
              </div>
            </div>
          ))
        ) : (
          wishlistProducts && wishlistProducts.map((product, index) => (
            <ProductCard
              key={index + 1}
              product={product.product}
              isInCart={isInCart}
              isInWishlist={isInWishlist}
              removeFromCart={removeFromCart}
              removeFromWishlist={removeFromWishlist}
              setWishlistProducts={setWishlistProducts}
              wishlistProducts={wishlistProducts}
              fromWishlistPage={true}
              compact={true}
            />
          ))
        )}
      </div>
    </div>
  );
}