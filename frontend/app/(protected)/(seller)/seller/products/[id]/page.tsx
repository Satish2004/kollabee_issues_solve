"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productsApi } from '@/lib/api/products';
import ProductForm from '../add-product';
import { toast } from 'sonner';

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Minus, Plus, ShoppingCart, Store, Truck, Globe, Phone, MapPin, Star } from "lucide-react"

export default function EditProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(10)
  const {id} = useParams();

  useEffect(() => {
    if (!id) {
      console.log("hello nh mila")
      toast.error('Product ID is required');
      router.push('/seller/products');
      return;
    }
    const loadProduct = async () => {
      try {
        if(id){
          const response:any = await productsApi.getProductDetails(id as string);
          console.log("hello")
          console.log("my product", response.product)
          setProduct(response.product);
        }
      } catch (error) {
        toast.error('Failed to load product');
        router.push('/seller/products');
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
        toast.error('Product ID is required');
        router.push('/seller/products');
        return;
      }
      await productsApi.updateProduct(id as string, data);
      toast.success('Product updated successfully');
      router.push('/seller/products');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const discountedPrice = product.price - product.price * (product.discount / 100)

  const incrementQuantity = () => {
    if (quantity < product?.availableQuantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > product.minOrderQuantity) {
      setQuantity(quantity - 1)
    }
  }

  if(!product){
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={product.stockStatus === "IN_STOCK" ? "default" : "secondary"}>
                {product.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
              </Badge>
              <div className="text-sm text-muted-foreground">Available: {product.availableQuantity} units</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            {product.discount > 0 && (
              <Badge variant="destructive" className="mb-2">
                Save {product.discount}%
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Delivery cost: ${product.deliveryCost}</span>
            </div>
          </div>

          <hr className="my-4 w-full border-neutral-300" />

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= product.minOrderQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.availableQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="ml-4 text-sm text-muted-foreground">Min. order: {product.minOrderQuantity} units</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button className="flex-1 gradient-border">
              <ShoppingCart className="mr-2 h-4 w-4 gradient-text" /> Add to Cart
            </Button>
            <Button variant="secondary" className="flex-1">
              Buy Now
            </Button>
          </div>

          {/* Seller Card */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Store className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{product.seller.businessName}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{product.seller.businessAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={`https://${product.seller.websiteLink}`} className="text-primary hover:underline">
                    {product.seller.websiteLink}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{product.seller.user.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Contact: {product.seller.user.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="attributes">Specifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="p-4 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-3">About this product</h3>
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p className="text-muted-foreground">No description available for this product.</p>
          )}
        </TabsContent>
        <TabsContent value="attributes" className="p-4 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.attributes).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="font-medium">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="p-4 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Shipping Information</h3>
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-5 w-5 text-primary" />
            <span className="font-medium">Delivery Cost:</span>
            <span>${product.deliveryCost}</span>
          </div>
          <p className="text-muted-foreground">
            Standard shipping typically takes 3-5 business days depending on your location.
          </p>
        </TabsContent>
      </Tabs>

      {/* Related Products Placeholder */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}