"use client"

import { Button } from "@/components/ui/button"
import React from "react"
import { useCheckout } from "../../../../../../checkout-context"

interface OrderSummaryProps {
  onNext?: () => void
  buttonText?: string
}

export function OrderSummary({ onNext, buttonText = "Next" }: OrderSummaryProps) {
  const { orderSummary, currentStep, products } = useCheckout()
  const { discount, shippingCost, totalQuantity } = orderSummary
  const subtotal = products.reduce((sum, product) => sum + product.product.price * product.quantity, 0)

  const freeShippingThreshold = 1000

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="font-medium">${discount.toFixed(1)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping Costs</span>
          <span className="font-medium">${shippingCost.toFixed(2)}</span>
        </div>

        {totalQuantity < freeShippingThreshold && (
          <div className="text-sm text-gray-600">
            Get Free Shipping for orders over {freeShippingThreshold.toLocaleString()} Quantity
          </div>
        )}

        <div className="pt-2">
          <a href="#" className="text-gray-600 hover:underline">
            Continue Shopping
          </a>
        </div>

        <Button onClick={onNext} className={`w-full mt-2 gradient-border ${currentStep === 2 ? "bg-gradient-to-r from-[#910973] to-[#f2bc6c] text-white" : "bg-white"}`}>
          <span className={`${currentStep === 2 ? "text-white" : "gradient-text"} font-semibold`}>{buttonText} {currentStep === 2 && "$"+orderSummary.total.toFixed(2)}</span>
        </Button>
      </div>
    </div>
  )
}

