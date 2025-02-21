"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import ProductForm from '../../add-product/page';
import { toast } from 'sonner';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await productsApi.getProductDetails(params.id);
        setInitialData(response.data);
      } catch (error) {
        toast.error('Failed to load product');
        router.push('/seller/products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await productsApi.updateProduct(params.id, data);
      toast.success('Product updated successfully');
      router.push('/seller/products');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ProductForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
} 