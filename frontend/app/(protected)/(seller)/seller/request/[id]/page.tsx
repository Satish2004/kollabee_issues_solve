"use client";

import { ordersApi } from "@/lib/api/orders";
import { OrderStatus } from "@/types/api";
import { ChevronLeft, X, Check, ChevronDown } from "lucide-react";
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

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

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.status-dropdown')) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

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

  const handleStatusUpdate = async (newStatus: string) => {
    if (!orderData) return;
    
    try {
      setIsUpdatingStatus(true);
      await ordersApi.updateOrderStatus(orderData.id, newStatus);
      setOrderData({ ...orderData, status: newStatus });
      setShowStatusDropdown(false);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "PACKED":
        return "bg-purple-100 text-purple-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "IN_TRANSIT":
        return "bg-orange-100 text-orange-800";
      case "OUT_FOR_DELIVERY":
        return "bg-pink-100 text-pink-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "RETURNED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Order received, awaiting processing";
      case "PROCESSING":
        return "Order is being prepared";
      case "PACKED":
        return "Order has been packed and is ready to ship";
      case "SHIPPED":
        return "Order has been shipped";
      case "IN_TRANSIT":
        return "Order is in transit to destination";
      case "OUT_FOR_DELIVERY":
        return "Order is out for delivery";
      case "DELIVERED":
        return "Order has been delivered successfully";
      case "CANCELLED":
        return "Order has been cancelled";
      case "RETURNED":
        return "Order has been returned";
      default:
        return status;
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
                  <div className="relative status-dropdown">
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      disabled={isUpdatingStatus}
                      className={`flex items-center justify-between w-full px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(orderData.status)} hover:opacity-80 transition-opacity`}
                    >
                      <span>{orderData.status.replace('_', ' ')}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    
                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {Object.values(OrderStatus).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(status)}
                            disabled={isUpdatingStatus}
                            className={`w-full text-left px-3 py-3 text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md border-b border-gray-100 last:border-b-0 ${
                              orderData.status === status ? "bg-blue-50 text-blue-700" : ""
                            }`}
                          >
                            <div className="font-medium">{status.replace('_', ' ')}</div>
                            <div className="text-xs text-gray-500 mt-1">{getStatusDescription(status)}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price per unit</p>
                  <p className="font-medium text-sm">
                    ${orderData.items[0]?.price}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAccept}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept Order
                </button>
                <button
                  onClick={handleDecline}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KollaBeeRequestDetails;
