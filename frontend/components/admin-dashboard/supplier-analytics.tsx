import React, { useEffect, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminApi } from '@/lib/api'

function SupplierAnalytics() {
  const [metricsData, setMetricsData] = useState<any>(null)
  // const [monthlyOnboarding, setMonthlyOnboarding] = useState<any>(null)

  useEffect(() => {
    const fetchMetricsData = async () => {
      const metricsRes = await AdminApi.getPlatformMetrics()
      setMetricsData(metricsRes)
    }

    fetchMetricsData()
  }, [])

  console.log(metricsData)
      
      const monthlyOnboarding = [
        { name: "Jan", buyers: 8, suppliers: 5 },
        { name: "Feb", buyers: 6, suppliers: 12 },
        { name: "Mar", buyers: 7, suppliers: 10, tooltip: 400 },
        { name: "Apr", buyers: 12, suppliers: 9 },
        { name: "May", buyers: 16, suppliers: 10 },
        { name: "Jun", buyers: 18, suppliers: 15 },
        { name: "Jul", buyers: 19, suppliers: 20 },
      ]
  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                
        {/* Metrics Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-2 w-full">
        <Card className={`bg-indigo-50 border border-gray-200`}>
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">Requests</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{metricsData?.requests?.current}</div>
                <div className={`flex items-center text-sm ${metricsData?.requests?.percentageChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {metricsData?.requests?.percentageChange ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {metricsData?.requests?.percentageChange}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-sky-50 border border-gray-200`}>
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">Messages</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{metricsData?.messages?.current}</div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-indigo-50 border border-gray-200`}>
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">Orders</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{metricsData?.orders?.current}</div>
                <div className={`flex items-center text-sm ${metricsData?.orders?.percentageChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {metricsData?.orders?.percentageChange ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {metricsData?.orders?.percentageChange}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-sky-50 border border-gray-200`}>
            <CardContent className="p-6">
              <div className="text-gray-700 font-medium mb-2">Certificates Uploaded</div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{metricsData?.certificatesUploaded?.current}</div>
              </div>
            </CardContent>
          </Card>

          
        </div>
        
        <div className="col-span-3 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-base font-medium mb-4">Suppliers Onboarded</h3>
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