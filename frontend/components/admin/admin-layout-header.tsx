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
import IconRenderer2 from "../buyer/icons-render-from-figma";

export default function AdminLayoutHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authApi.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
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
      icon: "Custom",
      image:
        "https://s3-alpha-sig.figma.com/img/4b80/7b26/0844b5e35e4d0a4cb4ae86b9ac1d8a74?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=D6-4oqaxt72KKqcrq-dH0koOghoe2xNdbm5lxH6wkKC~xEE7efg3xPGmta7Ka1kz5om8OcyyroMvil-y-G~mstgqwV4NkLnhLyc3Lu0i5EpsG94T4AP0peydx4ndzAW6jvKJ0nl3JFw9wZVAyxzY7beh3LA2nAFpjSMigzckwEMRFXwJYJ9Xl3q4NheXa73JVUB9GOi0qL2qXEhWsJYP~1qX8150qr4RAg31KzHAnA8SzUPE75ZTsey0bEWNeQVUys8kD-e0kwEcJB3Qq3TTZPLnvn84OsbNmIZI0NvwdNiCgW7TdIdZLkf5ObRoTDSMi2y16L6-A1tRyUNNomHVbQ__",
      href: "/admin/order",
    },
    {
      label: "Users",
      icon: "Custom",
      image:
        "https://s3-alpha-sig.figma.com/img/55f5/ff7a/fc3ffb170dfb78379cc43abe1c9b594a?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=LGr7VY5oL6y0Tvijn53Dx1h15ZbBpSprws-Mp~ubIPMop4Rh8A~8SeccS829tMp-vGZU7sXjyllQAIed2w40D3dj8pAnTWn96MNHms8QEUXTwP08wa6AKdNmdGd~IbsLPcBGPTA3qZIHoayzEVgH7-w1CNlB581KwDVOgKpcz3beHrUn4JU0K4V2iyOUHWA22GnqrbZ0tipjg7Eb0StwVInSJvbzrM8Ul9Vk39~2wqK5wUKzYToT9EEUuHW6e4tVcYTP3pBdCJGInfeIl3M1f1SXUqBnS6hZO7Uj8vq3AYCYFhYpb0nIzMhQG~n-grtk2HQXYpy-i2GG38XgE-BYjQ__",
      href: "/admin/user",
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
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-[96%] sticky top-0 text-lg font-semibold capitalize p-5 bg-white rounded-xl mb-4 flex justify-between items-center z-50 mx-auto my-6">
      <div className="flex items-center justify-between gap-2">
        {currentRoute && currentRoute.icon === "Custom" ? (
          <IconRenderer2 icon={currentRoute.image} />
        ) : (
          <currentRoute.icon className="w-5 h-5" />
        )}
        <span>{currentRoute ? currentRoute.label : "Dashboard"}</span>
      </div>
      <div className="flex items-center gap-2 ">
        <Button
          variant="outline"
          className="button-bg text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold"
        >
          Upgrade
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          onClick={() => router.push("/seller/notifications")}
        >
          <Bell className="size-7 cursor-pointer" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.push("/seller/chat")}
        >
          <Mail className="h-4 w-4 cursor-pointer" />
        </Button>
        <div className="flex items-center gap-2">
          <UserDropdown onLogout={handleLogout} currentUser={user} />
        </div>
      </div>
    </div>
  );
}
