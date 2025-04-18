"use client";
import React from "react";
import { ArrowDown, ArrowUp, Check, Filter } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

type FilterField = {
  label: string;
  options: FilterOption[];
  defaultValue?: string;
};

// Enhanced column filter that includes sort direction options
export function ColumnFilterWithSort({
  field,
  filterField,
  activeValue,
  onFilterChange,
  sortDirection,
  onSortDirectionChange,
  enableSorting = true,
}: {
  field: string;
  filterField: FilterField;
  activeValue?: string;
  onFilterChange: (key: string, value: string) => void;
  sortDirection?: "asc" | "desc";
  onSortDirectionChange?: (field: string, direction: "asc" | "desc") => void;
  enableSorting?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 p-0 ml-1",
            activeValue || sortDirection
              ? "text-primary bg-primary/10 hover:bg-primary/20"
              : "text-muted-foreground"
          )}
        >
          <Filter className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 p-2 bg-white" align="start">
        <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
          Filter by {filterField.label}
        </div>
        <DropdownMenuRadioGroup value={activeValue || "all"}>
          <DropdownMenuRadioItem
            value="all"
            onSelect={() => onFilterChange(field, "all")}
          >
            All
            {(!activeValue || activeValue === "all") && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuRadioItem>

          {filterField.options.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              onSelect={() => onFilterChange(field, option.value)}
            >
              {option.label}
              {activeValue === option.value && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        {enableSorting && onSortDirectionChange && (
          <>
            <DropdownMenuSeparator />
            <div className="text-xs font-medium text-muted-foreground my-2 px-2">
              Sort Direction
            </div>
            <DropdownMenuRadioGroup value={sortDirection || "asc"}>
              <DropdownMenuRadioItem
                value="asc"
                onSelect={() => onSortDirectionChange(field, "asc")}
                className="flex items-center"
              >
                <ArrowUp className="h-3.5 w-3.5 mr-2" />
                Ascending
                {sortDirection === "asc" && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="desc"
                onSelect={() => onSortDirectionChange(field, "desc")}
                className="flex items-center"
              >
                <ArrowDown className="h-3.5 w-3.5 mr-2" />
                Descending
                {sortDirection === "desc" && (
                  <Check className="h-4 w-4 ml-auto" />
                )}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
