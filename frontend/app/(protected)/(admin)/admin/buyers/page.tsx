"use client"
import { Card } from "@/components/ui/card"
import { ArrowRight, Maximize2, Users } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import MetricCard from "@/components/admin-dashboard/metric-card"
import TopBuyersTable from "@/components/admin-dashboard/top-buyers-table"
import AllBuyersTable from "@/components/admin-dashboard/all-buyers-table"

import { useState } from "react"


export default function Dashboard() {
  // Mock data for the chart
  const chartData = [
    { month: "Mar", buyers: 2 },
  ]


  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Joined Buyers */}
        <MetricCard title="NEW JOINED BUYERS" value="23,000" percentage="10.3%" change="+2,123" />
        {/* Buyers Bought Worth */}
        <MetricCard title="NEW JOINED BUYERS" value="23,000" percentage="10.3%" change="+2,123" />
        {/* Total Buyers */}
        <MetricCard title="NEW JOINED BUYERS" value="23,000" percentage="10.3%" change="+2,123" />
        {/* In-Active Buyers */}
        <MetricCard title="NEW JOINED BUYERS" value="23,000" percentage="10.3%" change="+2,123" />
      </div>

      {/* Chart */}
      <Card className="p-5 bg-white">
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

      <TopBuyersTable />
    

      <AllBuyersTable />
    </div>
  )
}
