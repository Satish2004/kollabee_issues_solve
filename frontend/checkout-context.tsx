"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
export interface Product {
  id: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
}

export interface OrderSummary {
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  totalQuantity: number
}

interface CheckoutContextType {
  // Cart state
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void

  // Shipping state
  shippingAddress: ShippingAddress
  updateShippingAddress: (address: Partial<ShippingAddress>) => void

  // Order summary
  orderSummary: OrderSummary

  // Loading states
  isLoading: boolean

  // API methods
  fetchProducts: () => Promise<void>
  submitOrder: () => Promise<{ success: boolean; orderId?: string; error?: string }>
}

// Default values
const defaultShippingAddress: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
}

const defaultOrderSummary: OrderSummary = {
  subtotal: 0,
  discount: 0,
  shippingCost: 50,
  total: 0,
  totalQuantity: 0,
}

// Create context
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

// Provider component
export function CheckoutProvider({ children }: { children: ReactNode }) {
  // Cart state
  const [products, setProducts] = useState<Product[]>([])

  // Shipping state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(defaultShippingAddress)

  // Order summary
  const [orderSummary, setOrderSummary] = useState<OrderSummary>(defaultOrderSummary)

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Update order summary whenever products change
  useEffect(() => {
    const subtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0)
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0)
    const discount = 0 // Could be calculated based on promo codes, etc.
    const shippingCost = totalQuantity >= 1000 ? 0 : 50

    setOrderSummary({
      subtotal,
      discount,
      shippingCost,
      total: subtotal - discount + shippingCost,
      totalQuantity,
    })
  }, [products])

  // Cart methods
  const addProduct = (product: Product) => {
    setProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.id === product.id)

      if (existingProduct) {
        return prevProducts.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + product.quantity } : p))
      }

      return [...prevProducts, product]
    })
  }

  const removeProduct = (productId: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === productId ? { ...p, quantity } : p)))
  }

  // Shipping methods
  const updateShippingAddress = (address: Partial<ShippingAddress>) => {
    setShippingAddress((prev) => ({ ...prev, ...address }))
  }

  // API methods
  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "T-Shirt",
          image: "/placeholder.svg?height=100&width=100",
          price: 12,
          quantity: 20000,
        },
        {
          id: "2",
          name: "Shipwreck Edibles",
          image: "/placeholder.svg?height=100&width=100",
          price: 0.04065,
          quantity: 123333,
        },
        {
          id: "3",
          name: "Shipwreck Edibles",
          image: "/placeholder.svg?height=100&width=100",
          price: 0.04065,
          quantity: 123333,
        },
      ]

      setProducts(mockProducts)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitOrder = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send the order data to your API
      const orderData = {
        products,
        shippingAddress,
        orderSummary,
      }

      console.log("Submitting order:", orderData)

      // Mock successful response
      return { success: true, orderId: "ORD-" + Math.floor(Math.random() * 1000000) }
    } catch (error) {
      console.error("Failed to submit order:", error)
      return { success: false, error: "Failed to submit order. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    products,
    addProduct,
    removeProduct,
    updateQuantity,
    shippingAddress,
    updateShippingAddress,
    orderSummary,
    isLoading,
    fetchProducts,
    submitOrder,
  }

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

// Custom hook to use the checkout context
export function useCheckout() {
  const context = useContext(CheckoutContext)

  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }

  return context
}

