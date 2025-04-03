"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Filter } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterButtonProps {
  options: FilterOption[];
  onFilterChange: (selectedOptions: string[]) => void;
  label?: string;
}

export function FilterButton({
  options,
  onFilterChange,
  label = "Filter",
}: FilterButtonProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionToggle = (optionId: string) => {
    const newSelectedOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];

    setSelectedOptions(newSelectedOptions);
    onFilterChange(newSelectedOptions);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-medium"
        >
          <Filter className="h-3.5 w-3.5 mr-2" />
          {label}
          {selectedOptions.length > 0 && (
            <span className="ml-1 bg-gray-200 text-gray-700 rounded-full px-1.5 py-0.5 text-xs">
              {selectedOptions.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleOptionToggle(option.id)}
            >
              {option.label}
              {selectedOptions.includes(option.id) && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {selectedOptions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 cursor-pointer"
              onClick={() => {
                setSelectedOptions([]);
                onFilterChange([]);
              }}
            >
              Clear filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
