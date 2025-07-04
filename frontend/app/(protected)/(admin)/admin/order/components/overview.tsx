"use client";

import {
  ArrowUp,
  ArrowDown,
  Package,
  RefreshCw,
  TrendingDown,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { AdminApi } from "@/lib/api";
import MetricCard from "@/components/admin-dashboard/metric-card";

export default function Overview() {
  const [orderMetrics, setOrderMetrics] = useState<any>(null)

  useEffect(() => {
    const fetchOrderMetrics = async () => {
      const metricsRes = await AdminApi.getOrderMetrics()
      setOrderMetrics(metricsRes)
    }
    fetchOrderMetrics()
  }, [])


  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Orders Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Orders" value={orderMetrics?.totalOrders?.current} percentage={orderMetrics?.totalOrders?.percentageChange} icon={<Package className="h-4 w-4" />} iconBg="bg-emerald-100" />
        <MetricCard title="Orders Worth" value={orderMetrics?.ordersWorth?.current} percentage={orderMetrics?.ordersWorth?.percentageChange} icon={<TrendingDown className="h-4 w-4" />} iconBg="bg-rose-100" />
        <MetricCard title="Returned Products" value={"0"} percentage={orderMetrics?.ordersWorth?.percentageChange} icon={<TrendingDown className="h-4 w-4" />} iconBg="bg-rose-100" />
        <MetricCard title="Packed Orders" value={orderMetrics?.ordersPacked?.current} percentage={orderMetrics?.ordersPacked?.percentageChange} icon={<ArrowUp className="h-4 w-4" />} iconBg="bg-emerald-100" />
        <MetricCard title="Average Response" value={orderMetrics?.averageResponse?.current} percentage={orderMetrics?.averageResponse?.percentageChange} icon={<Clock className="h-4 w-4" />} iconBg="bg-blue-100" />
      </div>

      <div className="pt-4">
        <h2 className="text-lg font-medium mb-4">Order Analytics</h2>
        <OrderOverview />
      </div>
    </div>
  );
}

function OrderOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <BulkOrder />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Customers"
          value="3,781"
          change="+11.01%"
          trend="up"
        />
        <StatCard
          title="Revenue"
          value="$695"
          change="+15.03%"
          trend="up"
        />
        <StatCard
          title="Orders"
          value="1,219"
          change="-0.03%"
          trend="down"
        />
        <StatCard title="Growth" value="30.1%" change="+6.08%" trend="up" />
      </div>
    </div>
  );
}

export function BulkOrder() {
  return (
    <Card>
      <CardContent className="p-6">
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
  );
}


function StatCard({ title, value, change, trend }) {
  return (
    <Card className="border-0 shadow-sm bg-pink-100">
      <CardContent className="p-4">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center gap-1 text-sm font-medium mt-1">
            {trend === "up" ? (
              <ArrowUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <ArrowDown className="h-3 w-3 text-rose-500" />
            )}
            <span
              className={trend === "up" ? "text-emerald-500" : "text-rose-500"}
            >
              {change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
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
