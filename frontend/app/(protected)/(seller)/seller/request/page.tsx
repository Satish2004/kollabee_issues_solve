"use client"
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, Plus, Eye, Edit2, Trash2, X ,ChevronsLeft ,Omega,CheckCheck,Factory, ChevronRight} from 'lucide-react';
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api/orders";
import { toast } from 'sonner';
import ManufactureForm from './manufacture-form';
import Image from 'next/image';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryId: string;
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
  shippingAddress: ShippingAddress;
  isAccepted: boolean;
}

const KollaBeeRequests = () => {
  const [requests, setRequests] = useState<Order[]>([]);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('received');
  const [showActions, setShowActions] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response :any= await ordersApi.getOrders();
        setRequests(response.orders);
        console.log("resposne", response.orders);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Action Modal
  const ActionModal = () => {
    const selectedRequest = requests.find(r => r.id === selectedRequestId);

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

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="p-4 bg-white rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
            <ChevronsLeft className='w-4 h-4' onClick={() => router.push('/seller')}/>
              <button 
                className={`pb-2 px-2 text-sm flex items-center space-x-2 gap-2 ${activeTab === 'all' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('all')}
              >
                <Omega className='w-4 h-4'/>
                All Requests
              </button>
              <button 
                className={ `pb-2 px-2 text-sm flex items-center space-x-2 gap-2 ${activeTab === 'received' ? 'text-rose-600 border-b-2  border-[#9e1171]' : 'text-gray-500'}`}
                onClick={() => setActiveTab('received')}
              >
                <CheckCheck className='w-4 h-4'/>
                Received Requests
              </button>
              <button 
                className={`pb-2 px-2 text-sm flex items-center space-x-2 gap-2 ${activeTab === 'manufacturing' ? 'text-rose-600 border-b-2  border-[#9e1171]' : 'text-gray-500'}`}
                onClick={() => setActiveTab('manufacturing')}
              >
                <Factory className='w-4 h-4'/>
                Manufacturing Requests
              </button>
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="p-4 flex-1 overflow-auto bg-white mt-6 rounded-xl">
       { (activeTab === 'received' || activeTab === 'all') && <div className="mb-4">
            <h3 className="text-lg font-medium mb-4">Received Requests</h3>
          </div>}

          {(activeTab !== 'manufacturing') && isLoading ? (
            <div>Loading...</div>
          ) : activeTab !== 'manufacturing' && (
            requests.map((request) => (
<div className="max-w-6xl mx-auto rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-1 border-2 rounded-[10px] border-gray-200">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
          <span className="text-indigo-600 font-semibold">G</span>
        </div>
        <div className="font-medium text-lg">{request.items[0].product.artistName || "Guangzhou Duoxi Trading Firm (Sole Proprietorship)"}</div>
        <div className="flex items-center gap-1 ml-2">
          <div className="w-5 h-3 bg-red-600"></div>
          <span className="text-gray-700">CN</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-2">
        {/* Product Image */}
        <div className="w-full md:w-60 lg:w-72">
          <Image 
            src="/placeholder.svg?height=400&width=400" 
            alt="Product Image" 
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

            {/* Take Action Button */}
            <div className="ml-auto">
              <button className=" w-40 py-2 text-purple-600 font-medium gradient-border text-xl"  onClick={() => router.push(`/seller/chat`)}>
                <span className="text-rose-500">Take Action </span>
              </button>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{request.items[0].product.name}</h1>

          {/* Product Tabs */}
          <div className="flex gap-2 mb-6">
            <span className="px-4 py-1 border border-gray-400 text-sm rounded-[5px] text-gray-800">Product</span>
            <span className="px-4 py-1 border border-gray-400 text-sm rounded-[5px] text-gray-800">Packaging</span>
            <span className="px-4 py-1 border border-gray-400 text-sm rounded-[5px] text-gray-800">Request for proposal</span>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-medium text-stone-700 rounded-tl-xl">
                    Lead size <span className="text-gray-400 text-xs">↑</span>
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">Country</th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Quantity <span className="text-gray-400 text-xs">↑</span>
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700">Target Price</th>
                  <th className="text-left p-3 font-medium text-gray-700">
                    Order frequency <span className="text-gray-400 text-xs">↑</span>
                  </th>
                  <th className="text-left p-3 font-medium text-gray-700 rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="p-3 text-gray-800">{request.totalAmount}</td>
                  <td className="p-3 text-gray-800">{request.shippingAddress.country}</td>
                  <td className="p-3 text-gray-800">{request.items[0].quantity}</td>
                  <td className="p-3 text-gray-800">{request.items[0].price}</td>
                  <td className="p-3 text-gray-800">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      Monthly
                    </div>
                  </td>
                  <td className="p-3">
                    <button className="bg-zinc-800 text-white px-6 py-1 rounded-xl" onClick={() => router.push(`/seller/request/${request.id}`)}>View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
            ))
          )}
          {activeTab === 'manufacturing' && (
           <ManufactureForm setActiveTab={setActiveTab}/>
          )}
        </div>
      </div>

      {showActions && <ActionModal />}
    </div>
  );
};


export default KollaBeeRequests;