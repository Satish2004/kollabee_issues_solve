"use client"

import React, { useEffect } from "react"
import { CartItem } from "./cart-item"
import { OrderSummary } from "./order-summary"
import { useCheckout } from "../../../../../../checkout-context"


interface ShoppingCartProps {
  onNext: () => void
}

export function ShoppingCart({ onNext }: ShoppingCartProps) {
  const { products, updateQuantity, fetchProducts, isLoading } = useCheckout()

  useEffect(() => {
    // Fetch products when component mounts
    if (products.length === 0) {
      fetchProducts()
    }
  }, [fetchProducts, products.length])

  if (isLoading && products.length === 0) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg border">
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
      <div className="md:col-span-2 bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <span className="text-gray-600">({products.length})</span>
        </div>

        <div className="text-sm text-gray-600 mb-6">Minimum Order Quantity Is: 20,000</div>

        <div className="grid grid-cols-3 text-sm text-gray-500 pb-2 border-b">
          <div className="col-span-1">Product</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1 text-right">Price</div>
        </div>

        <div className="divide-y">
          {products.map((product) => (
            <CartItem
              key={product.id}
              id={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              initialQuantity={product.quantity}
              minQuantity={product.id === "1" ? 20000 : 1}
              onQuantityChange={updateQuantity}
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

