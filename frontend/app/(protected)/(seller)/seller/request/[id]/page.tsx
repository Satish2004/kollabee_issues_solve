"use client";

import { ordersApi } from "@/lib/api/orders";
import { OrderStatus } from "@/types/api";
import { ChevronLeft, X, Check, ChevronDown } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

interface OrderData {
  id: string;
  buyerId: string;
  sellerId: string | null;
  status: string;
  totalAmount: number;
  isAccepted: boolean;
  stripePaymentId: string | null;
  stripePaymentIntentId: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  trackingHistory: any[];
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    orderId: string;
    productId: string;
    sellerId: string;
    quantity: number;
    price: number;
    isAccepted: boolean;
    createdAt: string;
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      wholesalePrice: number;
      minOrderQuantity: number;
      availableQuantity: number;
      images: string[];
      isDraft: boolean;
      status: string;
      stockStatus: string;
      rating: number;
      reviewCount: number;
      attributes: Record<string, string>;
      deliveryCost: number;
      sellerId: string;
      categoryId: string;
      createdAt: string;
      updatedAt: string;
      thumbnail: string[];
    };
    seller: {
      id: string;
      userId: string;
      businessName: string;
      businessDescription: string;
      businessAddress: string;
      websiteLink: string;
      businessCategories: string[];
      businessTypes: string[];
      businessLogo: string;
      teamSize: string;
      annualRevenue: string;
      factoryImages: string[];
      businessRegistration: string[];
      certificates: string[];
      projectImages: string[];
      brandVideo: string;
      socialMediaLinks: string;
      additionalNotes: string;
      rating: number;
      createdAt: string;
      updatedAt: string;
      user: {
        name: string;
        imageUrl: string;
        phoneNumber: string;
        email: string;
      };
    };
  }>;
  shippingAddress: any | null;
}

const KollaBeeRequestDetails = () => {
  const router = useRouter();
  const { id } = useParams();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    orderSummary: true,
    productDetails: true,
    sellerInfo: true,
    paymentInfo: true,
    shippingInfo: true,
  });

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!orderData) {
    return <div className="text-center mt-4">Order not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className=" mx-auto">
        <button
          className="flex items-center text-gray-600 text-sm mb-6"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Order Details</h1>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Order ID:</span>
              <span className="font-medium">{orderData.id}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <button
                onClick={() => toggleSection('orderSummary')}
                className="text-blue-600 text-sm"
              >
                {expandedSections.orderSummary ? 'Hide' : 'Show'}
              </button>
            </div>

            {expandedSections.orderSummary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Status</h3>
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
                      <div className="absolute z-10 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                        {Object.values(OrderStatus).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(status)}
                            disabled={isUpdatingStatus}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${orderData.status === status ? "bg-blue-50 text-blue-700" : ""}`}
                          >
                            <div className="font-medium">{status.replace('_', ' ')}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {getStatusDescription(status)}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Dates</h3>
                  <p className="text-sm">
                    <span className="text-gray-500">Created:</span> {formatDate(orderData.createdAt)}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Updated:</span> {formatDate(orderData.updatedAt)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Amounts</h3>
                  <p className="text-sm">
                    <span className="text-gray-500">Total:</span> ${orderData.totalAmount.toFixed(2)}
                  </p>
                  {orderData.items.map((item, index) => (
                    <p key={index} className="text-sm">
                      <span className="text-gray-500">Item {index + 1}:</span> ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Product Details</h2>
              <button
                onClick={() => toggleSection('productDetails')}
                className="text-blue-600 text-sm"
              >
                {expandedSections.productDetails ? 'Hide' : 'Show'}
              </button>
            </div>

            {expandedSections.productDetails && orderData.items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4">
                    {item.product.images.length > 0 && (
                      <div className="relative aspect-square rounded-md overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-3/4">
                    <h3 className="text-lg font-semibold mb-2">{item.product.name}</h3>
                    <p className="text-gray-600 mb-4">{item.product.description || "No description available"}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${item.isAccepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.isAccepted ? 'Accepted' : 'Pending'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Product Attributes</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(item.product.attributes).map(([key, value]) => (
                          value && (
                            <div key={key} className="bg-white p-2 rounded border">
                              <p className="text-xs text-gray-500 capitalize">{key}</p>
                              <p className="text-sm font-medium">{value || '-'}</p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Seller Information */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Seller Information</h2>
              <button
                onClick={() => toggleSection('sellerInfo')}
                className="text-blue-600 text-sm"
              >
                {expandedSections.sellerInfo ? 'Hide' : 'Show'}
              </button>
            </div>

            {expandedSections.sellerInfo && orderData.items[0]?.seller && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4">
                    <div className="flex items-center gap-4 mb-4">
                      {orderData.items[0].seller.businessLogo && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={orderData.items[0].seller.businessLogo}
                            alt={orderData.items[0].seller.businessName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{orderData.items[0].seller.businessName}</h3>
                        <p className="text-sm text-gray-500">{orderData.items[0].seller.businessDescription}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-500">Contact:</span> {orderData.items[0].seller.user.name}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Email:</span> {orderData.items[0].seller.user.email}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Phone:</span> {orderData.items[0].seller.user.phoneNumber}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Address:</span> {orderData.items[0].seller.businessAddress}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-3/4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-700 mb-2">Business Details</h4>
                        <p className="text-sm">
                          <span className="text-gray-500">Types:</span> {orderData.items[0].seller.businessTypes.join(', ')}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Categories:</span> {orderData.items[0].seller.businessCategories.slice(0, 3).join(', ')}...
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Team Size:</span> {orderData.items[0].seller.teamSize}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Revenue:</span> {orderData.items[0].seller.annualRevenue}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-700 mb-2">Certifications</h4>
                        {orderData.items[0].seller.certificates && orderData.items[0].seller.certificates.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {orderData.items[0].seller.certificates.slice(0, 3).map((cert, idx) => (
                              <a
                                key={idx}
                                href={cert}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-xs hover:underline"
                              >
                                Certificate {idx + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No certifications available</p>
                        )}
                      </div>
                    </div>

                    {orderData.items[0].seller.factoryImages && orderData.items[0].seller.factoryImages.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Factory Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {orderData.items[0].seller.factoryImages.slice(0, 3).map((img, idx) => (
                            <div key={idx} className="relative aspect-video rounded-md overflow-hidden border">
                              <Image
                                src={img}
                                alt={`Factory image ${idx + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="mb-8 border-b pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Payment Information</h2>
              <button
                onClick={() => toggleSection('paymentInfo')}
                className="text-blue-600 text-sm"
              >
                {expandedSections.paymentInfo ? 'Hide' : 'Show'}
              </button>
            </div>

            {expandedSections.paymentInfo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Payment Details</h3>
                    <p className="text-sm">
                      <span className="text-gray-500">Payment Intent:</span> {orderData.stripePaymentIntentId || 'Not available'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Payment ID:</span> {orderData.stripePaymentId || 'Not available'}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-500">Payment Status:</span> {orderData.stripePaymentIntentId ? 'Processed' : 'Pending'}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Order Acceptance</h3>
                    <p className="text-sm">
                      <span className="text-gray-500">Order Accepted:</span>
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${orderData.isAccepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {orderData.isAccepted ? 'Yes' : 'No'}
                      </span>
                    </p>
                    {orderData.items.map((item, index) => (
                      <p key={index} className="text-sm">
                        <span className="text-gray-500">Item {index + 1} Accepted:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${item.isAccepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.isAccepted ? 'Yes' : 'No'}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Information */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shipping Information</h2>
              <button
                onClick={() => toggleSection('shippingInfo')}
                className="text-blue-600 text-sm"
              >
                {expandedSections.shippingInfo ? 'Hide' : 'Show'}
              </button>
            </div>

            {expandedSections.shippingInfo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                {orderData.shippingAddress ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
                      <p className="text-sm">
                        <span className="text-gray-500">Name:</span> {orderData.shippingAddress.fullName}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Address:</span> {orderData.shippingAddress.address}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">State:</span> {orderData.shippingAddress.state}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Country:</span> {orderData.shippingAddress.country}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Shipping Status</h3>
                      <p className="text-sm">
                        <span className="text-gray-500">Carrier:</span> {orderData.carrier || 'Not specified'}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Tracking Number:</span> {orderData.trackingNumber || 'Not available'}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-500">Tracking History:</span> {orderData.trackingHistory.length || 'No'} events
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No shipping information available</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons - only show if order is not accepted */}
          {!orderData.isAccepted && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default KollaBeeRequestDetails;