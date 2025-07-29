"use client"

import type React from "react"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CategoryCarouselProps {
    category: string
    handleCategoryChange: (value: string) => void
    productsLoading: boolean
    CATEGORY_OPTIONS: Array<{ value: string; label: string; icon?: React.ReactNode }>
}

export default function CategoryCarousel({
    category,
    handleCategoryChange,
    productsLoading,
    CATEGORY_OPTIONS,
}: CategoryCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
        }
    }

    const categories = [{ value: "all", label: "All", icon: <Sparkles className="w-4 h-4" /> }, ...CATEGORY_OPTIONS]

    return (
        <div className="w-1/1 mb-6 border-b-2 border-gray-200 pb-6">
            <div className="relative">
                {/* Left scroll button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white shadow-md hover:bg-gray-50"
                    onClick={scrollLeft}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Scrollable container */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide gap-2 px-10 scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => handleCategoryChange(cat.value)}
                            disabled={productsLoading}
                            className={cn(
                                "flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 min-w-[72px] text-center flex-shrink-0",
                                category === cat.value ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                                productsLoading && "opacity-75 cursor-not-allowed",
                            )}
                        >
                            {cat.icon && <div className="mb-1">{cat.icon}</div>}
                            <span className="text-[10px] sm:text-xs whitespace-nowrap">{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Right scroll button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white shadow-md hover:bg-gray-50"
                    onClick={scrollRight}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
