"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Check, ChevronsUpDown, X, Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type CategoriesFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const CategoriesForm = ({ formState, onChange, onSave, hasChanges, isSaving }: CategoriesFormProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState<Record<string, boolean>>({})

  // Toggle accordion expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  // Check if a category is selected
  const isCategorySelected = (categoryId: string) => {
    return formState.selectedCategories?.includes(categoryId) || false
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string, isSelected: boolean) => {
    const newSelectedCategories = isSelected
      ? [...(formState.selectedCategories || []), categoryId]
      : (formState.selectedCategories || []).filter((id: string) => id !== categoryId)

    // If category is deselected, clear its subcategory selections
    const newSubcategories = { ...(formState.subcategories || {}) }
    if (!isSelected && newSubcategories[categoryId]) {
      delete newSubcategories[categoryId]
    }

    onChange({
      ...formState,
      selectedCategories: newSelectedCategories,
      subcategories: newSubcategories,
    })
  }

  // Handle subcategory selection
  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    // Only allow subcategory selection if parent category is selected
    if (!isCategorySelected(categoryId)) return

    const currentSubcategories = formState.subcategories?.[categoryId] || []
    const isSelected = currentSubcategories.includes(subcategoryId)

    const newSubcategories = isSelected
      ? currentSubcategories.filter((id: string) => id !== subcategoryId)
      : [...currentSubcategories, subcategoryId]

    onChange({
      ...formState,
      subcategories: {
        ...(formState.subcategories || {}),
        [categoryId]: newSubcategories,
      },
    })
  }

  // Toggle subcategory dropdown
  const toggleSubcategoryDropdown = (categoryId: string, subcategoryId: string) => {
    setSubcategoryDropdownOpen((prev) => ({
      ...prev,
      [`${categoryId}-${subcategoryId}`]: !prev[`${categoryId}-${subcategoryId}`],
    }))
  }

  // Mock categories from backend - replace with actual data from formState
  const categories = [
    {
      id: "FASHION_APPAREL_ACCESSORIES",
      name: "Apparel & Accessories",
      subcategories: [
        { id: "clothing", name: "Clothing" },
        { id: "footwear", name: "Footwear" },
        { id: "jewelry", name: "Jewelry" },
        { id: "accessories", name: "Accessories" },
      ],
    },
    {
      id: "FOOD_BEVERAGES",
      name: "Food & Beverages",
      subcategories: [
        { id: "processed", name: "Processed Food" },
        { id: "beverages", name: "Beverages" },
        { id: "snacks", name: "Snacks" },
        { id: "organic", name: "Organic Food" },
      ],
    },
    {
      id: "HERBAL_NATURAL_PRODUCTS",
      name: "Mother & Baby Care",
      subcategories: [
        { id: "baby-clothing", name: "Baby Clothing" },
        { id: "toys", name: "Toys" },
        { id: "care-products", name: "Care Products" },
        { id: "feeding", name: "Feeding Products" },
      ],
    },
    {
      id: "HOME_CLEANING_ESSENTIALS",
      name: "Home & Garden",
      subcategories: [
        { id: "furniture", name: "Furniture" },
        { id: "decor", name: "Home Decor" },
        { id: "garden", name: "Garden Supplies" },
        { id: "kitchenware", name: "Kitchenware" },
      ],
    },
  ]

  // Get subcategory selections for a category
  const getSelectedSubcategories = (categoryId: string) => {
    return formState.subcategories?.[categoryId] || []
  }

  // Sort categories to put selected ones at the top
  const sortedCategories = [...categories].sort((a, b) => {
    const aSelected = isCategorySelected(a.id)
    const bSelected = isCategorySelected(b.id)

    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    return 0
  })

  return (
    <div className="mt-4 space-y-4">
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-1">Business Categories</h4>
        <p className="text-xs text-gray-500">Select the categories that best describe your business</p>
      </div>

      {/* Category Accordions */}
      <div className="space-y-3">
        {sortedCategories.map((category) => {
          const isSelected = isCategorySelected(category.id)
          const isExpanded = expandedCategory === category.id
          const selectedSubcategories = getSelectedSubcategories(category.id)

          return (
            <div
              key={category.id}
              className={cn("border rounded-md overflow-hidden", isSelected ? "border-gray-500" : "border-gray-200")}
            >
              {/* Accordion Header */}
              <div
                className={cn(
                  "flex items-center justify-between p-4 cursor-pointer",
                  isSelected ? "bg-gray-50" : "bg-white",
                )}
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      handleCategorySelect(category.id, checked === true)
                      // Prevent accordion toggle when clicking checkbox
                      event?.stopPropagation()
                    }}
                    className={cn("h-5 w-5 data-[state=checked]:bg-green-800 data-[state=checked]:text-white")}

                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-base font-medium cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {category.name}
                  </Label>
                  {isSelected && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Selected
                    </span>
                  )}
                </div>
                <div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="space-y-6">
                    {/* Subcategory Dropdown */}
                    <div className="space-x-2 flex flex-row">
                      <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Select Subcategories:</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={subcategoryDropdownOpen[category.id]}
                            className={cn("max-w-80 justify-between", !isSelected && "opacity-50 cursor-not-allowed")}
                            disabled={!isSelected}
                          >
                            <span className="truncate">
                              {selectedSubcategories.length > 0
                                ? `${selectedSubcategories.length} ${selectedSubcategories.length === 1 ? "subcategory" : "subcategories"} selected`
                                : "Select subcategories..."}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-white">
                          <Command>
                            <div className="flex items-center border-b px-3">
                              <CommandInput placeholder="Search subcategories..." className="h-9 flex-1" />
                            </div>
                            <CommandEmpty>No subcategory found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {category.subcategories.map((subcategory) => (
                                  <CommandItem
                                    key={subcategory.id}
                                    value={subcategory.id}
                                    onSelect={() => handleSubcategorySelect(category.id, subcategory.id)}
                                  >
                                    <div className="flex items-center">
                                      <span>{subcategory.name}</span>
                                    </div>
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        selectedSubcategories.includes(subcategory.id) ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      </div>

                      {/* Selected Subcategories Badges */}
                      {selectedSubcategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-7 pl-8">
                          {selectedSubcategories.map((subcategoryId: string) => {
                            const subcategory = category.subcategories.find((s) => s.id === subcategoryId)
                            if (!subcategory) return null

                            return (
                              <Badge key={subcategoryId} variant="secondary" className="pl-2 pr-1 h-8 bg-zinc-700 hover:bg-red-900 text-white hover:text-white cursor-pointer">
                                <div className="flex items-center">
                                  <span>{subcategory.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 ml-1"
                                    onClick={() => handleSubcategorySelect(category.id, subcategoryId)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </Badge>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoriesForm

