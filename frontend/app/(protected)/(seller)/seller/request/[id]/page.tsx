"use client";

import { ordersApi } from "@/lib/api/orders";
import { ChevronLeft, X, Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface OrderData {
  id: string;
  status: string;
  totalAmount: number;
  isAccepted: boolean;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      description: string;
      images: string[];
    };
  }>;
  shippingAddress: {
    fullName: string;
    country: string;
    state: string;
    address: string;
  };
}

const KollaBeeRequestDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setIsLoading(true);
        const response: any = await ordersApi.getOrderDetails(id as string);
        setOrderData(response);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const handleAccept = async () => {
    try {
      await ordersApi.acceptOrder(id as string);
      toast.success("Order accepted successfully");
      router.push("/seller/request");
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Failed to accept order");
    }
  };

  const handleDecline = async () => {
    try {
      await ordersApi.declineOrder(id as string);
      toast.success("Order declined successfully");
      router.push("/seller/request");
    } catch (error) {
      console.error("Error declining order:", error);
      toast.error("Failed to decline order");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!orderData) {
    return <div className="text-center mt-4">Order not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto bg-white shadow-sm max-w-4xl md:max-w-full">
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <button
              className="flex items-center text-gray-600 text-sm"
              onClick={() => router.back()}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </div>

          <div className="border rounded-md mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-xl font-semibold mb-2 sm:mb-0">
                  {orderData.items[0]?.product.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="font-medium text-sm">
                    ${orderData.totalAmount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Country</p>
                  <p className="font-medium text-sm">
                    {orderData.shippingAddress?.country ?? "India"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Quantity</p>
                  <p className="font-medium text-sm">
                    {orderData.items[0]?.quantity} Units
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <div className="flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        orderData.isAccepted ? "bg-green-500" : "bg-yellow-500"
                      } mr-2`}
                    ></span>
                    <p className="font-medium text-sm">{orderData.status}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price per unit</p>
                  <p className="font-medium text-sm">
                    ${orderData.items[0]?.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KollaBeeRequestDetails;
