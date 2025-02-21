"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MenuIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGlobalStore } from "@/store/store";
import { toast } from "sonner";
import { MAX_PRICE, MIN_PRICE } from "@/constants/price";
import { CategoryEnum } from '@prisma/client';

const sortOptions = [
  { value: "latest-first", label: "Latest First" },
  { value: "oldest-first", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];


const FilterSidebar = ({page}: {page?: string}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { priceRange, setPriceRange, sortBy, setSortBy, category, setCategory } = useGlobalStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sortBy) params.set('sortBy', sortBy);
    if (priceRange[0]) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1]) params.set('maxPrice', priceRange[1].toString());
    if (category) params.set('category', category);
    
    router.push(`?${params.toString()}`);
  }, [sortBy, priceRange, category, router, searchParams]);

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const SidebarContent = () => (
    <div className="h-full py-6 px-2">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Sort By</h3>
          <RadioGroup 
            value={sortBy} 
            onValueChange={(value) => setSortBy(value)} 
            className="space-y-3"
          >
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <PriceRangeSection onPriceChange={handlePriceChange} />

        <Separator />

        {page !== 'SEARCH' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            <Button 
              variant={"ghost"} 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setCategory("ALL")}
            >
              All
            </Button>
            {/* {Object.keys(CategoryEnum).map((cat) => (
              <Button 
                variant={"ghost"} 
                size="sm" 
                key={cat} 
                className="w-full justify-start"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))} */}
          </div>
        </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block w-[250px] border-r min-h-screen">
        <SidebarContent />
      </div>
    </>
  );
};

export default FilterSidebar;




const PriceRangeSection = ({ onPriceChange }: { onPriceChange: (min: number, max: number) => void }) => {
  const { priceRange } = useGlobalStore();
  const [localMin, setLocalMin] = useState(priceRange[0] || MIN_PRICE);
  const [localMax, setLocalMax] = useState(priceRange[1] || MAX_PRICE);

  useEffect(() => {
    setLocalMin(priceRange[0] || MIN_PRICE);
    setLocalMax(priceRange[1] || MAX_PRICE);
  }, [priceRange]);

  const handleSubmit = () => {
    if (localMin > localMax || localMin < MIN_PRICE || localMax > MAX_PRICE) {
      toast.error("Invalid price range");
      return;
    }
    onPriceChange(localMin, localMax);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Price Range</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min={MIN_PRICE}
              max={MAX_PRICE}
              placeholder="Min"
              value={localMin}
              onChange={(e) => setLocalMin(parseInt(e.target.value))}
              className="pl-7"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min={MIN_PRICE}
              max={MAX_PRICE}
              placeholder="Max"
              value={localMax}
              onChange={(e) => setLocalMax(parseInt(e.target.value))}
              className="pl-7"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Apply Range
        </Button>
      </div>
    </div>
  );
};