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
import { AdminApi } from "@/lib/api/admin";
import { BsDash } from "react-icons/bs";



const columns: ColumnDef<any>[] = [
  {
    accessorKey: "buyerName",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("buyerName") as string;
      return (
        <div className="flex items-center gap-2">
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as string;
      return (
        <div className="flex items-center gap-2">
          <span>{products.map((product: any) => product.name).join(", ")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
        const address = row.getValue("address") as string;
        return (
          <div className="flex items-center ml-4 gap-2 text-center">
            <span>{address.street === "N/A" ? <BsDash /> : `${address.street}, ${address.city}, ${address.state}, ${address.country}`}</span>
          </div>
        );
      },
  },
  {
    accessorKey: "latestOrderDate",
    header: "Order Date",
    cell: ({ row }) => {
        const orderDate = row.getValue("latestOrderDate") as string;
        return (
          <div className="flex items-center gap-2">
            <span>{formatDate(orderDate)}</span>
          </div>
        );
      },
  },
];

export default function AllSuppliersTable() {

const [buyers, setBuyers] = useState<any[]>([]);

useEffect(() => {
    const fetchBuyers = async () => {
        const response = await AdminApi.getTopBuyers();
        setBuyers(response);
    };
    fetchBuyers();
}, []);
    

// console.log(buyers)

  const table = useReactTable({
    data: buyers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 bg-white p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Suppliers</h2>
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
