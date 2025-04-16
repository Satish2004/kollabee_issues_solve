"use client";

import { useState, useEffect, useCallback } from "react";
import { productsApi } from "@/lib/api/products";
import type { Product, ProductStats } from "../types";

interface UseProductsParams {
  status: string;
  search: string;
  page: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  limit?: number;
}

export function useProducts({
  status,
  search,
  page,
  sortBy,
  sortOrder,
  limit = 10,
}: UseProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<ProductStats>({
    categories: 0,
    totalProducts: 0,
    topSelling: 0,
    lowStocks: 0,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: any = await productsApi.getProducts({
        search,
        page,
        limit,
        status,
        sortBy,
        sortOrder,
      });

      // Handle potential API response format issues
      if (!response || !Array.isArray(response.data)) {
        console.error("Invalid API response format:", response);
        setProducts([]);
        return;
      }

      setProducts(response.data);
      const meta = response.meta;
      //     meta: {
      //     total,
      //     page: Number(page),
      //     limit: Number(limit),
      //     totalPages: Math.ceil(total / Number(limit)),
      //   },

      // Update total pages safely
      if (meta?.totalPages && typeof response.totalPages === "number") {
        setTotalPages(meta.totalPages);
      } else {
        // Fallback calculation if totalPages is not provided
        const totalItems = meta?.total || meta.total;
        setTotalPages(Math.ceil(totalItems / limit));
      }

      // Calculate stats
      updateStats(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, page, limit, status, sortBy, sortOrder]);

  const updateStats = useCallback(
    (productData: Product[]) => {
      if (!Array.isArray(productData)) return;

      const newStats = { ...stats };

      // Calculate low stocks
      const lowStocks = productData.filter(
        (product) =>
          product.availableQuantity < 15 && product.availableQuantity > 0
      );
      newStats.lowStocks = lowStocks.length;

      // Calculate total products
      newStats.totalProducts = productData.length;

      // Calculate top selling (products with stock)
      const topSelling = productData.filter(
        (product) => product.availableQuantity > 0
      );
      newStats.topSelling = topSelling.length;

      setStats(newStats);
    },
    [stats]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      await productsApi.deleteProduct(productId);
      // Refresh products after deletion
      fetchProducts();
    },
    [fetchProducts]
  );

  // Load products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    totalPages,
    stats,
    deleteProduct,
    refetchProducts: fetchProducts,
  };
}
