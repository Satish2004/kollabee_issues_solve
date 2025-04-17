"use client"
import { Card } from "@/components/ui/card"
import { ArrowRight, Users } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  // Mock data for the chart
  const chartData = [
    { month: "Jan", buyers: 8000000 },
    { month: "Feb", buyers: 16000000 },
    { month: "Mar", buyers: 18000000 },
    { month: "Apr", buyers: 17000000 },
    { month: "May", buyers: 11000000 },
    { month: "Jun", buyers: 14000000 },
    { month: "Jul", buyers: 22000000 },
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Joined Buyers */}
        <Card className="p-5 relative">
          <div className="absolute top-5 right-5">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase">NEW JOINED BUYERS</p>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">23,000</h2>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">10.3%</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-600 font-medium">+$2,123</span>
              <span className="mx-1">from last month</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </div>
          </div>
        </Card>

        {/* Buyers Bought Worth */}
        <Card className="p-5 relative">
          <div className="absolute top-5 right-5">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase">BUYERS BOUGHT WORTH</p>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">$23,000</h2>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">3.4%</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-600 font-medium">+$4,123</span>
              <span className="mx-1">from last month</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </div>
          </div>
        </Card>

        {/* Total Buyers */}
        <Card className="p-5 relative">
          <div className="absolute top-5 right-5">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase">TOTAL BUYERS</p>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">56,000</h2>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">10.3%</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-green-600 font-medium">+223</span>
              <span className="mx-1">from last month</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </div>
          </div>
        </Card>

        {/* In-Active Buyers */}
        <Card className="p-5 relative">
          <div className="absolute top-5 right-5">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase">IN-ACTIVE BUYERS</p>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">46,000</h2>
              <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">10.3%</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span className="text-red-600 font-medium">-223K</span>
              <span className="mx-1">from last month</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="text-base font-medium">Buyers Onboarded</h3>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  if (value === 0) return "0"
                  if (value === 10000000) return "10M"
                  if (value === 20000000) return "20M"
                  if (value === 30000000) return "30M"
                  return ""
                }}
                domain={[0, 30000000]}
                ticks={[0, 10000000, 20000000, 30000000]}
              />
              <Tooltip
                formatter={(value) => [`${(value / 1000000).toFixed(1)}M`, "Buyers"]}
                labelFormatter={(label) => label}
                contentStyle={{
                  backgroundColor: "#333",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px",
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="buyers"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 8,
                  fill: "#F59E0B",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
