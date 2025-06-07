"use client"

import { Line, LineChart, Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function OrderAnalyticsChart() {
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

export function OrderSummaryChart() {
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

export function RevenueChart() {
  const data = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 18000 },
    { month: "Mar", revenue: 15000 },
    { month: "Apr", revenue: 22000 },
    { month: "May", revenue: 25000 },
    { month: "Jun", revenue: 32000 },
    { month: "Jul", revenue: 28000 },
  ]

  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Revenue",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => {
                return [`$${value.toLocaleString()}`, "Revenue"]
              }}
            />
          }
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function ProductCategoryChart() {
  const data = [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 25 },
    { name: "Home", value: 20 },
    { name: "Beauty", value: 15 },
    { name: "Other", value: 5 },
  ]

  return (
    <ChartContainer
      config={{
        value: {
          label: "Sales",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <BarChart data={data} layout="vertical">
        <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => {
                return [`${value}%`, "Sales Percentage"]
              }}
            />
          }
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
