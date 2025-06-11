"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, type Column } from "@/components/data-table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ordersApi } from "@/lib/api/orders";

type FormattedTopBuyer = {
  id: string;
  name: string;
  avatar?: string;
  productOrdered: string;
  address: string;
  orderDate: string;
  status: string;
};

export default function Analytics() {
  const [topBuyers, setTopBuyers] = useState<FormattedTopBuyer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 5,
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
  });

  useEffect(() => {
    fetchTopBuyers();
  }, [currentPage, searchQuery]);

  const fetchTopBuyers = async () => {
    try {
      setIsLoading(true);
      const params = {
        pageNo: currentPage,
        pageSize: pagination.pageSize,
        search: searchQuery,
        sortBy: "totalAmount",
        sortOrder: "desc",
      };

      const response = await ordersApi.getTopBuyers(params);

      if (response && response.data) {
        // Format the data to make it compatible with the DataTable component
        const formattedData: FormattedTopBuyer[] = response.data.map(
          (buyer) => ({
            id: buyer.buyerId,
            name: buyer.details.user.name || "Unknown",
            avatar: buyer.details.user.imageUrl,
            productOrdered: "Product", // This would need to come from the API
            address: buyer.details.location || "N/A",
            orderDate: new Date().toLocaleDateString(), // This would need to come from the API
            status: "Active Buying", // This would need to come from the API
          })
        );

        setTopBuyers(formattedData);
        setPagination({
          total: response.pagination.total,
          pageSize: response.pagination.pageSize,
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          hasMore: response.pagination.hasMore,
        });
      }
    } catch (error) {
      console.error("Error fetching top buyers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearchQuery("");
    fetchTopBuyers();
  };

  const handleExport = () => {
    console.log("Exporting top buyers data...");
    // Implement export logic here
  };

  const columns: Column<FormattedTopBuyer>[] = [
    {
      header: "Buyer Name",
      accessorKey: "name",
      cell: (buyer) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={buyer.avatar || "/placeholder.svg"}
              alt={buyer.name}
            />
            <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{buyer.name}</span>
        </div>
      ),
      filterable: true,
      searchable: true,
    },
    {
      header: "Product Ordered",
      accessorKey: "productOrdered",
      filterable: true,
      searchable: true,
    },
    {
      header: "Address",
      accessorKey: "address",
      searchable: true,
    },
    {
      header: "Order Date",
      accessorKey: "orderDate",
      cell: (buyer) => (
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
          <span>{buyer.orderDate}</span>
        </div>
      ),
    },
    {
      header: "Status of Customer",
      accessorKey: "status",
      cell: (buyer) => <CustomerStatusBadge status={buyer.status} />,
      filterable: true,
    },
    {
      header: "",
      className: "w-[50px]",
      cell: (buyer) => (
        <button title="view" className="p-1">
          <Eye className="h-4 w-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Order Analytics</h2>

      <OrderAnalytics />

      <Card className="p-4">
        <DataTable
          data={topBuyers}
          columns={columns}
          title="Top Buyers List"
          isLoading={isLoading}
          pageSize={pagination.pageSize}
          searchPlaceholder="Search buyers..."
          onRefresh={handleRefresh}
          onExport={handleExport}
          enableSearch={true}
          enablePagination={true}
          enableFiltering={true}
          enableRefresh={true}
          enableExport={true}
          currentPage={pagination.currentPage}
          totalItems={pagination.total}
          onPageChange={(page) => setCurrentPage(page)}
          renderEmptyState={() => (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-6 text-muted-foreground"
              >
                No top buyers found matching your criteria
              </TableCell>
            </TableRow>
          )}
        />
      </Card>
    </div>
  );
}

export function OrderAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Order Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-rose-500"></span>
              <span className="text-sm">Bulk Quantity</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-amber-400"></span>
              <span className="text-sm">Single Quantity</span>
            </div>
            <div className="ml-auto">
              <select title="time" className="text-sm border rounded px-2 py-1">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">16 Aug 2023</div>
          <div className="text-xl font-semibold">$59,492.10</div>
          <div className="h-[200px] mt-4">
            <OrderAnalyticsChart />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <OrderSummaryChart />
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-amber-400"></span>
              <span className="text-sm">Repeated Customers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-rose-500"></span>
              <span className="text-sm">New Customers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderAnalyticsChart() {
  const data = [
    { month: "Jan", bulk: 20, single: 30 },
    { month: "Feb", bulk: 25, single: 40 },
    { month: "Mar", bulk: 30, single: 35 },
    { month: "Apr", bulk: 35, single: 30 },
    { month: "May", bulk: 40, single: 45 },
    { month: "Jun", bulk: 45, single: 40 },
    { month: "Jul", bulk: 50, single: 45 },
  ];

  return (
    <ChartContainer
      config={{
        bulk: {
          label: "Bulk Quantity",
          color: "hsl(346, 84%, 61%)", // Rose color
        },
        single: {
          label: "Single Quantity",
          color: "hsl(43, 96%, 58%)", // Amber color
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="bulk"
            stroke="hsl(346, 84%, 61%)" // Rose color
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="single"
            stroke="hsl(43, 96%, 58%)" // Amber color
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function OrderSummaryChart() {
  const data = [
    { month: "Jan", repeated: 1000, new: 2000 },
    { month: "Feb", repeated: 2000, new: 1500 },
    { month: "Mar", repeated: 3000, new: 1800 },
    { month: "Apr", repeated: 3500, new: 2200 },
    { month: "May", repeated: 3000, new: 2000 },
  ];

  return (
    <ChartContainer
      config={{
        repeated: {
          label: "Repeated Customers",
          color: "hsl(43, 96%, 58%)", // Amber color
        },
        new: {
          label: "New Customers",
          color: "hsl(346, 84%, 61%)", // Rose color
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="repeated"
            stroke="hsl(43, 96%, 58%)" // Amber color
            fill="hsl(43, 96%, 58%)" // Amber color
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="new"
            stroke="hsl(346, 84%, 61%)" // Rose color
            fill="hsl(346, 84%, 61%)" // Rose color
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function CustomerStatusBadge({ status }) {
  const statusStyles = {
    "Active Buying": "text-rose-600",
    "Not Active": "text-gray-600",
  };

  return (
    <div className="flex items-center">
      {status === "Active Buying" ? (
        <span className="mr-1 text-rose-500">•</span>
      ) : (
        <span className="mr-1 text-gray-500">•</span>
      )}
      <span className={statusStyles[status] || ""}>{status}</span>
    </div>
  );
}

const TableRow = ({ children }) => <tr>{children}</tr>;
const TableCell = ({ colSpan, className, children }) => (
  <td colSpan={colSpan} className={className}>
    {children}
  </td>
);
