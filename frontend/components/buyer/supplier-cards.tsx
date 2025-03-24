"use client"

import React, { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

const suppliers = Array(5).fill({
  name: "Hangzhou Honghao Electron Co., Ltd.",
  performance: "4.6/5",
  certified: true,
  deliveryRate: "87.5% on-time delivery rate",
})

export default function SupplierCards({sellers}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current

      // Check if we can scroll left (not at the beginning)
      setCanScrollLeft(scrollLeft > 0)

      // Check if we can scroll right (not at the end)
      // Add a small buffer (1px) to account for rounding errors
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
    }
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current

    // Initial check
    checkScrollButtons()

    // Add scroll event listener
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollButtons)

      // Check on window resize too
      window.addEventListener("resize", checkScrollButtons)
    }

    // Cleanup
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScrollButtons)
      }
      window.removeEventListener("resize", checkScrollButtons)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = 300

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {canScrollLeft && (
        <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-gray-100 shadow-md flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide max-w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        { sellers && sellers.map((supplier, index) => (
          <div key={index} className="max-w-[240px] bg-gray-100 rounded-lg p-6 flex-shrink-0">
            <h3 className=" font-medium mb-3">{supplier.businessName}</h3>

            <div className="space-y-1 mb-4">
              <div className="flex items-center text-pink-600">
                <span className="text-sm mr-1">Performance:</span>
                <span className="text-sm ">{supplier.rating || 0}/5</span>
              </div>
              <div className="text-sm">Certified Seller</div>
              <div className="text-sm">{supplier.exportPercentage || 0}% Export</div>
            </div>

            <Link href={"#"}>
            <Button className="w-full py-2 text-sm font-semibold shadow-none rounded-md gradient-border gradient-text">
              View Supplier Profile
            </Button>
            </Link>
          </div>
        ))}
      </div>

      {canScrollRight && (
        <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-gray-100 shadow-md flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

