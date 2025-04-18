"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Store,
  Users,
  MessageSquare,
  ShoppingCart,
  Headphones,
  UserCog,
  HelpCircle,
  LogOut,
  ChevronLeft,
  User,
  Settings,
  Plus,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { authApi } from "@/lib/api/auth";
import { removeToken } from "@/lib/utils/token";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { PiChatCenteredDotsFill } from "react-icons/pi";
import { IoStorefront } from "react-icons/io5";
import IconRenderer2 from "../buyer/icons-render-from-figma";

type SidebarProps = {
  className?: string;
};

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout(); // Add logout endpoint to authApi if not exists
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const routes = [
    {
      label: "",
      routes: [
        {
          label: "Dashboard",
          icon: Home,
          href: "/admin",
        },
        {
          label: "Suppliers",
          icon: IoStorefront,
          href: "/admin/suppliers",
          className: "tour-products",
        },
        {
          label: "Buyers",
          icon: User,
          href: "/admin/buyers",
        },
        // {
        //   label: "Add Product",
        //   icon: Plus,
        //   href: "/seller/products/add",
        // },
        {
          label: "Messages",
          icon: HiChatBubbleLeftRight,
          href: "/admin/chat",
          className: "tour-chat",
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
        // {
        //   label: "Settings",
        //   icon: Settings,
        //   href: "/seller/settings",
        // },
      ],
    },
    {
      label: "GUIDES",
      routes: [
        {
          label: "Events",
          icon: Headphones,
          href: "/admin/events",
          target: "advertise",
        },
        // {
        //   label: "Profile Manage",
        //   icon: UserCog,
        //   href: "/profile/seller/profile-management",
        // },
      ],
    },
  ];

  const menuItems: string = [
    { title: "Dashboard", icon: Home },
    { title: "Products", icon: Package },
  ];

  return (
    <div className={cn("relative min-h-screen", className)}>
      <div
        className={cn(
          "flex h-screen flex-col gap-4 border-r p-4 transition-all duration-300 relative",
          isCollapsed ? "w-[80px]" : "w-[250px]",
          "relative"
        )}
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center justify-center py-2">
            <Image
              src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/w0knrjcs0l7mqswxuway"
              alt="KollaBee"
              width={isCollapsed ? 40 : 150}
              height={40}
              className={`rounded-full cursor-pointer ${
                isCollapsed ? "hidden" : ""
              }`}
              onClick={() => router.push("/seller")}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className=" hover:bg-muted rounded-md absolute top-5 right-4 bg-white p-4 z-90"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-all",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        <div
          className={`flex flex-1 flex-col gap-6 ${isCollapsed ? "mt-10" : ""}`}
        >
          {routes.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              {!isCollapsed && (
                <span className="text-xs text-muted-foreground">
                  {group.label}
                </span>
              )}
              <div className="flex flex-col gap-1">
                {group.routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`${cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-[#78787A]",
                      pathname === route.href && "bg-[#FDECED] text-[#363638]"
                    )} `}
                  >
                    {route.icon === "Custom" ? (
                      <IconRenderer2 icon={route.image} />
                    ) : (
                      <route.icon className="h-4 w-4" />
                    )}
                    {!isCollapsed && <span>{route.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t pt-4">
          <Link
            href="/help"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent"
          >
            <HelpCircle className="h-4 w-4" />
            {!isCollapsed && <span>Help</span>}
          </Link>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-all hover:bg-accent justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
