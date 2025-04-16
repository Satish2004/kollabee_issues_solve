"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"

interface ProductsHeaderProps {
  activeTab: "active" | "draft"
  setActiveTab: (tab: "active" | "draft") => void
  isProfileComplete: boolean
  remainingSteps: number[]
}

export default function ProductsHeader({
  activeTab,
  setActiveTab,
  isProfileComplete,
  remainingSteps,
}: ProductsHeaderProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "active" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Products
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "draft" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("draft")}
          >
            Draft Products
          </button>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Link
                href={isProfileComplete ? "/seller/products/add-product" : "#"}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-[6px] gradient-border bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]",
                  !isProfileComplete && "opacity-50 cursor-not-allowed",
                )}
                onClick={(e) => !isProfileComplete && e.preventDefault()}
              >
                <Plus className="w-4 h-4 text-pink-500" strokeWidth={3} />
                <span className="gradient-text font-semibold">Add Product</span>
              </Link>
            </div>
          </TooltipTrigger>
          {!isProfileComplete && (
            <TooltipContent side="top" className="-ml-28 bg-zinc-900 text-white p-3">
              <p className="font-medium text-sm mb-2">Complete the remaining steps in Seller Profile</p>
              <p className="text-xs">
                {remainingSteps.length > 0
                  ? `Remaining ${
                      remainingSteps.length > 1 ? "steps" : "step"
                    } to be completed: ${remainingSteps.join(", ")}`
                  : "All steps completed!"}
              </p>
              <div className="w-full flex justify-end mt-4">
                <Link href="/seller/profile">
                  <Button className="bg-zinc-200 hover:bg-zinc-300 text-zinc-950">Complete Profile</Button>
                </Link>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
