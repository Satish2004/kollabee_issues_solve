"use client"

import React from "react"

import { OrderSummary } from "./order-summary"
import { useCheckout } from "../../../../../../checkout-context"


interface ShippingAddressProps {
  onNext: () => void
}

export function ShippingAddress({ onNext }: ShippingAddressProps) {
  const { shippingAddress, updateShippingAddress } = useCheckout()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateShippingAddress({ [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={shippingAddress.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={shippingAddress.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={shippingAddress.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingAddress.address}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="123 Main St"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="New York"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingAddress.state}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="NY"
                required
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="10001"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="(123) 456-7890"
              required
            />
          </div>
        </form>
      </div>

      <div>
        <OrderSummary onNext={onNext} buttonText="Next" />
      </div>
    </div>
  )
}

