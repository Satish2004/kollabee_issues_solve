"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";
import OrderStatusTracker from "../components/order-status-tracker";
import OrderActivity from "../components/order-activity";
import type { Order } from "@/types/api";
import ProductDetailCarousel from "../components/product-detail-carousel";
import { ordersApi } from "@/lib/api/orders";

export default function OrderTrackingPage({
  params: paramsPromise,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const params = React.use(paramsPromise);
  const { orderId } = params;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // In a real implementation, you would fetch the order data from an API
    // For now, we'll use the data provided in the component props
    const fetchOrderData = async () => {
      try {
        // For demo purposes, we're using the data directly
        // In production, you would use: await ordersApi.getOrderDetails(orderId);

        const orderData = await ordersApi.getOrderDetails(orderId);

        setOrder(orderData as Order);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  return (
    <div className="w-full rounded-xl bg-white mx-auto min-h-screen">
      <div className="bg-white p-4 mb-4 h-16 gap-4 flex rounded-xl items-center">
        <Link href="/buyer/orders" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-sm font-medium">Order Details</h1>
      </div>

      {order ? (
        <div className="px-4 md:px-10">
          {/* Order Summary */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Order #{order.id.substring(0, 8)}
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "Product" : "Products"} • Order
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
                {order.stripePaymentIntentId && (
                  <p className="text-xs text-gray-600 mt-1">
                    Payment ID: {order.stripePaymentIntentId}
                  </p>
                )}
              </div>
              <div className="text-lg font-bold">
                ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Ordered Products with Carousel */}
          <div className="bg-white p-4 rounded-md border mb-6">
            <h2 className="text-base font-bold mb-4">
              Ordered Products ({order.items.length.toString().padStart(2, "0")}
              )
            </h2>

            {/* Product Items with Toggle Details */}
            <div className="space-y-2">
              {order.items.map((item) => (
                <ProductDetailCarousel key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-md border mb-6">
            <h2 className="text-base font-bold mb-4">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>

              {order.items.some((item) => item.product.deliveryCost > 0) && (
                <div className="flex justify-between text-sm">
                  <span>Delivery:</span>
                  <span>
                    $
                    {order.items
                      .reduce(
                        (sum, item) => sum + (item.product.deliveryCost || 0),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white p-4 rounded-md border mb-6">
            <h2 className="text-base font-bold mb-4">Seller Information</h2>

            {order.items.map((item) => (
              <div key={item.id} className="mb-4 last:mb-0">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                    {item.seller.user.imageUrl ? (
                      <img
                        src={item.seller.user.imageUrl || "/placeholder.svg"}
                        alt={item.seller.businessName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs">
                        {item.seller.businessName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {item.seller.businessName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.seller.user.email}
                    </p>
                  </div>
                </div>

                {item.seller.businessAddress && (
                  <p className="text-xs text-gray-600 ml-10">
                    Address: {item.seller.businessAddress}
                  </p>
                )}

                {item.seller.user.phoneNumber && (
                  <p className="text-xs text-gray-600 ml-10">
                    Phone: {item.seller.user.phoneNumber}
                  </p>
                )}
              </div>
            ))}
          </div>
          {/* Order Status Tracker */}
          <OrderStatusTracker />

          {/* Order Activity */}
          <OrderActivity />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p>Loading order details...</p>
        </div>
      )}
    </div>
  );
}
