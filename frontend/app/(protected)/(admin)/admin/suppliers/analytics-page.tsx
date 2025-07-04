"use client"
import MetricCard from "@/components/admin-dashboard/metric-card"
import { BarChart3, TrendingUp, DollarSign } from "lucide-react"
import SupplierAnalytics from "@/components/admin-dashboard/supplier-analytics"
import SupplierGeoChart from "@/components/admin-dashboard/supplier-geo-chart"
import { useEffect, useState } from "react"
import { AdminApi } from "@/lib/api"

export default function AnalyticsTab() {
  const [supplierMetrics, setSupplierMetrics] = useState<any>(null)
  
      useEffect(() => {
          const fetchSupplierMetrics = async () => {
              const metricsRes = await AdminApi.getSupplierMetrics()
              setSupplierMetrics(metricsRes)
          }
  
          fetchSupplierMetrics()
      }, [])
  
      console.log(supplierMetrics)
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <MetricCard
          title="NEW JOINED SUPPLIERS"
          value={supplierMetrics?.NEW_JOINED_SUPPLIERS?.current}
          percentage={supplierMetrics?.NEW_JOINED_SUPPLIERS?.percentage}
        />
        <MetricCard
          title="SUPPLIERS SOLD WORTH"
          value={supplierMetrics?.SUPPLIERS_SOLD_WORTH?.current}
          percentage={supplierMetrics?.SUPPLIERS_SOLD_WORTH?.percentage}
        />
        <MetricCard
          title="TOTAL PRODUCTS SOLD"
          value={supplierMetrics?.TOTAL_PRODUCTS_SOLD?.current}
          percentage={supplierMetrics?.TOTAL_PRODUCTS_SOLD?.percentage}
        />
        <MetricCard
          title="INACTIVE SUPPLIERS"
          value={supplierMetrics?.INACTIVE_SUPPLIERS?.current}
          percentage={supplierMetrics?.INACTIVE_SUPPLIERS?.percentage}
        />
      </div>


      <SupplierAnalytics />
      <SupplierGeoChart />
    </div>
  )
}
