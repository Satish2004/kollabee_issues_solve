"use client"
import { Card } from "@/components/ui/card"
import { ArrowRight, ChevronDown, TrendingDown, TrendingUp, Users } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import MetricCard from "@/components/admin-dashboard/metric-card"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminApi } from "@/lib/api"
import TopBuyersTable from "@/components/admin-dashboard/top-buyers-table"

export default function Dashboard() {

    const [selectedStatTime, setSelectedStatTime] = useState<"today" | "week" | "month" | "year">("today")
    const [buyerMetrics, setBuyerMetrics] = useState<any>(null)
    const [supplierMetrics, setSupplierMetrics] = useState<any>(null)
    const [timePeriodMetrics, setTimePeriodMetrics] = useState<any>(null)
    const [monthlyOnboarding, setMonthlyOnboarding] = useState<any>(null)
    const [productPerformance, setProductPerformance] = useState<any>(null)

    useEffect(() => {
        const fetchBuyerMetrics = async () => {
            const metricsRes = await AdminApi.getBuyerMetrics()
            setBuyerMetrics(metricsRes?.metricResponse)
        }

        const fetchMonthlyOnboarding = async () => {
            const onboardingRes = await AdminApi.getMonthlyOnboarding()
            setMonthlyOnboarding(onboardingRes)
        }

        const fetchProductPerformance = async () => {
            const performanceRes = await AdminApi.getProductPerformance()
            setProductPerformance(performanceRes)
        }

        const fetchSupplierMetrics = async () => {
            const metricsRes = await AdminApi.getSupplierMetrics()
            setSupplierMetrics(metricsRes)
        }

        fetchMonthlyOnboarding()
        fetchBuyerMetrics()
        fetchProductPerformance()
        fetchSupplierMetrics()
    }, [])

    useEffect(() => {
        const fetchTimePeriodMetrics = async (period: "today" | "week" | "month" | "year") => {
            const metricsRes = await AdminApi.getTimePeriodMetrics(period)
            setTimePeriodMetrics(metricsRes)
        }
        fetchTimePeriodMetrics(selectedStatTime)
    }, [selectedStatTime])

    console.log(timePeriodMetrics)
    console.log(monthlyOnboarding)
    console.log(productPerformance)

  // Mock data for the chart
  const chartData2 = [
    { name: "Jan", buyers: 8, suppliers: 5 },
    { name: "Feb", buyers: 6, suppliers: 12 },
    { name: "Mar", buyers: 7, suppliers: 10, tooltip: 400 },
    { name: "Apr", buyers: 12, suppliers: 9 },
    { name: "May", buyers: 16, suppliers: 10 },
    { name: "Jun", buyers: 18, suppliers: 15 },
    { name: "Jul", buyers: 19, suppliers: 20 },
  ]

  // Sample data for trending products
  const trendingProducts = [
    { name: "Lux", progress: 85 },
    { name: "Santoor", progress: 70 },
    { name: "Lifeboy", progress: 40 },
    { name: "Jay", progress: 35 },
    { name: "Boro+", progress: 65 },
    { name: "Gold", progress: 55 },
    { name: "Diamond", progress: 45 },
  ]

  const topSellingProducts = [
    { name: "ASOS Ridley High Waist", price: 79.49, quantity: 82, amount: 6518.18 },
    { name: "Marco Lightweight Shirt", price: 128.5, quantity: 37, amount: 4754.5 },
    { name: "Half Sleeve Shirt", price: 39.99, quantity: 64, amount: 2559.36 },
    { name: "Lightweight Jacket", price: 20.0, quantity: 184, amount: 3680.0 },
    { name: "Marco Shoes", price: 79.49, quantity: 64, amount: 1965.81 },
  ]

  // Sample data for low seller pie chart
  const lowSellerData = [
    { name: "Other", value: 38.6, color: "#000000" },
    { name: "Total Salt", value: 25, color: "#8884d8", amount: 300.56 },
    { name: "Lays", value: 15, color: "#82ca9d", amount: 135.18 },
    { name: "Pops", value: 15, color: "#8dd1e1", amount: 154.02 },
    { name: "Crops", value: 6.4, color: "#a4de6c", amount: 48.96 },
  ]



  return (
    <div>
        <div className="space-y-6 mx-auto">
        {/* Metrics Cards */}
        <div className="bg-white rounded-lg p-4">
        <h1 className="font-semibold mb-2 text-lg">Buyers Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {/* New Joined Buyers */}
        <MetricCard title="NEW JOINED BUYERS" value={buyerMetrics?.NEW_JOINED_BUYERS?.current} percentage={buyerMetrics?.NEW_JOINED_BUYERS?.percentage} change={buyerMetrics?.NEW_JOINED_BUYERS?.percentageChange}/>
        {/* Buyers Bought Worth */}
        <MetricCard title="BUYERS BOUGHT WORTH" value={buyerMetrics?.BUYERS_BOUGHT?.current} percentage={buyerMetrics?.BUYERS_BOUGHT?.percentage} change={buyerMetrics?.BUYERS_BOUGHT?.percentageChange}/>
        {/* Total Buyers */}
        <MetricCard title="TOTAL BUYERS" value={buyerMetrics?.TOTAL_BUYERS?.current} percentage={buyerMetrics?.TOTAL_BUYERS?.percentage} change={buyerMetrics?.TOTAL_BUYERS?.percentageChange}/>
        {/* In-Active Buyers */}
        <MetricCard title="INACTIVE BUYERS" value={buyerMetrics?.INACTIVE_BUYERS?.current} percentage={buyerMetrics?.INACTIVE_BUYERS?.percentage} change={buyerMetrics?.INACTIVE_BUYERS?.percentageChange}/>
      </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <h1 className="font-semibold mb-2 text-lg">Supplier Metrics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 ">
        {/* New Joined Buyers */}
        <MetricCard title="NEW JOINED SUPPLIERS" value={supplierMetrics?.NEW_JOINED_SUPPLIERS?.current} percentage={supplierMetrics?.NEW_JOINED_SUPPLIERS?.percentage} change={supplierMetrics?.NEW_JOINED_SUPPLIERS?.percentageChange}/>
        {/* Buyers Bought Worth */}
        <MetricCard title="SUPPLIERS SOLD WORTH" value={supplierMetrics?.SUPPLIERS_SOLD_WORTH?.current} percentage={supplierMetrics?.SUPPLIERS_SOLD_WORTH?.percentage} change={supplierMetrics?.SUPPLIERS_SOLD_WORTH?.percentageChange}/>
        {/* Total Buyers */}
        <MetricCard title="TOTAL PRODUCTS SOLD" value={supplierMetrics?.TOTAL_PRODUCTS_SOLD?.current} percentage={supplierMetrics?.TOTAL_PRODUCTS_SOLD?.percentage} change={supplierMetrics?.TOTAL_PRODUCTS_SOLD?.percentageChange}/>
        {/* In-Active Buyers */}
        <MetricCard title="INACTIVE SUPPLIERS" value={supplierMetrics?.INACTIVE_SUPPLIERS?.current} percentage={supplierMetrics?.INACTIVE_SUPPLIERS?.percentage} change={supplierMetrics?.INACTIVE_SUPPLIERS?.percentageChange}/>
      </div>
      </div>


    
      {/* Stats Cards */}
      <div className="px-6 py-4 bg-white rounded-lg">
        <div className="mb-2">
        <Select
                  value={selectedStatTime}
                  onValueChange={(value) => setSelectedStatTime(value)}
                >
                  <SelectTrigger className="w-fit space-x-2 font-semibold border-none">
                    <SelectValue placeholder={selectedStatTime} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-none ">
                    <SelectItem
                      className="cursor-pointer bg-gray-100"
                      value="today"
                    >
                      Today
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer bg-gray-100"
                      value="week"
                    >
                      Last 7 days
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer bg-gray-100"
                      value="month"
                    >
                      Last 30 days
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer bg-gray-100"
                      value="year"
                    >
                      This Year
                    </SelectItem>
                  </SelectContent>
                </Select>
        </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-4">
        <StatCard title="Requests" value={timePeriodMetrics?.requests?.current} change={timePeriodMetrics?.requests?.percentageChange} trend={timePeriodMetrics?.requests?.percentageChange > 0 ? "up" : "down"} bgColor="bg-slate-100" />
        <StatCard title="Messages" value={timePeriodMetrics?.messages?.current} bgColor="bg-sky-100" />
        <StatCard title="Orders" value={timePeriodMetrics?.orders?.current} change={timePeriodMetrics?.orders?.percentageChange} trend={timePeriodMetrics?.orders?.percentageChange > 0 ? "up" : "down"} bgColor="bg-sky-100" />
        <StatCard title="Certificates uploaded" value={timePeriodMetrics?.certificatesUploaded?.current} bgColor="bg-sky-100" />
      </div>
      </div>

      {/* Charts and Trending Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* User Onboarded Chart */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">User Onboarded</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyOnboarding}>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => (value === 0 ? "0" : `${value}M`)}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="buyers"
                  stroke="#e91e63"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#e91e63" }}
                />
                <Line
                  type="monotone"
                  dataKey="suppliers"
                  stroke="#ffc107"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#ffc107" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-end mt-2 text-xs">
            <div className="flex items-center mr-4">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
              <span>Buyers</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
              <span>Suppliers</span>
            </div>
          </div>
        </div>

        {/* Trending Products */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-6">Trending Products</h3>
          <div className="space-y-4">
            {trendingProducts.map((product) => (
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Top Selling Products */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">Top Selling Products In Marketplace</h3>
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
                {topSellingProducts.map((product, index) => (
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
        </div>

        {/* Low Seller */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">Low seller</h3>
          <div className="flex items-center justify-between">
            <div className="w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lowSellerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {lowSellerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-medium">
                    {lowSellerData[0].value}%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {lowSellerData.slice(1).map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.color }}></span>
                  <span className="text-sm mr-2">{item.name}</span>
                  <span className="text-sm ml-auto">${item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <TopBuyersTable />
      </div>
    </div>
    </div>
  )
}



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
  