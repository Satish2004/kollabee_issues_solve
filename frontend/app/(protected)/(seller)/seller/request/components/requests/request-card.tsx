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
      className="w-full mx-auto rounded-lg overflow-hidden mb-6"
    >
      {/* Header - Updated to show buyer info */}
      <div className="flex items-center gap-3 p-1 border-2 rounded-[10px] border-gray-200">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
          <span className="text-indigo-600 font-semibold">
            {buyer?.user?.name ? buyer.user.name.charAt(0) : "B"}
          </span>
        </div>
        <div className="font-medium text-lg">
          {buyer?.user?.name || "Unknown Buyer"}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xl">{countryFlag}</span>
          <span className="text-gray-700">
            {buyerCountry.substring(0, 2).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-2">
        {/* Product Image */}
        <div className="w-full md:w-60 lg:w-72">
          <Image
            src={productImage || "/placeholder.svg"}
            alt={product.name || "Product Image"}
            width={200}
            height={200}
            className="w-full h-full object-cover bg-neutral-300 rounded-xl"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 p-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-gray-500 text-sm font-medium mb-4 flex-wrap">
            <span>Beauty & Personal Care</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span>Skin Care & Body Care</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span>Facial Care</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span>Face Mask Sheet</span>
          </div>

          {/* Product Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name || "Antibacterial Sheet Masks"}
          </h1>

          {/* Product Tabs */}
          <div className="flex gap-2 mb-6">
            <span className="px-4 py-1 border border-gray-400 text-sm rounded-[5px] text-gray-800">
              Product
            </span>
            <span className="px-4 py-1 border border-gray-400 text-sm rounded-[5px] text-gray-800">
              Packaging
            </span>
            <span className="px-4 py-1 border border-gray-400 text-sm rounded-[5px] text-gray-800">
              Request for proposal
            </span>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-medium text-stone-700 rounded-tl-xl">
                    Lead size <span className="text-gray-400 text-xs">↑</span>
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Country
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Quantity <span className="text-gray-400 text-xs">↑</span>
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Target Price
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700 rounded-tr-xl">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="p-3 text-gray-800">
                    ${request.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-gray-800">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{countryFlag}</span>
                      <span>{buyerCountry}</span>
                    </div>
                  </td>
                  <td className="p-3 text-gray-800">{item.quantity} units</td>
                  <td className="p-3 text-gray-800">On demand</td>
                  <td className="p-3">
                    <button
                      className="bg-zinc-800 text-white px-6 py-1 rounded-xl"
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
