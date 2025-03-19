"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { cartApi } from "@/lib/api/cart"

// Types
export interface Product {
  id: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface Address {
  id: string
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  isDefault?: boolean
}

export interface OrderSummary {
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  totalQuantity: number
}

interface CheckoutContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  // Cart state
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void

  // Shipping state
  savedAddresses: Address[]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  currentAddress: Address | null
  updateCurrentAddress: (address: Partial<Address>) => void
  addNewAddress: (address: Address) => void

  // Order summary
  orderSummary: OrderSummary

  // Loading states
  isLoading: boolean

  // API methods
  fetchProducts: () => Promise<void>
  fetchAddresses: () => Promise<void>
  submitOrder: () => Promise<{ success: boolean; orderId?: string; error?: string }>
}

// Default values
const defaultAddress: Address = {
  id: "",
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
  const [currentStep, setCurrentStep] = useState(1)


  // Shipping state
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null)

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

  // Update current address when selected address changes
  useEffect(() => {
    if (selectedAddressId) {
      const address = savedAddresses.find((addr) => addr.id === selectedAddressId) || null
      setCurrentAddress(address)
    } else {
      setCurrentAddress(null)
    }
  }, [selectedAddressId, savedAddresses])

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
  const updateCurrentAddress = (address: Partial<Address>) => {
    setCurrentAddress((prev) => {
      if (!prev) {
        return { ...defaultAddress, ...address, id: `new-${Date.now()}` }
      }
      return { ...prev, ...address }
    })
  }

  const addNewAddress = (address: Address) => {
    const newAddress = { ...address, id: address.id || `addr-${Date.now()}` }
    setSavedAddresses((prev) => [...prev, newAddress])
    setSelectedAddressId(newAddress.id)
  }

  // API methods
  const fetchProducts = async () => {
    setIsLoading(true)
    try {

      const response = await cartApi.getCart()
      setProducts(response?.items)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAddresses = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Mock data
      const mockAddresses: Address[] = [
        {
          id: "addr-1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          phone: "(123) 456-7890",
          isDefault: true,
        },
        {
          id: "addr-2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          address: "456 Park Ave",
          city: "Boston",
          state: "MA",
          zipCode: "02108",
          phone: "(987) 654-3210",
          isDefault: false,
        },
      ]

      setSavedAddresses(mockAddresses)

      // Set default address
      const defaultAddr = mockAddresses.find((addr) => addr.isDefault)
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id)
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error)
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
        shippingAddress: currentAddress,
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
    setProducts,
    addProduct,
    removeProduct,
    updateQuantity,
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    currentAddress,
    updateCurrentAddress,
    addNewAddress,
    orderSummary,
    isLoading,
    fetchProducts,
    fetchAddresses,
    submitOrder,
    currentStep,
    setCurrentStep
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

