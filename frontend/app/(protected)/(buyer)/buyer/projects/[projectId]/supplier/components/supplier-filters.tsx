"use client";

import type React from "react";

import { Search, X, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuppliers } from "../context/supplier-context";
import { useState } from "react";

// Predefined rating options
const ratingOptions = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

export function SupplierFilters() {
  const {
    searchQuery,
    handleSearchChange,
    activeFiltersCount,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    minAge,
    maxAge,
    selectedCountry,
    countries,
    selectedSupplierTypes,
    sortOption,
    handleFilterChange,
    resetFilters,
    toggleSupplierType,
    fetchSuggestedSellers,
    buildCurrentFilters,
    setSearchQuery,
  } = useSuppliers();

  // Local state for search input to prevent excessive re-renders
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Handle local search input change
  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    handleSearchChange(e);
  };

  // Clear search
  const clearSearch = () => {
    setLocalSearchQuery("");
    setSearchQuery("");
    fetchSuggestedSellers({
      ...buildCurrentFilters(),
      search: "",
    });
  };

  return (
    <>
      <div className="relative flex-1 md:flex-none">
        <Input
          placeholder="Search suppliers..."
          className="w-full md:w-64 pl-8"
          value={localSearchQuery}
          onChange={handleLocalSearchChange}
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {localSearchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="ml-1 bg-[#e00261] hover:bg-[#c80057]">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 z-50 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs text-[#e00261]"
              >
                Reset All
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Price Range</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="min-price" className="text-xs">
                    Min
                  </Label>
                  <Select
                    value={minPrice}
                    onValueChange={(value) =>
                      handleFilterChange("minPrice", value)
                    }
                  >
                    <SelectTrigger id="min-price">
                      <SelectValue placeholder="Min Price" />
                    </SelectTrigger>
                    <SelectContent className=" bg-white">
                      <SelectItem value="0">$0</SelectItem>
                      <SelectItem value="100">$100</SelectItem>
                      <SelectItem value="200">$200</SelectItem>
                      <SelectItem value="300">$300</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-gray-500">to</span>
                <div className="flex-1">
                  <Label htmlFor="max-price" className="text-xs">
                    Max
                  </Label>
                  <Select
                    value={maxPrice}
                    onValueChange={(value) =>
                      handleFilterChange("maxPrice", value)
                    }
                  >
                    <SelectTrigger id="max-price">
                      <SelectValue placeholder="Max Price" />
                    </SelectTrigger>
                    <SelectContent className=" bg-white">
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="750">$750</SelectItem>
                      <SelectItem value="1000">$1000</SelectItem>
                      <SelectItem value="2000">$2000</SelectItem>
                      <SelectItem value="5000">$5000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Other filter sections remain the same */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Rating</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="min-rating" className="text-xs">
                    Min
                  </Label>
                  <Select
                    value={minRating}
                    onValueChange={(value) =>
                      handleFilterChange("minRating", value)
                    }
                  >
                    <SelectTrigger id="min-rating">
                      <SelectValue placeholder="Min Rating" />
                    </SelectTrigger>
                    <SelectContent className=" bg-white">
                      {ratingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} ★
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-gray-500">to</span>
                <div className="flex-1">
                  <Label htmlFor="max-rating" className="text-xs">
                    Max
                  </Label>
                  <Select
                    value={maxRating}
                    onValueChange={(value) =>
                      handleFilterChange("maxRating", value)
                    }
                  >
                    <SelectTrigger id="max-rating">
                      <SelectValue placeholder="Max Rating" />
                    </SelectTrigger>
                    <SelectContent className=" bg-white">
                      {ratingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} ★
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Supplier Age (Years)</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="min-age" className="text-xs">
                    Min
                  </Label>
                  <Select
                    value={minAge}
                    onValueChange={(value) =>
                      handleFilterChange("minAge", value)
                    }
                  >
                    <SelectTrigger id="min-age">
                      <SelectValue placeholder="Min Age" />
                    </SelectTrigger>
                    <SelectContent className=" bg-white">
                      <SelectItem value="0">0 years</SelectItem>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-gray-500">to</span>
                <div className="flex-1">
                  <Label htmlFor="max-age" className="text-xs">
                    Max
                  </Label>
                  <Select
                    value={maxAge}
                    onValueChange={(value) =>
                      handleFilterChange("maxAge", value)
                    }
                  >
                    <SelectTrigger id="max-age">
                      <SelectValue placeholder="Max Age" />
                    </SelectTrigger>
                    <SelectContent className=" bg-white">
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                      <SelectItem value="50">50 years</SelectItem>
                      <SelectItem value="100">100+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Country</h4>
              <Select
                value={selectedCountry}
                onValueChange={(value) => handleFilterChange("country", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className=" bg-white">
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Supplier Types</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manufacturing"
                    checked={selectedSupplierTypes.includes("Manufacturing")}
                    onCheckedChange={() => toggleSupplierType("Manufacturing")}
                  />
                  <label htmlFor="manufacturing" className="text-sm">
                    Manufacturing
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="packaging"
                    checked={selectedSupplierTypes.includes("Packaging")}
                    onCheckedChange={() => toggleSupplierType("Packaging")}
                  />
                  <label htmlFor="packaging" className="text-sm">
                    Packaging
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="private-labelling"
                    checked={selectedSupplierTypes.includes(
                      "Private Labelling"
                    )}
                    onCheckedChange={() =>
                      toggleSupplierType("Private Labelling")
                    }
                  />
                  <label htmlFor="private-labelling" className="text-sm">
                    Private Labelling
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wholesale"
                    checked={selectedSupplierTypes.includes("Wholesale")}
                    onCheckedChange={() => toggleSupplierType("Wholesale")}
                  />
                  <label htmlFor="wholesale" className="text-sm">
                    Wholesale
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eco-friendly"
                    checked={selectedSupplierTypes.includes("Eco-friendly")}
                    onCheckedChange={() => toggleSupplierType("Eco-friendly")}
                  />
                  <label htmlFor="eco-friendly" className="text-sm">
                    Eco-friendly
                  </label>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 z-50 bg-white">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Sort By</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("sortOption", "reference")}
                className="h-8 text-xs text-[#e00261]"
              >
                Reset
              </Button>
            </div>

            <RadioGroup
              value={sortOption}
              onValueChange={(value) => handleFilterChange("sortOption", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reference" id="reference" />
                <Label htmlFor="reference" className="text-sm">
                  Best Match (Default)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating-desc" id="rating-desc" />
                <Label htmlFor="rating-desc" className="text-sm">
                  Rating (High to Low)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating-asc" id="rating-asc" />
                <Label htmlFor="rating-asc" className="text-sm">
                  Rating (Low to High)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-asc" id="price-asc" />
                <Label htmlFor="price-asc" className="text-sm">
                  Price (Low to High)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-desc" id="price-desc" />
                <Label htmlFor="price-desc" className="text-sm">
                  Price (High to Low)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="age-desc" id="age-desc" />
                <Label htmlFor="age-desc" className="text-sm">
                  Experience (Most to Least)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="name-asc" id="name-asc" />
                <Label htmlFor="name-asc" className="text-sm">
                  Name (A to Z)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
