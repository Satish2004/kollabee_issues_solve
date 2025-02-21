"use client";

import { useEffect, useState } from "react";
import { Period, Product } from "@/types/dashboard";
import { getTrendingProductsAction } from "@/actions/seller-dashboard";
import { Skeleton } from "../ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface TrendingProductsProps {
  period: Period;
}

export function TrendingProducts({ period }: TrendingProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getTrendingProductsAction(period);
        setProducts(data as Product[]);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">{product.name}</span>
          </div>
          <Progress 
            value={(product.totalQuantity - product.availableQuantity) / product.totalQuantity * 100} 
            className="h-2 bg-gray-100" 
            indicatorClassName="bg-gray-800"
          />
        </div>
      ))}
    </div>
  );
}
