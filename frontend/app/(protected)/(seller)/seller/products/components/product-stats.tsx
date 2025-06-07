import type React from "react"
import { Box, List } from "lucide-react"
import type { ProductStats as ProductStatsType } from "../types"

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="bg-white rounded-lg p-4 shadow">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-500 text-sm">{title}</span>
      {icon}
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
)

interface ProductStatsProps {
  stats: ProductStatsType
}

export default function ProductStats({ stats }: ProductStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard title="CATEGORIES" value={stats.categories} icon={<Box className="w-5 h-5 text-red-500" />} />
      <StatCard title="TOTAL PRODUCTS" value={stats.totalProducts} icon={<List className="w-5 h-5 text-red-500" />} />
      <StatCard title="TOP SELLING" value={stats.topSelling} icon={<Box className="w-5 h-5 text-red-500" />} />
      <StatCard title="LOW STOCKS" value={stats.lowStocks} icon={<Box className="w-5 h-5 text-red-500" />} />
    </div>
  )
}
