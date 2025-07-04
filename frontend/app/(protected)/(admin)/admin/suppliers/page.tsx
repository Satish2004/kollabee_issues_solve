"use client"

import { useState } from "react"
import { BarChart3, Users } from "lucide-react"
import AnalyticsTab from "./analytics-page"
import SuppliersTab from "./suppliers-page"
import ProductsTab from "./products-page"


export default function TabInterface() {
  const [activeTab, setActiveTab] = useState<"analytics" | "suppliers" | "products">("analytics")

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === "analytics"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === "suppliers"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Suppliers
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center px-6 py-3 text-sm font-medium ${activeTab === "products"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <span className="w-4 h-4 mr-2">🛒</span>
            Products
          </button>
        </div>
      </div>
      <div className="py-6 px-4">{activeTab === "analytics" ? <AnalyticsTab /> : activeTab === "suppliers" ? <SuppliersTab /> : <ProductsTab/>}</div>
    </div>
  )
}
