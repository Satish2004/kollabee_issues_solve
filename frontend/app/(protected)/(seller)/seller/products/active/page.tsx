"use client"

import React, { useState } from 'react';
import { 
  Box, 
  List, 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash,
  ChevronLeft,
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import type { Product, ProductStats, ProductTableItem } from '../types';
import { useRouter } from 'next/navigation';

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'draft'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const stats: ProductStats = {
    categories: 14,
    totalProducts: 1252,
    topSelling: 5,
    lowStocks: 12
  };

  const products: ProductTableItem[] = [
    {
      id: '1',
      name: 'Natali Craig',
      price: 10.99,
      quantityAvailable: 12311212,
      createdDate: 'Just now',
      availability: 'In-Stock'
    },
    {
      id: '2',
      name: 'Kate Morrison',
      price: 10.99,
      quantityAvailable: 1231341,
      createdDate: 'A minute ago',
      availability: 'In-Stock'
    },
    // Add more sample data...
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
   

      {/* Main Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            title="CATEGORIES"
            value={stats.categories}
            icon={<Box className="w-5 h-5 text-red-500" />}
          />
          <StatCard
            title="TOTAL PRODUCTS"
            value={stats.totalProducts}
            icon={<List className="w-5 h-5 text-red-500" />}
          />
          <StatCard
            title="TOP SELLING"
            value={stats.topSelling}
            icon={<Box className="w-5 h-5 text-red-500" />}
          />
          <StatCard
            title="LOW STOCKS"
            value={stats.lowStocks}
            icon={<Box className="w-5 h-5 text-red-500" />}
          />
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 ${
                  activeTab === 'active'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('active')}
              >
                Active Products
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === 'draft'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('draft')}
              >
                Draft Product
              </button>
            </div>
            <button className="flex items-center space-x-2 bg-red-50 text-red-500 px-4 py-2 rounded-lg" onClick={() => router.push('/seller/products/add-product')}>
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-4 flex justify-between items-center">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Products</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Selling Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity Available</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Created Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Availability</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">${product.price}</td>
                    <td className="px-4 py-2">{product.quantityAvailable}</td>
                    <td className="px-4 py-2">{product.createdDate}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.availability === 'In-Stock' 
                          ? 'bg-green-100 text-green-600'
                          : product.availability === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {product.availability}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 p-4">
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded ${
                  page === 1 ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg p-4 shadow">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-500 text-sm">{title}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default ProductsPage;