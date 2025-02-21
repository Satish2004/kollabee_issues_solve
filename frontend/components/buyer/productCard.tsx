'use client'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    wholesalePrice: number
    minOrderQuantity: number
    availableQuantity: number
    images: string[]
    seller: {
      id: string
      businessName: string
      country: string
      yearEstablished?: number
      isVerified?: boolean
    }
    category: {
      id: string
      name: string
    }
  }
  onContactClick?: () => void
  onEnquiryClick?: () => void
}

const ProductCard = ({
  product,
  onContactClick,
  onEnquiryClick
}: ProductCardProps) => {
  const {
    name,
    images,
    price,
    wholesalePrice,
    minOrderQuantity,
    seller,
  } = product

  const yearsActive = seller.yearEstablished 
    ? new Date().getFullYear() - seller.yearEstablished 
    : 0

  return (
    <div className="w-full max-w-sm rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      {/* Image Container */}
      <div className="relative aspect-square">
        <Image
          src={images[0] || '/placeholder-product.jpg'}
          alt={name}
          fill
          className="object-cover"
        />
        <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900">
          <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Price and Product Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
            {name}
          </h3>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              ${wholesalePrice.toLocaleString()} - ${price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Min. order: {minOrderQuantity} Pieces
            </div>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {seller.businessName}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {yearsActive > 0 && <span>{yearsActive} yrs</span>}
            <div className="flex items-center gap-1">
              <img 
                src={`https://flagcdn.com/${seller.country.toLowerCase()}.svg`} 
                alt={seller.country}
                className="w-4 h-3"
              />
              <span>{seller.country} Supplier</span>
            </div>
            {seller.isVerified && (
              <span className="text-blue-600 dark:text-blue-400">Verified</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onContactClick}
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-orange-400 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Contact Supplier
          </button>
          <button
            onClick={onEnquiryClick}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Send Enquiry
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
