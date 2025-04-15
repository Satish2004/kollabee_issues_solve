"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { OrderItem } from "@/types/order";

interface ProductDetailCarouselProps {
  item: OrderItem;
}

export default function ProductDetailCarousel({
  item,
}: ProductDetailCarouselProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = item.product;
  const images =
    product.images.length > 0
      ? product.images
      : ["/placeholder.svg?height=300&width=300"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      {/* Basic Info - Always Visible */}
      <div className="p-3 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <div className="w-12 h-16 bg-gray-100 mr-3 flex-shrink-0 overflow-hidden rounded">
            <Image
              src={product.images[0] || "/placeholder.svg?height=80&width=60"}
              alt={product.name}
              width={60}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-xs text-gray-500">
              Seller: {item.seller.businessName}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-xs mr-4">
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
              <p className="text-xs font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center text-xs text-gray-600 hover:text-gray-900"
        >
          {showDetails ? (
            <>
              <span className="mr-1">Less</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="mr-1">Details</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Detailed Info - Visible on Toggle */}
      {showDetails && (
        <div className="border-t">
          {/* Image Carousel */}
          <div className="relative h-64 bg-gray-100">
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`Product image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full ${
                        index === currentImageIndex
                          ? "bg-gray-800"
                          : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Details */}
          <div className="p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Product Details</h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {product.description && (
                <div className="col-span-2 mb-2">
                  <p className="text-gray-500">Description:</p>
                  <p>{product.description || "No description available"}</p>
                </div>
              )}

              {product.discount > 0 && (
                <div>
                  <p className="text-gray-500">Discount:</p>
                  <p className="text-green-600">{product.discount}%</p>
                </div>
              )}

              {product.deliveryCost > 0 && (
                <div>
                  <p className="text-gray-500">Delivery Cost:</p>
                  <p>${product.deliveryCost.toFixed(2)}</p>
                </div>
              )}

              {product.material && (
                <div>
                  <p className="text-gray-500">Material:</p>
                  <p>{product.material}</p>
                </div>
              )}

              {product.color && (
                <div>
                  <p className="text-gray-500">Color:</p>
                  <p>{product.color}</p>
                </div>
              )}

              {/* Display product attributes if they exist and have values */}
              {product.attributes &&
                Object.entries(product.attributes).map(([key, value]) =>
                  value && value !== "" ? (
                    <div key={key}>
                      <p className="text-gray-500">{key}:</p>
                      <p>{value}</p>
                    </div>
                  ) : null
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
