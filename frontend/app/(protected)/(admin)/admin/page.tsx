// Dashboard.tsx
"use client"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { AdminApi } from "@/lib/api"
import MetricCard from "@/components/admin-dashboard/metric-card"
import TopBuyersTable from "@/components/admin-dashboard/top-buyers-table"

function StatCard({ title, value, change, trend, bgColor }) {
  return (
    <div className={`${bgColor} p-6 rounded-lg`}>
      <h3 className=" font-bold text-gray-700 mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">{value}</span>
        {change && (
          <div className="flex items-center ml-2 text-xs">
            <span className={trend === "up" ? "text-green-600" : "text-red-600"}>{change}</span>
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

export default function Dashboard() {
  const [selectedStatTime, setSelectedStatTime] = useState("today")
  const [buyerMetrics, setBuyerMetrics] = useState(null)
  const [supplierMetrics, setSupplierMetrics] = useState(null)
  const [timePeriodMetrics, setTimePeriodMetrics] = useState(null)
  const [monthlyOnboarding, setMonthlyOnboarding] = useState([])
  const [productPerformance, setProductPerformance] = useState(null)
  const [trendingProducts, setTrendingProducts] = useState([])

  useEffect(() => {
    AdminApi.getBuyerMetrics().then((res) => setBuyerMetrics(res.metricResponse))
    AdminApi.getSupplierMetrics().then((res) => setSupplierMetrics(res.metricResponse))
    AdminApi.getMonthlyOnboarding().then(setMonthlyOnboarding)
    AdminApi.getProductPerformance().then(setProductPerformance)
    AdminApi.getTrendingProducts().then(setTrendingProducts)
  }, [])

  useEffect(() => {
    AdminApi.getTimePeriodMetrics(selectedStatTime).then(setTimePeriodMetrics)
  }, [selectedStatTime])

  return (
    <div className="space-y-6 mx-auto">
      {/* Metrics Cards */}
      <div className="bg-white rounded-lg p-4">
        <h1 className="font-semibold mb-2 text-lg">Buyers Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="NEW JOINED BUYERS" value={buyerMetrics?.NEW_JOINED_BUYERS?.current} percentage={buyerMetrics?.NEW_JOINED_BUYERS?.percentage} change={buyerMetrics?.NEW_JOINED_BUYERS?.percentageChange} />
          <MetricCard title="BUYERS BOUGHT WORTH" value={buyerMetrics?.BUYERS_BOUGHT?.current} percentage={buyerMetrics?.BUYERS_BOUGHT?.percentage} change={buyerMetrics?.BUYERS_BOUGHT?.percentageChange} />
          <MetricCard title="TOTAL BUYERS" value={buyerMetrics?.TOTAL_BUYERS?.current} percentage={buyerMetrics?.TOTAL_BUYERS?.percentage} change={buyerMetrics?.TOTAL_BUYERS?.percentageChange} />
          <MetricCard title="INACTIVE BUYERS" value={buyerMetrics?.INACTIVE_BUYERS?.current} percentage={buyerMetrics?.INACTIVE_BUYERS?.percentage} change={buyerMetrics?.INACTIVE_BUYERS?.percentageChange} />
        </div>
      </div>

      {/* Supplier Metrics */}
      <div className="bg-white rounded-lg p-4">
        <h1 className="font-semibold mb-2 text-lg">Supplier Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="NEW JOINED SUPPLIERS" value={supplierMetrics?.NEW_JOINED_SUPPLIERS?.current} percentage={supplierMetrics?.NEW_JOINED_SUPPLIERS?.percentage} change={supplierMetrics?.NEW_JOINED_SUPPLIERS?.percentageChange} />
          <MetricCard title="SUPPLIERS SOLD WORTH" value={supplierMetrics?.SUPPLIERS_SOLD_WORTH?.current} percentage={supplierMetrics?.SUPPLIERS_SOLD_WORTH?.percentage} change={supplierMetrics?.SUPPLIERS_SOLD_WORTH?.percentageChange} />
          <MetricCard title="TOTAL PRODUCTS SOLD" value={supplierMetrics?.TOTAL_PRODUCTS_SOLD?.current} percentage={supplierMetrics?.TOTAL_PRODUCTS_SOLD?.percentage} change={supplierMetrics?.TOTAL_PRODUCTS_SOLD?.percentageChange} />
          <MetricCard title="INACTIVE SUPPLIERS" value={supplierMetrics?.INACTIVE_SUPPLIERS?.current} percentage={supplierMetrics?.INACTIVE_SUPPLIERS?.percentage} change={supplierMetrics?.INACTIVE_SUPPLIERS?.percentageChange} />
        </div>
      </div>

      {/* Time Period Metrics */}
      <div className="px-6 py-4 bg-white rounded-lg">
        <Select value={selectedStatTime} onValueChange={setSelectedStatTime}>
          <SelectTrigger className="w-fit font-semibold border-none">
            <SelectValue placeholder={selectedStatTime} />
          </SelectTrigger>
          <SelectContent className="bg-white border-none">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <StatCard title="Requests" value={timePeriodMetrics?.requests?.current} change={timePeriodMetrics?.requests?.percentageChange} trend={timePeriodMetrics?.requests?.percentageChange > 0 ? "up" : "down"} bgColor="bg-slate-100" />
          <StatCard title="Messages" value={timePeriodMetrics?.messages?.current} bgColor="bg-sky-100" />
          <StatCard title="Orders" value={timePeriodMetrics?.orders?.current} change={timePeriodMetrics?.orders?.percentageChange} trend={timePeriodMetrics?.orders?.percentageChange > 0 ? "up" : "down"} bgColor="bg-sky-100" />
          <StatCard title="Certificates uploaded" value={timePeriodMetrics?.certificatesUploaded?.current} bgColor="bg-sky-100" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">User Onboarded</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyOnboarding}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="buyers" stroke="#e91e63" />
                <Line type="monotone" dataKey="suppliers" stroke="#ffc107" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">Trending Products</h3>
          <div className="space-y-4">
            {trendingProducts?.map((product) => (
              <div key={product.name} className="flex items-center">
                <span className="w-20 text-sm">{product.name}</span>
                <div className="flex-1 ml-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-black" style={{ width: `${product.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top / Low Selling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">Top Selling Products</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {productPerformance?.topSellingProducts?.map((p, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">${p.price.toFixed(2)}</td>
                  <td className="py-2">{p.quantity}</td>
                  <td className="py-2">${p.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">Low Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productPerformance?.lowSellingProducts || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
              >
                {(productPerformance?.lowSellingProducts || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <TopBuyersTable />
    </div>
  )
}