"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  Users,
  MessageSquare,
  ShoppingCart,
  Bell,
  Mail,
  StoreIcon,
  PenTool,
  Headphones,
  UserCog,
  Settings,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserDropdown } from "./user-dropdown";

export default function AdminLayoutHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [ user , setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authApi.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);
  
  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/admin",
      color: "text-gray-800",
      fontWeight: "font-bold",
    },
    {
      label: "Suppliers",
      icon: Store,
      href: "/admin/suppliers",
    },
    {
      label: "Buyers",
      icon: Users,
      href: "/admin/buyers",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/admin/chats",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
  ];

  let currentRoute = routes.find((route) => pathname === route.href);
  if (!currentRoute && pathname.startsWith("/seller/update-product/")) {
    currentRoute = {
      label: "Update Product",
      icon: PenTool,
      href: "/seller/update-product",
    };
  }
  console.log(currentRoute);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-[96%] sticky top-0 text-lg font-semibold capitalize p-5 bg-white rounded-xl mb-4 flex justify-between items-center z-50 mx-auto my-6">
      <div className="flex items-center justify-between gap-2">
        {currentRoute && <currentRoute.icon className="w-5 h-5" />}
        <span>{currentRoute ? currentRoute.label : "Dashboard"}</span>
      </div>
      <div className="flex items-center gap-2 ">
        <Button variant="outline" className="button-bg text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold">
          Upgrade
        </Button>
        <Button variant="ghost" size="icon" className="size-10" onClick={()=>router.push("/seller/notifications")}>
          <Bell className="size-7 cursor-pointer"  />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=>router.push("/seller/chat")}>
          <Mail className="h-4 w-4 cursor-pointer"  />
        </Button>
        <div className="flex items-center gap-2">
          <UserDropdown onLogout={handleLogout} currentUser={user} />
        </div>
      </div>
    </div>
  );
}
