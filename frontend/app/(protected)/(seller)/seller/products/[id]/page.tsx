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
import { ChevronRight, Minus, Plus, ShoppingCart, Store, Truck, Globe, Phone, MapPin, Star, User, ChevronDown, Play, ChevronLeft } from "lucide-react"
import { cn } from '@/lib/utils';


export default function EditProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(10)
  const {id} = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedPrintingMethods, setSelectedPrintingMethods] = useState<string[]>(["Puff Printing"])
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)

  const productImages = product?.images

  const thumbnailsPerView = 6
  const hasMoreThumbnails = productImages.length > thumbnailsPerView

  const handleThumbnailScroll = () => {
    if (thumbnailStartIndex + thumbnailsPerView >= productImages.length) {
      setThumbnailStartIndex(0)
    } else {
      setThumbnailStartIndex((prev) => prev + 1)
    }
  }

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

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



  const discountedPrice = product.price - product.price * (product.discount / 100)

  if(!product){
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="flex">
          {/* Thumbnail Vertical Carousel */}
          <div className="hidden sm:flex flex-col mr-4 space-y-2 relative">
            {productImages.slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerView).map((img, idx) => (
              <div
                key={idx + thumbnailStartIndex}
                className={cn(
                  "w-16 h-16 border rounded cursor-pointer overflow-hidden",
                  activeImageIndex === idx + thumbnailStartIndex ? "border-primary border-2" : "border-gray-200",
                )}
                onClick={() => setActiveImageIndex(idx + thumbnailStartIndex)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Product thumbnail ${idx + thumbnailStartIndex + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
            {hasMoreThumbnails && (
              <button
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-gray-700"
                onClick={handleThumbnailScroll}
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Main Image Carousel */}
          <div className="flex-1 relative border border-gray-200 rounded-md overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={productImages[activeImageIndex] || "/placeholder.svg"}
                alt={`Product image ${activeImageIndex + 1}`}
                fill
                className="object-cover"
              />
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5 text-gray-800" />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5 text-gray-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant={product.stockStatus === "IN_STOCK" ? "default" : "secondary"} className={`${product.stockStatus === "IN_STOCK" ? "bg-green-100 text-green-700" : "bg-red-100"}`}>
                {product.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock"}
              </Badge>
              <div className={`text-sm ${product.availableQuantity > 500 ? "text-green-700" : "text-red-700"}`}>Available: {product.availableQuantity} units</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-bold">${discountedPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            {product.discount > 0 && (
              <Badge className="mb-2 button-bg text-white font-semibold">
                Save {product.discount}%
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-5">
              <span className='font-semibold'>Delivery cost: ${product.deliveryCost}</span>
            </div>

            <div className='mt- flex items-center gap-2'>
                <p className='font-semibold'>Ratings:</p>
                <span>{product.rating > 0 ? product.rating.map((rating) => <Star className="h-4 w-4 text-yellow-500" fill='yellow' key={rating} />) : <Star className="h-4 w-4 text-gray-400" />}</span>
              </div>
          </div>

          <hr className="my-4 w-full border-neutral-300" />

          {/* Seller Card */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-6">
                <Store className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-xl">{product.seller.businessName}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{product.seller.businessAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={`https://${product.seller.websiteLink}`} className="text-primary hover:underline">
                    {product?.seller.websiteLink}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{product.seller.user.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{product.seller.user.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="space-y-0 gap-0">
        <TabsList className="rounded-t-xl rounded-b-none gap-4 bg-white pb-10 pt-7 px-4">
          <TabsTrigger value="details"  className=" bg-zinc-200 data-[state=active]:bg-zinc-700 data-[state=active]:text-white font-semibold">Product Details</TabsTrigger>
          <TabsTrigger value="attributes" className=" bg-zinc-200 data-[state=active]:bg-zinc-700 data-[state=active]:text-white font-semibold">Specifications</TabsTrigger>
          <TabsTrigger value="shipping" className=" bg-zinc-200 data-[state=active]:bg-zinc-700 data-[state=active]:text-white font-semibold">Shipping</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="p-4 bg-white rounded-b-xl">
          <h3 className="text-lg font-medium mb-3">About this product</h3>
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p className="text-muted-foreground">No description available for this product.</p>
          )}
        </TabsContent>
        <TabsContent value="attributes" className="p-4 bg-white rounded-b-xl">
          <h3 className="text-lg font-medium mb-3">Product Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {Object.entries(product.attributes).map(([key, value], index) => (
              <div key={key} className={`flex justify-between border-b py-2 px-4 bg-gray-100 rounded-full`}>
                <span className="font-medium">{key}</span>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="shipping" className="p-4 bg-white rounded-b-xl">
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

    </div>
  )
}