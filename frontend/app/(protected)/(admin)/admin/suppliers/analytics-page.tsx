import MetricCard from "@/components/admin-dashboard/metric-card"
import { BarChart3, TrendingUp, DollarSign } from "lucide-react"
import SupplierAnalytics from "@/components/admin-dashboard/supplier-analytics"
import SupplierGeoChart from "@/components/admin-dashboard/supplier-geo-chart"

export default function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Analytics Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* New Joined Buyers */}
        <MetricCard title="NEW JOINED SUPPLIERS" value="2,000" percentage="10.3%" change="+2,123" />
        {/* Buyers Bought Worth */}
        <MetricCard title="NEW JOINED SUPPLIERS" value="2,000" percentage="10.3%" change="+2,123" />
        {/* Total Buyers */}
        <MetricCard title="NEW JOINED SUPPLIERS" value="2,000" percentage="10.3%" change="+2,123" />
        {/* In-Active Buyers */}
        <MetricCard title="NEW JOINED SUPPLIERS" value="2,000" percentage="10.3%" change="+2,123" />
      </div>

      <SupplierAnalytics />
      <SupplierGeoChart />
    </div>
  )
}
