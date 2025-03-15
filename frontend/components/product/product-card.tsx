import { Heart } from "lucide-react"
import Image from "next/image"
import React from "react"

interface ProductCardProps {
  image: string
  rating: number
  reviews: number
  priceRange: string
  minOrder: string
  supplier: {
    name: string
    years: number
    country: string
    verified: boolean
  }
}

export default function ProductCard({
  image,
  rating = 5.0,
  reviews = 11,
  priceRange = "$850.00-1,100.00",
  minOrder = "200 Pieces",
  supplier = {
    name: "Marcos Cottons Co.,Ltd",
    years: 2,
    country: "CN",
    verified: true,
  },
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt="Product"
          width={400}
          height={300}
          className="w-full aspect-[4/3] object-cover bg-gray-200"
        />
        <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-end text-sm">
          <span className="font-medium">{rating}</span>
          <span className="text-gray-500">/5.0</span>
          <span className="text-gray-500 ml-1">({reviews} reviews)</span>
        </div>

        <div>
          <div className="text-2xl mb-1 font-medium">{priceRange}</div>
          <div className="text-sm text-gray-500">Min. order: {minOrder}</div>
        </div>

        <div className="space-y-1">
          <div className="font-medium">{supplier.name}</div>
          <div className="flex items-center justify-between text-sm text-gray-500 space-x-2">
            <div className="flex items-center  space-x-2">
                <span>{supplier.years} yrs</span>
                <div className="flex items-center">
                <span className="w-4 h-3 bg-red-500 mr-1" /> {/* Placeholder for flag */}
                <span>{supplier.country} Supplier</span>
                </div>
            </div>
            {supplier.verified && (
              <div className="flex items-center  text-green-600">
                <span className="text-sm font-semibold">Verified</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <button className="w-full py-2.5 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-[#950b72] to-[#f2bd6d]">
            Contact Supplier
          </button>
          <button className="w-full py-2.5 px-4 rounded-lg gradient-border">
             <span className="gradient-text font-semibold"> Send Enquiry</span>
          </button>
        </div>
      </div>
    </div>
  )
}

