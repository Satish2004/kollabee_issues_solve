"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Account Settings",
    href: "/seller/profile-management/account-settings",
  },
  {
    label: "Password Management",
    href: "/seller/profile-management/password/reset-password",
  },
  {
    label: "Payment Method",
    href: "/seller/profile-management/payment-methods",
  },
];

export function ProfileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-4 border-b border-gray-200 p-4 rounded-lg">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-4 py-2 text-sm transition-colors",
            pathname === item.href
              ? "bg-[#fdeced] text-[#363638] rounded-md"
              : "text-[#78787a] hover:text-[#363638]"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
