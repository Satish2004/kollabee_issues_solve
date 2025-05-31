"use client";

import { Button } from "../ui/button";
import { UserDropdown } from "./user-dropdown";
import { authApi } from "@/lib/api/auth";
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
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SellerLayoutHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Effect to prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Prevent scrolling on the body
      document.body.style.overflow = "hidden";
      // Get current scroll position
      const scrollY = window.scrollY;
      // Apply fixed position to body to prevent iOS bounce effect
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Re-enable scrolling when menu is closed
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1);
      }
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [mobileMenuOpen]);

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
  if (!currentRoute && pathname.startsWith("/seller/products/")) {
    currentRoute = {
      label: "Product",
      icon: Store,
      href: "/seller/products",
    };
  }

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
    <div className="w-[95%] sticky top-0 text-lg font-semibold capitalize p-5 bg-white rounded-xl mb-4 flex justify-between items-center z-50 mx-auto my-6">
      <div className="flex items-center justify-between gap-2">
        {currentRoute && <currentRoute.icon className="w-5 h-5" />}
        <span>{currentRoute ? currentRoute.label : "Dashboard"}</span>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="relative z-50"
        >
          {mobileMenuOpen ? "" : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-screen w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col">
            <div className="flex flex-col p-6 flex-shrink-0">
              <div className="flex justify-end mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold mb-6"
              >
                Upgrade
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* <Link
                  href="/seller/add-product"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-full border-neutral-300"
                  >
                    <Plus className="size-5 cursor-pointer" />
                  </Button>
                  <span className="text-xs font-medium">Add Product</span>
                </Link> */}

                <Link
                  href="/seller/notifications"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-full border-neutral-300"
                  >
                    <Bell
                      className="size-5 cursor-pointer"
                      fill={"currentColor"}
                    />
                  </Button>
                  <span className="text-xs font-medium">Notifications</span>
                </Link>

              

                <Link
                  href="/seller/chat"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-full border-neutral-300"
                  >
                    <Mail
                      className="size-5 cursor-pointer"
                      fill={"currentColor"}
                      stroke="white"
                    />
                  </Button>
                  <span className="text-xs font-medium">Messages</span>
                </Link>
              </div>
            </div>

            <div className="border-t pt-6 px-6 pb-6 flex-shrink-0">
              <div className="flex justify-center">
                <UserDropdown onLogout={handleLogout} currentUser={user} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-4">
        <Button
          variant="outline"
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold"
        >
          Upgrade
        </Button>
        {/* <Link href="/seller/add-product">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full border-neutral-300"
          >
            <Plus className="size-5 cursor-pointer" />
          </Button>
        </Link> */}
        {/* <Link href="/seller/orders">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full border-neutral-300"
          >
            <ShoppingCart className="size-5 cursor-pointer" />
          </Button>
        </Link> */}
        <Link href="/seller/notifications">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full border-neutral-300"
          >
            <Bell className="size-5 cursor-pointer" fill={"currentColor"} />
          </Button>
        </Link>
        <Link href="/seller/chat">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full border-neutral-300"
          >
            <Mail
              className="size-5 cursor-pointer"
              fill={"currentColor"}
              stroke="white"
            />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <UserDropdown onLogout={handleLogout} currentUser={user} />
        </div>
      </div>
    </div>
  );
}
