"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSuppliers } from "../context/supplier-context";

export function ActiveFilters() {
  const {
    activeFiltersCount,
    searchQuery,
    selectedSupplierTypes,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    selectedCountry,
    minAge,
    maxAge,
    resetFilters,
    toggleSupplierType,
    setSearchQuery,
    setMinPrice,
    setMaxPrice,
    setMinRating,
    setMaxRating,
    setSelectedCountry,
    setMinAge,
    setMaxAge,
    fetchSuggestedSellers,
    buildCurrentFilters,
  } = useSuppliers();

  if (activeFiltersCount === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-500">Active filters:</span>

      {searchQuery && (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-gray-100"
        >
          Search: {searchQuery}
          <button
            onClick={() => {
              setSearchQuery("");
              fetchSuggestedSellers({
                ...buildCurrentFilters(),
                search: "",
              });
            }}
          >
            <X className="h-3 w-3 ml-1" />
          </button>
        </Badge>
      )}

      {selectedSupplierTypes.map((type) => (
        <Badge
          key={type}
          variant="outline"
          className="flex items-center gap-1 bg-gray-100"
        >
          {type}
          <button onClick={() => toggleSupplierType(type)}>
            <X className="h-3 w-3 ml-1" />
          </button>
        </Badge>
      ))}

      {(minPrice !== "0" || maxPrice !== "1000") && (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-gray-100"
        >
          Price: ${minPrice}-${maxPrice}
          <button
            onClick={() => {
              setMinPrice("0");
              setMaxPrice("1000");
              fetchSuggestedSellers({
                ...buildCurrentFilters(),
                priceRange: "0-1000",
              });
            }}
          >
            <X className="h-3 w-3 ml-1" />
          </button>
        </Badge>
      )}

      {(minRating !== "0" || maxRating !== "5") && (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-gray-100"
        >
          Rating: {minRating}-{maxRating}★
          <button
            onClick={() => {
              setMinRating("0");
              setMaxRating("5");
              fetchSuggestedSellers({
                ...buildCurrentFilters(),
                minRating: 0,
                maxRating: 5,
              });
            }}
          >
            <X className="h-3 w-3 ml-1" />
          </button>
        </Badge>
      )}

      {selectedCountry && (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-gray-100"
        >
          Country: {selectedCountry}
          <button
            onClick={() => {
              setSelectedCountry("");
              fetchSuggestedSellers({
                ...buildCurrentFilters(),
                country: "",
              });
            }}
          >
            <X className="h-3 w-3 ml-1" />
          </button>
        </Badge>
      )}

      {(minAge !== "0" || maxAge !== "50") && (
        <Badge
          variant="outline"
          className="flex items-center gap-1 bg-gray-100"
        >
          Age: {minAge}-{maxAge} years
          <button
            onClick={() => {
              setMinAge("0");
              setMaxAge("50");
              fetchSuggestedSellers({
                ...buildCurrentFilters(),
                minAge: 0,
                maxAge: 50,
              });
            }}
          >
            <X className="h-3 w-3 ml-1" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={resetFilters}
        className="text-xs text-[#e00261]"
      >
        Clear All
      </Button>
    </div>
  );
}
