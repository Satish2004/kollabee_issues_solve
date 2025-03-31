"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { productsApi } from "@/lib/api/products";
import ProductForm from "../../add-product";
import { toast } from "sonner";

export default function EditProductPage() {
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      toast.error("Product ID is required");
      router.push("/seller/products");
      return;
    }
    const loadProduct = async () => {
      try {
        if (id) {
          const response: any = await productsApi.getProductDetails(
            id as string
          );
          console.log("my product", response.product);
          setInitialData(response.product);
        }
      } catch (error) {
        toast.error("Failed to load product");
        router.push("/seller/products");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (data: any) => {
    try {
      if (!id) {
        toast.error("Product ID is required");
        router.push("/seller/products");
        return;
      }
      await productsApi.updateProduct(id as string, data);
      toast.success("Product updated successfully");
      router.push("/seller/products");
    } catch (error) {
      toast.error("Failed to update product");
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
