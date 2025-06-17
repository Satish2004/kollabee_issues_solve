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
import { dashboardApi } from "@/lib/api/dashboard";

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
        const formattedData: FormattedTopBuyer[] = (response.data.data || []).map(
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
          total: response.data.pagination.total,
          pageSize: response.data.pagination.pageSize,
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          hasMore: response.data.pagination.hasMore,
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
  const [period, setPeriod] = useState<'month' | 'week' | 'today' | 'year'>('month');
  const [chartData, setChartData] = useState<{ name: string; bulk: number; single: number }[]>([]);
  const [orderSummaryData, setOrderSummaryData] = useState<{ name: string; repeated: number; new: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Fetch both order analytics and order summary data
    Promise.all([
      dashboardApi.getOrderAnalytics(period),
      dashboardApi.getOrderSummary(period)
    ])
      .then(([analyticsRes, summaryRes]) => {
        // Handle order analytics data
        const raw = (analyticsRes.data as any)?.chartData || [];
        setChartData(
          raw.map((item: any) => ({
            name: item.name,
            bulk: item.bulk ?? 0,
            single: item.single ?? 0,
          }))
        );
        
        // Handle order summary data
        const summaryRaw = (summaryRes.data as any)?.summaryData || [];
        setOrderSummaryData(
          summaryRaw.map((item: any) => ({
            name: item.name,
            repeated: item.repeated ?? 0,
            new: item.new ?? 0,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      })
      .finally(() => setIsLoading(false));
  }, [period]);

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
              <select
                title="time"
                className="text-sm border rounded px-2 py-1"
                value={period}
                onChange={e => setPeriod(e.target.value as any)}
              >
                <option value="year">Yearly</option>
                <option value="month">Monthly</option>
                <option value="week">Weekly</option>
                <option value="today">Daily</option>
              </select>
            </div>
          </div>
          <div className="h-[200px] mt-4">
            <OrderAnalyticsChart data={chartData} isLoading={isLoading} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <OrderSummaryChart data={orderSummaryData} isLoading={isLoading} />
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

function OrderAnalyticsChart({ data, isLoading }) {
  const hasData = data.some(d => d.bulk > 0 || d.single > 0);

  if (!isLoading && !hasData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data for this period.
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        bulk: {
          label: "Bulk Quantity",
          color: "hsl(346, 84%, 61%)",
        },
        single: {
          label: "Single Quantity",
          color: "hsl(43, 96%, 58%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="bulk"
            stroke="hsl(346, 84%, 61%)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="single"
            stroke="hsl(43, 96%, 58%)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function OrderSummaryChart({ data, isLoading }) {
  const hasData = data.some(d => d.repeated > 0 || d.new > 0);
  if (!isLoading && !hasData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data for this period.
      </div>
    );
  }
  return (
    <ChartContainer
      config={{
        repeated: {
          label: "Repeated Customers",
          color: "hsl(43, 96%, 58%)",
        },
        new: {
          label: "New Customers",
          color: "hsl(346, 84%, 61%)",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="repeated"
            stroke="hsl(43, 96%, 58%)"
            fill="hsl(43, 96%, 58%)"
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="new"
            stroke="hsl(346, 84%, 61%)"
            fill="hsl(346, 84%, 61%)"
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
