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
  User2,
  Users2,
  MessagesSquare,
  Share,
  NotebookPen,
  Bot,
  Calendar,
  MessageCircleQuestion,
} from "lucide-react";
import { BsFillCartCheckFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, ElementType } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { authApi } from "@/lib/api/auth";
import { removeToken } from "@/lib/utils/token";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoStorefront } from "react-icons/io5";

type SidebarProps = {
  className?: string;
};

type IconType = ElementType | "custom";

const IconRenderer = ({ icon }: { icon: IconType }) => {
  if (icon === "custom") {
    return (
      <Image
        src="/cross-supplier.svg"
        width={18}
        height={12}
        alt="Custom Icon"
      />
    );
  }

  const IconComponent = icon as ElementType;
  return <IconComponent className="h-4 w-4" />;
};

export function BuyerSidebar({ className }: SidebarProps) {
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

    // Set initial state based on screen size
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }

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
      routes: [
        {
          label: "Dashboard",
          icon: Home,
          href: "/buyer",
        },
        {
          label: "Marketplace",
          icon: IoStorefront,
          href: "/buyer/marketplace",
          // className: "tour-products"
        },
        {
          label: "My Suppliers",
          icon: User2,
          href: "/buyer/my-suppliers",
          // className: "tour-chat"
        },
        {
          label: "Projects",
          icon: "custom",
          href: "/buyer/projects",
          // className: "tour-requests"
        },
        {
          label: "Messages",
          icon: HiChatBubbleLeftRight,
          href: "/buyer/chat",
          // className: "tour-requests"
        },
        {
          label: "Orders",
          icon: BsFillCartCheckFill,
          href: "/buyer/orders",
          // className: "tour-requests"
        },
      ],
    },
    {
      label: "GUIDES",
      routes: [
        {
          label: "Support",
          icon: Headphones,
          href: "/seller/support",
        },
      ],
    },
    {
      label: "OTHERS",
      routes: [
        {
          label: "Invite",
          icon: Share,
          href: "/buyer/invite",
        },
        {
          label: "Calendar",
          icon: Calendar,
          href: "/buyer/appointment",
        },
        {
          label: "Feedback",
          icon: NotebookPen,
          href: "/buyer/contact",
        },
        {
          label: "FAQ",
          icon: MessageCircleQuestion,
          href: "/buyer/faq",
        },
      ],
    },
  ];

  const menuItems: string = [
    { title: "Dashboard", icon: Home },
    { title: "Products", icon: Package },
  ];

  return (
    <div className={cn("relative min-h-screen ", className)}>
      <div
        className={cn(
          "flex h-screen flex-col gap-4 border-r p-4 transition-all duration-300",
          isCollapsed ? "w-[80px]" : "w-[250px]",
          "relative"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center py-2">
            <Image
              src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/w0knrjcs0l7mqswxuway"
              alt="KollaBee"
              width={isCollapsed ? 40 : 150}
              height={40}
              className={`rounded-full cursor-pointer ${
                isCollapsed ? "hidden" : ""
              }`}
              onClick={() => router.push("/buyer")}
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
          {routes.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-2">
              {!isCollapsed && (
                <span className="text-xs text-muted-foreground">
                  {group.label}
                </span>
              )}
              <div className="flex flex-col gap-1">
                {group.routes.map((route, routeIndex) => (
                  <Link
                    key={routeIndex}
                    href={route.href}
                    className={`${cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-[#78787A]",
                      pathname === route.href && "bg-[#FDECED] text-[#363638]"
                    )} `}
                  >
                    <IconRenderer icon={route.icon} />
                    {!isCollapsed && <span>{route.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t pt-4">
          <Link
            href="#"
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
