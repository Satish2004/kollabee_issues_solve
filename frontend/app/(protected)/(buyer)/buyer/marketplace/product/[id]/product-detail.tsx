"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ProductDetailData = {
    id: string;
    name: string;
    images: string[];
    sellerName?: string;
    sellerCountry?: string;
    sellerYearsActive?: number;
    pricingTiers: { min: number; max?: number; price: number }[];
    colors: { name: string; value: string; bg: string }[];
    sizes: string[];
    printingMethods: string[];
};

interface ProductDetailProps {
    product: ProductDetailData;
}

export default function ProductDetail({
    product,
}: ProductDetailProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [thumbStart, setThumbStart] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]?.value ?? "");
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
    const [selectedPrinting, setSelectedPrinting] = useState<string[]>([product.printingMethods[0]]);

    const onSendEnquiry = (productId, selections) => {
        // Handle send enquiry logic here
        console.log("Enquiry sent for product:", productId, "with selections:", selections);
    }

    const onChatNow = (productId: string) => {
        // Handle chat now logic here
        console.log("Chat initiated for product:", productId);
    };

    const thumbsPerView = 6;
    const endThumb = thumbStart + thumbsPerView;

    const prevImage = () =>
        setActiveImageIndex((idx) => (idx - 1 + product.images.length) % product.images.length);
    const nextImage = () =>
        setActiveImageIndex((idx) => (idx + 1) % product.images.length);

    const scrollThumbs = () => {
        const nextStart = endThumb >= product.images.length ? 0 : thumbStart + 1;
        setThumbStart(nextStart);
    };

    const togglePrinting = (m: string) =>
        setSelectedPrinting((prev) =>
            prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
        );

    const handleEnquiry = () => {
        onSendEnquiry?.(product.id, { color: selectedColor, size: selectedSize, printingMethods: selectedPrinting });
    };

    const handleChat = () => {
        onChatNow?.(product.id);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex h-fit">
                    <div className="hidden sm:flex flex-col mr-4 space-y-2 relative">
                        {product.images.slice(thumbStart, endThumb).map((img, i) => {
                            const realIndex = i + thumbStart;
                            return (
                                <div
                                    key={realIndex}
                                    className={cn(
                                        "w-16 h-16 border rounded overflow-hidden cursor-pointer",
                                        activeImageIndex === realIndex ? "border-primary border-2" : "border-gray-200"
                                    )}
                                    onClick={() => setActiveImageIndex(realIndex)}
                                >
                                    <Image src={img} alt="" width={64} height={64} className="object-cover" />
                                </div>
                            );
                        })}
                        {product.images.length > thumbsPerView && (
                            <button className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-gray-700" onClick={scrollThumbs}>
                                <ChevronDown className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 relative border border-gray-200 rounded-md overflow-hidden">
                        <div className="relative aspect-square">
                            <Image src={product.images[activeImageIndex]} alt="" fill className="object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="bg-white/80 rounded-full p-3 hover:bg-white">
                                    <Play className="h-8 w-8 text-gray-800" />
                                </button>
                            </div>
                            <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white" onClick={prevImage}>
                                <ChevronLeft className="h-5 w-5 text-gray-800" />
                            </button>
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white" onClick={nextImage}>
                                <ChevronRight className="h-5 w-5 text-gray-800" />
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-medium text-gray-900 mb-1">{product.name}</h1>
                    <div className="flex items-center text-sm text-gray-500 mb-6">
                        <span className="mr-2">{product.sellerName}</span>
                        {product.sellerYearsActive && (
                            <span className="mr-2">{product.sellerYearsActive} yr.</span>
                        )}
                        {product.sellerCountry && (
                            <span className="flex items-center">
                                <span className="ml-1">{product.sellerCountry}</span>
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {product.pricingTiers.map((t, i) => (
                            <div key={i} className="text-center">
                                <div className="text-sm text-gray-500 mb-1">
                                    {t.min} {t.max ? `- ${t.max}` : "+"} pcs
                                </div>
                                <div className="text-xl font-bold">${t.price.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-medium mb-2">Variations</h2>
                        <div className="text-sm text-gray-600 mb-4">
                            Total options: {product.colors.length} Color, {product.sizes.length} Size, {product.printingMethods.length} Printing Meth
                        </div>

                        <div className="mb-4">
                            <h3 className="text-base font-medium mb-2">Color: {selectedColor}</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((c) => (
                                    <button key={c.value} className={cn("w-10 h-10 rounded-md flex items-center justify-center", c.bg, selectedColor === c.value && "ring-2 ring-primary")} onClick={() => setSelectedColor(c.value)} />
                                ))}
                                <button className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center">
                                    <Plus className="h-4 w-4 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-base font-medium mb-2">Size: {selectedSize}</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((s) => (
                                    <button key={s} className={cn("px-4 py-2 rounded-md border", selectedSize === s ? "bg-primary/10 border-primary" : "border-gray-200")} onClick={() => setSelectedSize(s)}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-base font-medium mb-2">Printing Methods</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.printingMethods.map((m) => (
                                    <button key={m} className={cn("px-4 py-2 rounded-md border text-sm", selectedPrinting.includes(m) ? "bg-primary/10 border-primary" : "border-gray-200")} onClick={() => togglePrinting(m)}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <Button onClick={handleEnquiry} className="flex-1 bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white font-semibold py-6">
                            Send Enquiry
                        </Button>
                        <Button variant="outline" onClick={handleChat} className="flex-1 font-semibold py-6 gradient-text gradient-border">
                            Chat Now
                        </Button>
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                        <h2 className="text-base font-medium">Protections for this product</h2>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
