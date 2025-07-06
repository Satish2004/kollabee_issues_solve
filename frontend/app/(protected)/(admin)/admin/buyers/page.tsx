"use client"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import MetricCard from "@/components/admin-dashboard/metric-card"
import TopBuyersTable from "@/components/admin-dashboard/top-buyers-table"
import AllBuyersTable from "@/components/admin-dashboard/all-buyers-table"
import { useEffect, useState } from "react"
import { AdminApi } from "@/lib/api"
import UserGeoChart from "@/components/admin-dashboard/supplier-geo-chart"

export default function Dashboard() {
  const [buyerMetrics, setBuyerMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchBuyerMetrics = async () => {
      const metricsRes = await AdminApi.getBuyerMetrics()
      setBuyerMetrics(metricsRes?.metricResponse)
    }

    const fetchMonthlyOnboarding = async () => {
      const monthlyOnboardingRes = await AdminApi.getMonthlyOnboarding('buyer')
      console.log("Monthly Onboarding Data:", monthlyOnboardingRes)

      // Ensure the response is in the form { type: 'buyer', data: [...] }
      const formattedData = monthlyOnboardingRes.data.map((item: any) => ({
        month: item.name,           // or item.month, depending on API response
        buyers: item.count          // or item.buyersOnboarded, depending on API
      }))

      setChartData(formattedData)
      setLoading(false)
    }

    fetchBuyerMetrics()
    fetchMonthlyOnboarding()
  }, [])

  return (
    <div className="space-y-6 mx-auto">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="NEW JOINED BUYERS"
          value={buyerMetrics?.NEW_JOINED_BUYERS?.current}
          percentage={buyerMetrics?.NEW_JOINED_BUYERS?.percentage}
          change={buyerMetrics?.NEW_JOINED_BUYERS?.percentageChange}
        />
        <MetricCard
          title="BUYERS BOUGHT WORTH"
          value={buyerMetrics?.BUYERS_BOUGHT?.current}
          percentage={buyerMetrics?.BUYERS_BOUGHT?.percentage}
          change={buyerMetrics?.BUYERS_BOUGHT?.percentageChange}
        />
        <MetricCard
          title="TOTAL BUYERS"
          value={buyerMetrics?.TOTAL_BUYERS?.current}
          percentage={buyerMetrics?.TOTAL_BUYERS?.percentage}
          change={buyerMetrics?.TOTAL_BUYERS?.percentageChange}
        />
        <MetricCard
          title="INACTIVE BUYERS"
          value={buyerMetrics?.INACTIVE_BUYERS?.current}
          percentage={buyerMetrics?.INACTIVE_BUYERS?.percentage}
          change={buyerMetrics?.INACTIVE_BUYERS?.percentageChange}
        />
      </div>

      {/* Buyers Onboarded Chart */}
      <Card className="p-5 bg-white">
        <div className="mb-4">
          <h3 className="text-base font-medium">Buyers Onboarded</h3>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [`${value}`, "Buyers"]}
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

      {/* Buyers Tables & Geo Analytics */}
      <TopBuyersTable />
      <UserGeoChart defaultType="buyer" />
      <AllBuyersTable />
    </div>
  )
}
