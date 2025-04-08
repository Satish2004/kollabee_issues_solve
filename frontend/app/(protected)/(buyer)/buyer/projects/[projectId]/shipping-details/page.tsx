"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, FileText } from "lucide-react";
import ShippingTimeline from "../../_component/shipping-timeline";
import React from "react";
import { LiaShippingFastSolid } from "react-icons/lia";

export default function ShippingDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const params = React.use(paramsPromise);
  const { projectId } = params;
  const [isDetailsVisible, setIsDetailsVisible] = useState(true);

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  const timelineItems = [
    {
      date: "Apr 19, 2025",
      status: "Order Placed",
      description: "Shipping order created",
      completed: true,
    },
    {
      date: "Mar 1, 2025",
      status: "Scheduled",
      description: "Pickup scheduled for March 3rd",
      completed: true,
    },
    {
      date: "-",
      status: "Picked Up",
      description: "-",
      completed: false,
    },
    {
      date: "-",
      status: "In Transit",
      description: "-",
      completed: false,
    },
    {
      date: "-",
      status: "Delivered",
      description: "-",
      completed: false,
    },
  ];

  return (
    <div className="h-screen bg-gray-100 p-4 w-full">
      {/* Back button */}
      <div className="bg-white p-4 mb-8 h-16 rounded-lg shadow-sm">
        <Link
          href="/buyer/projects"
          className="inline-flex items-center text-rose-600 font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold mb-6">
          Custom Manufacturing Shipping Details
        </h1>

        {/* Supplier section with clickable dropdown */}
        <div
          className="bg-gray-50 p-4 rounded-md mb-6 flex justify-between items-center cursor-pointer"
          onClick={toggleDetails}
        >
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Supplier:</span>
            <span className="font-medium">EcoManufacture Inc</span>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
              isDetailsVisible ? "transform rotate-180" : ""
            }`}
          />
        </div>

        {/* Content that can be toggled */}
        {isDetailsVisible && (
          <div className="grid md:grid-cols-2 px-10 gap-8">
            {/* Shipment Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Shipment Information
              </h2>

              <div className="space-y-4">
                <div className="flex">
                  <div className="w-36 text-gray-600">Status:</div>
                  <div className="flex items-center gap-2 w-auto px-2 bg-gray-200 rounded-md">
                    <LiaShippingFastSolid
                      className="text-[#78787a]"
                      size={24}
                    />
                    <span>Not Started</span>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-36 text-gray-600">Origin:</div>
                  <div>
                    <div className="font-medium">EcoManufacture Inc.</div>
                    <div className="text-gray-600 text-sm">
                      123 Greenway Road, Springfield, NY 1100, USA
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-36 text-gray-600">Destination:</div>
                  <div>
                    <div className="font-medium">Buyer</div>
                    <div className="text-gray-600 text-sm">
                      123 Greenway Road, Springfield, NY 1100, USA
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="w-36 text-gray-600">Estimated Delivery:</div>
                  <div className="font-medium">Mar 22, 2025</div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Items</h2>

              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 p-3 border-b">
                  <div className="text-gray-600">Item</div>
                  <div className="text-gray-600 text-right">Quantity</div>
                  <div className="text-gray-600 text-right">Unit</div>
                </div>

                <div className="grid grid-cols-3 p-3">
                  <div>Finished Product</div>
                  <div className="text-right">1000</div>
                  <div className="text-right">Units</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 border-t px-10 pt-6">
          <ShippingTimeline items={timelineItems} />
        </div>
      </div>
    </div>
  );
}
