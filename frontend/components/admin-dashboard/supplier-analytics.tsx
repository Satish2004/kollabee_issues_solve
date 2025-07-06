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

function SupplierAnalytics() {
  const [metricsData, setMetricsData] = useState<any>(null)

  useEffect(() => {
    const fetchMetricsData = async () => {
      const metricsRes = await AdminApi.getPlatformMetrics()
      setMetricsData(metricsRes)
    }

    fetchMetricsData()
  }, [])

  const monthlyOnboarding = [
    { name: "Jan", buyers: 8, suppliers: 15 },
    { name: "Feb", buyers: 6, suppliers: 12 },
    { name: "Mar", buyers: 7, suppliers: 10 },
    { name: "Apr", buyers: 12, suppliers: 9 },
    { name: "May", buyers: 16, suppliers: 10 },
    { name: "Jun", buyers: 18, suppliers: 15 },
    { name: "Jul", buyers: 19, suppliers: 20 },
  ]

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded-lg text-xs">
        <details>
          <summary className="cursor-pointer font-medium">Debug Info (Click to expand)</summary>
          <pre className="mt-2 overflow-auto max-h-40">
            {JSON.stringify({
              metricsData,
              monthlyOnboarding
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
        <div className="col-span-3 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">Suppliers Onboarded</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyOnboarding}>
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
                <Tooltip />
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
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
              <span>Suppliers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierAnalytics
