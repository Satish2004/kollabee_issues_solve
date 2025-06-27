"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSidebar } from "@/contexts/sidebar-context";

export default function SupplierCards({ sellers }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [debouncedIsCollapsed, setDebouncedIsCollapsed] = useState(false);
  const { isCollapsed } = useSidebar();

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedIsCollapsed(isCollapsed);
    }, 100); 

    return () => clearTimeout(timer);
  }, [isCollapsed]);

  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    
    checkMobile();

    
    window.addEventListener("resize", checkMobile);

    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  
  useEffect(() => {
    if (!containerRef.current) return;

    const updateContainerWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    
    updateContainerWidth();

    
    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });

    resizeObserver.observe(containerRef.current);

    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);

      if (scrollContainerRef.current && !isMobile) {
        const cardWidth =
          scrollContainerRef.current.querySelector("div")?.offsetWidth || 0;
        const gap = 16; 
        scrollContainerRef.current.scrollBy({
          left: -(cardWidth + gap),
          behavior: "smooth",
        });
      }
    }
  };

  const handleNext = () => {
    if (sellers && currentIndex < sellers.length - 1) {
      setCurrentIndex(currentIndex + 1);

      if (scrollContainerRef.current && !isMobile) {
        const cardWidth =
          scrollContainerRef.current.querySelector("div")?.offsetWidth || 0;
        const gap = 16; 
        scrollContainerRef.current.scrollBy({
          left: cardWidth + gap,
          behavior: "smooth",
        });
      }
    }
  };

  
  if (!sellers || sellers.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className={`w-full mx-auto transition-all duration-300 ${
        debouncedIsCollapsed ? "max-w-[85vw]" : "max-w-[74vw]"
      }`}
    >
      {/* Mobile View - Single Card with Navigation */}
      <div className="sm:hidden w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentIndex === 0
                ? "text-gray-300 bg-gray-100"
                : "bg-gray-100 shadow-md"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {sellers.length}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === sellers.length - 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentIndex === sellers.length - 1
                ? "text-gray-300 bg-gray-100"
                : "bg-gray-100 shadow-md"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Single Card */}
        <div className="w-full bg-gray-100 rounded-lg p-4">
          <h3 className="font-medium mb-2 break-words whitespace-normal">
            {sellers[currentIndex].businessName}
          </h3>

          <div className="space-y-1 mb-3">
            <div className="flex items-center text-pink-600">
              <span className="text-sm mr-1">Performance:</span>
              <span className="text-sm">
                {sellers[currentIndex].rating || 0}/5
              </span>
            </div>
            <div className="text-sm">Certified Seller</div>
            <div className="text-sm">
              {sellers[currentIndex].exportPercentage || 0}% Export
            </div>
          </div>

          <Link href={`/supplier/${sellers[currentIndex].id}`}>
            <Button className="w-full py-2 text-sm font-semibold shadow-none rounded-md gradient-border gradient-text">
              View Supplier Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop View - Scrollable Cards */}
      <div className="hidden sm:block relative">
        <div className="flex items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`mr-2 w-10 h-10 rounded-full flex items-center justify-center ${
              currentIndex === 0
                ? "text-gray-300 bg-gray-100"
                : "bg-gray-100 shadow-md"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide flex-1"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
              maxWidth: containerWidth > 0 ? `${containerWidth - 120}px` : "auto"
            }}
          >
            {sellers.map((supplier, index) => (
              <div
                key={index}
                className="max-w-[240px] bg-gray-100 rounded-lg p-6 flex-shrink-0"
              >
                <h3 className="font-medium mb-3 break-words whitespace-normal">
                  {supplier.businessName}
                </h3>

                <div className="space-y-1 mb-4">
                  <div className="flex items-center text-pink-600">
                    <span className="text-sm mr-1">Performance:</span>
                    <span className="text-sm">{supplier.rating || 0}/5</span>
                  </div>
                  <div className="text-sm">Certified Seller</div>
                  <div className="text-sm">
                    {supplier.exportPercentage || 0}% Export
                  </div>
                </div>

                <Link href={`/supplier/${supplier.id}`}>
                  <Button className="w-full py-2 text-sm font-semibold shadow-none rounded-md gradient-border gradient-text">
                    View Supplier Profile
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === sellers.length - 1}
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${
              currentIndex === sellers.length - 1
                ? "text-gray-300 bg-gray-100"
                : "bg-gray-100 shadow-md"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
