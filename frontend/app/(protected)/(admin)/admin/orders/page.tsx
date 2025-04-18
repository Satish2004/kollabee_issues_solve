"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import ActiveOrdersTable from "@/components/admin-dashboard/active-orders-list"

// Sample data - replace with your actual data
const chartData = [
  { month: "Jan", bulkQuantity: 20, singleQuantity: 35 },
  { month: "Feb", bulkQuantity: 30, singleQuantity: 32 },
  { month: "Mar", bulkQuantity: 40, singleQuantity: 48 },
  { month: "Apr", bulkQuantity: 45, singleQuantity: 65 },
  { month: "May", bulkQuantity: 40, singleQuantity: 60 },
  { month: "Jun", bulkQuantity: 42, singleQuantity: 55 },
  { month: "Jul", bulkQuantity: 65, singleQuantity: 50 },
]

// Highlighted data point
const highlightedData = {
  date: "15 Aug 2022",
  value: "$59,492.10",
  position: { x: 290, y: 180 }, // Approximate position for the highlight
}

// Metrics data
const metricsData = [
  {
    title: "Customers",
    value: "3,781",
    change: "+11.01%",
    isPositive: true,
    bgColor: "bg-red-50",
  },
  {
    title: "Orders",
    value: "1,219",
    change: "-0.03%",
    isPositive: false,
    bgColor: "bg-white",
  },
  {
    title: "Revenue",
    value: "$695",
    change: "+15.03%",
    isPositive: true,
    bgColor: "bg-white",
  },
  {
    title: "Growth",
    value: "30.1%",
    change: "+6.08%",
    isPositive: true,
    bgColor: "bg-red-50",
  },
]

export default function OrderAnalytics() {
  const [timeframe, setTimeframe] = useState("monthly")

  return (
    <div className="w-full mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Order Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-3 border border-gray-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-semibold">Order Analytics</CardTitle>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-700">Bulk Quantity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-700">Single Quantity</span>
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px] h-8 text-sm border-gray-200">
                  <SelectValue>{timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 relative">
            <div className="h-[300px] w-full">

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="highlightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E2E8F0" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#E2E8F0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 12 }}
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      dx={-10}
                    />
                    <Tooltip cursor={false} />
                    <Line
                      type="monotone"
                      dataKey="bulkQuantity"
                      stroke="var(--color-bulkQuantity)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "var(--color-bulkQuantity)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="singleQuantity"
                      stroke="var(--color-singleQuantity)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, fill: "var(--color-singleQuantity)" }}
                    />
                    {/* Highlight area for March */}
                    <rect x={290} y={0} width={40} height={300} fill="url(#highlightGradient)" opacity={0.5} />
                  </LineChart>
                </ResponsiveContainer>

              {/* Highlighted data point */}
              <div
                className="absolute text-xs text-gray-700 font-medium"
                style={{
                  top: highlightedData.position.y - 40,
                  left: highlightedData.position.x - 20,
                }}
              >
                <div>{highlightedData.date}</div>
                <div className="font-bold text-gray-900">{highlightedData.value}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-2 w-full">
        {metricsData.map((metric, index) => (
          <Card key={index} className={`${metric.bgColor} border border-gray-200`}>
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">{metric.title}</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                <div className={`flex items-center text-sm ${metric.isPositive ? "text-green-600" : "text-red-600"}`}>
                  {metric.isPositive ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {metric.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      <ActiveOrdersTable />
    </div>
  )
}
