"use client"
import React, { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { AdminApi } from '@/lib/api'

interface MonthlyOnboardingData {
  name: string;
  suppliers: number;
  buyers?: number;
}

interface OnboardingResponse {
  data: MonthlyOnboardingData[];
  type: string;
}

function SupplierAnalytics() {
  const [metricsData, setMetricsData] = useState<any>(null)
  const [monthlyOnboardingData, setMonthlyOnboardingData] = useState<OnboardingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [metricsRes, onboardingRes] = await Promise.all([
          AdminApi.getPlatformMetrics(),
          AdminApi.getMonthlyOnboarding('seller') // Explicitly fetch seller data
        ])
        setMetricsData(metricsRes)
        setMonthlyOnboardingData(onboardingRes)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4 text-center">Loading analytics...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg text-xs">
        <details>
          <summary className="cursor-pointer font-medium">Debug Info (Click to expand)</summary>
          <pre className="mt-2 overflow-auto max-h-40">
            {JSON.stringify({
              monthlyOnboardingData
            }, null, 2)}
          </pre>
        </details>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Metrics Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-2 w-full">
          {/* Requests */}
          <Card className="bg-indigo-50 border border-gray-200">
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">Requests</div>
              <div className="text-3xl font-bold text-gray-900">
                {metricsData?.requests ?? '—'}
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="bg-sky-50 border border-gray-200">
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">Messages</div>
              <div className="text-3xl font-bold text-gray-900">
                {metricsData?.messages ?? '—'}
              </div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="bg-indigo-50 border border-gray-200">
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">Orders</div>
              <div className="text-3xl font-bold text-gray-900">
                {metricsData?.orders ?? '—'}
              </div>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card className="bg-sky-50 border border-gray-200">
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">Certificates Uploaded</div>
              <div className="text-3xl font-bold text-gray-900">
                {metricsData?.certificatesUploaded ?? '—'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Chart */}
        <div className="col-span-3 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-base font-medium mb-4">Suppliers Onboarded</h3>
          <div className="h-64">
            {monthlyOnboardingData?.data ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyOnboardingData.data}>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
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
                    formatter={(value) => [`${value} suppliers`, 'Count']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: 'bg-yellow-400', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No onboarding data available
              </div>
            )}
          </div>
          <div className="flex items-center justify-end mt-2 text-xs">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
              <span>Suppliers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierAnalytics