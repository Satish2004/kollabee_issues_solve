"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Category } from "../../types/product-form"

interface CategoryMultiSelectProps {
  categories: Category[]
  selectedIds: string[]
  onSelectionChange: (categoryIds: string[]) => void
  error?: string
}

export function CategoryMultiSelect({ categories, selectedIds, onSelectionChange, error }: CategoryMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (categoryId: string) => {
    const newSelection = selectedIds.includes(categoryId)
      ? selectedIds.filter((id) => id !== categoryId)
      : [...selectedIds, categoryId]

    onSelectionChange(newSelection)
  }

  const selectedCategories = categories.filter((cat) => selectedIds.includes(cat.id))

  return (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-4">
        Categories <span className="text-red-500">*</span>
      </h3>
      <div className="w-full">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={isOpen}
              className={`w-full flex items-center justify-between rounded-md border border-input bg-[#fcfcfc] px-3 py-2 text-sm ${
                error ? "border-red-500" : ""
              }`}
            >
              <div className="flex flex-wrap gap-1">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="mr-1">
                      {category.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">Select categories...</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search categories..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {categories.map((category) => (
                    <CommandItem key={category.id} value={category.name} onSelect={() => handleSelect(category.id)}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border",
                            selectedIds.includes(category.id)
                              ? "bg-primary border-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible",
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{category.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  )
}
