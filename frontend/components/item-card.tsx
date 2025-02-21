"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/api";
import Link from "next/link";
import { cartApi } from '@/lib/api/cart';
import { toast } from "sonner";

interface ProductListProps {
  product: Product;
  currentUser: {
    id: string;
    role: string;
  } | null;
}

export function ItemCard({ product, currentUser }: ProductListProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const isSeller = currentUser?.role === 'SELLER';
  const isSellerItem = product.seller.userId === currentUser?.id;
  const isAvailable = product.availableQuantity > 0;
  

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const addToCart = async (productId: string) => {
    setAddingToCart(true);
    try {
      await cartApi.addToCart({ productId, quantity: 1 });
      toast.success("Added to cart");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <Card className="w-full group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold mb-2">{product.name}</CardTitle>
            <div className="gap-3 flex">
              {product.categories?.map((category) => (
                <Badge variant="secondary" className="text-xs" key={category.id}>
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-2xl font-bold text-primary">${product.price}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {product.images && product.images.length > 0 && (
          <div className="relative w-full h-56 mb-4 overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <Image
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    previousImage();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    nextImage();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {product.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="w-4 h-4" />
            <span>{product.seller.user.name}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex flex-col gap-2">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white dark:text-black">
          <Link href={`/product/${product.id}`}>
            View Product
          </Link>
        </Button>
        {!isSeller && isAvailable && (
          <Button 
            disabled={addingToCart} 
            onClick={() => addToCart(product.id)} 
            className="w-full bg-primary hover:bg-primary/90 text-white dark:text-black"
          >
            {addingToCart ? "Adding to Cart..." : "Add to Cart"}
          </Button>
        )}
        {!isAvailable && (
          <Button className="w-full bg-gray-200 text-gray-500" disabled>
            Sold Out
          </Button>
        )}
        {isSeller && (
          <Button className="w-full" variant="outline" disabled>
            {isSellerItem ? "Your Listing" : "Not Your Listing"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}