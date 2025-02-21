"use client";

import { Bell, Menu, Search, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function CartNavbar() {
  return (
    <nav className="w-full border-b border-[#e5e5e5] bg-[#ffffff]">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button className="hover:opacity-80">
                <Menu className="h-5 w-5 text-[#363638]" />
              </button>
              <span className="font-medium text-[#363638]">Cart</span>
            </div>

            {/* Search Section */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666666]" />
              <Input
                type="search"
                placeholder="Search for product"
                className="pl-10 border-none rounded-md placeholder:text-[#666666]"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ">
            <button className="relative hover:opacity-80 p-2 rounded-md border border-[#E5E5E5]">
              <Bell className="h-5 w-5 text-[#363638]" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>
            <button className="hover:opacity-80 p-2 rounded-md border border-[#E5E5E5]">
              <Wallet className="h-5 w-5 text-[#363638]" />
            </button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}
