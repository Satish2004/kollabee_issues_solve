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
  Heart,
  ShoppingCartIcon,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { UserDropdown } from "./user-dropdown";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import IconRenderer from "./icon-render";
import { useCheckout } from "@/contexts/checkout-context";

export default function BuyerLayoutHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { products } = useCheckout();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    {
      label: "Projects",
      icon: "custom",
      href: "/buyer/projects",
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

  if (!currentRoute && pathname.startsWith("/buyer/projects/")) {
    currentRoute = {
      label: "Projects",
      icon: "custom",
      href: "/buyer/projects",
    };
  }

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response: any = await authApi.getCurrentUser();
      setUser(response);
    };
    fetchUser();
  }, []);

  return (
    <div className="w-[94%] sticky top-0 text-lg font-semibold capitalize p-5 bg-white rounded-xl mb-4 flex justify-between items-center z-50 mx-auto my-6 ">
      <div className="flex items-center justify-between gap-2">
        {currentRoute && (
          <IconRenderer icon={currentRoute.icon} className="w-5 h-5" />
        )}
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
          {mobileMenuOpen ? (
          ""
            // <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-100000 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col p-6 h-full">
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

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Link
                  href="/buyer/wishlist"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-full border-neutral-300"
                  >
                    <Heart className="size-5 cursor-pointer" />
                  </Button>
                  <span className="text-xs font-medium">Wishlist</span>
                </Link>

                <Link
                  href="/buyer/cart"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-full border-neutral-300 relative"
                  >
                    <ShoppingCartIcon className="size-5 cursor-pointer" />
                    {numberOfCartItems > 0 && (
                      <div className="flex items-center justify-center absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full">
                        <span className="text-xs font-semibold text-white">
                          {numberOfCartItems}
                        </span>
                      </div>
                    )}
                  </Button>
                  <span className="text-xs font-medium">Cart</span>
                </Link>

                <Link
                  href="/seller/notifications"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
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
                  href="/buyer/chat"
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50"
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

              <div className="mt-auto border-t pt-6">
                <div className="flex justify-center">
                  <UserDropdown onLogout={handleLogout} currentUser={user} />
                </div>
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
        <Link href="/buyer/wishlist">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full border-neutral-300"
            onClick={() => router.push("/seller/notifications")}
          >
            <Heart className="size-7 cursor-pointer" />
          </Button>
        </Link>
        <Link href="/buyer/cart">
          <Button
            variant="outline"
            size="icon"
            className="size-9 rounded-full border-neutral-300 relative"
            onClick={() => router.push("/seller/notifications")}
          >
            <ShoppingCartIcon className="size-8 cursor-pointer" />
            <div className="flex items-center justify-center absolute top-1 right-0 w-3 h-3 bg-gray-600 rounded-full p-1">
              <span className="text-xs font-semibold text-white">
                {numberOfCartItems}
              </span>
            </div>
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full border-neutral-300"
          onClick={() => router.push("/seller/notifications")}
        >
          <Bell className="size-7 cursor-pointer" fill={"currentColor"} />
        </Button>
        <Link href="/buyer/chat">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full border-neutral-300"
            onClick={() => router.push("/seller/chat")}
          >
            <Mail
              className="h-4 w-4 cursor-pointer"
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
