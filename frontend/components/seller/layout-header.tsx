"use client";
import { useState } from "react";
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
} from "lucide-react";
import { Button } from "../ui/button";
import { UserDropdown } from "./user-dropdown";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SellerLayoutHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    const fetchUser = async () => {
      const response:any = await authApi.getCurrentUser();
      setUser(response);
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full sticky top-0 text-lg font-semibold capitalize p-5 bg-white rounded-lg mb-4 flex justify-between items-center z-50">
      <div className="flex items-center justify-between gap-2">
        {currentRoute && <currentRoute.icon className="w-5 h-5" />}
        <span>{currentRoute ? currentRoute.label : "Dashboard"}</span>
      </div>
      <div className="flex items-center gap-2">
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
