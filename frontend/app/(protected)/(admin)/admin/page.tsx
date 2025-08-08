"use client"
import { TrendingDown, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import MetricCard from "@/components/admin-dashboard/metric-card"
import { useEffect, useState } from "react"
import { AdminApi } from "@/lib/api"
import TopBuyersTable from "@/components/admin-dashboard/top-buyers-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SupplierMetrics = {
  NEW_JOINED_SUPPLIERS?: { current: number; percentageChange?: number }
  SUPPLIERS_SOLD_WORTH?: { current: number; percentageChange?: number }
  TOTAL_PRODUCTS_SOLD?: { current: number; percentageChange?: number }
  INACTIVE_SUPPLIERS?: { current: number; percentageChange?: number }
  [key: string]: any
}

type MetricsType = {
  buyer?: any
  supplier?: SupplierMetrics | null
  timePeriod?: any
  onboarding?: any
  products?: any
  trending?: any
  platformMetrics?: any
}

export default function Dashboard() {
  const [selectedStatTime, setSelectedStatTime] = useState<"today" | "week" | "month" | "year">("today")
  const [metrics, setMetrics] = useState<MetricsType>({
    buyer: null,
    supplier: null,
    timePeriod: null,
    onboarding: null,
    products: null,
    trending: null,
    platformMetrics: null,
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
        console.log("Fetching dashboard data...")

        const [buyerRes, supplierRes, onboardingRes, productsRes, trendingRes, platformMetricsRes] = await Promise.all([
          AdminApi.getBuyerMetrics().catch((err) => {
            console.error("Buyer metrics error:", err)
            return { data: null }
          }),
          AdminApi.getSupplierMetrics().catch((err) => {
            console.error("Supplier metrics error:", err)
            return { data: null }
          }),
          AdminApi.getMonthlyOnboarding().catch((err) => {
            console.error("Onboarding metrics error:", err)
            return { data: [] }
          }),
          AdminApi.getProductPerformance().catch((err) => {
            console.error("Product performance error:", err)
            return { data: { topSelling: [], lowSellers: [] } }
          }),
          AdminApi.getTrendingProducts().catch((err) => {
            console.error("Trending products error:", err)
            return { data: [] }
          }),
          AdminApi.getPlatformMetrics().catch((err) => {
            console.error("Platform metrics error:", err)
            return { data: null }
          }),
        ])

        console.log("API Responses:", {
          buyer: buyerRes,
          supplier: supplierRes,
          onboarding: onboardingRes,
          products: productsRes,
          trending: trendingRes,
          platform: platformMetricsRes,
        })

        setMetrics({
          buyer: buyerRes?.data || buyerRes,
          supplier: supplierRes?.data || supplierRes,
          timePeriod: null,
          onboarding: onboardingRes?.data || onboardingRes || [],
          products: productsRes?.data || productsRes || { topSelling: [], lowSellers: [] },
          trending: trendingRes?.data || trendingRes || [],
          platformMetrics: platformMetricsRes?.data || platformMetricsRes,
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
        console.log("Fetching time period metrics for:", selectedStatTime)
        const res = await AdminApi.getTimePeriodMetrics(selectedStatTime)
        console.log("Time period response:", res)

        setMetrics((prev) => ({
          ...prev,
          timePeriod: res?.data || res,
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

  // Safe data access with fallbacks
  const buyerMetrics = metrics.buyer?.metricResponse || {}
  const supplierMetrics = metrics.supplier || {}
  const onboardingData = Array.isArray(metrics.onboarding) ? metrics.onboarding : []
  const productsData = metrics.products || { topSelling: [], lowSellers: [] }
  const trendingData = Array.isArray(metrics.trending) ? metrics.trending : []
  const timePeriodData = metrics.timePeriod || {}

  return (
    <div className="space-y-6 mx-auto">
      {/* Debug Information - Remove in production */}
      <div className="bg-gray-100 p-4 rounded-lg text-xs">
        <details>
          <summary className="cursor-pointer font-medium">Debug Info (Click to expand)</summary>
          <pre className="mt-2 overflow-auto max-h-40">
            {JSON.stringify({
              buyerMetrics: Object.keys(buyerMetrics),
              supplierMetrics: Object.keys(supplierMetrics),
              onboardingCount: onboardingData.length,
              productsData: {
                topSelling: productsData.topSellingProducts,
                lowSellers: productsData.lowSellingProducts,
              },
              trendingCount: trendingData.length,
              timePeriodKeys: Object.keys(timePeriodData),
              // Include raw API data if needed
              // fullDashboardData: data, // optional: include the full API response you shared
            }, null, 2)}
          </pre>
        </details>
      </div>

      {/* Buyer Metrics */}
      <div className="bg-white rounded-lg p-4">
        <h1 className="font-semibold mb-2 text-lg">Buyers Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="NEW JOINED BUYERS"
            value={buyerMetrics.NEW_JOINED_BUYERS?.current || 0}
            change={buyerMetrics.NEW_JOINED_BUYERS?.percentage || 0}
          />
          <MetricCard
            title="BUYERS BOUGHT WORTH"
            value={buyerMetrics.BUYERS_BOUGHT?.current || 0}
            change={buyerMetrics.BUYERS_BOUGHT?.percentage || 0}
          />
          <MetricCard
            title="TOTAL BUYERS"
            value={buyerMetrics.TOTAL_BUYERS?.current || 0}
            change={buyerMetrics.TOTAL_BUYERS?.percentage || 0}
          />
          <MetricCard
            title="INACTIVE BUYERS"
            value={buyerMetrics.INACTIVE_BUYERS?.current || 0}
            change={buyerMetrics.INACTIVE_BUYERS?.percentage || 0}
          />
        </div>
      </div>

      {/* Supplier Metrics */}
      <div className="bg-white rounded-lg p-4">
        <h1 className="font-semibold mb-2 text-lg">Supplier Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="NEW JOINED SUPPLIERS"
            value={supplierMetrics.NEW_JOINED_SUPPLIERS?.current || 0}
            change={supplierMetrics.NEW_JOINED_SUPPLIERS?.percentageChange || 0}
          />
          <MetricCard
            title="SUPPLIERS SOLD WORTH"
            value={supplierMetrics.SUPPLIERS_SOLD_WORTH?.current || 0}
            change={supplierMetrics.SUPPLIERS_SOLD_WORTH?.percentageChange || 0}
          />
          <MetricCard
            title="TOTAL PRODUCTS SOLD"
            value={supplierMetrics.TOTAL_PRODUCTS_SOLD?.current || 0}
            change={supplierMetrics.TOTAL_PRODUCTS_SOLD?.percentageChange || 0}
          />
          <MetricCard
            title="INACTIVE SUPPLIERS"
            value={supplierMetrics.INACTIVE_SUPPLIERS?.current || 0}
            change={supplierMetrics.INACTIVE_SUPPLIERS?.percentageChange || 0}
          />
        </div>
      </div>

      {/* Time Period Stats */}
      <div className="px-6 py-4 bg-white rounded-lg">
        <div className="mb-2">
          <Select value={selectedStatTime} onValueChange={(value: any) => setSelectedStatTime(value)}>
            <SelectTrigger className="w-fit space-x-2 font-semibold border-none">
              <SelectValue placeholder={selectedStatTime} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {["today", "week", "month", "year"].map((period) => (
                <SelectItem key={period} value={period} className="capitalize">
                  {period === "today"
                    ? "Today"
                    : period === "week"
                      ? "Last 7 days"
                      : period === "month"
                        ? "Last 30 days"
                        : "This Year"}
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
              value={timePeriodData.requests?.current || 0}
              change={timePeriodData.requests?.percentageChange || 0}
              bgColor="bg-slate-100"
            />
            <StatCard
              title="Messages"
              value={timePeriodData.messages?.current || 0}
              change={timePeriodData.messages?.percentageChange || 0}
              bgColor="bg-sky-100"
            />
            <StatCard
              title="Orders"
              value={timePeriodData.orders?.current || 0}
              change={timePeriodData.orders?.percentageChange || 0}
              bgColor="bg-sky-100"
            />
            <StatCard
              title="Certificates"
              value={timePeriodData.certificates?.current || 0}
              change={timePeriodData.certificates?.percentageChange || 0}
              bgColor="bg-sky-100"
            />
          </div>
        )}
      </div>
      {
        JSON.stringify(productsData.topSelling)
      }
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Onboarding Chart */}
        <ChartCard title="User Onboarded">
          {onboardingData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={onboardingData}>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="buyers" stroke="#e91e63" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="suppliers" stroke="#ffc107" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <ChartLegend
                items={[
                  { label: "Buyers", color: "#e91e63" },
                  { label: "Suppliers", color: "#ffc107" },
                ]}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">No onboarding data available</div>
          )}
        </ChartCard>

        {/* Trending Products */}
        <ChartCard title="Trending Products">
          {trendingData.length > 0 ? (
            <div className="space-y-4 mt-4">
              {trendingData.map((product: any, index: number) => (
                <TrendingProductItem
                  key={index}
                  name={product.name || `Product ${index + 1}`}
                  progress={product.progress || 0}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No trending products data available
            </div>
          )}
        </ChartCard>
      </div>

      {/* Product Performance Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Top Selling Products */}
        <ChartCard title="Top Selling Products">
          {productsData.topSellingProducts && productsData.topSellingProducts.length > 0 ? (
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
                  {productsData.topSellingProducts.map((product: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 text-sm">{product.name || `Product ${index + 1}`}</td>
                      <td className="py-3 text-sm">${(product.price || 0).toFixed(2)}</td>
                      <td className="py-3 text-sm">{product.quantity || 0}</td>
                      <td className="py-3 text-sm">${(product.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              No top selling products data available
            </div>
          )}
        </ChartCard>
     
        {/* Low Sellers */}
        <ChartCard title="Low Sellers">
          {productsData.lowSellingProducts && productsData.lowSellingProducts.length > 0 ? (
            <div className="flex items-center justify-between">
              <div className="w-1/2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productsData.lowSellingProducts}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {productsData.lowSellingProducts.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {productsData.lowSellingProducts.map((item: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-sm mr-2"
                      style={{ backgroundColor: item.color || `hsl(${index * 45}, 70%, 60%)` }}
                    ></span>
                    <span className="text-sm mr-2">{item.name || `Product ${index + 1}`}</span>
                    <span className="text-sm ml-auto">${(item.amount || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No low selling products data available
            </div>
          )}
        </ChartCard>
      </div>

      <div>
        <TopBuyersTable />
      </div>
    </div>
  )
}

function StatCard({ title, value, change, bgColor }: any) {
  const numericChange = typeof change === "string" ? Number.parseFloat(change) : change || 0
  const trend = numericChange > 0 ? "up" : "down"
  const trendColor = numericChange > 0 ? "text-green-600" : "text-red-600"

  return (
    <div className={`${bgColor} p-6 rounded-lg`}>
      <h3 className="font-bold text-gray-700 mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">{value ?? 0}</span>
        {numericChange !== 0 && (
          <div className="flex items-center ml-2 text-xs">
            <span className={trendColor}>{Math.abs(numericChange)}%</span>
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3 ml-0.5 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 ml-0.5 text-red-600" />
            )}
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
  const safeProgress = Math.min(Math.max(progress || 0, 0), 100)

  return (
    <div className="flex items-center">
      <span className="w-20 text-sm truncate" title={name}>
        {name}
      </span>
      <div className="flex-1 ml-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-black transition-all duration-300"
            style={{ width: `${safeProgress}%` }}
          ></div>
        </div>
      </div>
      <span className="text-xs text-gray-500 ml-2">{safeProgress}%</span>
    </div>
  )
}
