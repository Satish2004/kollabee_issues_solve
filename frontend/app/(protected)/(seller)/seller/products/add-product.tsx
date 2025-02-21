"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { productsApi } from '@/lib/api/products';
import { categoryApi } from '@/lib/api/category';
import { Category } from '@/types/api';
import type { ProductFormData } from './types';
import {ChevronLeft} from 'lucide-react'

interface ProductFormProps {
  initialData?: any;
  mode: 'create' | 'edit';
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
        name: '',
        description: '',
        price: 0,
        wholesalePrice: 0,
        minOrderQuantity: 1,
        availableQuantity: 0,
        categoryId: '',
        attributes: {},
        images: []
    }
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('upload');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setCoverImage(file);
        const response = await productsApi.uploadImage(file);
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), response.data.url]
        }));
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        isDraft: activeSection !== 'publish'
      };

      const response:any = await productsApi.create(productData);
      toast.success(mode === 'create' ? 'Product created successfully' : 'Product updated successfully');
      onSubmit(response.data);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center space-x-4">
            <ChevronLeft className="w-5 h-5" />
            <p className='text-red-500'>Back</p>
        </div>
      </header>

      <div className="p-6 grid grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">Last update</div>
            <div>Monday, June 06 | 06:42 AM</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">Status</div>
            <div>Draft</div>
          </div>

          <div className="space-y-2">
            <button
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeSection === 'upload' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveSection('upload')}
            >
              Upload art cover
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeSection === 'general' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveSection('general')}
            >
              General information
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeSection === 'details' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveSection('details')}
            >
              Product details
            </button>
            <button
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeSection === 'documents' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveSection('documents')}
            >
              Documents (if any)
            </button>
          </div>

          <button className="w-full bg-red-500 text-white py-2 rounded-lg mt-4">
            Save Changes
          </button>
        </div>

        {/* Main Content */}
        <div className="col-span-3 bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            {activeSection === 'upload' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Upload cover</h2>
                <p className="text-gray-600 mb-4">
                  Upload the art cover to capture your audience's attention
                </p>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {coverImage ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="Cover preview"
                        className="max-h-64 mx-auto"
                      />
                      <button
                        onClick={() => setCoverImage(null)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag and drop your image here</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="inline-block bg-red-50 text-red-500 px-4 py-2 rounded-lg cursor-pointer"
                      >
                        Browse Files
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'general' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">General information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category*
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price*
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name of Product*
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Description*
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg h-32"
                      placeholder="Enter product description"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'details' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Key attributes</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Industry-specific attributes</h3>
                      <div className="space-y-3">
                        <AttributeInput
                          label="Material"
                          value={formData.attributes.material || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, material: value }
                          })}
                        />
                        <AttributeInput
                          label="Fabric Weight"
                          value={formData.attributes.fabricWeight || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, fabricWeight: value }
                          })}
                        />
                        <AttributeInput
                          label="Technics"
                          value={formData.attributes.technics || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, technics: value }
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Other attributes</h3>
                      <div className="space-y-3">
                        <AttributeInput
                          label="Color"
                          value={formData.attributes.color || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, color: value }
                          })}
                        />
                        <AttributeInput
                          label="Fabric Type"
                          value={formData.attributes.fabricType || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, fabricType: value }
                          })}
                        />
                        <AttributeInput
                          label="Fit Type"
                          value={formData.attributes.fitType || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, fitType: value }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    + Add other options
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'documents' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your documents here</p>
                  <button className="bg-red-50 text-red-500 px-4 py-2 rounded-lg">
                    Browse Files
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface AttributeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const AttributeInput: React.FC<AttributeInputProps> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
      placeholder="Add your answer"
    />
  </div>
);

export default ProductForm;