"use client";

import React, { useState, useEffect } from "react";
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

const ratingOptions = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

const priceOptions = [
  { value: "0", label: "$0" },
  { value: "100", label: "$100" },
  { value: "200", label: "$200" },
  { value: "300", label: "$300" },
  { value: "500", label: "$500" },
  { value: "750", label: "$750" },
  { value: "1000", label: "$1000" },
  { value: "2000", label: "$2000" },
  { value: "5000", label: "$5000" },
];

const ageOptions = [
  { value: "0", label: "0 years" },
  { value: "1", label: "1 year" },
  { value: "3", label: "3 years" },
  { value: "5", label: "5 years" },
  { value: "10", label: "10 years" },
  { value: "20", label: "20 years" },
  { value: "30", label: "30 years" },
  { value: "50", label: "50 years" },
  { value: "100", label: "100+ years" },
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
  } = useSuppliers();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    handleSearchChange(e);
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    handleSearchChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
  };

  // Debugging
  useEffect(() => {
    console.log("Dropdown values:", {
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      minAge,
      maxAge,
      selectedCountry
    });
  }, [minPrice, maxPrice, minRating, maxRating, minAge, maxAge, selectedCountry]);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search Input */}

      {/* Filters Popover */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
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
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 bg-[#e00261] hover:bg-[#c80057]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
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

              {/* Price Range */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Price Range</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="min-price" className="text-xs">
                      Min
                    </Label>
                    <Select
                      value={minPrice?.toString()}
                      onValueChange={(value) => handleFilterChange("minPrice", value)}
                    >
                      <SelectTrigger id="min-price" className="h-8">
                        <SelectValue placeholder="Select min" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceOptions
                          .filter(opt => parseInt(opt.value) < parseInt(maxPrice || "5000"))
                          .map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="max-price" className="text-xs">
                      Max
                    </Label>
                    <Select
                      value={maxPrice?.toString()}
                      onValueChange={(value) => handleFilterChange("maxPrice", value)}
                    >
                      <SelectTrigger id="max-price" className="h-8">
                        <SelectValue placeholder="Select max" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceOptions
                          .filter(opt => parseInt(opt.value) > parseInt(minPrice || "0"))
                          .map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Rating</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="min-rating" className="text-xs">
                      Min
                    </Label>
                    <Select
                      value={minRating?.toString()}
                      onValueChange={(value) => handleFilterChange("minRating", value)}
                    >
                      <SelectTrigger id="min-rating" className="h-8">
                        <SelectValue placeholder="Select min" />
                      </SelectTrigger>
                      <SelectContent>
                        {ratingOptions
                          .filter(opt => parseInt(opt.value) < parseInt(maxRating || "5"))
                          .map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label} ★
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="max-rating" className="text-xs">
                      Max
                    </Label>
                    <Select
                      value={maxRating?.toString()}
                      onValueChange={(value) => handleFilterChange("maxRating", value)}
                    >
                      <SelectTrigger id="max-rating" className="h-8">
                        <SelectValue placeholder="Select max" />
                      </SelectTrigger>
                      <SelectContent>
                        {ratingOptions
                          .filter(opt => parseInt(opt.value) > parseInt(minRating || "0"))
                          .map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label} ★
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Supplier Age</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="min-age" className="text-xs">
                      Min
                    </Label>
                    <Select
                      value={minAge?.toString()}
                      onValueChange={(value) => handleFilterChange("minAge", value)}
                    >
                      <SelectTrigger id="min-age" className="h-8">
                        <SelectValue placeholder="Select min" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageOptions
                          .filter(opt => parseInt(opt.value) < parseInt(maxAge || "100"))
                          .map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="max-age" className="text-xs">
                      Max
                    </Label>
                    <Select
                      value={maxAge?.toString()}
                      onValueChange={(value) => handleFilterChange("maxAge", value)}
                    >
                      <SelectTrigger id="max-age" className="h-8">
                        <SelectValue placeholder="Select max" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageOptions
                          .filter(opt => parseInt(opt.value) > parseInt(minAge || "0"))
                          .map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

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
              value={sortOption || "reference"}
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
    </div>
  );
}