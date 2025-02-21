"use client"
import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Eye, Edit2, Trash2 } from 'lucide-react';

interface RequestItem {
  id: string;
  productName: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  details: {
    category: string;
    quantity: number;
    price: number;
    specifications: string[];
  };
}

const RequestsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'details' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);

  const mockRequests: RequestItem[] = [
    {
      id: '1',
      productName: 'Architectural Stone Works',
      image: '/api/placeholder/150/150',
      status: 'pending',
      timestamp: '2 hours ago',
      details: {
        category: 'Construction Materials',
        quantity: 100,
        price: 299.99,
        specifications: ['High durability', 'Weather resistant']
      }
    },
    // Add more mock data...
  ];

  const RequestList = () => (
    <div className="p-6">
      {/* Search and Actions Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search requests..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setView('form')}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Requests Grid */}
      <div className="grid gap-4">
        {mockRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start space-x-4">
              <img
                src={request.image}
                alt={request.productName}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{request.productName}</h3>
                    <p className="text-gray-500 text-sm">{request.timestamp}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setView('details');
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-500">Category</label>
                    <p className="font-medium">{request.details.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Quantity</label>
                    <p className="font-medium">{request.details.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Price</label>
                    <p className="font-medium">${request.details.price}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <p className={`font-medium ${
                      request.status === 'approved' ? 'text-green-500' :
                      request.status === 'rejected' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RequestDetails = () => (
    <div className="p-6">
      <button
        onClick={() => setView('list')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronDown className="w-4 h-4 transform rotate-90 mr-2" />
        Back
      </button>

      {selectedRequest && (
        <div className="space-y-6">
          <div className="flex items-start space-x-6">
            <img
              src={selectedRequest.image}
              alt={selectedRequest.productName}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {selectedRequest.productName}
              </h2>
              <p className="text-gray-500">{selectedRequest.timestamp}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Request Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Category</label>
                  <p className="font-medium">{selectedRequest.details.category}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Quantity</label>
                  <p className="font-medium">{selectedRequest.details.quantity}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Price</label>
                  <p className="font-medium">${selectedRequest.details.price}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Specifications</h3>
              <ul className="list-disc list-inside space-y-2">
                {selectedRequest.details.specifications.map((spec, index) => (
                  <li key={index} className="text-gray-700">{spec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const RequestForm = () => (
    <div className="p-6">
      <button
        onClick={() => setView('list')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronDown className="w-4 h-4 transform rotate-90 mr-2" />
        Back
      </button>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Create New Request</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">1. Product Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name*
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category*
                </label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>Select category</option>
                  {/* Add categories */}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">2. Quantity Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity*
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">3. Additional Requirements</h3>
            <textarea
              className="w-full px-3 py-2 border rounded-lg h-32"
              placeholder="Enter any additional requirements or specifications..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setView('list')}
              className="px-6 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg">
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'list' && <RequestList />}
      {view === 'details' && <RequestDetails />}
      {view === 'form' && <RequestForm />}
    </div>
  );
};

export default RequestsPage;