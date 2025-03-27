"use client";
import React, { useEffect, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ordersApi } from "@/lib/api/orders";

type Order = {
  id: string;
  orderDate: string;
  status: "in_progress" | "delivered" | "cancelled";
  total: number;
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order#",
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <div className="flex items-center gap-2">
          <span>{formatDate(createdAt)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              status === "in_progress"
                ? "bg-red-500"
                : status === "delivered"
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          />
          <span className="capitalize">
            {status === "PENDING"
              ? "Pending"
              : status === "in_progress"
              ? "In progress"
              : status === "delivered"
              ? "Delivered"
              : "Cancelled"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex items-center gap-2 justify-end">
          {order.status === "in_progress" && (
            <Link href={`/buyer/orders/${row.original.id}`}>
              <Button className="bg-red-500 text-white hover:bg-red-600">
                Track Order
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            className="text-red-500 border-red-500 hover:bg-red-50"
          >
            View Details
          </Button>
        </div>
      );
    },
  },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await ordersApi.getOrders();
      console.log("Response:", response);
      setOrders(response?.orders);
    };
    fetchOrders();
  }, []);

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <span className="text-gray-500">({orders.length})</span>
      </div>
      <div className="w-full">
        <div className="w-full rounded-md">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="grid grid-cols-5 w-full border-t border-b border-gray-200 pt-4 text-gray-500"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={header.id === "actions" ? "text-right" : ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="grid grid-cols-5 w-full pt-4"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "actions" ? "text-right" : ""
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
