"use client";
import 
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { ArrowUpDown, ListFilter, Search, SearchIcon, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FiltersProps {
  initialFilters: {
    search?: string;
    sortBy?: string;
    availability?: string;
  };
}

export function Filters({ initialFilters }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState(initialFilters.search || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "/";
    router.push(`${currentPath}?${createQueryString(name, value)}`);
  };

  return (
    <div className="flex justify-between sm:flex-row gap-4 px-4 py-2 bg-slate-100 rounded-xl">
      <div className="flex gap-5 items-center">
        {/* Filter Dropdown */}
        <Popover>
          <PopoverTrigger><ListFilter /></PopoverTrigger>
          <PopoverContent>
            <div className="flex gap-2">
              <Select
                defaultValue={initialFilters.availability || "all"}
                onValueChange={(value) =>
                  handleFilterChange("availability", value)
                }
              >
                <SelectTrigger className="w-[180px] border-[#e0e0e0] text-[#1c1c1c]">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="IN_STOCK">In Stock</SelectItem>
                  <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <ArrowUpDown />
          </PopoverTrigger>
          <PopoverContent>
            <Select
              defaultValue={initialFilters.sortBy || "updatedAt-desc"}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-[180px] border-[#e0e0e0] text-[#1c1c1c]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A to Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z to A)</SelectItem>
                <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
                <SelectItem value="updatedAt-asc">Oldest Updated</SelectItem>
                <SelectItem value="quantity-desc">
                  Quantity (High to Low)
                </SelectItem>
                <SelectItem value="quantity-asc">
                  Quantity (Low to High)
                </SelectItem>
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Search Input (Visible Only When Toggled) */}
      {searchVisible ? (
        <div className="relative flex-1 flex items-center gap-2">
          <Input
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-[#e0e0e0] text-[#1c1c1c] flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleFilterChange("search", searchValue)}
          >
            <Search className="h-5 w-5 text-[#78787a]" />
          </Button>
        </div>
      ) : (
      <button
        className="border-[#e0e0e0] text-[#dddddd] rounded-lg min-w-[160px] flex gap-2 border-2 px-2 py-1"
        onClick={() => setSearchVisible((prev) => !prev)}
      >
        <Search />
        <h4>Search</h4>
      </button>
      )}
    </div>
  );
}
