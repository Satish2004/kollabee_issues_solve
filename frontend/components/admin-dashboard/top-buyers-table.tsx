"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
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

// Types
interface Product {
  name: string;
  price: number;
  totalQuantity: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface Buyer {
  buyerName: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  products: Product[];
  latestOrderDate: string;
  status: string;
  address: Address;
}

const columns: ColumnDef<Buyer>[] = [
  {
    accessorKey: "buyerName",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("buyerName") as string;
      return <span>{name}</span>;
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as Product[];
      return (
        <span>{products?.length ? products.map((p) => p.name).join(", ") : <BsDash />}</span>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as Address;
      const isNA = address?.street === "N/A";
      return (
        <span>
          {isNA ? <BsDash /> : `${address.street}, ${address.city}, ${address.state}, ${address.country}`}
        </span>
      );
    },
  },
  {
    accessorKey: "latestOrderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const orderDate = row.getValue("latestOrderDate") as string;
      return <span>{formatDate(orderDate)}</span>;
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const email = row.original.email; // using email as unique identifier
  //     return (
  //       <div className="text-right">
  //         <Link href={`/buyer/orders/by-email/${email}`}>
  //           <Button className="border border-red-500 text-red-500 hover:border-red-600 hover:bg-red-100 font-semibold">
  //             View Details
  //           </Button>
  //         </Link>
  //       </div>
  //     );
  //   },
  // },
];

export default function TopBuyersTable() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    const fetchBuyers = async () => {
      const response = await AdminApi.getTopBuyers();
      setBuyers(response); // Ensure API returns an array of Buyer
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
        <h2 className="text-2xl font-semibold">Top Buyers List</h2>
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
