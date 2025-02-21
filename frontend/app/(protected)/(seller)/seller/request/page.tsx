"use client"
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { requestApi } from '@/lib/api/request';
import { toast } from 'sonner';
import { Category, Request } from '@/types/api';
import { categoryApi } from '@/lib/api/category';
import { Upload, X } from 'lucide-react';

const RequestsPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'details' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'received' | 'manufacturing'>('all');
  useEffect(() => {
    loadRequests();
    loadCategories();
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      const response:any = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response:any = await requestApi.getAll({
        search: searchQuery || undefined
      });
      setRequests(response);
    } catch (error) {
      console.error('Failed to load requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async (formData: any) => {
    try {
      await requestApi.create(formData);
      toast.success('Request created successfully');
      setView('list');
      loadRequests();
    } catch (error) {
      console.error('Failed to create request:', error);
      toast.error('Failed to create request');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await requestApi.delete(id);
      toast.success('Request deleted successfully');
      loadRequests();
    } catch (error) {
      console.error('Failed to delete request:', error);
      toast.error('Failed to delete request');
    }
  };

  const RequestList = () => (
    <div className="p-6">
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
        <div className="flex space-x-4">
          <button
            onClick={() => setView('form')}
            className="flex items-center space-x-2 px-4 py-2 bg-rose-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6 border-b">
        <button 
          className={`pb-2 px-2 ${activeTab === 'all' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('all')}
        >
          All Requests
        </button>
        <button 
          className={`pb-2 px-2 ${activeTab === 'received' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('received')}
        >
          Received Requests
        </button>
        <button 
          className={`pb-2 px-2 ${activeTab === 'manufacturing' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('manufacturing')}
        >
          Manufacturing Requests
        </button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold">Antibacterial Sheet Masks</h3>
                      <img src="/cn-flag.png" alt="CN" className="w-4 h-4" />
                    </div>
                    <p className="text-gray-500 text-sm">Guangzhou Daxin Trading Firm (Sole Proprietorship)</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <span>Beauty & Personal Care</span>
                      <span>•</span>
                      <span>Skin Care & Body Care</span>
                      <span>•</span>
                      <span>Facial Care</span>
                      <span>•</span>
                      <span>Face Mask Sheet</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowActions(true)}
                    className="px-4 py-1 text-rose-600 border border-rose-600 rounded-lg"
                  >
                    Take Action
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-4 gap-8">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Lead size</p>
                    <p className="font-medium">+$5,000</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Country</p>
                    <p className="font-medium">India</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Quantity</p>
                    <p className="font-medium">100-1000 units</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Order frequency</p>
                    <p className="font-medium">Monthly</p>
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
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setView('list')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronDown className="w-4 h-4 transform rotate-90 mr-2" />
          Back
        </button>
        <div className="flex space-x-4">
          <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg">
            Decline Request
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
            Accept Request
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <img src="/cn-flag.png" alt="CN" className="w-4 h-4" />
          <h2 className="text-lg font-semibold">Guangzhou Daxin Trading Firm (Sole Proprietorship)</h2>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <span>Beauty & Personal Care</span>
          <span>•</span>
          <span>Skin Care & Body Care</span>
          <span>•</span>
          <span>Facial Care</span>
          <span>•</span>
          <span>Face Mask Sheet</span>
        </div>

        <h3 className="text-xl font-semibold mb-4">Antibacterial Sheet Masks</h3>

        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-gray-500 text-sm mb-1">Lead size</p>
            <p className="font-medium">+$5,000</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Country</p>
            <p className="font-medium">India</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Quantity</p>
            <p className="font-medium">100-1000 units</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Order frequency</p>
            <p className="font-medium">Monthly</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Requirements</h4>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 mb-2">Industry-specific attributes</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p>Polyester / Cotton</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Technics</p>
                    <p>embroidered, Printed, 3D embroidery, Affixed cloth embroidery, towel embroidery</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-2">Other attributes</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Collar</p>
                    <p>Hooded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

      <h2 className="text-xl font-semibold mb-8">Create Form for the Buyer</h2>

      <div className="space-y-8">
        <button className="flex items-center text-rose-600 space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>

        <div>
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            <span>1. Basic Information</span>
            <button className="text-rose-600 text-sm font-normal flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              Add Fields
            </button>
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name*</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company Location*</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            <span>2. Product Details</span>
            <button className="text-rose-600 text-sm font-normal flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              Add Fields
            </button>
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name*</label>
              <input
                type="text"
                placeholder="Name of the product (e.g., Aloe Vera Gel)"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Additional Ingredients (Optional)*</label>
              <input
                type="text"
                placeholder="Want customization, you can add extra ingredients or specify preferences"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Formula Details*</label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                <button className="px-4 py-2 border rounded-lg">Upload</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
            <span>3. Quantity Requirements</span>
            <button className="text-rose-600 text-sm font-normal flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              Add Fields
            </button>
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Total Quantity Needed*</label>
            <input
              type="text"
              placeholder="e.g., 1000 units"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Action Modal
  const ActionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Take Action</h3>
          <button onClick={() => setShowActions(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg">
            Edit Request
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg">
            Start Chat
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg">
            View Details
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg text-red-600">
            Delete Request
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'list' && <RequestList />}
      {view === 'details' && <RequestDetails />}
      {view === 'form' && <RequestForm />}
      {showActions && <ActionModal />}
    </div>
  );
};

// API Types (you can move these to a separate types file)
interface BasicInformation {
  companyName: string;
  companyLocation: string;
}

interface ProductDetails {
  productName: string;
  additionalIngredients?: string;
  formulaDetails?: File;
}

interface QuantityRequirements {
  totalQuantity: number;
  orderFrequency?: string;
}

interface RequestFormData {
  basicInformation: BasicInformation;
  productDetails: ProductDetails;
  quantityRequirements: QuantityRequirements;
}

export default RequestsPage;