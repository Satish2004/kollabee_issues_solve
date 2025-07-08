"use client"

import { useEffect, useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { ordersApi } from "@/lib/api/orders"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Order = {
  id: string
  createdAt: string
  status: "PENDING" | "in_progress" | "delivered" | "cancelled"
  totalAmount: number
  items: {
    id: string
    product: {
      id: string
      name: string
    }
    quantity: number
  }[]
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order#",
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      return <span className="font-medium">{id}</span>
    },
  },
  {
    accessorKey: "items",
    header: "Products",
    cell: ({ row }) => {
      const items = row.original.items || []
      if (items.length === 0) return "N/A"

      const firstItem = items[0]
      const additionalCount = items.length - 1

      return (
        <div>
          {firstItem.product.name} {firstItem.quantity > 1 && `(Qty: ${firstItem.quantity})`}
          {additionalCount > 0 && (
            <span className="text-gray-500 ml-1">+{additionalCount} more</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return (
        <div className="flex items-center gap-2">
          <span>{formatDate(createdAt)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${status === "PENDING" || status === "in_progress"
                ? "bg-amber-500"
                : status === "delivered"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
          />
          <span className="capitalize">
            {status === "PENDING" || status === "in_progress"
              ? "In progress"
              : status === "delivered"
                ? "Delivered"
                : "Cancelled"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalAmount") as string)
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount || 0)
      return formatted
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 justify-end">
          <Link href={`/buyer/orders/${row.original.id}`}>
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:border-red-600 hover:bg-red-50 hover:text-red-600 font-semibold"
            >
              View Details
            </Button>
          </Link>
        </div>
      )
    },
  },
]

const formatDate = (date: string) => {
  if (!date) return "N/A"
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    return "Invalid date"
  }
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await ordersApi.getOrders()
        setOrders(response?.orders || [])
      } catch (err) {
        console.error("Failed to fetch orders:", err)
        setError("Failed to load orders. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const table = useReactTable({
    data: orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4 bg-white p-3 sm:p-5 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold">Orders</h2>
        {!isLoading && <span className="text-gray-500">({orders.length})</span>}
      </div>
      <div className="w-full overflow-auto">
        <div className="rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-t border-b border-gray-200">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`text-xs sm:text-sm font-medium text-gray-500 ${header.id === "actions" ? "text-right" : ""
                        } ${header.id === "createdAt" ? "hidden sm:table-cell" : ""}`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-9 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`py-3 text-sm ${cell.column.id === "actions" ? "text-right" : ""} ${cell.column.id === "createdAt" ? "hidden sm:table-cell" : ""
                          } ${cell.column.id === "id" ? "font-medium" : ""}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

