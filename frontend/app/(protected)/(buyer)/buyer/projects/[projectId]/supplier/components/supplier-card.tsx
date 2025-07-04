"use client";

import { Star, Bookmark, Send, CheckCircle, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSuppliers } from "../context/supplier-context";
import type { Supplier } from "../context/supplier-context";
import { toast } from "sonner";

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const {
    savedSuppliers,
    requestedSuppliers,
    toggleSaveSupplier,
    sendRequest,
    hiredSuppliers,
    savingSuppliers,
    activeTab,
  } = useSuppliers();

  // Check if this supplier is saved
  const isSaved = savedSuppliers.includes(supplier.id);

  // Check if this supplier is currently being saved/unsaved
  const isSaving = savingSuppliers[supplier.id];

  // Check if this supplier was hired in the past
  const wasHiredInPast = hiredSuppliers.includes(supplier.id);

  // Handle send request with order creation message
  const handleSendRequest = async () => {
    try {
      await sendRequest(supplier);
      toast.success("Order request sent successfully! Order will be created once supplier accepts.");
    } catch (error) {
      toast.error("Failed to send request");
    }
  };

  // Format supplier data from either existing or new API structure
  const formattedSupplier = {
    id: supplier.id,
    name: supplier.businessName || supplier.user?.name || "Unknown Supplier",
    logo: supplier.businessLogo || supplier.user?.imageUrl || "/placeholder.svg",
    description: supplier.businessDescription || supplier.comments || "No description available",
    productType: supplier.businessCategories?.join(", ") || "Various products",
    priceRange: getPriceRange(supplier),
    minOrder: `Min. order: ${supplier.minimumOrderQuantity || "N/A"}`,
    rating: supplier.rating || 0,
    reviews: supplier.products?.length || 0,
    age: new Date().getFullYear() - (supplier.yearEstablished || new Date().getFullYear()),
    country: supplier.country || supplier.user?.country || "Unknown",
    verified: supplier.approved || false,
    tags: getSupplierTags(supplier),
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden transition-all hover:shadow-md">
      <div className="relative flex justify-center items-center bg-gray-100 h-40 group">
        <Image
          src={formattedSupplier.logo}
          alt={`${formattedSupplier.name} logo`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Save button */}
        <button
          onClick={() => toggleSaveSupplier(supplier.id)}
          disabled={isSaving}
          className={`absolute bottom-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-opacity duration-200 opacity-70 group-hover:opacity-100 ${isSaving ? "cursor-wait" : ""
            }`}
        >
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#e00261]" />
          ) : (
            <Bookmark
              className={`h-4 w-4 ${isSaved ? "text-[#e00261] fill-[#e00261]" : "text-gray-700"
                }`}
            />
          )}
        </button>

        {wasHiredInPast && activeTab === "suggested" && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs flex items-center gap-1">
              <Award className="h-3 w-3" />
              Hired in past
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center mb-1">
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {formattedSupplier.rating.toFixed(1)}/5.0
            </span>
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({formattedSupplier.reviews} reviews)
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {formattedSupplier.description}
        </p>

        <h3 className="font-medium text-sm mb-2">{formattedSupplier.productType}</h3>
        <div className="font-bold mb-1">{formattedSupplier.priceRange}</div>
        <div className="text-sm text-gray-600 mb-3">{formattedSupplier.minOrder}</div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">{formattedSupplier.name}</div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">
              {formattedSupplier.age} yrs
            </span>
            <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200 text-xs">
              {formattedSupplier.country}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {formattedSupplier.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-end">
          {formattedSupplier.verified && (
            <Badge variant="outline" className="bg-blue-50 text-blue-500 border-blue-200">
              Verified
            </Badge>
          )}
          <Button
            className={`w-full ml-2 ${requestedSuppliers.includes(supplier.id)
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gradient-to-r from-[#e00261] to-[#f0b168] hover:from-[#c80057] hover:to-[#e0a058]"
              } text-white border-none`}
            onClick={handleSendRequest}
            disabled={requestedSuppliers.includes(supplier.id)}
          >
            {hiredSuppliers.includes(supplier.id) ? (
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Hired
              </div>
            ) : requestedSuppliers.includes(supplier.id) ? (
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

// Helper functions to format supplier data
function getPriceRange(supplier: any): string {
  // You can implement your own logic to determine price range
  // For example, based on products or other supplier data
  if (supplier.products && supplier.products.length > 0) {
    const prices = supplier.products.map((p: any) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `$${min.toFixed(2)}-$${max.toFixed(2)}`;
  }
  return "$100-$1000"; // Default range
}

function getSupplierTags(supplier: any): string[] {
  const tags = [];

  if (supplier.businessCategories) {
    tags.push(...supplier.businessCategories);
  }

  if (supplier.businessTypes) {
    tags.push(...supplier.businessTypes);
  }

  if (supplier.businessAttributes) {
    tags.push(...supplier.businessAttributes);
  }

  if (supplier.certificationTypes) {
    tags.push(...supplier.certificationTypes);
  }

  // Ensure unique tags and limit to 5
  return [...new Set(tags)].slice(0, 5);
}