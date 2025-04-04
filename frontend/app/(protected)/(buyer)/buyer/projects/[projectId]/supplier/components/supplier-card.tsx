"use client";

import { Star, Bookmark, Send, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSuppliers } from "../context/supplier-context";
import type { Supplier } from "../context/supplier-context";

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const {
    savedSuppliers,
    requestedSuppliers,
    toggleSaveSupplier,
    sendRequest,
  } = useSuppliers();

  // Check if this supplier is saved
  const isSaved = savedSuppliers.includes(supplier.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden transition-all hover:shadow-md">
      <div className="relative flex justify-center items-center bg-blue-900 h-40 group">
        <Image
          src={supplier.logo || "/placeholder.svg?height=200&width=200"}
          alt={`${supplier.name} logo`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Save button */}
        <button
          onClick={() => toggleSaveSupplier(supplier.id)}
          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-opacity duration-200 opacity-70 group-hover:opacity-100"
          aria-label={isSaved ? "Unsave supplier" : "Save supplier"}
        >
          <Bookmark
            className={`h-4 w-4 ${
              isSaved ? "text-[#e00261] fill-[#e00261]" : "text-gray-700"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-1">
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {supplier.rating.toFixed(1)}/5.0
            </span>
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({supplier.reviews} reviews)
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {supplier.description}
        </p>

        <h3 className="font-medium text-sm mb-2">{supplier.productType}</h3>
        <div className="font-bold mb-1">{supplier.priceRange}</div>
        <div className="text-sm text-gray-600 mb-3">{supplier.minOrder}</div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">{supplier.name}</div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">
              {supplier.age} yrs
            </span>
            <Badge
              variant="outline"
              className="bg-red-50 text-red-500 border-red-200 text-xs"
            >
              {supplier.country}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {supplier.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50">
              {tag}
            </Badge>
          ))}
          {supplier.tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-50">
              +{supplier.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center">
          {supplier.verified && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-500 border-blue-200"
            >
              Verified
            </Badge>
          )}
          <Button
            className={`w-full ml-2 ${
              requestedSuppliers.includes(supplier.id)
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gradient-to-r from-[#e00261] to-[#f0b168] hover:from-[#c80057] hover:to-[#e0a058]"
            } text-white border-none`}
            onClick={() => sendRequest(supplier)}
            disabled={requestedSuppliers.includes(supplier.id)}
          >
            {requestedSuppliers.includes(supplier.id) ? (
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Request Sent
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="h-4 w-4 mr-2" />
                Send Request
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
