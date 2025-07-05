"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { productsApi } from '@/lib/api';

interface ProductDetailProps {
    id: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    discount?: number;
    minOrderQuantity: number;
    availableQuantity: number;
    deliveryCost: number;
    images: string[];
    thumbnail?: string;
    attributes: Record<string, string>;
    seller: {
        businessName: string;
        teamSize: string;
        annualRevenue: string;
        productionCountries: string[];
        user: {
            country: string;
        };
    };
}

export default function ProductDetail({ id }: ProductDetailProps) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productsApi.getProductDetails(id);
                const data = response.product as Product;
                setProduct(data);
            } catch (err: any) {
                console.error("Failed to fetch product:", err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [thumbStart, setThumbStart] = useState(0);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    // Safely combine images and thumbnails
    const allImages = [
        ...(product?.images || []),
        ...(product?.thumbnail ? [product.thumbnail] : [])
    ].filter(Boolean);

    // Generate pricing tiers based on available data
    const pricingTiers = product ? [
        { min: product.minOrderQuantity, max: 50, price: product.price },
        { min: 51, max: 100, price: product.price * 0.95 },
        { min: 101, price: product.price * 0.9 },
    ] : [];

    // Extract available attributes as variations
    const availableAttributes = product
        ? Object.entries(product.attributes || {}).filter(([_, value]) => value)
        : [];

    const thumbsPerView = 6;
    const endThumb = Math.min(thumbStart + thumbsPerView, allImages.length);

    const prevImage = () => setActiveImageIndex((idx) => (idx - 1 + allImages.length) % allImages.length);
    const nextImage = () => setActiveImageIndex((idx) => (idx + 1) % allImages.length);

    const scrollThumbs = () => {
        const nextStart = endThumb >= allImages.length ? 0 : thumbStart + 1;
        setThumbStart(nextStart);
    };

    const handleEnquiry = () => {
        if (!product) return;
        // onSendEnquiry?.(product.id, {
        //   quantity: selectedQuantity,
        //   attributes: availableAttributes,
        // })
    };

    const handleChat = () => {
        if (!product) return;
        // onChatNow?.(product.id)
    };

    const calculateDiscountedPrice = (price: number) => {
        if (product?.discount) {
            return price * (1 - product.discount / 100);
        }
        return price;
    };

    // Update selectedQuantity when product loads
    useEffect(() => {
        if (product) {
            setSelectedQuantity(product.minOrderQuantity);
        }
    }, [product]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <p className="text-gray-500">Loading product details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-6">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-6">
                <p className="text-red-500">Product not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="flex h-fit">
                    {allImages.length > 1 && (
                        <div className="hidden sm:flex flex-col mr-4 space-y-2 relative">
                            {allImages.slice(thumbStart, endThumb).map((img, i) => {
                                const realIndex = i + thumbStart;
                                return (
                                    <div
                                        key={realIndex}
                                        className={cn(
                                            "w-16 h-16 border rounded overflow-hidden cursor-pointer",
                                            activeImageIndex === realIndex ? "border-primary border-2" : "border-gray-200",
                                        )}
                                        onClick={() => setActiveImageIndex(realIndex)}
                                    >
                                        <Image
                                            src={img || "/placeholder.svg"}
                                            alt=""
                                            width={64}
                                            height={64}
                                            className="object-cover"
                                        />
                                    </div>
                                );
                            })}
                            {allImages.length > thumbsPerView && (
                                <button
                                    className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={scrollThumbs}
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex-1 relative border border-gray-200 rounded-md overflow-hidden">
                        <div className="relative aspect-square">
                            {allImages.length > 0 ? (
                                <>
                                    <Image
                                        src={allImages[activeImageIndex] || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button className="bg-white/80 rounded-full p-3 hover:bg-white">
                                            <Play className="h-8 w-8 text-gray-800" />
                                        </button>
                                    </div>
                                    {allImages.length > 1 && (
                                        <>
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
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">No image available</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-2xl font-medium text-gray-900 mb-1">{product.name}</h1>

                    <div className="flex items-center text-sm text-gray-500 mb-6">
                        <span className="mr-2">{product.seller?.businessName}</span>
                        <span className="mr-2">{product.seller?.teamSize}</span>
                        <span className="flex items-center">
                            <span className="ml-1">{product.seller?.user?.country}</span>
                        </span>
                    </div>

                    {/* Pricing Tiers */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {pricingTiers.map((tier, i) => (
                            <div key={i} className="text-center">
                                <div className="text-sm text-gray-500 mb-1">
                                    {tier.min} {tier.max ? `- ${tier.max}` : "+"} pcs
                                </div>
                                <div className="text-xl font-bold">
                                    ${calculateDiscountedPrice(tier.price).toFixed(2)}
                                    {product.discount && (
                                        <span className="text-sm text-gray-400 line-through ml-2">${tier.price.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Product Information */}
                    <div className="mb-6">
                        <h2 className="text-lg font-medium mb-2">Product Details</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Min Order Quantity:</span>
                                <span className="font-medium">{product.minOrderQuantity} pcs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Available Stock:</span>
                                <span className="font-medium">{product.availableQuantity} pcs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Cost:</span>
                                <span className="font-medium">${product.deliveryCost}</span>
                            </div>
                            {product.discount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-medium text-green-600">{product.discount}% OFF</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attributes/Variations */}
                    {availableAttributes.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-medium mb-2">Specifications</h2>
                            <div className="space-y-3">
                                {availableAttributes.map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-sm">
                                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                                        <span className="font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selection */}
                    <div className="mb-6">
                        <h3 className="text-base font-medium mb-2">Quantity</h3>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setSelectedQuantity(Math.max(product.minOrderQuantity, selectedQuantity - 1))}
                                className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                            >
                                -
                            </button>
                            <span className="px-4 py-2 border border-gray-200 rounded-md min-w-[80px] text-center">
                                {selectedQuantity}
                            </span>
                            <button
                                onClick={() => setSelectedQuantity(Math.min(product.availableQuantity, selectedQuantity + 1))}
                                className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Min: {product.minOrderQuantity}, Max: {product.availableQuantity}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-6">
                        <Button
                            onClick={handleEnquiry}
                            className="flex-1 bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white font-semibold py-6"
                        >
                            Send Enquiry
                        </Button>
                        <Button variant="outline" onClick={handleChat} className="flex-1 font-semibold py-6 bg-transparent">
                            Chat Now
                        </Button>
                    </div>

                    {/* Seller Information */}
                    <div className="border-t pt-4">
                        <h2 className="text-base font-medium mb-3">Seller Information</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Business:</span>
                                <span className="font-medium">{product.seller?.businessName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Team Size:</span>
                                <span className="font-medium">{product.seller?.teamSize}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Revenue:</span>
                                <span className="font-medium">{product.seller?.annualRevenue}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Production:</span>
                                <span className="font-medium">{product.seller?.productionCountries?.join(", ") || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}