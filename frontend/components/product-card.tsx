'use client'
import { addToCartAction } from "@/actions/cart";
import { removeFromWishlistAction } from "@/actions/wish-list";
import { Heart } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProductCardProps {
  id: string; // Unique ID of the product
  imageUrl: string; // URL of the product image
  rating: number; // Star rating (e.g., 4.5)
  priceRange: string; // Price range (e.g., "$850 - $1,100")
  supplierName: string; // Name of the supplier
  minOrder: string; // Minimum order quantity (e.g., "200 pieces")
  verified: boolean; // Whether the supplier is verified
  yearsActive: number; // Years of operation (e.g., 2)
  location: string; // Location of the supplier (e.g., "CN Supplier")
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imageUrl,
  rating,
  priceRange,
  supplierName,
  minOrder,
  verified,
  yearsActive,
  location,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-72 min-w-[200px]">
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt="Product"
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-0 left-0 bg-black/50 w-full text-white p-2">
          <p>$5.90-10.90</p>
          <p>MOQ: 100 pieces</p>
        </div>
        <button
          className={`absolute bottom-2 right-2`}
          onClick={() => removeFromWishlistAction(id)}
        >
          <Heart fill="white" color="white" />
        </button>
      </div>

      {/* Star Rating */}
      <div className="mt-3 flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className={`w-5 h-5 ${
              index < Math.floor(rating) ? "text-[#FC9231]" : "text-gray-300"
            }`}
          >
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.001 5.848 1.42 8.305-7.419-4.015L4.581 24l1.42-8.305L0 9.306l8.332-1.151L12 .587z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600 text-sm">(12)</span>
      </div>

      {/* Price Range */}
      <p className="text-gray-800 text-lg font-semibold mt-2">{priceRange}</p>

      {/* Supplier Information */}
      <p className="text-gray-500 text-sm mt-1">{supplierName}</p>

      {/* Minimum Order */}
      <p className="text-gray-500 text-sm mt-1">Min Order: {minOrder}</p>

      {/* Supplier Details */}
      <div className="flex items-center mt-3 text-gray-600 text-sm space-x-2">
        {verified && (
          <Image
            src={"/verifiedLogo.png"}
            alt="verified logo"
            width={66.22}
            height={16}
          />
        )}
        <span className="text-[#767676]">{yearsActive} yrs</span>
        <span className="text-[#767676]">{location}</span>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-col space-y-2">
        <button className="bg-[#363638] text-white font-semibold py-2 rounded-lg transition">
          Contact Supplier
        </button>
        <button className="bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition" onClick={() => addToCartAction(id)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
