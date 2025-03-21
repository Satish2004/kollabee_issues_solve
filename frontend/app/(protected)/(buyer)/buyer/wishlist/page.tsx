"use client"
import React, { useEffect, useState } from 'react'
import ProductCard from '../../../../../components/product/product-card'
import { wishlistApi } from '@/lib/api/wishlist';
import { useCheckout } from '@/checkout-context';
import { cartApi } from '@/lib/api/cart';
import { Skeleton } from '@/components/ui/skeleton';

function page() {
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {products, fetchProducts, setProducts } = useCheckout()

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const response = await wishlistApi.getWishlist()
        console.log(response.items)
        setWishlistProducts(response.items)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    getProducts()
    fetchProducts()
  }, [])

    const isInCart = ( productId: string) => {
      return products.findIndex((p:any) => p.product.id === productId) > -1
    }

    const isInWishlist = ( productId: string) => {
      return wishlistProducts.findIndex((p:any) => p.product.id === productId) > -1
    }
  
    const removeFromCart = (productId: string) => {
      const item = products.find((p:any) => p.product.id === productId)
      const itemId = item?.id
      cartApi.removeFromCart(itemId)
      setProducts(products.filter((p:any) => p.id !== itemId))
    }
    
    const removeFromWishlist = (productId: string) => {
      try {
        const item = wishlistProducts.find((p:any) => p.product.id === productId)
        const itemId = item?.id
        wishlistApi.removeFromWishlist(itemId)
        setWishlistProducts(wishlistProducts.filter((p:any) => p.id !== itemId))
      } catch {
        console.error('Failed to remove product from wishlist')
      }
    }


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        {isLoading ? ( 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            { Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[450px] w-full bg-gray-200 flex flex-col gap-4 p-4">
            <Skeleton className="h-40 w-full bg-gray-400" />
            <Skeleton className="h-4 w-10 bg-gray-400" />
            <Skeleton className="h-4 w-16 bg-gray-400" />
            <Skeleton className="h-6 w-32 bg-gray-400" />
            <Skeleton className="h-8 w-32 bg-gray-400" />
            <div className='space-y-4'> 
              <Skeleton className="h-10 w-full bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-400" />
            </div>
          </Skeleton>
        )) }
        </div> ): (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {
              wishlistProducts && wishlistProducts.map((product, index) => (
                <ProductCard 
                key={index+1} 
                product={product.product} 
                isInCart={isInCart} 
                isInWishlist={isInWishlist} 
                removeFromCart={removeFromCart} 
                removeFromWishlist={removeFromWishlist} 
                setWishlistProducts={setWishlistProducts} 
                wishlistProducts={wishlistProducts} 
              />
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

export default page
