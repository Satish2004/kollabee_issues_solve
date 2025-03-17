"use client"
import React, { useEffect, useState } from 'react'
import ProductCard from '../../../../../components/product/product-card'
import { productsApi } from '@/lib/api/products';
import { Skeleton } from "@/components/ui/skeleton"

function page() {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productsApi.getProducts()
        setProducts(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    getProducts()
  }, [])




  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-4 bg-white p-4 rounded-xl'>
      { isLoading ? (<>
        {Array(4).fill(0).map((_, i) => (
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
        ))}
      </>) : products.map((product, index) => (
        <ProductCard key={index} {...product} />
      ))}

      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  )
}

export default page
