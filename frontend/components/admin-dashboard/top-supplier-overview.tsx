"use client"
import React from "react"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Area, AreaChart, Bar, BarChart } from "recharts"
import { Button } from "@/components/ui/button"

// Dynamic data for the dashboard
const topSupplierData = {
  name: "Marcos Private Limited",
  avatar: "/diverse-group-city.png",
  label: "Top Supplier",
  date: "January 21",
  salesInfo: "Sold 100K Soaps",
  totalSales: "800K",
  salesDescription: "Products sold on KollaBee.",
  products: [
    {
      id: 1,
      name: "Natali Craig",
      avatar: "/contemplative-artist.png",
      price: "$10.99",
      action: "VIEW",
    },
  ],
  // Data for the small line chart
  growthData: [
    { value: 10 },
    { value: 15 },
    { value: 13 },
    { value: 17 },
    { value: 20 },
    { value: 22 },
    { value: 25 },
    { value: 30 },
  ],
  // Data for the colorful bar chart
  salesData: [
    { value: 30, color: "#9747FF" },
    { value: 40, color: "#9747FF" },
    { value: 20, color: "#9747FF" },
    { value: 50, color: "#9747FF" },
    { value: 35, color: "#FF47B6" },
    { value: 25, color: "#FF47B6" },
    { value: 45, color: "#FF47B6" },
    { value: 30, color: "#FF47B6" },
    { value: 55, color: "#FF4747" },
    { value: 25, color: "#FF4747" },
    { value: 45, color: "#FF4747" },
    { value: 40, color: "#FF4747" },
  ],
}

// Data for the suppliers table
const suppliersTableData = [
  { name: "ASOS Ridley High Waist", price: "$79.49", quantity: 82, amount: "$6,518.18" },
  { name: "Marco Lightweight Shirt", price: "$128.50", quantity: 37, amount: "$4,754.50" },
  { name: "Half Sleeve Shirt", price: "$39.99", quantity: 64, amount: "$2,559.36" },
  { name: "Lightweight Jacket", price: "$20.00", quantity: 184, amount: "$3,680.00" },
  { name: "Marco Shoes", price: "$79.49", quantity: 64, amount: "$1,965.81" },
]

export default function KollaBeeDashboard() {
  return (
    <div className="p-6 font-sans">
      <h1 className="text-xl font-semibold mb-6">Top Suppliers on KollaBee</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Top Supplier */}
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-6">Top Supplier</h2>

          <div className="flex items-start mb-6">
            <div className="relative mr-4">
              <Avatar className="w-20 h-20 border-2 border-white">
                <img src={topSupplierData.avatar || "/placeholder.svg"} alt="Supplier" className="object-cover" />
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-5 h-5 border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{topSupplierData.name}</h3>
              <p className="text-sm text-gray-500">{topSupplierData.label}</p>

              <div className="flex items-center mt-2">
                <div className="mr-4">
                  <p className="text-xs text-gray-500">{topSupplierData.date}</p>
                  <p className="text-xs">{topSupplierData.salesInfo}</p>
                </div>

                <div className="w-24 h-10">
                  <AreaChart
                    width={100}
                    height={40}
                    data={topSupplierData.growthData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#4F46E5" fillOpacity={1} fill="url(#colorGrowth)" />
                  </AreaChart>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline">
              <h2 className="text-5xl font-bold mr-2">{topSupplierData.totalSales}</h2>
            </div>
            <p className="text-sm text-gray-600">{topSupplierData.salesDescription}</p>

            <div className="mt-2 h-12">
              <BarChart
                width={350}
                height={48}
                data={topSupplierData.salesData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                barSize={8}
              >
                {topSupplierData.salesData.map((entry, index) => (
                  <Bar
                    key={index}
                    dataKey="value"
                    fill={entry.color}
                    background={{ fill: "#eee" }}
                    radius={[10, 10, 10, 10]}
                  />
                ))}
              </BarChart>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-3 border-b pb-2 mb-2">
              <div className="text-sm text-gray-500">Product Title</div>
              <div className="text-sm text-gray-500">Selling Price</div>
              <div className="text-sm text-gray-500">Action</div>
            </div>

            {topSupplierData.products.map((product) => (
              <div key={product.id} className="grid grid-cols-3 py-2 items-center">
                <div className="flex items-center">
                  <Avatar className="w-8 h-8 mr-2">
                    <img src={product.avatar || "/placeholder.svg"} alt={product.name} className="object-cover" />
                  </Avatar>
                  <span className="text-sm">{product.name}</span>
                </div>
                <div className="text-sm">{product.price}</div>
                <div>
                  <Button variant="ghost" className="text-sm text-indigo-600 hover:text-indigo-800 p-0">
                    {product.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Card - Top Suppliers Table */}
        <Card className="p-6 bg-gray-50">
          <h2 className="text-xl font-bold mb-6">Top Suppliers</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-3 text-gray-500 font-normal text-sm">Name</th>
                  <th className="text-left pb-3 text-gray-500 font-normal text-sm">Price</th>
                  <th className="text-left pb-3 text-gray-500 font-normal text-sm">Quantity</th>
                  <th className="text-left pb-3 text-gray-500 font-normal text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {suppliersTableData.map((supplier, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-sm">{supplier.name}</td>
                    <td className="py-4 text-sm">{supplier.price}</td>
                    <td className="py-4 text-sm">{supplier.quantity}</td>
                    <td className="py-4 text-sm">{supplier.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
