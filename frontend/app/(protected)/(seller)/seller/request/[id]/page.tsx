"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, X, Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { ordersApi } from "@/lib/api/orders";
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
    return <div>Loading...</div>;
  }

  if (!orderData) {
    return <div>Order not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto bg-white shadow-sm">
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <button
              className="flex items-center text-gray-600 text-sm"
              onClick={() => router.back()}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            {/* <div className="flex space-x-2">
              <button
                onClick={handleDecline}
                className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-sm flex items-center px-4 py-2"
                disabled={orderData.isAccepted}
              >
                <X className="w-4 h-4 mr-1 text-red-500" />
                Decline Request
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-lg text-sm flex items-center"
                disabled={orderData.isAccepted}
              >
                <Check className="w-4 h-4 mr-1" />
                Accept Request
              </button>
            </div> */}
          </div>

          <div className="border rounded-md mb-6">
            <div className="p-4">
              <div className="flex items-center mb-2">
                <ChevronLeft className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  {orderData.shippingAddress?.fullName}
                </span>
                <div className="flex items-center ml-2">
                  <div className="w-5 h-3 bg-red-600 flex items-center justify-center text-[8px] text-white font-bold">
                    {orderData.shippingAddress?.country}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {orderData.items[0]?.product.name}
                </h2>
              </div>

              <div className="grid grid-cols-5 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="font-medium text-sm">
                    ${orderData.totalAmount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Country</p>
                  <p className="font-medium text-sm">
                    {orderData.shippingAddress?.country ?? "Not available"}
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
