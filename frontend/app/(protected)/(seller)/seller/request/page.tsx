"use client"
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, Plus, Eye, Edit2, Trash2, X ,ChevronsLeft} from 'lucide-react';
import { useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api/orders";
import { toast } from 'sonner';

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
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button 
                className={`pb-2 px-2 text-sm flex items-center space-x-2 ${activeTab === 'all' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('all')}
              >
                <ChevronsLeft className='w-4 h-4' onClick={() => router.push('/seller')}/>
                All Requests
              </button>
              {/* <button 
                className={`pb-2 px-2 text-sm ${activeTab === 'received' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('received')}
              >
                Received Requests
              </button>
              <button 
                className={`pb-2 px-2 text-sm ${activeTab === 'manufacturing' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('manufacturing')}
              >
                Manufacturing Requests
              </button> */}
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="p-4 flex-1 overflow-auto bg-gray-50">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-4">Received Requests</h3>
          </div>
          
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow mb-4">
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="font-medium">{request.shippingAddress?.fullName}</span>
                    {request.shippingAddress?.country && (
                      <div className="flex items-center ml-2">
                        <div className="w-5 h-3 bg-red-600 flex items-center justify-center text-[8px] text-white font-bold">
                          {request.shippingAddress.country}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {request.items[0]?.product?.name}
                    </h2>
                    {!request.isAccepted ? (
                      <button
                        onClick={() => router.push(`/seller/request/${request.id}`)}
                        className="flex items-center space-x-2 px-4 py-1 rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-sm"
                      >
                        Take Action
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">Accepted</span>
                        <button
                          onClick={() => router.push(`/seller/chat`)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded hover:bg-gray-200"
                        >
                          Chat
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="font-medium text-sm">${request.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Country</p>
                      <p className="font-medium text-sm">{request.shippingAddress?.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          request.isAccepted ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <p className="font-medium text-sm">
                          {request.isAccepted ? 'Accepted' : request.status}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Date</p>
                      <p className="font-medium text-sm">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Action</p>
                      <button 
                        className="px-3 py-1 bg-gray-800 text-white text-xs rounded"
                        onClick={() => router.push(`/seller/request/${request.id}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showActions && <ActionModal />}
    </div>
  );
};

export default KollaBeeRequests;