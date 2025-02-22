"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Loader2   } from 'lucide-react';
import { toast } from 'sonner';
import { productsApi } from '@/lib/api/products';
import { categoryApi } from '@/lib/api/category';
import { Category } from '@/types/api';
import type { ProductFormData } from './types';
import {ChevronLeft} from 'lucide-react'
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  initialData?: any;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(
    initialData || {
        name: '',
        description: '',
        price: 0,
        wholesalePrice: 0,
        minOrderQuantity: 1,
        availableQuantity: 0,
        categoryId: '',
        attributes: {},
        images: [],
        isDraft: true
    }
  );
const [imageLoading,setImageLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverImage, setCoverImage] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('upload');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData({...initialData,...formData});
      if(initialData.images){
      setCoverImage(initialData.images[0]);
      }
    }
  }, [initialData, mode]);

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
        setImageLoading(true);  
        const response:any = await productsApi.uploadImage(file);
        setFormData((prev:any) => ({
          ...prev,
          images: [...(prev.images || []), response?.url]
        }));
        setCoverImage(response?.url);
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image');
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent,isDraft:boolean=true) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        isDraft: isDraft
      };
      let response:any;
if(mode === 'edit'){
       response = await productsApi.updateProduct(initialData.id,productData);
}else{
  response = await productsApi.create(productData);
}
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
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => router.back()}>
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
            <div>{formData.isDraft ? "Draft" : "Active"}</div>
          </div>

          <div className="space-y-2">
            <div className='text-[16px] font-semibold text-gray-800 mb-2'>General Information</div>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeSection === 'upload' ? 'font-semibold' : ''}`}
              onClick={() => setActiveSection('upload')}
            >
              Upload art cover
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeSection === 'general' ? 'font-semibold' : ''}`}
              onClick={() => setActiveSection('general')}
            >
              General information
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeSection === 'details' ? 'font-semibold' : ''}`}
              onClick={() => setActiveSection('details')}
            >
              Product details
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeSection === 'documents' ? 'font-semibold' : ''}`}
              onClick={() => setActiveSection('documents')}
            >
              Documents (if any)
            </button>
          </div>
          <div className='text-[16px] font-semibold text-gray-800 mb-2'>Publish Art</div>
     <button className={`w-full text-left px-3 py-2 rounded-lg ${
                activeSection === 'publish' ? 'font-semibold' : ''}`} onClick={() => setActiveSection('publish')}>Review and Publish</button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200"
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
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
                        src={coverImage}
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
                      {imageLoading ? <div className="w-8 h-8 text-gray-400 mx-auto mb-4"><Loader2 className="w-8 h-8 animate-spin" /></div> : <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />}
                      <p className="text-gray-600 mb-2 text-sm">Drag and drop your image here</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                       
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200"
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
                          value={formData.attributes?.material || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, material: value }
                          })}
                        />
                        <AttributeInput
                          label="Fabric Weight"
                          value={formData.attributes?.fabricWeight || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, fabricWeight: value }
                          })}
                        />
                        <AttributeInput
                          label="Technics"
                          value={formData.attributes?.technics || ''}
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
                          value={formData.attributes?.color || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, color: value }
                          })}
                        />
                        <AttributeInput
                          label="Fabric Type"
                          value={formData.attributes?.fabricType || ''}
                          onChange={(value) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, fabricType: value }
                          })}
                        />
                        <AttributeInput
                          label="Fit Type"
                          value={formData.attributes?.fitType || ''}
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

            {activeSection === 'publish' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Review and Publish</h2>
                <div className="space-y-6">
                  {/* Preview Section */}
                  <div className="border rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        {coverImage && (
                          <img
                            src={coverImage}
                            alt="Product preview"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm text-gray-500">Product Name</h4>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm text-gray-500">Price</h4>
                          <p className="font-medium">${formData.price}</p>
                        </div>
                        <div>
                          <h4 className="text-sm text-gray-500">Category</h4>
                          <p className="font-medium">
                            {categories.find(c => c.id === formData.categoryId)?.categoryName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visibility Section */}
                  {/* <div className="border rounded-lg p-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Visibility</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="visibility"
                          checked={!formData.isDraft}
                          onChange={() => setFormData({ ...formData, isDraft: false })}
                          className="form-radio text-[#9e1171]"
                        />
                        <div>
                          <p className="font-medium">Public</p>
                          <p className="text-sm text-gray-500">This product will be visible to all users</p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="visibility"
                          checked={formData.isDraft}
                          onChange={() => setFormData({ ...formData, isDraft: true })}
                          className="form-radio text-[#9e1171]"
                        />
                        <div>
                          <p className="font-medium">Private</p>
                          <p className="text-sm text-gray-500">Only you can see this product</p>
                        </div>
                      </label>
                    </div>
                  </div> */}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4">
                
                    <button
                      type="submit"
                      onClick={(e:any) => handleSubmit(e,false)}
                      className="px-6 py-2 bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px]"
                    >
                      Publish Now
                    </button>
                  </div>
                </div>
              </div>
            )}
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