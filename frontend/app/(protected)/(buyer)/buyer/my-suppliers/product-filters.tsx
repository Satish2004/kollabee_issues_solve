"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FilterState } from "./page"

interface ProductFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onApply: () => void
  onClear: () => void
}

export default function ProductFilters({ filters, onFilterChange, onApply, onClear }: ProductFiltersProps) {
  const handleCheckboxChange = (
    category: keyof Omit<FilterState, "price" | "minOrders">,
    field: string,
    checked: boolean,
  ) => {
    onFilterChange({
      ...filters,
      [category]: {
        ...filters[category],
        [field]: checked,
      },
    })
  }

  const handlePriceChange = (field: "min" | "max", value: string) => {
    onFilterChange({
      ...filters,
      price: {
        ...filters.price,
        [field]: value,
      },
    })
  }

  const handleMinOrdersChange = (value: string) => {
    onFilterChange({
      ...filters,
      minOrders: value,
    })
  }

  return (
    <div className="border rounded-lg p-4 sticky top-4 bg-white">
      <div className="flex flex-col items-start  mb-4">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="grid grid-cols-2 gap-4 w-full">
          <Button variant="outline" onClick={onClear} className="font-semibold px-4 border-2 border-red-500 text-red-500">
            Clear
          </Button>
          <Button variant="default" onClick={onApply} className="px-4 bg-red-500 hover:bg-red-600 font-semibold text-white">
            Apply
          </Button>
        </div>
      </div>

      {/* Supplier features */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Supplier features</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified-supplier"
              checked={filters.supplierFeatures.verifiedSupplier}
              onCheckedChange={(checked) =>
                handleCheckboxChange("supplierFeatures", "verifiedSupplier", checked as boolean)
              }
            />
            <Label htmlFor="verified-supplier" className="text-sm font-normal">
              Verified Supplier
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="response-time"
              checked={filters.supplierFeatures.responseTime}
              onCheckedChange={(checked) =>
                handleCheckboxChange("supplierFeatures", "responseTime", checked as boolean)
              }
            />
            <Label htmlFor="response-time" className="text-sm font-normal">
              ≤1h response time
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="above-rating"
              checked={filters.supplierFeatures.rating}
              onCheckedChange={(checked) => handleCheckboxChange("supplierFeatures", "rating", checked as boolean)}
            />
            <Label htmlFor="above-rating" className="text-sm font-normal">
              Above 4 rating
            </Label>
          </div>
        </div>
      </div>

      {/* Delivery by */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Delivery by</h3>
        <p className="text-xs text-muted-foreground mb-2">Unit price is subject to expected delivery date</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="jan-25"
              checked={filters.deliveryBy.jan25}
              onCheckedChange={(checked) => handleCheckboxChange("deliveryBy", "jan25", checked as boolean)}
            />
            <Label htmlFor="jan-25" className="text-sm font-normal">
              Delivery by Jan 25
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="jan-31"
              checked={filters.deliveryBy.jan31}
              onCheckedChange={(checked) => handleCheckboxChange("deliveryBy", "jan31", checked as boolean)}
            />
            <Label htmlFor="jan-31" className="text-sm font-normal">
              Delivery by Jan 31
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="feb-06"
              checked={filters.deliveryBy.feb06}
              onCheckedChange={(checked) => handleCheckboxChange("deliveryBy", "feb06", checked as boolean)}
            />
            <Label htmlFor="feb-06" className="text-sm font-normal">
              Delivery by Feb 06
            </Label>
          </div>
        </div>
      </div>

      {/* Store reviews */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Store reviews</h3>
        <p className="text-xs text-muted-foreground mb-2">based on a 5-star rating system</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="four-stars"
              checked={filters.storeReviews.fourStars}
              onCheckedChange={(checked) => handleCheckboxChange("storeReviews", "fourStars", checked as boolean)}
            />
            <Label htmlFor="four-stars" className="text-sm font-normal">
              4.0 & up
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="four-point-five-stars"
              checked={filters.storeReviews.fourPointFiveStars}
              onCheckedChange={(checked) =>
                handleCheckboxChange("storeReviews", "fourPointFiveStars", checked as boolean)
              }
            />
            <Label htmlFor="four-point-five-stars" className="text-sm font-normal">
              4.5 & up
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="five-stars"
              checked={filters.storeReviews.fiveStars}
              onCheckedChange={(checked) => handleCheckboxChange("storeReviews", "fiveStars", checked as boolean)}
            />
            <Label htmlFor="five-stars" className="text-sm font-normal">
              5.0
            </Label>
          </div>
        </div>
      </div>

      {/* Product features */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Product features</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="paid-samples"
              checked={filters.productFeatures.paidSamples}
              onCheckedChange={(checked) => handleCheckboxChange("productFeatures", "paidSamples", checked as boolean)}
            />
            <Label htmlFor="paid-samples" className="text-sm font-normal">
              Paid samples
            </Label>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="stainless-steel-coils"
              checked={filters.categories.stainlessSteelCoils}
              onCheckedChange={(checked) =>
                handleCheckboxChange("categories", "stainlessSteelCoils", checked as boolean)
              }
            />
            <Label htmlFor="stainless-steel-coils" className="text-sm font-normal">
              Stainless Steel Coils
            </Label>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Price</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label htmlFor="min-price" className="sr-only">
              Minimum Price
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="Min."
              value={filters.price.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="text-sm"
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="flex-1">
            <Label htmlFor="max-price" className="sr-only">
              Maximum Price
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="Max."
              value={filters.price.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      {/* Min no of orders */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Min no of orders</h3>
        <div>
          <Label htmlFor="min-orders" className="sr-only">
            Minimum Number of Orders
          </Label>
          <Input
            id="min-orders"
            type="number"
            placeholder="Enter minimum orders"
            value={filters.minOrders}
            onChange={(e) => handleMinOrdersChange(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  )
}

