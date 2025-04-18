"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, StatusBadge, type Column } from "@/components/data-table";
import { OrderDetail } from "./order-detail";
import { FilterDialog } from "./filter-dialog";
import { mockOrders } from "@/lib/mock-data";
import { ordersApi } from "@/lib/api/orders";

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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const ordersPerPage = 10;

  useEffect(() => {
    // Filter orders based on search query and filters
    const filtered = filteredOrders.filter((order) => {
      // Search filter
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        order.status.toLowerCase().replace(" ", "-") ===
          filters.status.toLowerCase();

      // Product channel filter
      const matchesChannel =
        filters.productChannel === "all" ||
        order.productChannel.toLowerCase() ===
          filters.productChannel.toLowerCase();

      return matchesSearch && matchesStatus && matchesChannel;
    });

    setFilteredOrders(filtered);
  }, [searchQuery, filters]);

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
    setCurrentPage(1); // Reset to first page when filters change
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
    // Implement export logic
    console.log("Exporting data...");
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
      }));

      setFilteredOrders(formattedData);
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
  }, [currentPage, searchQuery, filters]);

  useEffect(() => {
    console.log("filteredOrders", filteredOrders);
  }, [filteredOrders]);

  // Define columns for the DataTable
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
        <button className="p-1" onClick={() => handleViewOrder(order)}>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  // Calculate pagination
  // const indexOfLastOrder = currentPage * ordersPerPage;
  // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  // const currentOrders = filteredOrders.slice(
  //   indexOfFirstOrder,
  //   indexOfLastOrder
  // );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <>
      <DataTable
        data={filteredOrders}
        columns={columns}
        title="Active Order List"
        isLoading={isLoading}
        pageSize={pagination.size}
        searchPlaceholder="Search orders..."
        // onSearch={setSearchQuery}
        onRefresh={handleRefresh}
        onExport={handleExport}
        // onFilter={() => setIsFilterOpen(true)}
        enableSearch={true}
        enablePagination={true}
        enableFiltering={true}
        enableRefresh={true}
        enableExport={true}
        currentPage={pagination.page}
        totalItems={pagination.total}
        onPageChange={(page) => setCurrentPage(page)}
        // searchValue={searchQuery}
        renderEmptyState={() => (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="text-center py-6 text-muted-foreground"
            >
              No orders found matching your criteria
            </TableCell>
          </TableRow>
        )}
        renderLoadingState={() => (
          <div className="flex items-center justify-center h-full">
            ...loading
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
      />
    </>
  );
}

// This is just to make the example work without errors
const TableRow = ({ children }) => <tr>{children}</tr>;
const TableCell = ({ colSpan, className, children }) => (
  <td colSpan={colSpan} className={className}>
    {children}
  </td>
);
