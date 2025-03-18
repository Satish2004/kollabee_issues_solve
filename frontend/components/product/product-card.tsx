  import { Heart } from "lucide-react"
  import Image from "next/image"
  import React from "react"
  import { Button } from "@/components/ui/button"
  import { cartApi } from "@/lib/api/cart"
  import { useCheckout } from "@/checkout-context"
import { set } from "date-fns"


  interface ProductCardProps {
    product: any;
    isInCart: (productId: string) => boolean;
    removeFromCart: (productId: string) => void;
  }
  
  export default function ProductCard({ product, isInCart, removeFromCart }: ProductCardProps) {
    const { products, setProducts } = useCheckout()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleCart = async () => {
      if (!isInCart(product.id)) {
        setIsLoading(true)
        const response = await cartApi.addToCart({productId: product.id,  quantity: product.minOrderQuantity})
        const updatedCart = await response
        setProducts(updatedCart?.items)
      }
      else {
        removeFromCart(product.id)
      }
      setIsLoading(false)
    }

    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="relative">
          <Image
            src={product.images[0] || "/placeholder.svg"}
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
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-500">/5.0</span>
            <span className="text-gray-500 ml-1">({product.reviewCount} reviews)</span>
          </div>

          <div>
            <div className="text-2xl mb-1 font-medium">{product.price}</div>
            <div className="text-sm text-gray-500">Min. order: {product.minOrderQuantity}</div>
          </div>

          <div className="space-y-1">
            <div className="font-medium">{product.seller.businessName}</div>
            <div className="flex items-center justify-between text-sm text-gray-500 space-x-2">
              <div className="flex items-center  space-x-2">
                  <span>{findYearDifference(product.seller.yearEstablished)} yrs</span>
                  <div className="flex items-center">
                  <span className="w-4 h-3 bg-red-500 mr-1" /> {/* Placeholder for flag */}
                  <span>{product.seller.country} Supplier</span>
                  </div>
              </div>
              {product.seller.verified && (
                <div className="flex items-center  text-green-600">
                  <span className="text-sm font-semibold">Verified</span>
                </div>
                //TODO: THERE IS NO VERIFIED DATA IN SELLER (BY ANURAG)
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={handleCart} className="w-full py-6 px-4 rounded-md text-white font-semibold bg-gradient-to-r from-[#950b72] via-[#e0655d] to-[#f2bd6d]">
              {isLoading ? "Adding..." : isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
            </Button>
            <Button className="w-full py-6 px-4 rounded-lg gradient-border">
              <span className="gradient-text font-semibold">Contact Supplier</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const findYearDifference = (startYear: string) => {
    const currentYear = new Date().getFullYear()
    const startYearNum = parseInt(startYear)
    return currentYear - startYearNum
  }