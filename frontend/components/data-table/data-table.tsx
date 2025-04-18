"use client";
import type React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Column<T> = {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  filterable?: boolean;
  searchable?: boolean;
};

type FilterOption = {
  label: string;
  value: string;
};

type FilterField = {
  label: string;
  options: FilterOption[];
  defaultValue?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  title?: string;
  isLoading?: boolean;
  pageSize?: number;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onFilter?: () => void;
  renderFilterDialog?: () => React.ReactNode;
  renderEmptyState?: () => React.ReactNode;
  renderLoadingState?: () => React.ReactNode;
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableFiltering?: boolean;
  enableRefresh?: boolean;
  enableExport?: boolean;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  searchValue?: string;
  filterOptions?: {
    [key: string]: FilterField;
  };
  activeFilters?: { [key: string]: string };
  onFilterChange?: (filters: { [key: string]: string }) => void;
};

export function DataTable<T>({
  data,
  columns,
  title,
  isLoading = false,
  pageSize = 10,
  searchPlaceholder = "Search...",
  onSearch,
  onRefresh,
  onExport,
  onFilter,
  renderFilterDialog,
  renderEmptyState,
  renderLoadingState,
  enableSearch = true,
  enablePagination = true,
  enableFiltering = true,
  enableRefresh = true,
  enableExport = true,
  currentPage = 1,
  totalItems,
  onPageChange,
  searchValue = "",
  filterOptions,
  activeFilters,
  onFilterChange,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [page, setPage] = useState(currentPage);
  const [internalFilters, setInternalFilters] = useState<{
    [key: string]: string;
  }>(activeFilters || {});
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Generate filter options from data if not provided
  const [generatedFilterOptions, setGeneratedFilterOptions] = useState<{
    [key: string]: FilterField;
  }>({});

  useEffect(() => {
    if (!filterOptions && enableFiltering) {
      // Auto-generate filter options from data for columns marked as filterable
      const options: { [key: string]: FilterField } = {};

      columns.forEach((column) => {
        if (column.filterable && column.accessorKey) {
          const key = String(column.accessorKey);
          const uniqueValues = new Set<string>();

          data.forEach((item) => {
            const value = item[column.accessorKey as keyof T];
            if (value !== undefined && value !== null) {
              uniqueValues.add(String(value));
            }
          });

          options[key] = {
            label: column.header,
            options: Array.from(uniqueValues).map((value) => ({
              label: value,
              value: value,
            })),
            defaultValue: "all",
          };
        }
      });

      setGeneratedFilterOptions(options);
    }
  }, [data, columns, filterOptions, enableFiltering]);

  // Apply internal filtering and searching when no external handlers are provided
  useEffect(() => {
    // If parent is handling filtering and searching, use the provided data
    if (onSearch && onFilterChange) {
      setFilteredData(data);
      return;
    }

    // Otherwise, handle filtering and searching internally
    let result = [...data];

    // Apply search if enabled and no external search handler
    if (enableSearch && !onSearch && searchQuery) {
      result = result.filter((item) => {
        // Only search through specified searchable columns or all columns if none specified
        const searchableColumns = columns.filter(
          (col) => col.searchable !== false
        );

        return searchableColumns.some((column) => {
          if (!column.accessorKey) return false;

          const value = (item as Record<string, any>)[column.accessorKey];
          if (value === undefined || value === null) return false;

          if (typeof value === "string") {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          if (typeof value === "number") {
            return value.toString().includes(searchQuery);
          }
          return false;
        });
      });
    }

    // Apply filters if enabled and no external filter handler
    if (
      enableFiltering &&
      !onFilterChange &&
      Object.keys(internalFilters).length > 0
    ) {
      result = result.filter((item) => {
        return Object.entries(internalFilters).every(([key, value]) => {
          if (!value || value === "all") return true;

          const itemValue = (item as Record<string, any>)[key];
          if (itemValue === undefined || itemValue === null) return false;

          return itemValue.toString().toLowerCase() === value.toLowerCase();
        });
      });
    }

    setFilteredData(result);
  }, [
    data,
    searchQuery,
    internalFilters,
    onSearch,
    onFilterChange,
    enableSearch,
    enableFiltering,
    columns,
  ]);

  // Calculate total pages based on either provided totalItems or filtered data length
  const totalPages = totalItems
    ? Math.ceil(totalItems / pageSize)
    : Math.ceil(filteredData.length / pageSize);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...internalFilters };

    if (value === "all" || !value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    setInternalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Reset all filters
  const resetAllFilters = () => {
    setInternalFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  // Handle filter dialog
  const handleFilterClick = () => {
    if (onFilter) {
      onFilter();
    } else {
      setIsFilterSheetOpen(true);
    }
  };

  // Create a paginated view of the data
  const getPaginatedData = () => {
    return filteredData;
    if (!enablePagination) return filteredData;

    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return filteredData.slice(startIdx, endIdx);
  };

  // Default skeleton loading state
  const defaultLoadingState = (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: pageSize }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((_, colIndex) => (
              <TableCell key={colIndex}>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Default empty state
  const defaultEmptyState = (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        className="text-center py-6 text-muted-foreground"
      >
        No data found
      </TableCell>
    </TableRow>
  );

  // Get the data to display
  const displayData =
    onSearch || onFilterChange ? filteredData : getPaginatedData();

  // Get active filter count
  const activeFilterCount = Object.keys(internalFilters).length;

  // The actual filter options to use (either provided or auto-generated)
  const effectiveFilterOptions = filterOptions || generatedFilterOptions;

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-lg font-medium">
          {title}{" "}
          {totalItems !== undefined
            ? `(${totalItems})`
            : filteredData.length > 0
            ? `(${filteredData.length})`
            : ""}
        </h2>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {enableFiltering && (
            <Button
              variant={activeFilterCount > 0 ? "default" : "outline"}
              size="sm"
              onClick={handleFilterClick}
              className={
                activeFilterCount > 0
                  ? "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  : ""
              }
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters{" "}
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          )}
          {enableRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
          {enableExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 ml-2 items-center">
              {Object.entries(internalFilters).map(([key, value]) => {
                const filterField = effectiveFilterOptions?.[key];
                const filterOption = filterField?.options.find(
                  (o) => o.value === value
                );
                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className="rounded-full px-3 py-1 flex items-center gap-1"
                  >
                    <span className="text-xs font-medium">
                      {filterField?.label || key}:
                    </span>{" "}
                    {filterOption?.label || value}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer opacity-70 hover:opacity-100"
                      onClick={() => handleFilterChange(key, "all")}
                    />
                  </Badge>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={resetAllFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {enableSearch && (
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8"
            />
            <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="border rounded-md">
        {isLoading ? (
          renderLoadingState ? (
            renderLoadingState()
          ) : (
            defaultLoadingState
          )
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index} className={column.className}>
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.filterable &&
                        column.accessorKey &&
                        effectiveFilterOptions[
                          column.accessorKey as string
                        ] && (
                          <ColumnFilterPopover
                            field={column.accessorKey as string}
                            filterField={
                              effectiveFilterOptions[
                                column.accessorKey as string
                              ]
                            }
                            activeValue={
                              internalFilters[column.accessorKey as string]
                            }
                            onFilterChange={handleFilterChange}
                          />
                        )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length > 0
                ? displayData.map((item, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {column.cell
                            ? column.cell(item)
                            : column.accessorKey
                            ? String(item[column.accessorKey] || "")
                            : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : renderEmptyState
                ? renderEmptyState()
                : defaultEmptyState}
            </TableBody>
          </Table>
        )}
      </div>

      {enablePagination && totalPages > 1 && (
        <Pagination className="hover:cursor-pointer">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className={
                  page === 1
                    ? "hover:cursor-not-allowed pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {(() => {
              const totalPageNumbers = 5;
              let startPage = 1;
              let endPage = Math.min(totalPages, totalPageNumbers);

              // Adjust range when current page is near the end
              if (page > totalPageNumbers - 2) {
                startPage = Math.max(1, totalPages - totalPageNumbers + 1);
                endPage = totalPages;
              }
              // Adjust range when current page is in the middle
              else if (page > 2) {
                startPage = Math.max(1, page - 2);
                endPage = Math.min(
                  startPage + totalPageNumbers - 1,
                  totalPages
                );
              }

              return Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ));
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className={
                  page === totalPages
                    ? "hover:cursor-not-allowed pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Filter Sheet */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent className="sm:max-w-md bg-white">
          <SheetHeader>
            <SheetTitle>Filter Data</SheetTitle>
            <SheetDescription>
              Apply filters to narrow down the data displayed in the table.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {Object.entries(effectiveFilterOptions || {}).map(
              ([key, filterField]) => (
                <div key={key} className="space-y-2">
                  <h4 className="font-medium text-sm">{filterField.label}</h4>
                  <div className="space-y-1">
                    <FilterSelect
                      field={key}
                      options={filterField.options}
                      value={internalFilters[key] || "all"}
                      onChange={(value) => handleFilterChange(key, value)}
                    />
                  </div>
                </div>
              )
            )}

            {Object.keys(effectiveFilterOptions || {}).length === 0 && (
              <div className="text-center text-muted-foreground py-6">
                No filter options available for this data.
              </div>
            )}
          </div>

          <SheetFooter className="flex flex-row justify-between sm:justify-between gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={resetAllFilters}
            >
              Reset All
            </Button>
            <SheetClose asChild>
              <Button>Apply Filters</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {renderFilterDialog && renderFilterDialog()}
    </div>
  );
}

// Column Filter Popover Component
function ColumnFilterPopover({
  field,
  filterField,
  activeValue,
  onFilterChange,
}: {
  field: string;
  filterField: FilterField;
  activeValue?: string;
  onFilterChange: (key: string, value: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 p-0 ml-1",
            activeValue
              ? "text-primary bg-primary/10 hover:bg-primary/20"
              : "text-muted-foreground"
          )}
        >
          <Filter className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0 bg-white" align="start">
        <Command>
          <CommandInput placeholder={`Filter by ${filterField.label}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => onFilterChange(field, "all")}
                className="flex items-center justify-between"
              >
                <span>All</span>
                {(!activeValue || activeValue === "all") && (
                  <Check className="h-4 w-4" />
                )}
              </CommandItem>
              {filterField.options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => onFilterChange(field, option.value)}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {activeValue === option.value && (
                    <Check className="h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Filter Select component with search
function FilterSelect({
  field,
  options,
  value,
  onChange,
}: {
  field: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {value === "all"
            ? "All"
            : options.find((option) => option.value === value)?.label ||
              "Select..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white" align="start">
        <Command>
          <CommandInput placeholder={`Search options...`} />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
                className="flex items-center justify-between"
              >
                <span>All</span>
                {value === "all" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
