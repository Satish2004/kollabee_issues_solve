"use client"

import React, { useEffect } from "react"
import { CartItem } from "./cart-item"
import { OrderSummary } from "./order-summary"
import { useCheckout } from "../../../../../../contexts/checkout-context"
import { cartApi } from "@/lib/api/cart"


interface ShoppingCartProps {
  onNext: () => void
}

export function ShoppingCart({ onNext }: ShoppingCartProps) {
  const { products, updateQuantity, fetchProducts, isLoading, setProducts } = useCheckout()

  useEffect(() => {
    // Fetch products when component mounts
    if (products.length === 0) {
      fetchProducts()
    }
  }, [])


    const removeFromCart = (productId: string) => {
      const item = products.find((p:any) => p.product.id === productId)
      const itemId = item?.id
      cartApi.removeFromCart(itemId)
      setProducts(products.filter((p:any) => p.id !== itemId))
    }

  if (isLoading && products.length === 0) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your cart...</p>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg border h-64 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white px-6 ">
        <div className="flex justify-between items-center mb-4 pb-6 border-b-2 border-gray-100">
          <h2 className="text-2xl font-[900]">Your Cart</h2>
          <span className="text-gray-600">({products.length})</span>
        </div>
        <div className="grid grid-cols-6 text-sm text-gray-500 pb-2">
          <div className="col-span-3">Product</div>
          <div className="col-span-1 text-center ml-10">Quantity</div>
          <div className="col-span-1 text-right ml-20">Price</div>
        </div>

        <div className="divide-y">
          {products.map((product : any) => (
            <CartItem
              key={product.id}
              id={product.product.id}
              name={product.product.name}
              image={product.product.images[0]}
              price={product.product.price}
              initialQuantity={product.quantity}
              minQuantity={product?.product.minOrderQuantity}
              onQuantityChange={updateQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      </div>

      <div>
        <OrderSummary onNext={onNext} buttonText="Next" />
      </div>
    </div>
  )
}

