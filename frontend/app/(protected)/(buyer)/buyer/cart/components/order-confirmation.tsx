"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { OrderSummary } from './order-summary'
import { Button } from '@/components/ui/button'
import { ordersApi } from '@/lib/api/orders'
import { useCheckout } from '@/contexts/checkout-context'

function OrderConfirmation() {
 const { products, isLoading, orderSummary, orderId } = useCheckout()
 const { subtotal, discount, shippingCost, totalQuantity, total } = orderSummary
 const [orderedProducts, setOrderedProducts] = useState<any>([])

 useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderDetails = await ordersApi.getOrderDetails(orderId)
      console.log(orderDetails)
      setOrderedProducts(orderDetails.items)
    }
   
  if (orderId) {
    fetchOrderDetails()
  }
}, [orderId])

 if (isLoading && orderedProducts.length === 0) {
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
      <div className="md:col-span-2 bg-white p-6 ">
        <div className="flex justify-between items-center mb-4 pb-6 border-b-2 border-gray-100">
          <h2 className="text-2xl font-bold">Your Order</h2>
          <span className="text-gray-600">({orderedProducts.length})</span>
        </div>
        <div className="grid grid-cols-6 text-sm text-gray-500 pb-2 border-b">
          <div className="col-span-4">Product</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1 text-right">Price</div>
        </div>

        <div className="divide-y">
          {orderedProducts.map((product : any) => (
            <CartItem
              key={product.id}
              name={product.product.name}
              image={product.product.images[0]}
              price={product.product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      </div>

      <div>
      <div className="bg-white p-6 rounded-lg border">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Discount</span>
          <span className="font-medium">${discount.toFixed(1)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Shipping Costs</span>
          <span className="font-medium">${shippingCost.toFixed(2)}</span>
        </div>

        <hr className='bg-gray-300 my-4 w-full'></hr>

        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold text-sm">TOTAL</span>
          <span className="font-medium text-pink-500">${total.toFixed(2)}</span>
        </div>

        <div className="pt-2">
          <a href="/buyer/marketplace" className="text-gray-600 hover:underline">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
      </div>
    </div>
  )
}

export default OrderConfirmation

const CartItem = ({ name, image, price, quantity}: any) => {

    return (
            <div className="flex items-center py-4 border-b">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 mr-4 relative">
                  <Image src={image || "/placeholder.png"} alt={name} fill className="object-cover rounded-md" />
                </div>
                <span className="font-medium">{name}</span>
              </div>
        
              <div className="flex items-center justify-center w-40">
                <span>{quantity.toLocaleString()}</span>
              </div>
        
              <div className="w-24 text-right font-medium">${(price * quantity).toFixed(2)}</div>
            </div>
    )
}