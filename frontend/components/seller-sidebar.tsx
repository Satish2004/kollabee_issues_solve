"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { authApi } from "@/lib/api/auth";
import { removeToken } from "@/lib/utils/token";

type SidebarProps = {
  className?: string;
};

export function SellerSidebar({ className }: SidebarProps) {
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout(); // Add logout endpoint to authApi if not exists
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const routes = [
    {
      label: "MAIN",
      routes: [
        {
          label: "Dashboard",
          icon: Home,
          href: "/seller",
        },
        {
          label: "Products",
          icon: Store,
          href: "/seller/products",
          className: "tour-products"
        },
        // {
        //   label: "Add Product",
        //   icon: Plus,
        //   href: "/seller/products/add",
        // },
        {
          label: "Chat",
          icon: MessageSquare,
          href: "/seller/chat",
          className: "tour-chat"
        },
        {
          label: "Requests",
          icon: MessageSquare,
          href: "/seller/request",
          className: "tour-requests"
        },
        // {
        //   label: "Orders",
        //   icon: ShoppingCart,
        //   href: "/seller/orders",
        // },
        // {
        //   label: "Profile",
        //   icon: User,
        //   href: "/seller/profile",
        // },
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
          label: "Advertise",
          icon: Headphones,
          href: "/seller/advertise",
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
          "flex h-full flex-col gap-4 border-r bg-background p-4 transition-all duration-300",
          isCollapsed ? "w-[80px]" : "w-[250px]",
          "relative"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center py-2">
            <Image
              src="/kollabee.jpg"
              alt="KollaBee"
              width={isCollapsed ? 40 : 150}
              height={40}
              className="rounded-full cursor-pointer"
              onClick={()=>router.push("/seller")}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="border border-border hover:bg-muted rounded-md"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-all",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-6">
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
                    <route.icon className="h-4 w-4" />
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