"use client";

import Link from "next/link";
import { Plus, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";

interface ProductsHeaderProps {
  activeTab: "active" | "draft";
  setActiveTab: (tab: "active" | "draft") => void;
  isProfileComplete: boolean;
  remainingSteps: number[];
}

// Improve mobile header experience
export default function ProductsHeader({
  activeTab,
  setActiveTab,
  isProfileComplete,
  remainingSteps,
}: ProductsHeaderProps) {
  const [showProfileWarning, setShowProfileWarning] = useState(
    !isProfileComplete
  );

  return (
    <TooltipProvider>
      <div className="border-b">
        {/* Profile completion warning - collapsible on mobile */}
        {showProfileWarning && !isProfileComplete && (
          <div className="bg-amber-50 p-3 sm:p-4 border-b border-amber-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-start sm:items-center">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-sm text-amber-700">
                    Complete your profile to start selling products
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {remainingSteps.length}{" "}
                    {remainingSteps.length === 1 ? "step" : "steps"} remaining
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:ml-auto">
                <Link
                  href="/seller/profile"
                  className="text-xs sm:text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-md transition-colors"
                >
                  Complete Profile
                </Link>

                <button
                  className="sm:hidden ml-2 text-amber-700"
                  onClick={() => setShowProfileWarning(false)}
                  aria-label="Dismiss warning"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header with tabs and add button */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* Tabs - scrollable on mobile */}
          <div className="overflow-x-auto flex-1 border-b sm:border-b-0">
            <div className="flex space-x-4 px-4 py-3 sm:py-4 min-w-max">
              <button
                className={`px-1 py-1 text-sm font-medium border-b-2 ${
                  activeTab === "active"
                    ? "text-red-500 border-red-500"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("active")}
              >
                Active Products
              </button>
              <button
                className={`px-1 py-1 text-sm font-medium border-b-2 ${
                  activeTab === "draft"
                    ? "text-red-500 border-red-500"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("draft")}
              >
                Draft Products
              </button>
            </div>
          </div>

          {/* Add product button */}
          <div className="px-4 pb-3 sm:py-0 sm:pr-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Link
                    href={
                      isProfileComplete ? "/seller/products/add-product" : "#"
                    }
                    className={cn(
                      "flex items-center justify-center space-x-2 px-4 py-2 rounded-[6px] gradient-border bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]",
                      !isProfileComplete && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={(e) => !isProfileComplete && e.preventDefault()}
                  >
                    <Plus className="w-4 h-4 text-pink-500" strokeWidth={3} />
                    <span className="gradient-text font-semibold">
                      Add Product
                    </span>
                  </Link>
                </div>
              </TooltipTrigger>
              {!isProfileComplete && (
                <TooltipContent
                  side="top"
                  className="bg-zinc-900 text-white p-3 max-w-[280px] sm:max-w-[320px]"
                  sideOffset={5}
                >
                  <p className="font-medium text-sm mb-2">
                    Complete the remaining steps in Seller Profile
                  </p>
                  <p className="text-xs">
                    {remainingSteps.length > 0
                      ? `Remaining ${
                          remainingSteps.length > 1 ? "steps" : "step"
                        } to be completed: ${remainingSteps.join(", ")}`
                      : "All steps completed!"}
                  </p>
                  <div className="w-full flex justify-end mt-4">
                    <Link href="/seller/profile">
                      <Button className="bg-zinc-200 hover:bg-zinc-300 text-zinc-950">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
