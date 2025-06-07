"use client";

import { Search, ArrowDownUp, Filter, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: "Date", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Price", value: "price" },
  { label: "Stock", value: "availableQuantity" },
];

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSortChange: (field: string) => void;
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  sortField,
  sortOrder,
  onSortChange,
}: SearchAndFilterProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get current sort option label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === sortField);
    return option ? option.label : "Sort by";
  };

  return (
    <>
      {/* Desktop view */}
      <div className="hidden sm:flex px-4 py-2 justify-between items-center gap-2 bg-[#f8f9fb]">
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center space-x-2 relative"
            ref={dropdownRef}
          >
            <button
              className="border rounded-xl px-3 py-1.5 text-sm flex items-center gap-2"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              aria-expanded={showSortDropdown}
              aria-haspopup="listbox"
            >
              <span>{getCurrentSortLabel()}</span>
              <ArrowDownUp
                className={`w-4 h-4 cursor-pointer ${
                  sortOrder === "desc" ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-40">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      sortField === option.value ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      if (sortField === option.value) {
                        // Toggle sort order if same field
                        onSortChange(sortField);
                      } else {
                        // Change sort field
                        onSortChange(option.value);
                      }
                      setShowSortDropdown(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {sortField === option.value && (
                        <ArrowDownUp
                          className={`w-3 h-3 ${
                            sortOrder === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-sm">
            <span className="text-gray-500">Order:</span>{" "}
            <button
              onClick={() => onSortChange(sortField)}
              className="text-gray-700 hover:text-gray-900"
            >
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-1.5 border rounded-xl placeholder:text-[13px] w-64"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden px-4 py-2 bg-[#f8f9fb]">
        <div className="flex items-center justify-between mb-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-1.5 border rounded-xl text-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search products"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            className="ml-2 p-1.5 border rounded-xl bg-white"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            aria-expanded={showFiltersMobile}
            aria-label="Show filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile filters panel */}
        {showFiltersMobile && (
          <div className="bg-white p-3 rounded-md border mb-2 animate-in slide-in-from-top duration-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sm">Sort Options</h3>
              <button
                onClick={() => setShowFiltersMobile(false)}
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Sort by
                </label>
                <select
                  className="w-full border rounded-md px-2 py-1.5 text-sm"
                  value={sortField}
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Order
                </label>
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    className={`flex-1 py-1.5 text-sm ${
                      sortOrder === "asc"
                        ? "bg-gray-100 font-medium"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      sortOrder !== "asc" && onSortChange(sortField)
                    }
                  >
                    Ascending
                  </button>
                  <button
                    className={`flex-1 py-1.5 text-sm ${
                      sortOrder === "desc"
                        ? "bg-gray-100 font-medium"
                        : "bg-white"
                    }`}
                    onClick={() =>
                      sortOrder !== "desc" && onSortChange(sortField)
                    }
                  >
                    Descending
                  </button>
                </div>
              </div>

              <button
                className="w-full mt-2 py-1.5 bg-gray-100 rounded-md text-sm font-medium"
                onClick={() => setShowFiltersMobile(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
