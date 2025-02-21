"use client";

import { useRouter } from 'next/navigation';
import ProductForm from '../add-product';

const AddProductPage = () => {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    // After successful submission
    router.push('/seller/products');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ProductForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default AddProductPage; 