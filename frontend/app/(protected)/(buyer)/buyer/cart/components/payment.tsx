"use client"

import React from "react"

import { useState } from "react"
import { OrderSummary } from "./order-summary"
import { Form, FormField, Input } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useCheckout } from "../../../../../../checkout-context"

interface PaymentProps {
  onNext: () => void
}

export function Payment({ onNext }: PaymentProps) {
  const { products, currentAddress, orderSummary, submitOrder, isLoading } = useCheckout()
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  })
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentDetails.cardName) {
      newErrors.cardName = "Name on card is required"
    }

    if (!paymentDetails.cardNumber) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number"
    }

    if (!paymentDetails.expiry) {
      newErrors.expiry = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiry)) {
      newErrors.expiry = "Please use MM/YY format"
    }

    if (!paymentDetails.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits"
    }

    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    const result = await submitOrder()

    if (result.success) {
      setOrderComplete(true)
      setOrderId(result.orderId || null)
      onNext()
    } else {
      setError(result.error || "An error occurred while processing your order.")
    }
  }

  if (orderComplete) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg border">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            {orderId && <p className="text-sm text-gray-500">Order ID: {orderId}</p>}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-medium mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span>
                    {product.name} × {product.quantity.toLocaleString()}
                  </span>
                  <span>${(product.price * product.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-6">Payment</h2>

          <Button
            className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md flex items-center justify-center"
          >
              "Complete Order"
          </Button>
      </div>

      <div>
        <OrderSummary buttonText="Complete Order" />
      </div>
    </div>
  )
}

