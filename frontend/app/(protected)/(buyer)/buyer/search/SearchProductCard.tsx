import React from "react";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface SearchProductCardProps {
  product: any;
}

export default function SearchProductCard({ product }: SearchProductCardProps) {
  // Example: product.priceRange = "$850.00-1,100.00" or use min/max price
  const priceRange = product.priceRange || (product.minPrice && product.maxPrice ? `$${product.minPrice}-${product.maxPrice}` : `$${product.price}`);
  return (
    <div className="bg-white rounded-2xl border border-[#F2F2F2] p-4 md:p-7 flex flex-col md:flex-row hover:shadow-lg transition-shadow w-full max-w-full items-stretch">
      {/* Image with wishlist icon */}
      <div className="relative w-full md:w-[260px] md:h-[195px] aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 mb-4 md:mb-0">
        <img
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          className="object-cover w-full h-full rounded-xl"
        />
        <button className="absolute bottom-4 right-4 bg-white border-2 border-white rounded-full p-2 shadow-md hover:bg-gray-100 transition flex items-center justify-center">
          <FaRegHeart className="text-2xl text-[#8C8C8C]" />
        </button>
      </div>
      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0 md:pl-6">
        {/* Top row: rating */}
        <div className="flex justify-end items-start mb-1">
          <div className="flex items-center gap-1 text-xs text-[#222] font-medium">
            <FaStar className="text-[#F9A826] text-base" />
            <span>{product.rating || "5.0"}</span>
            <span className="text-[#8C8C8C]">/5.0</span>
            <span className="ml-1 text-[#8C8C8C] font-normal">({product.reviewCount || 11} reviews)</span>
          </div>
        </div>
        {/* Title/desc */}
        <div className="flex items-center gap-1 text-sm text-[#C8894B] mb-1">
          <span className="inline-block">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 1.333l2.06 4.177 4.607.669-3.334 3.25.787 4.584L8 11.177l-4.12 2.836.787-4.584-3.334-3.25 4.607-.669L8 1.333z" fill="#C8894B"/></svg>
          </span>
          <span className="font-semibold text-base md:text-lg line-clamp-1">{product.name}</span>
        </div>
        <div className="text-sm text-[#8C8C8C] mb-2 line-clamp-2">
          {product.description || "Stamped ss 316 304 stainless steel 3d wall panel design embossed stainless steel plate"}
        </div>
        {/* Price */}
        <div className="text-[2rem] leading-none font-extrabold text-[#111] mb-2">{priceRange}</div>
        {/* Min order */}
        <div className="text-sm text-[#222] mb-3">
          Min. order: <span className="font-medium">{product.minOrderQuantity || "1 ton"}</span>
        </div>
        {/* Supplier info */}
        <div className="flex items-center gap-2 text-sm mb-2 flex-wrap">
          <span className="font-semibold text-[#111]">{product.seller?.businessName || "Shandong Great Steel Co.,Ltd"}</span>
          <span className="text-[#8C8C8C]">{product.seller?.years || 2} yrs</span>
          {/* Country flag and code */}
          {product.seller?.countryCode && (
            <span className="flex items-center gap-1">
              <img src={`https://flagcdn.com/16x12/${product.seller.countryCode.toLowerCase()}.png`} alt={product.seller.countryCode} className="inline-block w-4 h-3 rounded-sm border" />
              <span className="text-[#8C8C8C] text-xs">{product.seller.countryCode} Supplier</span>
            </span>
          )}
          {/* Fallback */}
          {!product.seller?.countryCode && (
            <span className="flex items-center gap-1">
              <span className="text-[#8C8C8C] text-xs">CN Supplier</span>
            </span>
          )}
          {/* Verified badge */}
          {product.seller?.verified && (
            <span className="text-[#1A73E8] font-bold ml-2">Verified</span>
          )}
        </div>
        {/* Action buttons */}
        <div className="flex gap-4 mt-2">
          <Button className="rounded-[8px] px-7 py-2.5 font-semibold text-white bg-gradient-to-r from-[#C02090] to-[#F9A826] hover:from-[#a01a7a] hover:to-[#e28c1c] shadow-md text-base">Contact Supplier</Button>
          <Button variant="outline" className="rounded-[8px] px-7 py-2.5 font-semibold border-2 border-[#F9A826] text-[#C02090] bg-white hover:bg-[#FFF7E6] text-base">Send Enquiry</Button>
        </div>
      </div>
    </div>
  );
} 