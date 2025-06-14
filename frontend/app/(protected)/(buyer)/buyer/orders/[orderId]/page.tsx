"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import React from "react";
import OrderStatusTracker from "../components/order-status-tracker";
import OrderActivity from "../components/order-activity";
import type { Order } from "@/types/api";
import type { OrderItem } from "@/types/order";
import ProductDetailCarousel from "../components/product-detail-carousel";
import MyProductReview from "@/components/review/my-product-review";
import { ordersApi } from "@/lib/api/orders";

export default function OrderTrackingPage({
  params: paramsPromise,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    paramsPromise.then(params => {
      setOrderId(params.orderId);
      console.log(params.orderId, "orderId 1");
    });
  }, [paramsPromise]);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrderData = async () => {
      try {
        const response = await ordersApi.getOrderDetails(orderId);
        setOrder(response);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };
    fetchOrderData();
  }, [orderId]);

  // Convert Order items to OrderItem format for ProductDetailCarousel
  const convertToOrderItems = (order: any): OrderItem[] => {
    try {
      if (!order || !order.items) {
        console.warn("Order or order.items is missing", order);
        return [];
      }
      return order.items.map((item: any, index: number) => ({
        id: `${order.id}-${index}`,
        orderId: order.id,
        productId: item.product?.categoryId || item.product?.id || `unknown-${index}`,
        quantity: 1,
        price: order.totalAmount / order.items.length,
        product: {
          id: item.product?.id || `unknown-${index}`,
          name: item.product?.name || 'Unnamed Product',
          description: item.product?.description || '',
          price: item.product?.price || 0,
          images: item.product?.images || [],
          categoryId: item.product?.categoryId || '',
          attributes: item.product?.attributes || {},
          discount: item.product?.discount || 0,
          deliveryCost: item.product?.deliveryCost || 0,
        },
        seller: {
          id: item.seller?.id || `unknown-seller-${index}`,
          businessName: item.seller?.businessName || 'Unknown Seller',
          businessAddress: item.seller?.businessAddress || '',
          user: {
            name: item.seller?.user?.name || '',
            imageUrl: item.seller?.user?.imageUrl,
            email: item.seller?.user?.email || '',
            phoneNumber: item.seller?.user?.phoneNumber || '',
          },
        },
      }));
    } catch (err) {
      console.error("Error in convertToOrderItems:", err, order);
      return [];
    }
  };

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
                  Order #{order.id?.substring(0, 8)}
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  {order.items?.length ?? 0} {order.items?.length === 1 ? "Product" : "Products"} • Order
                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
              </div>
              <div className="text-lg font-bold">
                ${order.totalAmount?.toFixed(2) ?? '0.00'}
              </div>
            </div>
          </div>

          {/* Ordered Products with Carousel */}
          <div className="bg-white p-4 rounded-md border mb-6">
            <h2 className="text-base font-bold mb-4">
              Ordered Products ({order.items?.length?.toString().padStart(2, "0") ?? '00'})
            </h2>

            {/* Product Items with Toggle Details */}
            <div className="space-y-2">
              {convertToOrderItems(order).map((item) => (
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
                <span>${order.totalAmount?.toFixed(2) ?? '0.00'}</span>
              </div>

              <div className="flex justify-between text-sm font-bold pt-2 border-t">
                <span>Total:</span>
                <span>${order.totalAmount?.toFixed(2) ?? '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white p-4 rounded-md border mb-6">
            <h2 className="text-base font-bold mb-4">Seller Information</h2>

            {order.items?.map((item: any, index: number) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                    <span className="text-xs">
                      {item.seller?.businessName?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {item.seller?.businessName || 'Unknown Seller'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Reviews */}
          {order.items?.map((item: any, index: number) => (
            <div key={index} className="mb-6">
              <MyProductReview
                productId={item.product?.id || `unknown-${index}`}
                myReview={item.product?.myReview || null}
                orderStatus={order.status}
                productName={item.product?.name || 'Unnamed Product'}
              />
            </div>
          ))}

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
