"use client"

import React, { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

import { CheckoutProvider, useCheckout } from "../../../../../checkout-context"
import { ShoppingCart } from "./components/shopping-cart"
import { ShippingAddress } from "./components/shipping-address"
import { Payment } from "./components/payment"
import OrderConfirmation from "./components/order-confirmation"

export default function CheckoutStepper() {

  const { currentStep, setCurrentStep } = useCheckout()

  const steps = [
    { id: 1, name: "Shopping Cart" },
    { id: 2, name: "Shipping Address" },
    { id: 3, name: "Payment" },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShoppingCart onNext={handleNext} />
      case 2:
        return <ShippingAddress onNext={handleNext} />
      case 3:
        return <Payment onNext={() => setCurrentStep(4)} />
      case 4:
        return <OrderConfirmation />
      default:
        return null
    }
  }

  return (
    <div className="mx-auto px-4 bg-gray-100">
    <div className="mb-4 bg-white px-10 rounded-xl pt-5 pb-8">
          <div className="flex items-center justify-start">
            {steps.map((step, index) => (
 <div key={step.id} className="flex items-center">
 <div className="flex flex-col items-center w-fit  cursor-pointer" onClick={() => setCurrentStep(currentStep - step.id > 0 ? currentStep - step.id : currentStep)}>
{/* Step circle */}
 <div
 className={cn(
   "flex items-center justify-center w-10 h-10 rounded-full border-2",
   currentStep > step.id
     ? "bg-green-500 border-green-500" // Completed step
     : currentStep === step.id
       ? "border-green-500" // Current step
       : "border-gray-300", // Future step
 )}
>
 {currentStep > step.id ? (
   <Check className="h-5 w-5 text-white" />
 ) : (
   <span
     className={cn("text-sm font-medium", currentStep === step.id ? "text-green-500" : "text-gray-500")}
   >
     {String(step.id).padStart(2, "0")}
   </span>
 )}
</div>
 <div  className="text-center relative">
 <span className={cn("text-sm font-medium absolute -left-8 text-nowrap", currentStep >= step.id ? "text-black" : "text-gray-400")}>
     {step.name}
 </span>
 </div>
 </div>

{/* Connecting line */}
{index < steps.length - 1 && (
 <div
   className={cn(
     "w-24 sm:w-32 md:w-40 h-0.5 mx-1",
     currentStep > step.id + 1 || (currentStep > step.id && currentStep === step.id + 1)
       ? "bg-green-500"
       : "bg-gray-300",
   )}
 />
)}
</div>
            ))}
          </div>

        </div>

        {/* Step content */}
        <div className="pt-6 bg-white rounded-xl">{renderStepContent()}</div>
      </div>
  )
}






 