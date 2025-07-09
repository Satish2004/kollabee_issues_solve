"use client";

import { useState, useEffect, useMemo } from "react";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, StatusBadge, type Column } from "@/components/data-table";
import { OrderDetail } from "./order-detail";
import { FilterDialog } from "./filter-dialog";
import { ordersApi } from "@/lib/api/orders";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

type Order = {
  id: string;
  buyer: {
    name: string;
    avatar?: string;
  };
  productChannel: string;
  address: string;
  orderDate: string;
  status: string;
  supplier?: string;
  createdAt: string;
};

export default function Orders() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    productChannel: "all",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  const ordersPerPage = 10;

  // Memoized filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.productChannel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        order.status.toLowerCase() === filters.status.toLowerCase();

      // Product channel filter
      const matchesChannel =
        filters.productChannel === "all" ||
        order.productChannel.toLowerCase() ===
        filters.productChannel.toLowerCase();

      // Date range filter (example implementation)
      let matchesDate = true;
      if (filters.dateRange !== "all") {
        const orderDate = new Date(order.createdAt);
        const now = new Date();

        if (filters.dateRange === "today") {
          matchesDate = orderDate.toDateString() === now.toDateString();
        } else if (filters.dateRange === "week") {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          matchesDate = orderDate >= oneWeekAgo;
        } else if (filters.dateRange === "month") {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          matchesDate = orderDate >= oneMonthAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesChannel && matchesDate;
    });
  }, [orders, searchQuery, filters]);

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    size: ordersPerPage,
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearchQuery("");
    setFilters({
      status: "all",
      dateRange: "all",
      productChannel: "all",
    });
    fetchData();
  };

  const handleExport = () => {
    if (!filteredOrders.length) return;

    const exportData = filteredOrders.map(order => ({
      "Order ID": order.id,
      "Buyer Name": order.buyer.name,
      "Product Channel": order.productChannel,
      "Address": order.address,
      "Order Date": order.orderDate,
      "Status": order.status,
      "Supplier": order.supplier,
    }));

    const csv = Papa.unparse(exportData);

    // Create and trigger file download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const params = {
        type: "orders",
        pageNo: currentPage,
        pageSize: ordersPerPage,
        search: searchQuery,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      const response = await ordersApi.getOrdersForAdmin(params);
      const formattedData = response.data.map((order) => ({
        id: order.id,
        buyer: {
          name: order.buyer?.user?.name || "Unknown Buyer",
          avatar: order.buyer?.user?.avatar || null,
        },
        productChannel: order.items[0]?.product?.name || "Unknown Product",
        address: order.buyer?.location || "Unknown Address",
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        status: order.status === "PENDING" ? "In Progress" : order.status,
        supplier: order.items[0]?.seller?.businessName || "Unknown Supplier",
        createdAt: order.createdAt,
      }));

      setOrders(formattedData);
      setPagination({
        total: response.pagination.total,
        pages: response.pagination.pages,
        page: response.pagination.page,
        size: response.pagination.size,
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    // Debounce search and filter changes
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const columns: Column<Order>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
      className: "w-[100px]",
    },
    {
      header: "Buyers",
      filterable: true,
      cell: (order) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={order.buyer.avatar || "/placeholder.svg"}
              alt={order.buyer.name}
            />
            <AvatarFallback>{order.buyer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{order.buyer.name}</span>
        </div>
      ),
    },
    {
      header: "Product Channel",
      filterable: true,
      accessorKey: "productChannel",
    },
    {
      header: "Address",
      filterable: true,
      accessorKey: "address",
    },
    {
      header: "Order Date",
      filterable: true,
      cell: (order) => (
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-calendar"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>{order.orderDate}</span>
        </div>
      ),
    },
    {
      header: "Status",
      filterable: true,
      accessorKey: "status",
      cell: (order) => <StatusBadge status={order.status} />,
    },
    {
      header: "Supplier",
      filterable: true,
      accessorKey: "supplier",
    },
    {
      header: "",
      className: "w-[50px]",
      cell: (order) => (
        <button
          className="p-1"
          onClick={() => router.push(`order/${order.id}`)}
        >
          <Eye className="h-4 w-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={filteredOrders}
        columns={columns}
        title="Active Order List"
        isLoading={isLoading}
        pageSize={pagination.size}
        searchPlaceholder="Search orders..."
        onSearch={(value) => setSearchQuery(value)}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onFilter={() => setIsFilterOpen(true)}
        enableSearch={true}
        enablePagination={true}
        enableFiltering={true}
        enableRefresh={true}
        enableExport={true}
        currentPage={currentPage}
        totalItems={filteredOrders.length}
        onPageChange={(page) => setCurrentPage(page)}
        searchValue={searchQuery}
        renderEmptyState={() => (
          <div className="text-center py-6 text-muted-foreground">
            No orders found matching your criteria
          </div>
        )}
      />

      <OrderDetail
        order={selectedOrder}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <FilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </>
  );
}