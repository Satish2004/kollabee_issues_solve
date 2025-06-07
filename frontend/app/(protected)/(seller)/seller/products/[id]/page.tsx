"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { productsApi } from "@/lib/api/products";
import { toast } from "sonner";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  Store,
  Truck,
  Globe,
  Phone,
  MapPin,
  Star,
  User,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(10);
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedPrintingMethods, setSelectedPrintingMethods] = useState<
    string[]
  >(["Puff Printing"]);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [isMobileGalleryOpen, setIsMobileGalleryOpen] = useState(false);

  const productImages = product?.images || [];

  const thumbnailsPerView = 6;
  const hasMoreThumbnails = productImages?.length > thumbnailsPerView;

  const handleThumbnailScroll = () => {
    if (thumbnailStartIndex + thumbnailsPerView >= productImages.length) {
      setThumbnailStartIndex(0);
    } else {
      setThumbnailStartIndex((prev) => prev + 1);
    }
  };

  const nextImage = () => {
    if (productImages?.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % productImages.length);
    }
  };

  const prevImage = () => {
    if (productImages?.length > 0) {
      setActiveImageIndex(
        (prev) => (prev - 1 + productImages.length) % productImages.length
      );
    }
  };

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
          setProduct(response.product);
        }
      } catch (error) {
        toast.error("Failed to load product");
        router.push("/seller/products");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const discountedPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Back button - mobile friendly */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        {/* Product Image */}
        <div className="flex">
          {/* Thumbnail Vertical Carousel - Desktop Only */}
          <div className="hidden sm:flex flex-col mr-4 space-y-2 relative">
            {productImages
              .slice(
                thumbnailStartIndex,
                thumbnailStartIndex + thumbnailsPerView
              )
              .map((img, idx) => (
                <div
                  key={idx + thumbnailStartIndex}
                  className={cn(
                    "w-16 h-16 border rounded cursor-pointer overflow-hidden",
                    activeImageIndex === idx + thumbnailStartIndex
                      ? "border-primary border-2"
                      : "border-gray-200"
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
          <div
            className="flex-1 relative border border-gray-200 rounded-md overflow-hidden"
            onClick={() => setIsMobileGalleryOpen(true)}
          >
            <div className="relative aspect-square">
              <Image
                src={productImages[activeImageIndex] || "/placeholder.svg"}
                alt={`Product image ${activeImageIndex + 1}`}
                fill
                className="object-cover"
              />
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1.5 sm:p-2 hover:bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-800" />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1.5 sm:p-2 hover:bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-800" />
              </button>

              {/* Mobile image counter */}
              {productImages.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full sm:hidden">
                  {activeImageIndex + 1}/{productImages.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile thumbnails - horizontal scrolling */}
        <div className="flex sm:hidden overflow-x-auto gap-2 pb-2 mt-2">
          {productImages.map((img, idx) => (
            <div
              key={`mobile-thumb-${idx}`}
              className={cn(
                "flex-shrink-0 w-16 h-16 border rounded cursor-pointer overflow-hidden",
                activeImageIndex === idx
                  ? "border-primary border-2"
                  : "border-gray-200"
              )}
              onClick={() => setActiveImageIndex(idx)}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`Product thumbnail ${idx + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 break-words">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
              <Badge
                variant={
                  product.stockStatus === "IN_STOCK" ? "default" : "secondary"
                }
                className={`${
                  product.stockStatus === "IN_STOCK"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.stockStatus === "IN_STOCK"
                  ? "In Stock"
                  : "Out of Stock"}
              </Badge>
              <div
                className={`text-xs sm:text-sm ${
                  product.availableQuantity > 500
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                Available: {product.availableQuantity} units
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline flex-wrap gap-2 sm:gap-3 mb-1">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-lg sm:text-xl text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <Badge className="mb-2 bg-red-500 hover:bg-red-600 text-white font-semibold">
                Save {product.discount}%
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-5">
              <span className="font-semibold">
                Delivery cost: ${product.deliveryCost}
              </span>
            </div>

            <div className="mt-2 flex items-center flex-wrap gap-2">
              <p className="font-semibold">Ratings:</p>
              <div className="flex">
                {product.rating && product.rating.length > 0 ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < product.rating.length
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No ratings yet</span>
                )}
              </div>
            </div>
          </div>

          <hr className="my-4 w-full border-neutral-300" />

          {/* Seller Card */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Store className="h-5 w-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-lg sm:text-xl truncate">
                  {product.seller?.businessName || "Unknown Seller"}
                </h3>
              </div>

              {product.seller ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start sm:items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="line-clamp-2">
                      {product.seller.businessAddress || "No address provided"}
                    </span>
                  </div>
                  {product.seller.websiteLink && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a
                        href={`https://${product.seller.websiteLink}`}
                        className="text-primary hover:underline truncate"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {product.seller.websiteLink}
                      </a>
                    </div>
                  )}
                  {product.seller.user?.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{product.seller.user.phoneNumber}</span>
                    </div>
                  )}
                  {product.seller.user?.name && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">
                        {product.seller.user.name}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Seller information not available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="overflow-hidden">
        <Tabs defaultValue="details" className="space-y-0 gap-0">
          <div className="overflow-x-auto">
            <TabsList className="rounded-t-xl rounded-b-none gap-2 sm:gap-4 bg-white pb-6 sm:pb-10 pt-4 sm:pt-7 px-2 sm:px-4 w-auto min-w-max">
              <TabsTrigger
                value="details"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-200 data-[state=active]:bg-zinc-700 data-[state=active]:text-white font-semibold text-xs sm:text-sm"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="attributes"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-200 data-[state=active]:bg-zinc-700 data-[state=active]:text-white font-semibold text-xs sm:text-sm"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-zinc-200 data-[state=active]:bg-zinc-700 data-[state=active]:text-white font-semibold text-xs sm:text-sm"
              >
                Shipping
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="p-4 bg-white rounded-b-xl">
            <h3 className="text-lg font-medium mb-3">About this product</h3>
            {product.description ? (
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{product.description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No description available for this product.
              </p>
            )}
          </TabsContent>

          <TabsContent value="attributes" className="p-4 bg-white rounded-b-xl">
            <h3 className="text-lg font-medium mb-3">Product Specifications</h3>
            {Object.entries(product.attributes || {}).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
                {Object.entries(product.attributes).map(
                  ([key, value], index) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:justify-between border-b py-2 px-4 bg-gray-50 rounded-md sm:rounded-full overflow-hidden"
                    >
                      <span className="font-medium mb-1 sm:mb-0">{key}</span>
                      <span className="text-muted-foreground break-words">
                        {value || "N/A"}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No specifications available for this product.
              </p>
            )}
          </TabsContent>

          <TabsContent value="shipping" className="p-4 bg-white rounded-b-xl">
            <h3 className="text-lg font-medium mb-3">Shipping Information</h3>
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="font-medium">Delivery Cost:</span>
              <span>${product.deliveryCost || "0.00"}</span>
            </div>
            <p className="text-muted-foreground">
              Standard shipping typically takes 3-5 business days depending on
              your location.
            </p>

            {product.minOrderQuantity > 1 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-800 font-medium">
                  Minimum Order Quantity: {product.minOrderQuantity} units
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

  

      {/* Fullscreen Mobile Gallery Modal */}
      {isMobileGalleryOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col sm:hidden">
          <div className="flex justify-between items-center p-4 text-white">
            <button
              onClick={() => setIsMobileGalleryOpen(false)}
              className="p-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <span className="text-sm">
              {activeImageIndex + 1} / {productImages.length}
            </span>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          <div className="flex-1 relative">
            <Image
              src={productImages[activeImageIndex] || "/placeholder.svg"}
              alt={`Product image ${activeImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />

            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-3"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-3"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="p-4 bg-black/50">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {productImages.map((img, idx) => (
                <div
                  key={`modal-thumb-${idx}`}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 border rounded cursor-pointer overflow-hidden",
                    activeImageIndex === idx
                      ? "border-white border-2"
                      : "border-gray-600"
                  )}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Product thumbnail ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
