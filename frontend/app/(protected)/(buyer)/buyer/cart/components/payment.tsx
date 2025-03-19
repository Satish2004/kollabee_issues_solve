"use client"

import React, { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { OrderSummary } from "./order-summary"
import { Button } from "@/components/ui/button"
import { useCheckout } from "../../../../../../checkout-context"
import { toast } from "sonner"

// Load Stripe.js asynchronously
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentProps {
  onNext: () => void
}

// Stripe Payment Form Component
const StripePaymentForm = ({ onSubmit, isLoading }) => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    })

    if (error) {
      console.error("Error creating payment method:", error)
      toast.error("Payment failed: " + error.message)
      return
    }

    // Call the onSubmit prop to handle the payment
    onSubmit(paymentMethod.id)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Card Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="p-3 border border-gray-300 rounded-md">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-md flex items-center justify-center font-semibold"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  )
}

export function Payment({ onNext }: PaymentProps) {
  const { products, orderSummary, submitOrder, isLoading } = useCheckout()
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const handlePayment = async (paymentMethodId: string) => {
    try {
      // Call your backend to create a payment intent
      const response = await fetch("/api/payment/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: orderSummary.total * 100, // Convert to cents
          currency: "usd",
          paymentMethodId,
          productIds: products.map((product) => product.id), // Include product IDs
          userId: "user_123", // Replace with actual user ID
        }),
      })

      const { success, clientSecret, orderId } = await response.json()

      if (success) {
        // Confirm the payment on the client side
        const { error } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethodId,
        })

        if (error) {
          throw new Error(error.message)
        }

        setOrderComplete(true)
        setOrderId(orderId)
        submitOrder() // Call your existing order submission logic
        toast.success("Payment successful!")
      } else {
        throw new Error("Payment failed. Please try again.")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error(error.message)
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
        <Elements stripe={stripePromise}>
          <StripePaymentForm onSubmit={handlePayment} isLoading={isLoading} />
        </Elements>
      </div>

      <div>
        <OrderSummary buttonText="Complete Order" />
      </div>
    </div>
  )
}