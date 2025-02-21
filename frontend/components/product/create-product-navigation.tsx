"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, FileText, Plus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreateProductNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center bg-white justify-between px-6 py-3 sticky top-24 rounded-lg">
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-5 h-5 text-[#EA3D4F]" />
        <Link href="/seller/products/active" className="font-semibold text-[#EA3D4F] text-lg">
          Back
        </Link>
      </div>
    </div>
  );
}
