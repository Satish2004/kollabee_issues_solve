"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Check, X, Package, Truck, Home } from "lucide-react";
import OrderActivity from "../components/order-activity";
import ProductDetailCarousel from "../components/product-detail-carousel";
import MyProductReview from "@/components/review/my-product-review";
import { ordersApi } from "@/lib/api/orders";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function OrderTrackingPage({
  params: paramsPromise,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paramsPromise.then(params => {
      setOrderId(params.orderId);
    });
  }, [paramsPromise]);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.getOrderDetails(orderId);
        setOrder(response);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [orderId]);

  const convertToOrderItems = (order: any) => {
    if (!order?.items) return [];
    return order.items.map((item: any, index: number) => ({
      id: `${order.id}-${index}`,
      orderId: order.id,
      productId: item.product?.id || `unknown-${index}`,
      quantity: item.quantity || 1,
      price: item.price || 0,
      product: {
        id: item.product?.id || `unknown-${index}`,
        name: item.product?.name || 'Unnamed Product',
        description: item.product?.description || '',
        price: item.product?.price || 0,
        images: item.product?.images || [],
        categoryId: item.product?.categoryId || '',
        attributes: item.product?.attributes || {},
      },
      seller: {
        id: item.seller?.id || `unknown-seller-${index}`,
        businessName: item.seller?.businessName || 'Unknown Seller',
        businessAddress: item.seller?.businessAddress || '',
        user: {
          name: item.seller?.user?.name || '',
          imageUrl: item.seller?.user?.imageUrl,
        },
      },
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'PACKED':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Order Placed';
      case 'PACKED':
        return 'Packed';
      case 'in_progress':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderTimeline = () => {
    if (!order) return null;

    const statuses = [
      { status: 'PENDING', date: order.createdAt },
      { status: 'PACKED', date: order.updatedAt },
      { status: 'in_progress', date: order.updatedAt },
      { status: 'delivered', date: order.updatedAt },
      { status: 'cancelled', date: order.updatedAt },
    ];

    // Filter to only show statuses up to the current order status
    const currentStatusIndex = statuses.findIndex(s => s.status === order.status);
    const visibleStatuses = statuses.slice(0, currentStatusIndex + 1);

    return (
      <div className="space-y-4">
        <h3 className="font-medium">Order Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {visibleStatuses.map((statusItem, index) => (
              <div key={index} className="relative flex gap-4">
                <div className="absolute left-4 top-4 -ml-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-white shadow">
                  {getStatusIcon(statusItem.status)}
                </div>
                <div className="flex-1 pl-11">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {getStatusText(statusItem.status)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {statusItem.date ? format(new Date(statusItem.date), 'MMM d, yyyy h:mm a') : 'N/A'}
                    </p>
                  </div>
                  {index === currentStatusIndex && (
                    <p className="mt-1 text-xs text-gray-500">
                      {order.status === 'delivered'
                        ? 'Your order has been delivered'
                        : order.status === 'cancelled'
                          ? 'Order was cancelled'
                          : 'Your order is being processed'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white mx-auto min-h-screen">
      <div className="bg-white p-4 mb-4 h-16 gap-4 flex rounded-xl items-center sticky top-0 z-10 border-b">
        <Link href="/buyer/orders" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-sm font-medium">Order Details</h1>
      </div>

      <div className="px-4 md:px-10 pb-10">
        {/* Order Header */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Order #{order.id}
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                {order.items?.length ?? 0} {order.items?.length === 1 ? "Product" : "Products"} •
                Placed on {order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy h:mm a') : 'N/A'}
              </p>
            </div>
            <Badge variant={order.status === 'cancelled' ? 'destructive' : 'default'}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white p-4 rounded-md border mb-6">
          {renderTimeline()}
        </div>

        {/* Products Section */}
        <div className="bg-white p-4 rounded-md border mb-6">
          <h2 className="text-base font-bold mb-4">
            Ordered Products ({order.items?.length?.toString().padStart(2, "0") ?? '00'})
          </h2>
          <div className="space-y-4">
            {convertToOrderItems(order).map((item) => (
              <ProductDetailCarousel key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded-md border mb-6">
          <h2 className="text-base font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${order.totalAmount?.toFixed(2) ?? '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-bold">
              <span>Total:</span>
              <span>${order.totalAmount?.toFixed(2) ?? '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        {order.shippingAddress && (
          <div className="bg-white p-4 rounded-md border mb-6">
            <h2 className="text-base font-bold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Shipping Address</p>
                <p className="font-medium">
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                  {order.shippingAddress.country}, {order.shippingAddress.postalCode}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="font-medium">
                  {order.shippingAddress.phoneNumber || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-white p-4 rounded-md border mb-6">
          <h2 className="text-base font-bold mb-4">Payment Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Payment Method</p>
              <p className="font-medium">
                {order.stripePaymentIntentId ? 'Credit Card' : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Payment Status</p>
              <p className="font-medium">
                {order.stripePaymentIntentId ? 'Paid' : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="bg-white p-4 rounded-md border mb-6">
          <h2 className="text-base font-bold mb-4">Seller Information</h2>
          {order.items?.map((item: any, index: number) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {item.seller?.user?.imageUrl ? (
                    <img
                      src={item.seller.user.imageUrl}
                      alt={item.seller.businessName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">
                      {item.seller?.businessName?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {item.seller?.businessName || 'Unknown Seller'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.seller?.businessAddress || 'No address provided'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Reviews */}
        {order.status === 'delivered' && order.items?.map((item: any, index: number) => (
          <div key={index} className="mb-6">
            <MyProductReview
              productId={item.product?.id || `unknown-${index}`}
              myReview={item.product?.myReview || null}
              orderStatus={order.status}
              productName={item.product?.name || 'Unnamed Product'}
            />
          </div>
        ))}

        {/* Order Activity */}
        <OrderActivity order={order} />
      </div>
    </div>
  );
}