import { ArrowUp, ArrowDown, Package, RefreshCw, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Overview() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Orders Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="TOTAL ORDERS"
          value="500"
          change="+2,123"
          changeText="from last month"
          trend="up"
          icon={<Package className="h-5 w-5 text-rose-500" />}
        />

        <MetricCard
          title="TOTAL RECEIVED"
          value="490"
          change="+$10,000"
          changeText="Revenue"
          trend="up"
          percentage="10.3%"
          icon={<RefreshCw className="h-5 w-5 text-rose-500" />}
        />

        <MetricCard
          title="RETURNED PRODUCTS"
          value="10"
          change="-$2,123"
          changeText="from last month"
          trend="down"
          icon={<TrendingDown className="h-5 w-5 text-rose-500" />}
        />

        <MetricCard
          title="ON THE WAY TO SHIP"
          value="12"
          change="$2,000"
          changeText="Products shipping"
          trend="neutral"
          icon={<Package className="h-5 w-5 text-rose-500" />}
        />
      </div>

      <div className="pt-6">
        <h2 className="text-lg font-medium mb-4">Order Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
                  {/* Chart will be rendered here */}
                  <SimpleChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <MetricCardGradient
              title="Customers"
              value="3,781"
              change="+10.5%"
              trend="up"
              color="bg-gradient-to-br from-pink-100 to-pink-200"
            />

            <MetricCardGradient
              title="Revenue"
              value="$695"
              change="+15.03%"
              trend="up"
              color="bg-gradient-to-br from-pink-100 to-pink-200"
            />

            <MetricCardGradient
              title="Orders"
              value="1,219"
              change="-0.03%"
              trend="down"
              color="bg-gradient-to-br from-pink-100 to-pink-200"
            />

            <MetricCardGradient
              title="Growth"
              value="30.1%"
              change="+6.08%"
              trend="up"
              color="bg-gradient-to-br from-amber-100 to-rose-200"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, changeText, trend, percentage, icon }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <div className="flex items-center mt-2 text-sm">
              {trend === "up" && <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />}
              {trend === "down" && <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />}
              <span className={trend === "down" ? "text-rose-500" : trend === "up" ? "text-emerald-500" : ""}>
                {change}
              </span>
              <span className="text-muted-foreground ml-1">{changeText}</span>
            </div>
          </div>
          {percentage && (
            <div className="bg-rose-100 text-rose-500 px-2 py-1 rounded text-xs font-medium">{percentage}</div>
          )}
          <div className="ml-auto">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricCardGradient({ title, value, change, trend, color }) {
  return (
    <Card className={color}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            {trend === "up" ? (
              <ArrowUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <ArrowDown className="h-3 w-3 text-rose-500" />
            )}
            <span className={trend === "up" ? "text-emerald-500" : "text-rose-500"}>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SimpleChart() {
  return (
    <div className="relative w-full h-full">
      {/* This is a placeholder for the chart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/order-analytics-line-chart.png" alt="Order analytics chart" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}
