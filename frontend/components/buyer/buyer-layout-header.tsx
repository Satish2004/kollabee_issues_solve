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
  Heart,
  ShoppingCartIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { UserDropdown } from "./user-dropdown";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useCheckout } from "@/contexts/checkout-context";
import { useAuth } from "@/contexts/auth-context";

export default function BuyerLayoutHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { products } = useCheckout();
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

  const numberOfCartItems = products.length;
  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/seller",
      color: "text-gray-800",
      fontWeight: "font-bold",
    },
    {
      label: "Your Products",
      icon: Store,
      href: "/seller/products",
    },
    {
      label: "Customers",
      icon: Users,
      href: "/seller/customers",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/seller/messages",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/seller/orders",
    },
    {
      label: "Requests",
      icon: Store,
      href: "/seller/request",
    },
    {
      label: "Advertise",
      icon: Headphones,
      href: "/seller/advertise",
    },
    {
      label: "Profile Manage",
      icon: UserCog,
      href: "/seller/profile/seller",
    },
    {
      label: "Post New Product",
      icon: StoreIcon,
      href: "/seller/add-product",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/seller/settings",
    },
    {
      label: "Chat",
      icon: MessageSquare,
      href: "/seller/chat",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/seller/notifications",
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
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <div className="w-[94%] sticky top-0 text-lg font-semibold capitalize p-5 bg-white rounded-xl mb-4 flex justify-between items-center z-50 mx-auto my-6 ">
      <div className="flex items-center justify-between gap-2">
        {currentRoute && <currentRoute.icon className="w-5 h-5" />}
        <span>{currentRoute ? currentRoute.label : "Dashboard"}</span>
      </div>
      <div className="flex items-center gap-4 ">
        <Button variant="outline" className="button-bg text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold">
          Upgrade
        </Button>
        <Link href="/buyer/wishlist">
        <Button variant="outline" size="icon" className="size-8 rounded-full border-neutral-300" onClick={()=>router.push("/seller/notifications")}>
          <Heart className="size-7 cursor-pointer"  />
        </Button>
        </Link>
        <Link href="/buyer/cart">
        <Button variant="outline" size="icon" className="size-9 rounded-full border-neutral-300 relative" onClick={()=>router.push("/seller/notifications")}>
          <ShoppingCartIcon className="size-8 cursor-pointer"  />
          <div className="flex items-center justify-center absolute top-1 right-0 w-3 h-3 bg-gray-600 rounded-full p-1">
            <span className="text-xs font-semibold text-white">{numberOfCartItems}</span>
          </div>
        </Button>
        </Link>
        <Button variant="outline" size="icon" className="size-8 rounded-full border-neutral-300" onClick={()=>router.push("/seller/notifications")}>
          <Bell className="size-7 cursor-pointer" fill={"currentColor"} />
        </Button>
        <Link href="/buyer/chat">
        <Button variant="outline" size="icon" className="size-8 rounded-full border-neutral-300" onClick={()=>router.push("/seller/chat")}>
          <Mail className="h-4 w-4 cursor-pointer"  fill={"currentColor"} stroke="white"  />
        </Button>
        </Link>
        <div className="flex items-center gap-2">
          <UserDropdown onLogout={handleLogout} currentUser={user} />
        </div>
      </div>
    </div>
  );
}
