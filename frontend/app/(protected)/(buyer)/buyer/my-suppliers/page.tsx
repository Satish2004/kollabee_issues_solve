"use client"
import React, { useEffect, useState } from 'react'
import { mySuppliersApi, type Supplier, type SupplierStats, type PaginationInfo } from '@/lib/api/my-suppliers'
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, ShoppingCart, Package, FolderGit2, Search, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SortByType = "businessName" | "rating" | "interactionCount" | "lastInteraction";

export default function MySuppliersPage() {
  const [activeType, setActiveType] = useState<"ALL" | "CART" | "ORDER" | "PROJECT" | "CONVERSATION">("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortByType>("lastInteraction");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch all suppliers for stats
  const { data: allSuppliers, isLoading: statsLoading } = useQuery({
    queryKey: ["allMySuppliers"],
    queryFn: () => mySuppliersApi.getMySuppliers({ type: "ALL" }),
  });

  // Calculate total counts for tabs (unaffected by search)
  const tabCounts = {
    ALL: new Set(allSuppliers?.suppliers?.map(s => s.id)).size || 0,
    CART: new Set(allSuppliers?.suppliers?.filter(s => s.types.includes("CART")).map(s => s.id)).size || 0,
    ORDER: new Set(allSuppliers?.suppliers?.filter(s => s.types.includes("ORDER")).map(s => s.id)).size || 0,
    PROJECT: new Set(allSuppliers?.suppliers?.filter(s => s.types.includes("PROJECT")).map(s => s.id)).size || 0,
    CONVERSATION: new Set(allSuppliers?.suppliers?.filter(s => s.types.includes("CONVERSATION")).map(s => s.id)).size || 0,
  };

  // Fetch suppliers with backend filtering
  const { data, isLoading: backendLoading } = useQuery({
    queryKey: ["mySuppliers", activeType, search, sortBy, currentPage],
    queryFn: () => mySuppliersApi.getMySuppliers({
      type: activeType,
      search,
      sortBy,
      sortOrder: "desc",
      page: currentPage,
      limit: pagination.itemsPerPage
    }),
  });

  useEffect(() => {
    if (data) {
      setSuppliers(data.suppliers);
      setPagination(data.pagination);
    }
  }, [data]);

  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5;

    if (pagination.totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= pagination.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of page range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(pagination.totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(pagination.totalPages - 1, 4);
      } else if (currentPage >= pagination.totalPages - 1) {
        start = Math.max(2, pagination.totalPages - 3);
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push("...");
      }

      // Add page numbers in range
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (end < pagination.totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      if (pagination.totalPages > 1) {
        pageNumbers.push(pagination.totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.ALL}</div>
            <p className="text-xs text-muted-foreground">Active partnerships</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.ORDER}</div>
            <p className="text-xs text-muted-foreground">Suppliers with orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.PROJECT}</div>
            <p className="text-xs text-muted-foreground">Project collaborations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.CONVERSATION}</div>
            <p className="text-xs text-muted-foreground">Ongoing conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Suppliers</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your supplier relationships and interactions
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeType} className="w-full">
              <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent border-b pb-4">
                <TabsTrigger
                  value="ALL"
                  onClick={() => setActiveType("ALL")}
                  className={cn(
                    "data-[state=active]:border-b-2 border-red-500 shadow-none transition-all duration-200",
                    backendLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                >
                  All ({tabCounts.ALL})
                </TabsTrigger>
                <TabsTrigger
                  value="CART"
                  onClick={() => setActiveType("CART")}
                  className={cn(
                    "data-[state=active]:border-b-2 border-red-500 shadow-none transition-all duration-200",
                    backendLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                >
                  Cart ({tabCounts.CART})
                </TabsTrigger>
                <TabsTrigger
                  value="ORDER"
                  onClick={() => setActiveType("ORDER")}
                  className={cn(
                    "data-[state=active]:border-b-2 border-red-500 shadow-none transition-all duration-200",
                    backendLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                >
                  Orders ({tabCounts.ORDER})
                </TabsTrigger>
                <TabsTrigger
                  value="PROJECT"
                  onClick={() => setActiveType("PROJECT")}
                  className={cn(
                    "data-[state=active]:border-b-2 border-red-500 shadow-none transition-all duration-200",
                    backendLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                >
                  Projects ({tabCounts.PROJECT})
                </TabsTrigger>
                <TabsTrigger
                  value="CONVERSATION"
                  onClick={() => setActiveType("CONVERSATION")}
                  className={cn(
                    "data-[state=active]:border-b-2 border-red-500 shadow-none transition-all duration-200",
                    backendLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-50"
                  )}
                >
                  Conversations ({tabCounts.CONVERSATION})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search suppliers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-lg border-gray-200 focus-visible:ring-red-500"
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(value: SortByType) => setSortBy(value)}
              >
                <SelectTrigger className="w-full sm:w-[200px] rounded-lg border-gray-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="businessName">Business Name</SelectItem>
                  <SelectItem value="lastInteraction">Last Interaction</SelectItem>
                  <SelectItem value="interactionCount">Interaction Count</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Suppliers Grid */}
          <AnimatePresence mode="wait">
            {backendLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
              >
                {[...Array(6)].map((_, i) => (
                  <SupplierCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
              >
                {suppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!backendLoading && suppliers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
              {/* Page info - visible on all screens */}
              <div className="text-sm text-gray-500">
                Page {currentPage} of {pagination.totalPages}
              </div>

              {/* Desktop pagination */}
              <div className="hidden sm:flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, index) =>
                  typeof page === "number" ? (
                    <Button
                      key={index}
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "h-8 w-8",
                        page === currentPage && "bg-red-500 text-white hover:bg-red-600"
                      )}
                    >
                      {page}
                    </Button>
                  ) : (
                    <span key={index} className="px-1">
                      {page}
                    </span>
                  )
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile pagination */}
              <div className="flex sm:hidden items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage src={supplier.user.imageUrl} alt={supplier.businessName} className="object-cover" />
              <AvatarFallback className="bg-red-50 text-red-600">{supplier.businessName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold group-hover:text-red-600 transition-colors">
                {supplier.businessName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-xs font-medium ml-1">{supplier.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{supplier.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Last interaction: {supplier.lastInteraction ? format(new Date(supplier.lastInteraction), 'MMM d, yyyy') : 'Never'}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {supplier.types.map((type) => {
            const isPrimary = type === supplier.primaryType;
            return (
              <Badge 
                key={type} 
                variant={isPrimary ? "secondary" : "outline"}
                className={cn(
                  "text-xs font-medium",
                  isPrimary 
                    ? "bg-red-50 text-red-600 hover:bg-red-100" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {type}
              </Badge>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {supplier.interactionCount} interactions
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupplierCardSkeleton() {
  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-100">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full border-2 border-white shadow-sm" />
            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full bg-amber-50/50" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-24 rounded-md bg-red-50/50" />
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}




