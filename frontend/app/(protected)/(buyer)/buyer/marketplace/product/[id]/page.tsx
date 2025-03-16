"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Play, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const productImages = [
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  "/placeholder.png",
  
]

const colors = [
  { name: "Brown", value: "brown", bg: "bg-amber-700" },
  { name: "Black", value: "black", bg: "bg-black" },
  { name: "Pink", value: "pink", bg: "bg-pink-300" },
  { name: "White", value: "white", bg: "bg-white border border-gray-200" },
  { name: "Red", value: "red", bg: "bg-red-600" },
  { name: "Gray", value: "gray", bg: "bg-gray-400" },
  { name: "Blue", value: "blue", bg: "bg-blue-600" },
  { name: "Yellow", value: "yellow", bg: "bg-yellow-400" },
]

const sizes = ["S", "M", "L", "XL", "2 XL", "3 XL"]

const printingMethods = [
  "Puff Printing",
  "Embossed",
  "Heat-transfer Printing",
  "Digital printing",
  "Silk screen printing",
]

export default function ProductDetail() {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("blue")
  const [selectedSize, setSelectedSize] = useState("S")
  const [selectedPrintingMethods, setSelectedPrintingMethods] = useState<string[]>(["Puff Printing"])
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)

  const thumbnailsPerView = 6
  const hasMoreThumbnails = productImages.length > thumbnailsPerView

  const handleThumbnailScroll = () => {
    if (thumbnailStartIndex + thumbnailsPerView >= productImages.length) {
      setThumbnailStartIndex(0)
    } else {
      setThumbnailStartIndex((prev) => prev + 1)
    }
  }

  const handlePrintingMethodToggle = (method: string) => {
    if (selectedPrintingMethods.includes(method)) {
      setSelectedPrintingMethods((prev) => prev.filter((m) => m !== method))
    } else {
      setSelectedPrintingMethods((prev) => [...prev, method])
    }
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <Link href="#" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image Gallery */}
        <div className="flex h-fit">
          {/* Thumbnail Vertical Carousel */}
          <div className="hidden sm:flex flex-col mr-4 space-y-2 relative">
            {productImages.slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerView).map((img, idx) => (
              <div
                key={idx + thumbnailStartIndex}
                className={cn(
                  "w-16 h-16 border rounded cursor-pointer overflow-hidden",
                  activeImageIndex === idx + thumbnailStartIndex ? "border-primary border-2" : "border-gray-200",
                )}
                onClick={() => setActiveImageIndex(idx + thumbnailStartIndex)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Product thumbnail ${idx + thumbnailStartIndex + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
            {hasMoreThumbnails && (
              <button
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-gray-700"
                onClick={handleThumbnailScroll}
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Main Image Carousel */}
          <div className="flex-1 relative border border-gray-200 rounded-md overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={productImages[activeImageIndex] || "/placeholder.svg"}
                alt={`Product image ${activeImageIndex + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white/80 rounded-full p-3 hover:bg-white">
                  <Play className="h-8 w-8 text-gray-800" />
                </button>
              </div>
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">
            Custom Cotton Plain Men Pullover Oversized French Terry 3d Foam Screen Puff Printing Hoodie
          </h1>

          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-500">No reviews yet</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="font-medium text-gray-900">#13</span>
            <span className="ml-1 text-sm text-gray-500">
              Most popular in Men's Regular Sleeve Hoodies & Sweatshirts
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span className="mr-2">Guangzhou Duoxi Trading Firm (Sole Proprietorship)</span>
            <span className="mr-2">1 yr.</span>
            <span className="flex items-center">
              <Image src="/placeholder.svg?height=20&width=30" alt="CN flag" width={20} height={14} className="mr-1" />
              CN
            </span>
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">2 - 999 pieces</div>
              <div className="text-xl font-bold">$0.99</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">1000 - 4999 pieces</div>
              <div className="text-xl font-bold">$0.43</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">&gt;= 5000 pieces</div>
              <div className="text-xl font-bold">$0.23</div>
            </div>
          </div>

          {/* Variations */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Variations</h2>
            <div className="text-sm text-gray-600 mb-4">Total options: 8 Color, 6 Size, 5 Printing Meth</div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Color(8): Blue</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    className={cn(
                      "w-10 h-10 rounded-md flex items-center justify-center",
                      selectedColor === color.value ? "ring-2 ring-primary ring-offset-2" : "",
                    )}
                    onClick={() => setSelectedColor(color.value)}
                  >
                    <span className={cn("w-8 h-8 rounded-md", color.bg)}></span>
                  </button>
                ))}
                <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">1</span>
                </button>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Size(6): S</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={cn(
                      "px-4 py-2 rounded-md border",
                      selectedSize === size
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-gray-200 text-gray-700 hover:border-gray-300",
                    )}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Printing Methods */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Printing Methods(5)</h3>
              <div className="flex flex-wrap gap-2">
                {printingMethods.map((method) => (
                  <button
                    key={method}
                    className={cn(
                      "px-4 py-2 rounded-md border text-sm",
                      selectedPrintingMethods.includes(method)
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-gray-200 text-gray-700 hover:border-gray-300",
                    )}
                    onClick={() => handlePrintingMethodToggle(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Shipping</h2>
            <p className="text-sm text-gray-600">
              Shipping solutions for the selected quantity are currently unavailable
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <Button className="flex-1 bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white font-semibold py-6">
              Send Enquiry
            </Button>
            <Button variant="outline" className="flex-1 font-semibold py-6 gradient-text gradient-border">
              Chat Now
            </Button>
          </div>

          {/* Protections */}
          <div className="flex items-center justify-between border-t pt-4">
            <h2 className="text-base font-medium">Protections for this product</h2>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

