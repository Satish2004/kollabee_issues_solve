"use client"

import React, { useState, useEffect } from 'react';
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
import { productsApi } from '@/lib/api/products';
import {categoryApi} from '@/lib/api/category';
import { Product } from '@/types/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';

interface ProductStats {
  categories: number;
  totalProducts: number;
  topSelling: number;
  lowStocks: number;
}

const ProductsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'draft'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);

  const [stats, setStats] = useState<ProductStats>({
    categories: 0,
    totalProducts: 0,
    topSelling: 0,
    lowStocks: 0
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [activeTab, searchQuery, currentPage]);

  useEffect(() => {
    const newStats = {...stats};
    if(categories.length > 0){
      newStats.categories = categories.length;
    }
    if(products.length > 0){
      newStats.totalProducts = products.length;
    }
    if(products.length > 0){
      const lowStocks = products.filter((product) => product.availableQuantity < 10);
      newStats.lowStocks = lowStocks.length;
    }
    setStats(newStats);
  },[categories,products])

  const loadCategories = async () => {
    const response:any = await categoryApi.getAll();
    setCategories(response.data);
  }

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response:any = await productsApi.getProducts({
        search: searchQuery,
        page: currentPage,
        limit: 10,
      });

      setProducts(response.data);
      // Assuming response includes pagination info
      if (response?.totalPages) {
        setTotalPages(response?.totalPages);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsApi.deleteProduct(productId);
      toast.success('Product deleted successfully');
      loadProducts(); // Reload the list
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

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
                Draft Products
              </button>
            </div>
            <Link 
              href="/seller/products/add-product"
              className="flex items-center space-x-2 bg-red-50 text-red-500 px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="p-4 flex justify-between items-center">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Products</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Stock</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Created</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.images[0] || '/placeholder.png'} 
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">${product.price}</td>
                      <td className="px-4 py-2">{product.availableQuantity}</td>
                      <td className="px-4 py-2">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.stockStatus === 'IN_STOCK' 
                            ? 'bg-green-100 text-green-600'
                            : product.stockStatus === 'LOW_STOCK'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {product.stockStatus}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <Link href={`/seller/products/${product.id}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/seller/products/${product.id}/edit`}>
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(product.id)}>
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 p-4">
            <button 
              className="p-1 rounded hover:bg-gray-100"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded ${
                  page === currentPage ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              className="p-1 rounded hover:bg-gray-100"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
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