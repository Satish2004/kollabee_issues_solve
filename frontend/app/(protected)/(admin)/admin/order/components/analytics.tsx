"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { mockTopBuyers } from "@/lib/mock-data"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Order Analytics</h2>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Order Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-rose-500"></span>
              <span className="text-sm">Bulk Quantity</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-amber-400"></span>
              <span className="text-sm">Single Quantity</span>
            </div>
            <div className="ml-auto">
              <select className="text-sm border rounded px-2 py-1">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">16 Aug 2023</div>
          <div className="text-xl font-semibold">$59,492.10</div>
          <div className="h-[300px] mt-4">
            <OrderAnalyticsChart />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <OrderSummaryChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Top Buyers List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer Name</TableHead>
                    <TableHead>Product Ordered</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status of Customer</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopBuyers.map((buyer) => (
                    <TableRow key={buyer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={buyer.avatar || "/placeholder.svg"} alt={buyer.name} />
                            <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{buyer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{buyer.product}</TableCell>
                      <TableCell>{buyer.address}</TableCell>
                      <TableCell>{buyer.orderDate}</TableCell>
                      <TableCell>
                        <CustomerStatusBadge status={buyer.status} />
                      </TableCell>
                      <TableCell>
                        <button className="p-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function OrderAnalyticsChart() {
  const data = [
    { month: "Jan", bulk: 20, single: 30 },
    { month: "Feb", bulk: 25, single: 40 },
    { month: "Mar", bulk: 30, single: 45 },
    { month: "Apr", bulk: 40, single: 30 },
    { month: "May", bulk: 35, single: 60 },
    { month: "Jun", bulk: 40, single: 70 },
    { month: "Jul", bulk: 50, single: 60 },
  ]

  return (
    <ChartContainer
      config={{
        bulk: {
          label: "Bulk Quantity",
          color: "hsl(var(--chart-1))",
        },
        single: {
          label: "Single Quantity",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="bulk"
          stroke="var(--color-bulk)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="single"
          stroke="var(--color-single)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

function OrderSummaryChart() {
  const data = [
    { month: "Jan", repeated: 1000, new: 1400 },
    { month: "Feb", repeated: 2000, new: 1500 },
    { month: "Mar", repeated: 3000, new: 1200 },
    { month: "Apr", repeated: 2500, new: 2000 },
    { month: "May", repeated: 2800, new: 2200 },
  ]

  return (
    <ChartContainer
      config={{
        repeated: {
          label: "Repeated Customers",
          color: "hsl(var(--chart-2))",
        },
        new: {
          label: "New Customers",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <AreaChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="repeated"
          stroke="var(--color-repeated)"
          fill="var(--color-repeated)"
          fillOpacity={0.2}
        />
        <Area type="monotone" dataKey="new" stroke="var(--color-new)" fill="var(--color-new)" fillOpacity={0.2} />
      </AreaChart>
    </ChartContainer>
  )
}

function CustomerStatusBadge({ status }) {
  const statusStyles = {
    "Active Buying": "bg-rose-50 text-rose-600 border-rose-200",
    "Not Active": "bg-gray-50 text-gray-600 border-gray-200",
    Rejected: "bg-rose-50 text-rose-600 border-rose-200",
  }

  return (
    <Badge variant="outline" className={`${statusStyles[status] || ""} font-normal`}>
      {status === "Active Buying" && <span className="mr-1 text-rose-500">•</span>}
      {status}
    </Badge>
  )
}
