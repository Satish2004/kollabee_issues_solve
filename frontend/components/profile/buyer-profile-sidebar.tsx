"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  Star, 
  User, 
  MapPin, 
  Bell, 
  HelpCircle, 
  Info, 
  LogOut,
  Menu 
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { profileApi } from "@/lib/api/profile"
import { authApi } from "@/lib/api/auth"
import { User as UserType } from "@/types/api"

export default function BuyerProfileSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await profileApi.getCurrentUser();
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      title: "Orders",
      icon: ShoppingBag,
      href: "/profile/buyer/orders",
    },
    {
      title: "Wishlist",
      icon: Heart,
      href: "/profile/buyer/wishlist",
    },
    {
      title: "Payment methods",
      icon: CreditCard,
      href: "/profile/buyer/payment",
    },
    {
      title: "My reviews",
      icon: Star,
      href: "/profile/buyer/reviews",
    },
  ];

  const accountItems = [
    {
      title: "Personal info",
      icon: User,
      href: "/profile/buyer/profile-info",
    },
    {
      title: "Addresses",
      icon: MapPin,
      href: "/profile/buyer/addresses",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/profile/buyer/notifications",
    },
  ];

  const helpItems = [
    {
      title: "Help center",
      icon: HelpCircle,
      href: "/help",
    },
    {
      title: "Terms and conditions",
      icon: Info,
      href: "/terms",
    },
    {
      title: "Log out",
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  const SidebarContent = () => (
    <div className="h-full w-full">
      <div className="flex items-center space-x-3 p-6 border-b">
        <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
          {userData?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold">{userData?.name}</h3>
          <p className="text-sm text-muted-foreground">{userData?.email}</p>
        </div>
      </div>

      <div className="p-4 space-y-8">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-2 text-sm rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div>
          <h4 className="mb-2 px-4 text-sm font-semibold">Manage account</h4>
          <nav className="space-y-1">
            {accountItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2 text-sm rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="mb-2 px-4 text-sm font-semibold">Customer service</h4>
          <nav className="space-y-1">
            {helpItems.map((item, index) => (
              item.href ? (
                <Link 
                  key={index} 
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-2 text-sm rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ) : (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={item.onClick}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  <span>{item.title}</span>
                </Button>
              )
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex border-r w-64 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}