"use client";

import { Button } from "../ui/button";
import IconRenderer from "./icon-render";
import { UserDropdown } from "./user-dropdown";
import { useCheckout } from "@/contexts/checkout-context";
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
  Heart,
  ShoppingCartIcon,
  Menu,
  X,
  Calendar,
  NotebookPen,
  MessageCircleQuestion,
  Share,
  Search,
} from "lucide-react";
import { User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoStorefront } from "react-icons/io5";
import { Input } from "../ui/input";
import { IconType } from "react-icons";

export default function BuyerLayoutHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { products } = useCheckout();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const routes = useMemo(
    () => [
      {
        label: "Update Product",
        icon: PenTool,
        href: "/seller/update-product",
        patterns: ["/seller/update-product/", "/seller/products/edit/"],
      },
      {
        label: "Add Product",
        icon: StoreIcon,
        href: "/seller/add-product",
        patterns: ["/seller/add-product"],
      },
      {
        label: "Profile Management",
        icon: UserCog,
        href: "/seller/profile",
        patterns: ["/seller/profile/"],
      },
      {
        label: "Projects",
        icon: "custom",
        href: "/buyer/projects",
        patterns: ["/buyer/projects/", "/buyer/project/"],
      },
      {
        label: "Marketplace",
        icon: IoStorefront,
        href: "/buyer/marketplace",
        patterns: ["/buyer/marketplace/"],
      },
      {
        label: "My Suppliers",
        icon: User2,
        href: "/buyer/my-suppliers",
        patterns: ["/buyer/my-suppliers/", "/buyer/suppliers/"],
      },
      {
        label: "Messages",
        icon: HiChatBubbleLeftRight,
        href: "/buyer/chat",
        patterns: ["/buyer/chat/", "/buyer/messages/"],
      },
      {
        label: "Orders",
        icon: ShoppingCart,
        href: "/buyer/orders",
        patterns: ["/buyer/orders/", "/buyer/order/"],
      },
      {
        label: "Cart",
        icon: ShoppingCartIcon,
        href: "/buyer/cart",
        patterns: ["/buyer/cart/"],
      },
      {
        label: "Wishlist",
        icon: Heart,
        href: "/buyer/wishlist",
        patterns: ["/buyer/wishlist/"],
      },
      {
        label: "Invite",
        icon: Share,
        href: "/buyer/invite",
        patterns: ["/buyer/invite/"],
      },
      {
        label: "Calendar",
        icon: Calendar,
        href: "/buyer/appointment",
        patterns: ["/buyer/appointment/", "/buyer/calendar/"],
      },
      {
        label: "Feedback",
        icon: NotebookPen,
        href: "/buyer/contact",
        patterns: ["/buyer/contact/", "/buyer/feedback/"],
      },
      {
        label: "FAQ",
        icon: MessageCircleQuestion,
        href: "/buyer/faq",
        patterns: ["/buyer/faq/"],
      },
      {
        label: "Support",
        icon: Headphones,
        href: "/buyer/support",
        patterns: ["/buyer/support/"],
      },
      {
        label: "Help",
        icon: MessageCircleQuestion,
        patterns: ["/buyer/help"],
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/buyer/settings",
        patterns: ["/buyer/settings/"],
      },
      {
        label: "Notifications",
        icon: Bell,
        href: "/buyer/notifications",
        patterns: ["/buyer/notifications/"],
      },
      // Seller routes
      {
        label: "Your Products",
        icon: Store,
        href: "/seller/products",
        patterns: ["/seller/products/"],
      },
      {
        label: "Customers",
        icon: Users,
        href: "/seller/customers",
        patterns: ["/seller/customers/"],
      },
      {
        label: "Seller Messages",
        icon: MessageSquare,
        href: "/seller/messages",
        patterns: ["/seller/messages/"],
      },
      {
        label: "Seller Orders",
        icon: ShoppingCart,
        href: "/seller/orders",
        patterns: ["/seller/orders/"],
      },
      {
        label: "Requests",
        icon: Store,
        href: "/seller/request",
        patterns: ["/seller/request/", "/seller/requests/"],
      },
      {
        label: "Advertise",
        icon: Headphones,
        href: "/seller/advertise",
        patterns: ["/seller/advertise/"],
      },
      {
        label: "Seller Chat",
        icon: MessageSquare,
        href: "/seller/chat",
        patterns: ["/seller/chat/"],
      },
      {
        label: "Seller Notifications",
        icon: Bell,
        href: "/seller/notifications",
        patterns: ["/seller/notifications/"],
      },
      {
        label: "Seller Settings",
        icon: Settings,
        href: "/seller/settings",
        patterns: ["/seller/settings/"],
      },
      {
        label: "Seller Dashboard",
        icon: Home,
        href: "/seller",
        patterns: ["/seller"],
        exact: true,
      },
      {
        label: "Dashboard",
        icon: Home,
        href: "/buyer",
        patterns: ["/buyer"],
        exact: true,
      },
    ],
    []
  );

  const getCurrentRoute = useMemo(() => {
    const exactMatch = routes.find((route) => {
      if (route.exact) {
        return pathname === route.href;
      }
      return false;
    });

    if (exactMatch) return exactMatch;

    const patternMatch = routes.find((route) => {
      if (route.patterns) {
        return route.patterns.some((pattern) => {
          if (pattern.endsWith("/")) {
            return (
              pathname.startsWith(pattern) || pathname === pattern.slice(0, -1)
            );
          }
          return pathname.startsWith(pattern);
        });
      }
      return false;
    });

    if (patternMatch) return patternMatch;

    const basicMatch = routes.find((route) => {
      if (route.exact) return false;
      if (!route.href) return false;
      return pathname.startsWith(route.href) && pathname !== route.href;
    });

    if (basicMatch) return basicMatch;

    if (pathname.startsWith("/buyer")) {
      return {
        label: "Dashboard",
        icon: Home,
        href: "/buyer",
      };
    }

    if (pathname.startsWith("/seller")) {
      return {
        label: "Seller Dashboard",
        icon: Home,
        href: "/seller",
      };
    }

    return {
      label: "Dashboard",
      icon: Home,
      href: "/",
    };
  }, [pathname, routes]);

  const currentRoute = getCurrentRoute;

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
      try {
        const response = await authApi.getCurrentUser();
        setUser(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const numberOfCartItems = products.length;

  useEffect(() => {
    if (!searchTerm.trim()) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      router.push(`/buyer/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }, 400);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchTerm]);
  
  

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/buyer/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  

  console.log("Current route:", currentRoute, "Pathname:", pathname);

  return (
    <div className="w-[95%] sticky top-0 text-lg font-semibold capitalize p-5 bg-white rounded-xl mb-4 flex justify-between items-center z-50 mx-auto my-6">
      <div className="flex items-center justify-between gap-2">
        {currentRoute && (
          <IconRenderer icon={currentRoute.icon as IconType} className="w-5 h-5" />
        )}
        <span>{currentRoute ? currentRoute.label : "Dashboard"}</span>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-xl mx-4 flex items-center bg-[#fafafa] rounded-lg border border-gray-200 px-2 py-1 shadow-sm"
        style={{ minWidth: 250 }}
      >
        <Input
          type="text"
          placeholder="Search for product you are looking for"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border-none bg-transparent focus:ring-0 flex-1 text-base"
        />
        <button title="search product" type="submit" className="p-2 text-gray-500 hover:text-black">
          <Search className="w-5 h-5" />
        </button>
      </form>

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
                    className={`size-10 rounded-full ${numberOfCartItems > 3
                        ? "border-red-500 border-2"
                        : "border-neutral-300"
                      } relative`}
                  >
                    <ShoppingCartIcon className="size-5 cursor-pointer" />
                    {numberOfCartItems > 0 && (
                      <div
                        className={(() => {
                          if (numberOfCartItems > 3) {
                            return "flex items-center justify-center absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full";
                          } else {
                            return "flex items-center justify-center absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full";
                          }
                        })()}
                      >
                        <span className="text-xs font-semibold text-white">
                          {numberOfCartItems}
                        </span>
                      </div>
                    )}
                  </Button>
                  <span className="text-xs font-medium">Cart</span>
                </Link>

                <Link
                  href="/buyer/notifications"
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
          >
            <Heart className="size-7 cursor-pointer" />
          </Button>
        </Link>
        <Link href="/buyer/cart">
          <Button
            variant="outline"
            size="icon"
            className={`size-9 rounded-full ${numberOfCartItems > 3
                ? "border-red-500 border-2"
                : "border-neutral-300"
              } relative`}
          >
            <ShoppingCartIcon className="size-8 cursor-pointer" />
            {numberOfCartItems > 0 && (
              <div
                className={(() => {
                  if (numberOfCartItems > 3) {
                    return "flex items-center justify-center absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full";
                  } else {
                    return "flex items-center justify-center absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full";
                  }
                })()}
              >
                <span className="text-xs font-semibold text-white">
                  {numberOfCartItems}
                </span>
              </div>
            )}
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full border-neutral-300"
          onClick={() => router.push("/buyer/notifications")}
        >
          <Bell className="size-7 cursor-pointer" fill={"currentColor"} />
        </Button>
        <Link href="/buyer/chat">
          <Button
            variant="outline"
            size="icon"
            className="size-8 rounded-full border-neutral-300"
          >
            <Mail
              className="size-7 cursor-pointer"
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
