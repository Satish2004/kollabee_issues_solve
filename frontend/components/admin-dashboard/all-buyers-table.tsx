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
import { BsDash } from "react-icons/bs";

interface Buyer {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    lastLogin: string | null;
  };
  businessType: string | null;
  otherBusinessType: string | null;
  lookingFor: string[];
  Order: Array<{
    id: string;
    createdAt: string;
    status: string;
    items: Array<{
      product: {
        name: string;
        price: number;
      };
      quantity: number;
    }>;
  }>;
}

const columns: ColumnDef<Buyer>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.user.name;
      return (
        <div className="flex items-center gap-2">
          <span>{name || <BsDash />}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.user.email;
      return (
        <div className="flex items-center gap-2">
          <span>{email || <BsDash />}</span>
        </div>
      );
    },
  },
  {
    id: "businessType",
    header: "Business Type",
    cell: ({ row }) => {
      const businessType = row.original.businessType;
      const otherType = row.original.otherBusinessType;
      return (
        <div className="flex items-center gap-2">
          <span>
            {businessType
              ? (businessType === "Other" && otherType
                ? otherType
                : businessType)
              : <BsDash />}
          </span>
        </div>
      );
    },
  },
  {
    id: "lookingFor",
    header: "Looking For",
    cell: ({ row }) => {
      const lookingFor = row.original.lookingFor;
      return (
        <div className="flex items-center gap-2">
          <span>
            {lookingFor && lookingFor.length > 0
              ? lookingFor.join(", ")
              : <BsDash />}
          </span>
        </div>
      );
    },
  },
  {
    id: "totalOrders",
    header: "Total Orders",
    cell: ({ row }) => {
      const orders = row.original.Order;
      return (
        <div className="flex items-center gap-2">
          <span>{orders?.length || 0}</span>
        </div>
      );
    },
  },
  {
    id: "products",
    header: "Products Ordered",
    cell: ({ row }) => {
      const orders = row.original.Order;
      // Get all unique product names from all orders
      const productNames = Array.from(
        new Set(
          orders.flatMap(order =>
            order.items.map(item => item.product.name)
          )
        ))
      return (
        <div className="flex items-center gap-2">
          <span>{productNames.join(", ") || <BsDash />}</span>
        </div>
      );
    },
  },
  {
    id: "latestOrderDate",
    header: "Last Order Date",
    cell: ({ row }) => {
      const orders = row.original.Order;
      const latestOrder = orders.length > 0
        ? orders.reduce((latest, current) =>
          new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
        )
        : null;

      return (
        <div className="flex items-center gap-2">
          <span>{latestOrder ? formatDate(latestOrder.createdAt) : <BsDash />}</span>
        </div>
      );
    },
  },
  {
    id: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => {
      const lastLogin = row.original.user.lastLogin;
      return (
        <div className="flex items-center gap-2">
          <span>{lastLogin ? formatDate(lastLogin) : <BsDash />}</span>
        </div>
      );
    },
  },
];

export default function AllBuyersTable() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await AdminApi.getAllBuyers();
        setBuyers(response.data);
      } catch (error) {
        console.error("Error fetching buyers:", error);
      }
    };
    fetchBuyers();
  }, []);

  const table = useReactTable({
    data: buyers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Buyers</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add Buyer</Button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="w-full rounded-md min-w-[1200px]">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="grid grid-cols-8 w-full border-t border-b border-gray-200 pt-4 text-gray-500"
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
                    className="grid grid-cols-8 w-full pt-4 hover:bg-gray-50"
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
    month: "short",
    day: "numeric",
  });
};