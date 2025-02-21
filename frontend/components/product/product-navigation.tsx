"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center bg-white justify-between px-6 rounded-lg">
      <div className="flex gap-8">
        <Link
          href="/seller/products/active"
          className={cn(
            "flex items-center gap-2 py-4 text-[#363638] hover:text-[#e00261] relative",
            pathname === "/products/active" &&
              "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#e00261]"
          )}
        >
          <Store className="w-5 h-5" />
          <span>Active Products</span>
        </Link>
        <Link
          href="/seller/products/draft"
          className={cn(
            "flex items-center gap-2 py-4 text-[#363638] hover:text-[#e00261] relative",
            pathname === "/products/draft" &&
              "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#e00261]"
          )}
        >
          <FileText className="w-5 h-5" />
          <span>Draft Product</span>
        </Link>
      </div>
      <Link
        href="/seller/create-product"
        className="flex items-center gap-2 px-4 py-2 text-[#e00261] font-semibold border-2 border-[#e00261] rounded-lg hover:bg-[#e00261] hover:text-white transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Add Product</span>
      </Link>
    </div>
  );
}
