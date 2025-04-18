"use client";

import { ordersApi } from "@/lib/api/orders";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  price: number;
  isAccepted: boolean;
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
    documents: string[];
    discount: number;
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
    businessAddress: string;
    websiteLink: string;
    businessCategories: string[];
    user: {
      name: string;
      imageUrl: string | null;
      phoneNumber: string;
      email: string;
    };
  };
}

interface Order {
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
  items: OrderItem[];
  shippingAddress: any | null;
  buyer: {
    id: string;
    userId: string;
    location: string | null;
    maxMOQ: number | null;
    minMOQ: number | null;
    preferences: any | null;
    user: {
      name: string;
      imageUrl: string | null;
      phoneNumber: string;
      country: string | null;
      email: string;
    };
  };
}

const OrderDetailsPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const orderId = pathname.split("/").slice(-1)[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await ordersApi.getOrderDetailsForAdmin(orderId);

        // Format the data before setting state
        if (response) {
          // Format dates to be more readable
          const formattedOrder = {
            ...response,
            createdAt: response.createdAt,
            updatedAt: response.updatedAt,
            // Format items data if needed
            items: response.items.map((item) => ({
              ...item,
              // Add any additional item formatting here
            })),
          };

          setOrder(formattedOrder);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const mainProduct = order.items[0]?.product;
  const seller = order.items[0]?.seller;

  return (
    <div className="w-full py-6 px-4  ">
      <div className="flex justify-between items-center bg-white mb-10 h-16 rounded-md shadow-sm border px-4">
        <Button
          variant="ghost"
          className="flex items-center text-rose-600"
          onClick={() => router.push("/admin/order?tab=orders")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
          Block
        </Button>
      </div>

      <div className="bg-white rounded-md shadow-sm border p-4 mb-6">
        <div className="flex items-center gap-2 border-b pb-3">
          <Flag className="w-4 h-4" />
          <span className="font-medium">
            {seller?.businessName || "Business Name"}
          </span>
          {seller?.businessAddress && (
            <span className="text-sm text-gray-500">
              ({seller.businessAddress})
            </span>
          )}
          {seller?.user?.email && (
            <Badge variant="outline" className="ml-auto">
              {seller.user.email}
            </Badge>
          )}
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-500 flex gap-2 mb-2">
            {mainProduct?.attributes &&
              Object.keys(mainProduct.attributes).length > 0 && (
                <>
                  {Object.entries(mainProduct.attributes)
                    .slice(0, 3)
                    .map(([key, value], index) => (
                      <React.Fragment key={key}>
                        <Link
                          href="#"
                          className="text-gray-600 hover:underline"
                        >
                          {key}
                        </Link>
                        {index < 2 && <span>›</span>}
                      </React.Fragment>
                    ))}
                </>
              )}
          </div>

          <div className="flex gap-6 mt-4">
            <div className="w-40 h-40 bg-gray-100 rounded-md overflow-hidden">
              {mainProduct?.images && mainProduct.images.length > 0 ? (
                <Image
                  src={mainProduct.images[0] || "/placeholder.svg"}
                  alt={mainProduct.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  No Image
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">
                {mainProduct?.name || "Product Name"}
              </h2>

              <Tabs defaultValue="product" className="mt-4">
                <TabsList className="border-b w-full justify-start rounded-none bg-transparent">
                  <TabsTrigger
                    value="product"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black bg-transparent"
                  >
                    Product
                  </TabsTrigger>
                  <TabsTrigger
                    value="packaging"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black bg-transparent"
                  >
                    Packaging
                  </TabsTrigger>
                  <TabsTrigger
                    value="ordered"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black bg-transparent"
                  >
                    Ordered
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="product" className="mt-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-6 gap-4 text-sm mb-2 text-muted-foreground">
                      <div className="font-medium">Lead size</div>
                      <div className="font-medium">Country</div>
                      <div className="font-medium">Quantity</div>
                      <div className="font-medium">Target Price</div>
                      <div className="font-medium">Order frequency</div>
                      <div className="font-medium">Action</div>
                    </div>
                    <div className="grid grid-cols-6 gap-4 text-sm py-3 border-t">
                      <div>${order.totalAmount}</div>
                      <div>India</div>
                      <div>{order.items[0]?.quantity || 1} Units</div>
                      <div>On demand</div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Monthly
                      </div>
                      <div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-gray-800 text-white hover:bg-gray-700"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="packaging" className="mt-4">
                  <p className="text-sm text-gray-500">
                    Packaging information not available
                  </p>
                </TabsContent>

                <TabsContent value="ordered" className="mt-4">
                  <p className="text-sm text-gray-500">
                    Order placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total Amount: ${order.totalAmount}
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border p-4">
        <h3 className="text-lg font-bold mb-4">Order Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Order ID</p>
            <p className="text-gray-700 break-all">{order.id}</p>
          </div>
          <div>
            <p className="font-medium">Order Date</p>
            <p className="text-gray-700">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="font-medium">Status</p>
            <Badge
              variant={
                order.status === "PENDING"
                  ? "outline"
                  : order.status === "COMPLETED"
                  ? "success"
                  : "default"
              }
              className={
                order.status === "PENDING"
                  ? "text-yellow-600 border-yellow-600"
                  : ""
              }
            >
              {order.status}
            </Badge>
          </div>
          <div>
            <p className="font-medium">Payment Status</p>
            <Badge
              variant={order.stripePaymentIntentId ? "success" : "destructive"}
              className={
                !order.stripePaymentIntentId ? "bg-red-100 text-red-800" : ""
              }
            >
              {order.stripePaymentIntentId ? "Payment Initiated" : "Not Paid"}
            </Badge>
          </div>
          <div>
            <p className="font-medium">Payment ID</p>
            <p className="text-gray-700 break-all">
              {order.stripePaymentIntentId || "Not available"}
            </p>
          </div>
          <div>
            <p className="font-medium">Total Amount</p>
            <p className="text-gray-700 font-bold">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {mainProduct?.attributes &&
        Object.keys(mainProduct.attributes).length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Product Attributes</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(mainProduct.attributes).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">{key}: </span>
                  <span className="text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      {seller && (
        <div className="bg-white rounded-md shadow-sm border p-4 mt-6">
          <h3 className="text-lg font-bold mb-4">Seller Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Business Name</p>
              <p className="text-gray-700">{seller.businessName}</p>
            </div>
            <div>
              <p className="font-medium">Business Address</p>
              <p className="text-gray-700">
                {seller.businessAddress || "Not provided"}
              </p>
            </div>
            <div>
              <p className="font-medium">Website</p>
              <p className="text-gray-700">
                {seller.websiteLink ? (
                  <a
                    href={`https://${seller.websiteLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {seller.websiteLink}
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            </div>
            <div>
              <p className="font-medium">Contact</p>
              <p className="text-gray-700">
                {seller.user?.email || "Not available"}
              </p>
            </div>
            <div>
              <p className="font-medium">Categories</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {seller.businessCategories?.map((category) => (
                  <Badge key={category} variant="outline" className="text-xs">
                    {category.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {order.buyer && (
        <div className="bg-white rounded-md shadow-sm border p-4 mt-6">
          <h3 className="text-lg font-bold mb-4">Buyer Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Name</p>
              <p className="text-gray-700">
                {order.buyer.user?.name || "Not provided"}
              </p>
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-700">
                {order.buyer.user?.email || "Not provided"}
              </p>
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-gray-700">
                {order.buyer.user?.phoneNumber || "Not provided"}
              </p>
            </div>
            <div>
              <p className="font-medium">Country</p>
              <p className="text-gray-700">
                {order.buyer.user?.country || "Not provided"}
              </p>
            </div>
            <div>
              <p className="font-medium">Buyer ID</p>
              <p className="text-gray-700 break-all">{order.buyer.id}</p>
            </div>
            <div>
              <p className="font-medium">User ID</p>
              <p className="text-gray-700 break-all">{order.buyer.userId}</p>
            </div>
          </div>
        </div>
      )}

      {mainProduct && (
        <div className="bg-white rounded-md shadow-sm border p-4 mt-6">
          <h3 className="text-lg font-bold mb-4">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Product Price:</span>
              <span>${mainProduct.price.toFixed(2)}</span>
            </div>
            {mainProduct.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({mainProduct.discount}%):</span>
                <span>
                  -$
                  {((mainProduct.price * mainProduct.discount) / 100).toFixed(
                    2
                  )}
                </span>
              </div>
            )}
            {mainProduct.deliveryCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>Delivery Cost:</span>
                <span>${mainProduct.deliveryCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
