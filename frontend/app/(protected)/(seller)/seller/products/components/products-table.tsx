"use client";

import Link from "next/link";
import { Eye, Edit2, Trash } from "lucide-react";
import type { ProductTableItem } from "../types";

interface ProductsTableProps {
  products: ProductTableItem[];
  onDelete: (id: string) => void;
  isDraftView?: boolean;
}

export default function ProductsTable({
  products,
  onDelete,
  isDraftView = false,
}: ProductsTableProps) {
  if (products.length === 0) {
    return <div className="p-8 text-center">No products found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Products
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Price
            </th>
            {!isDraftView && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Stock
              </th>
            )}
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Created
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t text-sm">
              <td className="px-4 py-2">
                <div className="flex items-center space-x-3">
                  <span>{product.name}</span>
                </div>
              </td>
              <td className="px-4 py-2">${product.price.toFixed(2)}</td>
              {!isDraftView && (
                <td className="px-4 py-2">
                  <span
                    className={
                      product.availableQuantity <= 20
                        ? "bg-red-100 text-red-600 px-2 py-1 rounded"
                        : ""
                    }
                  >
                    {product.availableQuantity}
                  </span>
                </td>
              )}
              <td className="px-4 py-2">
                {typeof product.createdAt === "string"
                  ? new Date(product.createdAt).toLocaleDateString()
                  : new Date(product.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-xs">
                {isDraftView ? (
                  <PendingApprovalStatus />
                ) : (
                  <StockStatus
                    availability={
                      product.availableQuantity <= 20 ? "Low Stock" : "In-Stock"
                    }
                  />
                )}
              </td>
              <td className="px-4 py-2 w-1/6">
                <div className="flex space-x-2 w-full gap-3">
                  <Link href={`/seller/products/${product.id}`}>
                    <Eye className="w-4 h-4" aria-label="View product" />
                  </Link>
                  <Link href={`/seller/products/${product.id}/edit`}>
                    <Edit2 className="w-4 h-4" aria-label="Edit product" />
                  </Link>
                  <button
                    onClick={() => onDelete(product.id)}
                    aria-label="Delete product"
                  >
                    <Trash className="w-4 h-4 text-yellow-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PendingApprovalStatus() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-blue-600 rounded-full" />
      <span className="text-blue-600">Pending Approval</span>
    </div>
  );
}

interface StockStatusProps {
  availability: "In-Stock" | "Low Stock" | "Out of stock";
}

function StockStatus({ availability }: StockStatusProps) {
  switch (availability) {
    case "Out of stock":
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          <span className="text-red-600">Out of Stock</span>
        </div>
      );
    case "Low Stock":
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-600 rounded-full" />
          <span className="text-yellow-600">Low Stock</span>
        </div>
      );
    case "In-Stock":
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-600 rounded-full" />
          <span className="text-green-600">In Stock</span>
        </div>
      );
    default:
      return null;
  }
}
