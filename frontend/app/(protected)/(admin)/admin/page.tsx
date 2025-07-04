"use client"
import { Card } from "@/components/ui/card"
import { ArrowRight, ChevronDown, TrendingDown, TrendingUp, Users } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import MetricCard from "@/components/admin-dashboard/metric-card"
import { useEffect, useState } from "react"
import { AdminApi } from "@/lib/api"
import TopBuyersTable from "@/components/admin-dashboard/top-buyers-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function Dashboard() {
  const [selectedStatTime, setSelectedStatTime] = useState<"today" | "week" | "month" | "year">("today")
  type SupplierMetrics = {
    NEW_JOINED_SUPPLIERS?: { current: number; percentageChange?: number };
    SUPPLIERS_SOLD_WORTH?: { current: number; percentageChange?: number };
    TOTAL_PRODUCTS_SOLD?: { current: number; percentageChange?: number };
    INACTIVE_SUPPLIERS?: { current: number; percentageChange?: number };
    [key: string]: any;
  };

  type MetricsType = {
    buyer?: any;
    supplier?: SupplierMetrics | null;
    timePeriod?: any;
    onboarding?: any;
    products?: any;
    trending?: any;
    platformMetrics?: any;
  };

  const [metrics, setMetrics] = useState<MetricsType>({
    buyer: null,
    supplier: null,
    timePeriod: null,
    onboarding: null,
    products: null,
    trending: null,
    platformMetrics: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timePeriodLoading, setTimePeriodLoading] = useState(false)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [
          buyerRes,
          supplierRes,
          onboardingRes,
          productsRes,
          trendingRes,
          platformMetricsRes
        ] = await Promise.all([
          AdminApi.getBuyerMetrics(),
          AdminApi.getSupplierMetrics(),
          AdminApi.getMonthlyOnboarding(),
          AdminApi.getProductPerformance(),
          AdminApi.getTrendingProducts(),
          AdminApi.getPlatformMetrics()
        ])

        setMetrics({
          buyer: buyerRes.data || buyerRes,
          supplier: supplierRes.data || supplierRes,
          timePeriod: null,
          onboarding: onboardingRes.data || onboardingRes,
          products: productsRes.data || productsRes,
          trending: trendingRes.data || trendingRes,
          platformMetrics: platformMetricsRes.data || platformMetricsRes
        })
      } catch (err: any) {
        console.error("Failed to fetch metrics:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch time period data whenever selectedStatTime changes
  useEffect(() => {
    const fetchTimeMetrics = async () => {
      setTimePeriodLoading(true)
      try {
        const res = await AdminApi.getTimePeriodMetrics(selectedStatTime)
        setMetrics(prev => ({
          ...prev,
          timePeriod: res.data || res
        }))
      } catch (err) {
        console.error("Failed to fetch time metrics:", err)
      } finally {
        setTimePeriodLoading(false)
      }
    }

    fetchTimeMetrics()
  }, [selectedStatTime])

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 mx-auto">
      {/* Buyer Metrics */}
      <div className="bg-white rounded-lg p-4">
        <h1 className="font-semibold mb-2 text-lg">Buyers Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="NEW JOINED BUYERS"
            value={metrics.buyer?.metricResponse.NEW_JOINED_BUYERS?.current}
            change={metrics.buyer?.metricResponse.NEW_JOINED_BUYERS?.percentage}
          />
          <MetricCard
            title="BUYERS BOUGHT WORTH"
            value={metrics.buyer?.metricResponse.BUYERS_BOUGHT?.current}
            change={metrics.buyer?.metricResponse.BUYERS_BOUGHT?.percentage}
          />
          <MetricCard
            title="TOTAL BUYERS"
            value={metrics.buyer?.metricResponse.TOTAL_BUYERS?.current}
            change={metrics.buyer?.metricResponse.TOTAL_BUYERS?.percentage}
          />
          <MetricCard
            title="INACTIVE BUYERS"
            value={metrics.buyer?.metricResponse.INACTIVE_BUYERS?.current}
            change={metrics.buyer?.metricResponse.INACTIVE_BUYERS?.percentage}
          />
        </div>
      </div>

      {/* Supplier Metrics */}
      <div className="bg-white rounded-lg p-4">
        <h1 className="font-semibold mb-2 text-lg">Supplier Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="NEW JOINED SUPPLIERS"
            value={metrics.supplier?.NEW_JOINED_SUPPLIERS?.current}
            change={metrics.supplier?.NEW_JOINED_SUPPLIERS?.percentageChange}
          />
          <MetricCard
            title="SUPPLIERS SOLD WORTH"
            value={metrics.supplier?.SUPPLIERS_SOLD_WORTH?.current}
            change={metrics.supplier?.SUPPLIERS_SOLD_WORTH?.percentageChange}
          />
          <MetricCard
            title="TOTAL PRODUCTS SOLD"
            value={metrics.supplier?.TOTAL_PRODUCTS_SOLD?.current}
            change={metrics.supplier?.TOTAL_PRODUCTS_SOLD?.percentageChange}
          />
          <MetricCard
            title="INACTIVE SUPPLIERS"
            value={metrics.supplier?.INACTIVE_SUPPLIERS?.current}
            change={metrics.supplier?.INACTIVE_SUPPLIERS?.percentageChange}
          />
        </div>
      </div>

      {/* Time Period Stats */}
      <div className="px-6 py-4 bg-white rounded-lg">
        <div className="mb-2">
          <Select
            value={selectedStatTime}
            onValueChange={(value: any) => setSelectedStatTime(value)}
          >
            <SelectTrigger className="w-fit space-x-2 font-semibold border-none">
              <SelectValue placeholder={selectedStatTime} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {["today", "week", "month", "year"].map(period => (
                <SelectItem key={period} value={period} className="capitalize">
                  {period === "today" ? "Today" :
                    period === "week" ? "Last 7 days" :
                      period === "month" ? "Last 30 days" : "This Year"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {timePeriodLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-4">
            <StatCard
              title="Requests"
              value={metrics.timePeriod?.requests?.current}
              change={metrics.timePeriod?.requests?.percentageChange}
              bgColor="bg-slate-100"
            />
            <StatCard
              title="Messages"
              value={metrics.timePeriod?.messages?.current}
              change={metrics.timePeriod?.messages?.percentageChange}
              bgColor="bg-sky-100"
            />
            <StatCard
              title="Orders"
              value={metrics.timePeriod?.orders?.current}
              change={metrics.timePeriod?.orders?.percentageChange}
              bgColor="bg-sky-100"
            />
            <StatCard
              title="Certificates"
              value={metrics.timePeriod?.certificates?.current}
              change={metrics.timePeriod?.certificates?.percentageChange}
              bgColor="bg-sky-100"
            />
          </div>
        )}
      </div>

      {/* Rest of your components... */}
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Onboarding Chart */}
        <ChartCard title="User Onboarded">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics.onboarding}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="buyers"
                stroke="#e91e63"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="suppliers"
                stroke="#ffc107"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <ChartLegend items={[
            { label: "Buyers", color: "#e91e63" },
            { label: "Suppliers", color: "#ffc107" }
          ]} />
        </ChartCard>

        {/* Trending Products */}
        <ChartCard title="Trending Products">
          <div className="space-y-4 mt-4">
            {metrics.trending?.map((product: any, index: number) => (
              <TrendingProductItem
                key={index}
                name={product.name}
                progress={product.progress}
              />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Product Performance Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Top Selling Products */}
        <ChartCard title="Top Selling Products">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-2 font-normal">Name</th>
                  <th className="pb-2 font-normal">Price</th>
                  <th className="pb-2 font-normal">Quantity</th>
                  <th className="pb-2 font-normal">Amount</th>
                </tr>
              </thead>
              <tbody>
                {metrics.products?.topSelling?.map((product: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 text-sm">{product.name}</td>
                    <td className="py-3 text-sm">${product.price.toFixed(2)}</td>
                    <td className="py-3 text-sm">{product.quantity}</td>
                    <td className="py-3 text-sm">${product.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Low Sellers */}
        <ChartCard title="Low Sellers">
          <div className="flex items-center justify-between">
            <div className="w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.products?.lowSellers}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {metrics.products?.lowSellers?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {metrics.products?.lowSellers?.map((item: any, index: number) => (
                <div key={index} className="flex items-center">
                  <span
                    className="w-3 h-3 rounded-sm mr-2"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-sm mr-2">{item.name}</span>
                  <span className="text-sm ml-auto">${item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Top Buyers Table */}
      <div>
        <TopBuyersTable />
      </div>
    </div>
  )
}

// Helper Components
function StatCard({ title, value, change, bgColor }: any) {
  const trend = change > 0 ? "up" : "down"
  const trendColor = change > 0 ? "text-green-600" : "text-red-600"

  return (
    <div className={`${bgColor} p-6 rounded-lg`}>
      <h3 className="font-bold text-gray-700 mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">{value ?? 0}</span>
        {change !== undefined && (
          <div className="flex items-center ml-2 text-xs">
            <span className={trendColor}>{change}</span>
            {trend === "up" ? <TrendingUp className="w-3 h-3 ml-0.5 text-green-600" /> : <TrendingDown className="w-3 h-3 ml-0.5 text-red-600" />}
          </div>
        )}
      </div>
    </div>
  )
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-base font-medium mb-4">{title}</h3>
      {children}
    </div>
  )
}

function ChartLegend({ items }: any) {
  return (
    <div className="flex justify-end mt-2 text-xs">
      {items.map((item: any, index: number) => (
        <div key={index} className="flex items-center ml-4">
          <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: item.color }}></span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function TrendingProductItem({ name, progress }: any) {
  return (
    <div className="flex items-center">
      <span className="w-20 text-sm">{name}</span>
      <div className="flex-1 ml-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full bg-black" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  )
}
