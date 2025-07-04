"use client"
import React, { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { AdminApi } from "@/lib/api"

interface Supplier {
  name: string;
  id: string;
  totalProductsSold: number;
  totalRevenueGenerated: number;
}

interface TopSuppliersData {
  topSuppliersOnProducts: Supplier[];
  topSuppliersOnRevenue: Supplier[];
}

const defaultSupplierData = {
  name: "Loading...",
  avatar: "",
  label: "Top Supplier",
  salesInfo: "Sold 0 products",
  totalSales: "0",
  salesDescription: "Products sold on KollaBee.",
  products: [],
  growthData: Array(8).fill({ value: 0 }),
  salesData: Array(12).fill({ value: 0, color: "#9747FF" })
};

export default function TopSuppliers() {
  const [topSuppliers, setTopSuppliers] = useState<TopSuppliersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierData, setSupplierData] = useState(defaultSupplierData);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await AdminApi.getTopSuppliers();
        setTopSuppliers(response);

        // Update the supplier data with API response
        if (response.topSuppliersOnProducts.length > 0) {
          const topSupplier = response.topSuppliersOnProducts[0];
          setSupplierData({
            ...defaultSupplierData,
            name: topSupplier.name,
            salesInfo: `Sold ${topSupplier.totalProductsSold} products`,
            totalSales: `$${topSupplier.totalRevenueGenerated}`,
            growthData: [
              { value: topSupplier.totalProductsSold * 0.7 },
              { value: topSupplier.totalProductsSold * 0.8 },
              { value: topSupplier.totalProductsSold * 0.9 },
              { value: topSupplier.totalProductsSold },
            ],
            salesData: [
              { value: topSupplier.totalRevenueGenerated * 0.6, color: "#9747FF" },
              { value: topSupplier.totalRevenueGenerated * 0.8, color: "#9747FF" },
              { value: topSupplier.totalRevenueGenerated, color: "#9747FF" },
            ]
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="font-sans">
      <h1 className="text-xl font-semibold mb-6">Top Suppliers on KollaBee</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Top Supplier */}
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-6">Top Supplier</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="flex flex-col items-start mb-6">
              <div className="relative mr-4">
                <Avatar className="w-20 h-20 border-2 border-white">
                  {supplierData.avatar ? (
                    <img
                      src={supplierData.avatar || "/default-avatar.png"}
                      alt="Supplier"
                      className="object-cover bg-stone-900"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-900 flex items-center justify-center text-white text-2xl">
                      {supplierData.name.charAt(0)}
                    </div>
                  )}
                </Avatar>
              </div>

              <div className="flex flex-col items-start">
                <h3 className="text-lg font-semibold">{supplierData.name}</h3>
                <p className="text-sm text-gray-500 text-center">{supplierData.label}</p>

                <div className="flex items-center mt-2">
                  <div className="mr-4">
                    <p className="text-xs text-gray-500">Top Selling Product</p>
                    <p className="text-xs">{supplierData.salesInfo}</p>
                  </div>

                  <div className="w-24 h-10">
                    <AreaChart
                      width={100}
                      height={40}
                      data={supplierData.growthData}
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
                <h2 className="text-5xl font-bold mr-2">{supplierData.totalSales}</h2>
              </div>
              <p className="text-sm text-gray-600">{supplierData.salesDescription}</p>

              <div className="mt-2 h-12 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart width={150} height={40} data={supplierData.salesData}>
                    <Tooltip />
                    <Bar dataKey="value" fill="#8300eb" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="">
            <div className="grid grid-cols-2 border-b pb-2 mb-2">
              <div className="text-sm text-gray-500">Product Title</div>
              <div className="text-sm text-gray-500">Selling Price</div>
            </div>

            {supplierData.products.length > 0 ? (
              supplierData.products.map((product) => (
                <div key={product.id} className="grid grid-cols-2 py-2 items-center">
                  <div className="flex items-center">
                    <span className="text-sm">{product.name}</span>
                  </div>
                  <div className="text-sm">{product.price}</div>
                </div>
              ))
            ) : (
              <div className="py-4 text-sm text-gray-500">No product data available</div>
            )}
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
                  <th className="text-left pb-3 text-gray-500 font-normal text-sm">Products Sold</th>
                  <th className="text-left pb-3 text-gray-500 font-normal text-sm">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSuppliers?.topSuppliersOnRevenue.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm">{supplier.name}</td>
                    <td className="py-4 text-sm">{supplier.totalProductsSold}</td>
                    <td className="py-4 text-sm">${supplier.totalRevenueGenerated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}