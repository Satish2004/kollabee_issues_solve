"use client";

import Link from "next/link";
import { Eye, Edit2, Trash, MoreVertical } from "lucide-react";
import type { ProductTableItem } from "../types";
import { useState } from "react";

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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No products found</p>
        <p className="text-sm text-gray-400 mt-2">
          {isDraftView
            ? "You don't have any draft products yet"
            : "Try adding a new product"}
        </p>
      </div>
    );
  }

  // Format date to readable format
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
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
                    <span className="max-w-[200px] truncate">
                      {product.name}
                    </span>
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
                <td className="px-4 py-2">{formatDate(product.createdAt)}</td>
                <td className="px-4 py-2 text-xs">
                  {isDraftView ? (
                    <PendingApprovalStatus />
                  ) : (
                    <StockStatus
                      availability={
                        product.availableQuantity <= 20
                          ? "Low Stock"
                          : "In-Stock"
                      }
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2 gap-3">
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

      {/* Mobile Card View */}
      <div className="md:hidden">
        {products.map((product) => (
          <div key={product.id} className="border-b p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-sm max-w-[200px] truncate">
                {product.name}
              </h3>
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === product.id ? null : product.id)
                  }
                  className="p-1"
                  aria-label="Product actions"
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>

                {/* Mobile dropdown menu */}
                {activeMenu === product.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md border z-10 w-36">
                    <Link
                      href={`/seller/products/${product.id}`}
                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-50 w-full text-left"
                      onClick={() => setActiveMenu(null)}
                    >
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Link>
                    <Link
                      href={`/seller/products/${product.id}/edit`}
                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-50 w-full text-left"
                      onClick={() => setActiveMenu(null)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Link>
                    <button
                      onClick={() => {
                        onDelete(product.id);
                        setActiveMenu(null);
                      }}
                      className="flex items-center px-3 py-2 text-sm hover:bg-gray-50 w-full text-left text-yellow-600"
                    >
                      <Trash className="w-4 h-4 mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Price:</span>
                <span className="ml-1 font-medium">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {!isDraftView && (
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span
                    className={`ml-1 font-medium ${
                      product.availableQuantity <= 20 ? "text-red-600" : ""
                    }`}
                  >
                    {product.availableQuantity}
                  </span>
                </div>
              )}

              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-1">{formatDate(product.createdAt)}</span>
              </div>

              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-1">
                  {isDraftView ? (
                    <span className="text-blue-600">Pending</span>
                  ) : (
                    <span
                      className={
                        product.availableQuantity <= 20
                          ? "text-yellow-600"
                          : "text-green-600"
                      }
                    >
                      {product.availableQuantity <= 20
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
