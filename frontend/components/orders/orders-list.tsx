"use client";

import { useEffect, useState } from "react";
import { ordersApi } from "@/lib/api/orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import type { Order } from "@/types/api";
import { format } from "date-fns";
import { Avatar } from "../ui/avatar";

export function OrdersList() {
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data:any = await ordersApi.getOrders();
        setOrders(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setOrders, setLoading, setError]);

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "text-purple-500 bg-purple-50";
      case "COMPLETED":
        return "text-green-500 bg-green-50";
      case "PENDING":
        return "text-blue-500 bg-blue-50";
      case "APPROVED":
        return "text-yellow-500 bg-yellow-50";
      case "REJECTED":
        return "text-gray-500 bg-gray-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">
          Active Order List ({orders.length})
        </h1>
      </div>

      <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex gap-4">
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search with Id"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-[300px]"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Order ID
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Buyer Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Product Ordered
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Address
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Order Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b last:border-b-0">
                <td className="p-4 text-sm">{order.id}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      {/* <Image
                        src={
                          order.buyer.user.image ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={order.buyer.user.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      /> */}
                      <Avatar/>
                    </div>
                    {/* <span className="text-sm">{order?.buyer.user.name}</span> */}
                  </div>
                </td>
                <td className="p-4 text-sm">
                  {order.items.map((item) => item.product.name).join(", ")}
                </td>
                {/* <td className="p-4 text-sm">{order.buyer.location}</td> */}
                <td className="p-4 text-sm">
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status
                      .toLowerCase()
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-center p-4 border-t">
          <nav className="flex gap-1">
            <Button variant="outline" size="icon" disabled>
              {"<"}
            </Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="icon"
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="icon">
              {">"}
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
