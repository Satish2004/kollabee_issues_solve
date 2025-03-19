"use client"
import React, { useEffect, useState } from 'react'
import ProductCard from '../../../../../components/product/product-card'
import { productsApi } from '@/lib/api/products';
import { Skeleton } from "@/components/ui/skeleton"
import { useCheckout } from '@/checkout-context';
import { cartApi } from '@/lib/api/cart';
import { set } from 'date-fns';
import ProductFilters from './product-filters';

export interface FilterState {
  supplierFeatures: {
    verifiedSupplier: boolean
    responseTime: boolean
    rating: boolean
  }
  deliveryBy: {
    jan25: boolean
    jan31: boolean
    feb06: boolean
  }
  storeReviews: {
    fourStars: boolean
    fourPointFiveStars: boolean
    fiveStars: boolean
  }
  productFeatures: {
    paidSamples: boolean
  }
  categories: {
    stainlessSteelCoils: boolean
  }
  price: {
    min: string
    max: string
  }
  minOrders: string
}


function page() {
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const {products, fetchProducts, setProducts } = useCheckout()
  const [filters, setFilters] = useState<FilterState>({
    supplierFeatures: {
      verifiedSupplier: false,
      responseTime: false,
      rating: false,
    },
    deliveryBy: {
      jan25: false,
      jan31: false,
      feb06: false,
    },
    storeReviews: {
      fourStars: false,
      fourPointFiveStars: false,
      fiveStars: false,
    },
    productFeatures: {
      paidSamples: false,
    },
    categories: {
      stainlessSteelCoils: false,
    },
    price: {
      min: "",
      max: "",
    },
    minOrders: "",
  })

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productsApi.getProducts()
        setAllProducts(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    getProducts()
    fetchProducts()
  }, [])

  
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleFilterApply = async () => {
    try {
      setIsLoading(true)
      const response = await productsApi.getProducts(filters)
      setAllProducts(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }


    console.log("Applying filters:", filters)
  }

  const handleFilterClear = () => {
    setFilters({
      supplierFeatures: {
        verifiedSupplier: false,
        responseTime: false,
        rating: false,
      },
      deliveryBy: {
        jan25: false,
        jan31: false,
        feb06: false,
      },
      storeReviews: {
        fourStars: false,
        fourPointFiveStars: false,
        fiveStars: false,
      },
      productFeatures: {
        paidSamples: false,
      },
      categories: {
        stainlessSteelCoils: false,
      },
      price: {
        min: "",
        max: "",
      },
      minOrders: "",
    })
  }

  const isInCart = ( productId: string) => {
    return products.findIndex((p:any) => p.product.id === productId) > -1
  }

  const removeFromCart = (productId: string) => {
    const item = products.find((p:any) => p.product.id === productId)
    const itemId = item?.id
    cartApi.removeFromCart(itemId)
    setProducts(products.filter((p:any) => p.id !== itemId))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        {isLoading ? ( 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              allProducts.map((product, index) => (
                <ProductCard key={index} product={product} isInCart={isInCart} removeFromCart={removeFromCart} />
              ))
            }
          </div>
        )}
      </div>
      <div className="col-span-1">
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onApply={handleFilterApply}
          onClear={handleFilterClear}
        />
      </div>
    </div>
  )
}

export default page




