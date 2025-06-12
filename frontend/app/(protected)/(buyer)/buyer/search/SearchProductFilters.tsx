import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/app/(protected)/(seller)/seller/products/hooks/use-categories";

export interface SearchFilterState {
  supplierFeatures: {
    verifiedSupplier: boolean;
    rating: boolean;
  };
  deliveryBy: {
    // Placeholder for future dynamic delivery options
  };
  storeReviews: {
    fourStars: boolean;
    fourPointFiveStars: boolean;
    fiveStars: boolean;
  };
  productFeatures: {
    paidSamples: boolean;
  };
  categories: Record<string, boolean>;
  price: {
    min: string;
    max: string;
  };
  minOrders: string;
}

type ObjectSectionKeys = "supplierFeatures" | "deliveryBy" | "storeReviews" | "productFeatures" | "categories";

interface SearchProductFiltersProps {
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function SearchProductFilters({ filters, onFilterChange, onApply, onClear }: SearchProductFiltersProps) {
  const { categories, isLoading: categoriesLoading } = useCategories();

  const handleCheckboxChange = (section: keyof SearchFilterState, field: string, checked: boolean) => {
    if (["supplierFeatures", "deliveryBy", "storeReviews", "productFeatures", "categories"].includes(section)) {
      if (section === "categories") {
        onFilterChange({
          ...filters,
          categories: {
            ...filters.categories,
            [field]: checked,
          },
        });
      } else {
        onFilterChange({
          ...filters,
          [section]: {
            ...(filters[section] as Record<string, boolean>),
            [field]: checked,
          },
        });
      }
    }
  };
  const handlePriceChange = (field: "min" | "max", value: string) => {
    onFilterChange({
      ...filters,
      price: {
        ...filters.price,
        [field]: value,
      },
    });
  };
  const handleMinOrdersChange = (value: string) => {
    onFilterChange({
      ...filters,
      minOrders: value,
    });
  };
  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm sticky top-4">
      <div className="flex flex-col items-start mb-4">
        <h2 className="text-xl font-bold mb-2">Filters</h2>
        <div className="grid grid-cols-2 gap-2 w-full mb-2">
          <Button variant="outline" onClick={onClear} className="text-sm px-4 py-2 text-red-500 border-2 border-red-500 hover:text-red-600 font-semibold">Clear</Button>
          <Button variant="default" onClick={onApply} className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold">Apply</Button>
        </div>
      </div>
      {/* Supplier features */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Supplier features</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="verified-supplier" checked={filters.supplierFeatures.verifiedSupplier} onCheckedChange={checked => handleCheckboxChange("supplierFeatures", "verifiedSupplier", checked as boolean)} />
            <span className="text-sm">Verified Supplier</span>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="above-rating" checked={filters.supplierFeatures.rating} onCheckedChange={checked => handleCheckboxChange("supplierFeatures", "rating", checked as boolean)} />
            <span className="text-sm">Above 4 rating</span>
          </div>
        </div>
      </div>
      {/* Delivery by */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Delivery by</h3>
        <p className="text-xs text-muted-foreground mb-2">(Coming soon: dynamic delivery options)</p>
        {/* TODO: Render delivery options dynamically when available */}
      </div>
      {/* Store reviews */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Store reviews</h3>
        <p className="text-xs text-muted-foreground mb-2">based on a 5-star rating system</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="four-stars" checked={filters.storeReviews.fourStars} onCheckedChange={checked => handleCheckboxChange("storeReviews", "fourStars", checked as boolean)} />
            <span className="text-sm">4.0 & up</span>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="four-point-five-stars" checked={filters.storeReviews.fourPointFiveStars} onCheckedChange={checked => handleCheckboxChange("storeReviews", "fourPointFiveStars", checked as boolean)} />
            <span className="text-sm">4.5 & up</span>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="five-stars" checked={filters.storeReviews.fiveStars} onCheckedChange={checked => handleCheckboxChange("storeReviews", "fiveStars", checked as boolean)} />
            <span className="text-sm">5.0</span>
          </div>
        </div>
      </div>
      {/* Product features */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Product features</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="paid-samples" checked={filters.productFeatures.paidSamples} onCheckedChange={checked => handleCheckboxChange("productFeatures", "paidSamples", checked as boolean)} />
            <span className="text-sm">Paid samples</span>
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Categories</h3>
        <div className="space-y-2">
          {categoriesLoading ? (
            <span className="text-xs text-gray-400">Loading categories...</span>
          ) : (
            categories.map((cat: any) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${cat.id}`}
                  checked={!!filters.categories[cat.id]}
                  onCheckedChange={checked => handleCheckboxChange("categories", cat.id, checked as boolean)}
                />
                <span className="text-sm">{cat.categoryName}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Price</h3>
        <div className="flex items-center gap-2">
          <Input type="number" placeholder="Min." value={filters.price.min} onChange={e => handlePriceChange("min", e.target.value)} className="text-sm" />
          <span className="text-muted-foreground">-</span>
          <Input type="number" placeholder="Max." value={filters.price.max} onChange={e => handlePriceChange("max", e.target.value)} className="text-sm" />
        </div>
      </div>
      {/* Min no of orders */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Min no of orders</h3>
        <Input type="number" placeholder="Enter minimum orders" value={filters.minOrders} onChange={e => handleMinOrdersChange(e.target.value)} className="text-sm" />
      </div>
    </div>
  );
} 