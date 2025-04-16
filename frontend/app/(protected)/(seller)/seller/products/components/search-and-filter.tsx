"use client"

import { Search, ArrowDownUp } from "lucide-react"

interface SortOption {
  label: string
  value: string
}

const sortOptions: SortOption[] = [
  { label: "Date", value: "createdAt" },
  { label: "Name", value: "name" },
  { label: "Price", value: "price" },
  { label: "Stock", value: "availableQuantity" },
]

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  sortField: string
  sortOrder: "asc" | "desc"
  onSortChange: (field: string) => void
}

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  sortField,
  sortOrder,
  onSortChange,
}: SearchAndFilterProps) {
  return (
    <div className="px-4 py-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 bg-[#f8f9fb]">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <select
            className="border rounded-xl px-2 py-1 text-sm"
            value={sortField}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort by field"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onSortChange(sortField)}
            className="flex items-center space-x-1 text-sm"
            aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
          >
            <ArrowDownUp className={`w-4 h-4 cursor-pointer ${sortOrder === "desc" ? "rotate-180" : ""}`} />
            <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
          </button>
        </div>
      </div>
      <div className="relative w-full sm:w-auto">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full sm:w-auto pl-10 pr-4 py-1 border rounded-xl placeholder:text-[13px]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search products"
        />
      </div>
    </div>
  )
}
