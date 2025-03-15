"use client"
import React from "react"
import { ArrowLeft, Box, CheckCircle2, MapPin, ShieldCheck, Truck, User2 } from "lucide-react"
import Link from "next/link"

// Dummy data to simulate backend response
const orderData = {
  orderNumber: "96459761",
  products: 4,
  orderDate: "17 Jan, 2021 at 7:32 PM",
  expectedDate: "23 Jan, 2021",
  amount: 1199.0,
  status: "packaging",
  timeline: [
    {
      id: 1,
      title: "Your order has been delivered. Thank you for shopping at Clicon!",
      date: "23 Jan, 2021 at 7:32 PM",
      icon: CheckCircle2,
    },
    {
      id: 2,
      title: "Our delivery man (John Wick) Has picked-up your order for delivery.",
      date: "23 Jan, 2021 at 2:00 PM",
      icon: User2,
    },
    {
      id: 3,
      title: "Your order has reached at last mile hub.",
      date: "22 Jan, 2021 at 8:00 AM",
      icon: MapPin,
    },
    {
      id: 4,
      title: "Your order on the way to (last mile) hub.",
      date: "21, 2021 at 5:32 AM",
      icon: Truck,
    },
    {
      id: 5,
      title: "Your order is successfully verified.",
      date: "20 Jan, 2021 at 7:32 PM",
      icon: ShieldCheck,
    },
    {
      id: 6,
      title: "Your order has been confirmed.",
      date: "19 Jan, 2021 at 2:61 PM",
      icon: Box,
    },
  ],
}

const steps = [
  { id: 1, title: "Order Placed", icon: Box },
  { id: 2, title: "Packaging", icon: Box },
  { id: 3, title: "On The Road", icon: Truck },
  { id: 4, title: "Delivered", icon: CheckCircle2 },
]

const getStepStatus = (stepIndex: number, currentStep: string) => {
  const currentStepIndex = steps.findIndex((step) => step.title.toLowerCase() === currentStep.toLowerCase())
  if (stepIndex < currentStepIndex) return "completed"
  if (stepIndex === currentStepIndex) return "current"
  return "upcoming"
}

export default function OrderTracking() {
  return (
    <div className="mx-auto bg-white min-h-screen">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="ml-2 text-lg font-medium">Track Order</h1>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium">#{orderData.orderNumber}</h2>
            <span className="text-xl font-medium">${orderData.amount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600">
            {orderData.products} Products • Order Placed in {orderData.orderDate}
          </p>
        </div>

        {/* Expected Date */}
        <p className="text-sm text-gray-600 mb-6">Order expected arrival {orderData.expectedDate}</p>

        {/* Stepper */}
        <div className="mb-8">
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index, orderData.status)
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      status === "completed"
                        ? "bg-red-500 text-white"
                        : status === "current"
                          ? "bg-red-500 text-white"
                          : "bg-gray-200"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  <p
                    className={`mt-2 text-sm ${status === "upcoming" ? "text-gray-400" : "text-gray-900 font-medium"}`}
                  >
                    {step.title}
                  </p>
                </div>
              )
            })}
            {/* Progress Line */}
            <div className="absolute top-4 left-10 h-[2px] w-[94%] -translate-y-1/2 z-0">
              <div className="h-full bg-gray-200">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{
                    width:
                      orderData.status === "packaging"
                        ? "35%"
                        : orderData.status === "on the road"
                          ? "65%"
                          : orderData.status === "delivered"
                            ? "100%"
                            : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Activity */}
        <div>
          <h2 className="text-lg font-bold mb-4">Order Activity</h2>
          <div className="space-y-4">
            {orderData.timeline.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="mt-1">
                  <item.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

