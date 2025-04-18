import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function SupplierAnalytics() {

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