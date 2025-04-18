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
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Filter,
  Download,
  RefreshCw,
  X,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
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
} from "../ui/sheet";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { ColumnFilterWithSort } from "./column-filter-with-sort";
import { FilterSelect } from "./filter-select";

export type Column<T> = {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  filterable?: boolean;
  searchable?: boolean;
  sortable?: boolean;
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
  enableSorting?: boolean;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  searchValue?: string;
  filterOptions?: {
    [key: string]: FilterField;
  };
  activeFilters?: { [key: string]: string };
  onFilterChange?: (filters: { [key: string]: string }) => void;
  defaultSortField?: string;
  defaultSortDirection?: "asc" | "desc";
  onSort?: (field: string, direction: "asc" | "desc") => void;
  sortFunction?: (
    a: T,
    b: T,
    field: string,
    direction: "asc" | "desc"
  ) => number;
};

export function EnhancedDataTable<T>({
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
  enableSorting = true,
  currentPage = 1,
  totalItems,
  onPageChange,
  searchValue = "",
  filterOptions,
  activeFilters,
  onFilterChange,
  defaultSortField,
  defaultSortDirection = "asc",
  onSort,
  sortFunction,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [page, setPage] = useState(currentPage);
  const [internalFilters, setInternalFilters] = useState<{
    [key: string]: string;
  }>(activeFilters || {});
  const [sortField, setSortField] = useState<string | undefined>(
    defaultSortField
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    defaultSortDirection
  );
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

  // Handle sort change
  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);

    if (onSort) {
      onSort(field, direction);
    }
  };

  // Toggle sort direction for a column
  const toggleSort = (field: string) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    handleSortChange(field, newDirection);
  };

  // Apply internal filtering and searching when no external handlers are provided
  useEffect(() => {
    // If parent is handling filtering, searching, and sorting, use the provided data
    if (onSearch && onFilterChange && onSort) {
      setFilteredData(data);
      return;
    }

    // Otherwise, handle filtering, searching, and sorting internally
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

    // Apply sorting if enabled and no external sort handler
    if (enableSorting && !onSort && sortField) {
      result.sort((a, b) => {
        if (sortFunction) {
          return sortFunction(a, b, sortField, sortDirection);
        }

        const aValue = (a as Record<string, any>)[sortField];
        const bValue = (b as Record<string, any>)[sortField];

        if (aValue === undefined || aValue === null)
          return sortDirection === "asc" ? -1 : 1;
        if (bValue === undefined || bValue === null)
          return sortDirection === "asc" ? 1 : -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    }

    setFilteredData(result);
  }, [
    data,
    searchQuery,
    internalFilters,
    sortField,
    sortDirection,
    onSearch,
    onFilterChange,
    onSort,
    sortFunction,
    enableSearch,
    enableFiltering,
    enableSorting,
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

          {/* Global sort direction button */}
          {enableSorting && sortField && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleSortChange(
                  sortField,
                  sortDirection === "asc" ? "desc" : "asc"
                )
              }
              className="flex items-center gap-1"
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              Sort: {sortDirection === "asc" ? "Ascending" : "Descending"}
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
                  <TableHead
                    key={index}
                    className={cn(
                      column.className,
                      enableSorting &&
                        column.sortable !== false &&
                        "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                    onClick={() => {
                      if (
                        enableSorting &&
                        column.sortable !== false &&
                        column.accessorKey
                      ) {
                        toggleSort(column.accessorKey as string);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {column.header}

                      {/* Sort indicator */}
                      {enableSorting &&
                        column.sortable !== false &&
                        column.accessorKey && (
                          <>
                            {sortField === column.accessorKey ? (
                              sortDirection === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5 ml-1" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5 ml-1" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-50" />
                            )}
                          </>
                        )}

                      {/* Column filter */}
                      {column.filterable &&
                        column.accessorKey &&
                        effectiveFilterOptions[
                          column.accessorKey as string
                        ] && (
                          <ColumnFilterWithSort
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
                            sortDirection={
                              sortField === column.accessorKey
                                ? sortDirection
                                : undefined
                            }
                            onSortDirectionChange={handleSortChange}
                            enableSorting={
                              enableSorting && column.sortable !== false
                            }
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
