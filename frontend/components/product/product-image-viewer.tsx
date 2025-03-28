"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThumbnailNav } from "./images-thumbnail-nav";

interface ProductImageViewerProps {
  images?: string[]; // Array of image URLs or undefined
}

export function ProductImageViewer({ images }: ProductImageViewerProps) {
  // Use a fallback image when images array is empty or undefined
  const fallbackImage =
    "https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/w0knrjcs0l7mqswxuway";
  const validImages = images && images.length > 0 ? images : [fallbackImage];
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % validImages.length);
  };

  const previousImage = () => {
    setActiveIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full p-4 my-5">
      {/* Thumbnail Navigation */}
      <div className="order-2 md:order-1">
        <ThumbnailNav
          images={validImages}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>

      {/* Main Image Viewer */}
      <div className="relative order-1 md:order-2 flex-1">
        <div className="relative aspect-square w-full">
          <Image
            src={validImages[activeIndex]}
            alt={`Product view ${activeIndex + 1}`}
            fill
            className="object-cover"
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={previousImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
