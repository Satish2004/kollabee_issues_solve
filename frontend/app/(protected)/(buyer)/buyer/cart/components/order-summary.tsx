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
  const { subtotal, discount, shippingCost, totalQuantity, total } = orderSummary

  const freeShippingThreshold = 1000

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="space-y-3">
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

        {
          currentStep === 2 || currentStep === 3 && (
            <>
            <hr className='bg-gray-300 my-4 w-full'></hr>

            <div className="flex justify-between">
              <span className="text-gray-700 font-[900] text-sm">TOTAL</span>
              <span className="font-medium text-pink-500">${total.toFixed(2)}</span>
            </div>
            </>
          )
        }

        {totalQuantity < freeShippingThreshold && currentStep === 2 && (
          <div className="text-sm text-gray-400">
            Get Free Shipping for orders over <span className="text-gray-600 text-semibold">{freeShippingThreshold.toLocaleString()} Quantity</span>
          </div>
        )}

        {
          currentStep === 2 && (
            <div className="-translate-y-2">
            <a href="/buyer/marketplace" className="text-gray-600 hover:underline text-sm">
              Continue Shopping
            </a>
          </div>
          )
        }

        {
          currentStep !== 3 && (
            <Button onClick={onNext} className={`w-full mt-2 gradient-border ${currentStep === 2 ? "bg-gradient-to-r from-[#910973] to-[#f2bc6c] text-white" : "bg-white"}`}>
            <span className={`${currentStep === 2 ? "text-white" : "gradient-text"} font-semibold`}>{buttonText} {currentStep === 2 && "$"+orderSummary.total.toFixed(2)}</span>
          </Button>
          )
        }
      </div>
    </div>
  )
}

