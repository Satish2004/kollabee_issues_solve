'use client';
import React from "react";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    label: 'All Requests',
    href: '/requests',
  },
  {
    label: 'Received Requests',
    href: '/requests/received',
  },
  {
    label: 'Manufacturing Requests',
    href: '/requests/manufacturing',
  }
];

export const RequestNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 p-4 bg-white rounded-lg">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-2 px-3 py-2 transition-colors
            ${pathname === item.href 
              ? 'text-pink-600 border-b-2 border-pink-600' 
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
