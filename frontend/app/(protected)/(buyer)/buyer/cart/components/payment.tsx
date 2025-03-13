"use client"

import  React from "react"
import { useState } from "react"
import { OrderSummary } from "./order-summary"
import { useCheckout } from "../../../../../../checkout-context"


interface PaymentProps {
  onNext: () => void
}

export function Payment({ onNext }: PaymentProps) {
  const { products, shippingAddress, orderSummary, submitOrder, isLoading } = useCheckout()
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

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

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium mb-1">
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={paymentDetails.cardName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiry"
                name="expiry"
                value={paymentDetails.expiry}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="123"
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="saveCard"
                name="saveCard"
                checked={paymentDetails.saveCard}
                onChange={handleChange}
                className="mt-1 mr-2"
              />
              <label htmlFor="saveCard" className="text-sm">
                Save this card for future purchases
              </label>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-600">
              <p>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p>{shippingAddress.phone}</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <span className="mr-2 animate-spin">◌</span>
                Processing...
              </>
            ) : (
              "Complete Order"
            )}
          </button>
        </form>
      </div>

      <div>
        <OrderSummary buttonText="Complete Order" />
      </div>
    </div>
  )
}

