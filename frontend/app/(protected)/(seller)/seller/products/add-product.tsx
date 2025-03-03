"use client";

import React, { useState, useEffect ,useRef} from 'react';
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
  mode='create',
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
        isDraft: true,
        thumbnail:null
    }
  );
const [imageLoading,setImageLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverImage, setCoverImage] = useState<any>(null);
  const [attributes, setAttributes] = useState<any>({});  
  const [uploadDocuments,setUploadDocuments] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('upload');
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const [thumbnail,setThumbnail] = useState<any>(null);
  const [documents,setDocuments] = useState<any>([]);
  const [documentsLoading,setDocumentsLoading] = useState(false);
  const documentsRef = useRef<HTMLInputElement>(null);

  // Refs for each section
  const uploadRef = useRef<HTMLDivElement>(null);
  const generalInfoRef = useRef<HTMLDivElement>(null);
  const productDetailsRef = useRef<HTMLDivElement>(null);
  // const documentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
console.log(initialData,"initialData");
 
  }, [mode]);


  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      setFormData({...initialData,...formData});
      if(initialData.images){
      setCoverImage(initialData.images[0]);
      console.log(initialData.images[0],"initialData.images[0]");
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

  // Handle scroll to section
  const scrollToSection = (sectionId: string) => {
    const refs: any = {
      'upload': uploadRef,
      'general-info': generalInfoRef,
      'product-details': productDetailsRef,
      'documents': documentsRef
    };
    
    refs[sectionId]?.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Update active section based on scroll position
  useEffect(() => {


    // window.addEventListener('scroll', handleScroll);
    // return () => window.removeEventListener('scroll', handleScroll);
    console.log(uploadRef.current,"uploadRef.current");
    console.log(generalInfoRef.current,"generalInfoRef.current");
    console.log(productDetailsRef.current,"productDetailsRef.current");
    console.log(documentsRef.current,"documentsRef.current");
  }, [uploadRef,generalInfoRef,productDetailsRef,documentsRef]);


      const handleScroll = () => {
      const sections = [
        { id: 'upload', ref: uploadRef },
        { id: 'general-info', ref: generalInfoRef },
        { id: 'product-details', ref: productDetailsRef },
        { id: 'documents', ref: documentsRef }
      ];

      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
  
  return (
    <div className="min-h-screen bg-white overflow-hidden">
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
        {mode !== 'create' &&  <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">Last update</div>
            <div>Monday, June 06 | 06:42 AM</div>
          </div>}

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">Status</div>
            <div>{formData.isDraft ? "Draft" : "Active"}</div>
          </div>

          {/* Navigation Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection('upload')}
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'upload' 
                    ? 'bg-pink-50 text-pink-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                Upload Art Cover
              </button>
              
              <button
                onClick={() => scrollToSection('general-info')}
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'general-info' 
                    ? 'bg-pink-50 text-pink-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                General Information
              </button>
              
              <button
                onClick={() => scrollToSection('product-details')}
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'product-details' 
                    ? 'bg-pink-50 text-pink-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                Product Details
              </button>
              
              <button
                onClick={() => scrollToSection('documents')}
                className={`w-full text-left p-2 rounded ${
                  activeSection === 'documents' 
                    ? 'bg-pink-50 text-pink-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                Documents
              </button>
            </div>
          </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200"
                onClick={(e) => handleSubmit(e,true)}
              >
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </button>
        </div>

        {/* Main Content */}
        <div className="col-span-3 bg-white rounded-lg shadow p-6 overflow-scroll" onScroll={handleScroll}>
          <form >
            {/* {activeSection === 'upload' && ( */}
              <div className='mb-4' ref={uploadRef}>
                <h2 className="text-lg font-semibold mb-2">Upload cover</h2>
                <p className="text-gray-600 mb-4">
                  Upload the art cover to capture your audience's attention
                </p>
                <div className="border-2 border-dashed rounded-lg p-8 text-center h-full">
                  {coverImage ? (
                    <div className="relative">
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        className="max-h-64 mx-auto"
                      />
                  
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
                <div className='flex items-center justify-end gap-2 mt-4'>
                  <button className='text-[#898989] text-sm px-6 py-2 rounded-[6px] font-semibold' onClick={() => {
                    setCoverImage(null);
                  }}>Remove</button>
                  <label htmlFor="cover-upload" className='text-[#898989] border border-[#898989] text-sm px-4 py-1 rounded-[14px] font-semibold cursor-pointer'>
                    Change
                  </label>
                </div>
              </div>
            {/* )} */}

            {/* {activeSection === 'general' && ( */}
              <div className='mb-4' ref={generalInfoRef}>
                <h2 className="text-lg font-semibold mb-4">Key attributes</h2>
                
                <div className="space-y-6">
                  {/* Industry-specific attributes */}
                  <div>
                    <h3 className="font-medium mb-4">Industry-specific attributes</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-[40%] text-sm text-gray-600 bg-[#f4f4f4] border border-[#eeeeee] rounded-l-[6px] px-2 py-2.5">Material</div>
                        <input 
                          type="text"
                          placeholder="Add your answer"
                          className="flex-1 p-2 border rounded-md active:border-[#9e1171] focus:border-[#eeeeee] focus:outline-none"
                          value={formData.attributes?.material || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, material: e.target.value }
                          })}
                        />
                      </div>

                      <div className="flex items-center ">
                        <div className="w-[40%] text-sm text-gray-600 bg-[#f4f4f4] border border-[#eeeeee] rounded-l-[6px] px-2 py-2.5">Fabric Weight</div>
                        <input 
                          type="text"
                          placeholder="Add your answer"
                          className="flex-1 p-2 border rounded-md active:border-[#9e1171] focus:border-[#eeeeee] focus:outline-none"
                          value={formData.attributes?.fabricWeight || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, fabricWeight: e.target.value }
                          })}
                        />
                      </div>

                      <div className="flex items-center ">
                          <div className="w-[40%] text-sm text-gray-600 bg-[#f4f4f4] border border-[#eeeeee] rounded-l-[6px] px-2 py-2.5">Technics</div>
                        <input 
                          type="text"
                          placeholder="Add your answer"
                          className="flex-1 p-2 border rounded-md active:border-[#9e1171] focus:border-[#eeeeee] focus:outline-none"
                          value={formData.attributes?.technics || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, technics: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Other attributes */}
                  <div>
                    <h3 className="font-medium mb-4 text-[16px]">Other attributes</h3>
                    <div className="space-y-4">
                      <div className="flex items-center ">
                        <div className="w-[40%] text-sm text-gray-600 bg-[#f4f4f4] border border-[#eeeeee] rounded-l-[6px] px-2 py-2.5">Collar</div>
                        <input 
                          type="text"
                          placeholder="Add your answer"
                          className="flex-1 p-2 border rounded-md active:border-[#9e1171] focus:border-[#eeeeee] focus:outline-none"
                          value={formData.attributes?.collar || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, collar: e.target.value }
                          })}
                        />
                      </div>

                      <div className="flex items-center ">
                        <div className="w-[40%] text-sm text-gray-600 bg-[#f4f4f4] border border-[#eeeeee] rounded-l-[6px] px-2 py-2.5">Fabric Type</div>
                        <input 
                          type="text"
                          placeholder="Add your answer"
                          className="flex-1 p-2 border rounded-md active:border-[#9e1171] focus:border-[#eeeeee] focus:outline-none"
                          value={formData.attributes?.fabricType || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, fabricType: e.target.value }
                          })}
                        />
                      </div>

                      <div className="flex items-center ">
                        <div className="w-[40%] text-sm text-gray-600 bg-[#f4f4f4] border border-[#eeeeee] rounded-l-[6px] px-2 py-2.5">Fit Type</div>
                        <input 
                          type="text"
                          placeholder="Add your answer"
                          className="flex-1 p-2 border rounded-md active:border-[#9e1171] focus:border-[#eeeeee] focus:outline-none"
                          value={formData.attributes?.fitType || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            attributes: { ...formData.attributes, fitType: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <button 
                    type="button"
                    onClick={() => {}}
                    className="text-[#898989] hover:text-[#666] flex items-center gap-2"
                  >
                    + Add other options
                  </button> */}
                </div>
              </div>
            {/* )} */}

            {/* {activeSection === 'details' && ( */}
              <div className='mb-4' ref={productDetailsRef}>
                    <h2 className="text-lg font-semibold mb-4">Thumbnail of the product</h2>
                 {   thumbnail ? <div className="border-2 border-dashed rounded-lg p-8 text-center h-full">
                      <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                
                    </div> : <div className="border-2 border-dashed rounded-lg p-8 text-center h-full">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <label htmlFor='thumbnail-upload' className='text-[#898989] border border-[#898989] text-sm px-4 py-1 rounded-[14px] font-semibold cursor-pointer' onClick={() => {
                  thumbnailRef.current?.click();
                   }}>
                    Browse Files
                   </label>
                   <input id='thumbnail-upload' type="file" ref={thumbnailRef} className='hidden' onChange={(e) => {
                    setThumbnail(e.target.files?.[0]);
                   }}/>
                    </div>}
                <h2 className="text-lg font-semibold mb-4 mt-2">Add price details</h2>
                
                <div className="space-y-6">
                  {/* Price Details */}
                  <div className="space-y-4">
                    <div className='flex items-center gap-4'>
                      <div className='text-sm text-gray-600 w-[50%]'>Name</div>
                      <input 
                        type="text"
                        placeholder="Enter product name"
                        className="w-full p-2 border rounded-md bg-[#fcfcfc]"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          name: e.target.value
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-1/3 text-sm text-gray-600">Add product price</div>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input 
                          type="text"
                          placeholder="122.00"
                          className="w-full p-2 pl-8 border rounded-md bg-[#fcfcfc]"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            price: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-1/3 text-sm text-gray-600">Discount</div>
                      <div className="flex-1 relative">
                        <input 
                          type="text"
                          placeholder="Enter discount"
                          className="w-full p-2 border rounded-md bg-[#fcfcfc]"
                          value={formData.discount || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            discount: e.target.value
                          })}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-1/3 text-sm text-gray-600">Delivery cost</div>
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input 
                          type="text"
                          placeholder="Enter delivery cost"
                          className="w-full p-2 pl-8 border rounded-md bg-[#fcfcfc]"
                          value={formData.deliveryCost || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            deliveryCost: e.target.value
                          })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-1/3 text-sm text-gray-600">Minimum order</div>
                      <input 
                        type="number"
                        placeholder="Enter minimum order quantity"
                        className="flex-1 p-2 border rounded-md bg-[#fcfcfc]"
                        value={formData.minOrderQuantity || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          minOrderQuantity: e.target.value
                        })}
                      />
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className="w-1/3 text-sm text-gray-600">Available quantity</div>
                      <input 
                        type="number"
                        placeholder="Enter available quantity"
                        className="flex-1 p-2 border rounded-md bg-[#fcfcfc]"
                        value={formData.availableQuantity || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          availableQuantity: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  {/* Add other options button */}
                
                </div>
              </div>
            {/* )} */}

            {/* {activeSection === 'documents' && ( */}
              <div ref={documentsRef}>
                <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            {    documents.length === 0 ? <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop your documents here</p>
                  <label htmlFor='documents-upload' className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200" onClick={() => {
                    documentsRef.current?.click();
                  }}>
                    Browse Files
                  </label>
                  <input id='documents-upload' type="file" ref={documentsRef} className='hidden' onChange={(e) => {
                    setDocuments([...documents,e.target.files?.[0]]);
                  }}/>
                </div> : <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  {documents.map((document:any,index:number) => (
                    <div key={index}>
                      <img src={URL.createObjectURL(document)} alt="Document" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    </div>
                  ))}
                </div>}
              </div>
            {/* )} */}

          
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