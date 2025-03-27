"use client";
import { useState, useEffect } from "react";
import { X, CheckCheck, Factory, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api/orders";
import { toast } from "sonner";
import ManufactureForm from "./manufacture-form";
import Image from "next/image";
import { countries } from "@/app/(auth)/signup/seller/onboarding/signup-form";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  isAccepted: boolean;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryId: string;
    attributes: Record<string, string>;
  };
  seller: {
    id: string;
    businessName: string;
    businessAddress: string;
    user: {
      name: string;
      imageUrl: string | null;
    };
  };
}

interface ShippingAddress {
  fullName: string;
  address: string;
  country: string;
  state: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
  isAccepted: boolean;
  buyer?: {
    id: string;
    userId: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      companyName: string;
      country: string | null;
      imageUrl: string | null;
      phoneNumber: string;
    };
  };
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

const KollaBeeRequests = () => {
  const [requests, setRequests] = useState<Order[]>([]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("received");
  const [showActions, setShowActions] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await ordersApi.getOrdersForSeller();
        setRequests(response.orders);
        console.log("response", response.orders);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to load requests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleTakeAction = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowActions(true);
  };

  // Action Modal
  const ActionModal = () => {
    const selectedRequest = requests.find((r) => r.id === selectedRequestId);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Take Action</h3>
            <button onClick={() => setShowActions(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            {!selectedRequest?.isAccepted ? (
              <>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg">
                  Accept Request
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg text-red-600">
                  Decline Request
                </button>
              </>
            ) : (
              <>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg"
                  onClick={() => router.push(`/seller/chat`)}
                >
                  Start Chat
                </button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg">
                  View Details
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRequestCard = (request: Order) => {
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
                    {/* <th className="text-left p-3 font-medium text-gray-700">
                      Order frequency{" "}
                      <span className="text-gray-400 text-xs">↑</span>
                    </th> */}
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
                    {/* <td className="p-3 text-gray-800">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        Monthly
                      </div>
                    </td> */}
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

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="p-4 bg-white rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                className={`pb-2 px-2 text-sm flex items-center space-x-2 gap-2 ${
                  activeTab === "received"
                    ? "text-rose-600 border-b-2 border-rose-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("received")}
              >
                <CheckCheck className="w-4 h-4" />
                Received Requests
              </button>
              <button
                className={`pb-2 px-2 text-sm flex items-center space-x-2 gap-2 ${
                  activeTab === "manufacturing"
                    ? "text-rose-600 border-b-2 border-rose-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("manufacturing")}
              >
                <Factory className="w-4 h-4" />
                Manufacturing Requests
              </button>
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="p-4 flex-1 overflow-auto bg-white mt-6 rounded-xl">
          {(activeTab === "received" || activeTab === "all") && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-4">Showing all requests</h3>
            </div>
          )}

          {activeTab !== "manufacturing" && isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            activeTab !== "manufacturing" &&
            (requests.length > 0 ? (
              <div className="space-y-8">
                {requests.map((request) => renderRequestCard(request))}
              </div>
            ) : (
              <div className="px-8 pt-20 text-center flex items-center justify-center">
                No requests found
              </div>
            ))
          )}

          {activeTab === "manufacturing" && (
            <ManufactureForm setActiveTab={setActiveTab} />
          )}
        </div>
      </div>

      {showActions && <ActionModal />}
    </div>
  );
};

export default KollaBeeRequests;
