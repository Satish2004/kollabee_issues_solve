"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { countries } from "@/app/(auth)/signup/seller/onboarding/signup-form";
import type { Order } from "@/types/requests";

interface RequestCardProps {
  request: Order;
}

export const RequestCard = ({ request }: RequestCardProps) => {
  const router = useRouter();

  if (!request.items || request.items.length === 0) return null;

  const item = request.items[0];
  const product = item.product;
  const buyer = request.buyer;
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/placeholder.svg?height=400&width=400";

  // Find the country flag
  const buyerCountry =
    buyer?.user?.country || request.shippingAddress?.country || "India";
  const countryData = countries.find((c) => c.name === buyerCountry);
  const countryFlag = countryData?.flag || "🌍";

  return (
    <div
      key={request.id}
      className="w-full mx-auto rounded-lg overflow-hidden mb-4 sm:mb-6"
    >
      {/* Header - Updated to show buyer info */}
      <div className="flex items-center gap-2 sm:gap-3 p-1 border-2 rounded-[10px] border-gray-200">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded flex items-center justify-center">
          <span className="text-indigo-600 font-semibold text-xs sm:text-base">
            {buyer?.user?.name ? buyer.user.name.charAt(0) : "B"}
          </span>
        </div>
        <div className="font-medium text-sm sm:text-lg truncate">
          {buyer?.user?.name || "Unknown Buyer"}
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-lg sm:text-xl">{countryFlag}</span>
          <span className="text-gray-700 text-xs sm:text-sm">
            {buyerCountry.substring(0, 2).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-2">
        {/* Product Image - Improved responsive sizing */}
        <div className="w-full md:w-60 lg:w-72 h-40 sm:h-48 md:h-auto flex-shrink-0">
          <div className="relative w-full h-full">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={product.name || "Product Image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover bg-neutral-300 rounded-xl"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 p-3 sm:p-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-gray-500 text-xs sm:text-sm font-medium mb-2 sm:mb-4 flex-wrap">
            <span>Beauty & Personal Care</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1" />
            <span className="hidden xs:inline">Skin Care & Body Care</span>
            <ChevronRight className="hidden xs:inline w-3 h-3 sm:w-4 sm:h-4 mx-1" />
            <span className="hidden sm:inline">Facial Care</span>
            <ChevronRight className="hidden sm:inline w-3 h-3 sm:w-4 sm:h-4 mx-1" />
            <span className="hidden sm:inline">Face Mask Sheet</span>
          </div>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
            {product.name || "Antibacterial Sheet Masks"}
          </h1>

          {/* Product Tabs */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-6">
            <span className="px-2 sm:px-4 py-1 border border-gray-400 text-xs sm:text-sm rounded-[5px] text-gray-800">
              Product
            </span>
            <span className="px-2 sm:px-4 py-1 border border-gray-400 text-xs sm:text-sm rounded-[5px] text-gray-800">
              Packaging
            </span>
            <span className="px-2 sm:px-4 py-1 border border-gray-400 text-xs sm:text-sm rounded-[5px] text-gray-800">
              Request for proposal
            </span>
          </div>

          {/* Mobile Card View (visible on small screens only) */}
          <div className="md:hidden space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Lead size</div>
                <div className="font-medium">
                  ${request.totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Country</div>
                <div className="font-medium flex items-center gap-1">
                  <span>{countryFlag}</span>
                  <span className="truncate">{buyerCountry}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Quantity</div>
                <div className="font-medium">{item.quantity} units</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Target Price</div>
                <div className="font-medium">On demand</div>
              </div>
            </div>
            <button
              className="w-full bg-zinc-800 text-white py-2 rounded-xl text-sm"
              onClick={() => router.push(`/seller/request/${request.id}`)}
            >
              View Details
            </button>
          </div>

          {/* Desktop Table View (hidden on small screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 sm:p-3 font-medium text-stone-700 rounded-tl-xl text-xs sm:text-sm">
                    Lead size <span className="text-gray-400 text-xs">↑</span>
                  </th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm">
                    Country
                  </th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm">
                    Quantity <span className="text-gray-400 text-xs">↑</span>
                  </th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 text-xs sm:text-sm">
                    Target Price
                  </th>
                  <th className="text-left p-2 sm:p-3 font-medium text-gray-700 rounded-tr-xl text-xs sm:text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="p-2 sm:p-3 text-gray-800 text-xs sm:text-sm">
                    ${request.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-2 sm:p-3 text-gray-800 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-base sm:text-lg">
                        {countryFlag}
                      </span>
                      <span className="truncate max-w-[60px] sm:max-w-none">
                        {buyerCountry}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 text-gray-800 text-xs sm:text-sm">
                    {item.quantity} units
                  </td>
                  <td className="p-2 sm:p-3 text-gray-800 text-xs sm:text-sm">
                    On demand
                  </td>
                  <td className="p-2 sm:p-3">
                    <button
                      className="bg-zinc-800 text-white px-3 sm:px-6 py-1 rounded-xl text-xs sm:text-sm"
                      onClick={() =>
                        router.push(`/seller/request/${request.id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
