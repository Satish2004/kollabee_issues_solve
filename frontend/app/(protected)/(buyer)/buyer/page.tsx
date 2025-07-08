"use client";

import { useEffect, useState } from "react";
import { Info, ArrowRight, ArrowUpRightFromCircle, Bell } from "lucide-react";
import SupplierCards from "../../../../components/buyer/supplier-cards";
import Link from "next/link";
import ProductCard from "../../../../components/product/product-card";
import { wishlistApi } from "@/lib/api/wishlist";
import { cartApi } from "@/lib/api/cart";
import { productsApi } from "@/lib/api/products";
import { Skeleton } from "@/components/ui/skeleton";
import { sellerApi } from "@/lib/api/seller";
import { useCheckout } from "@/contexts/checkout-context";
import NotificationItem from "@/components/notifications/notification-item";
import { dashboardApi } from "@/lib/api";
import { toast } from "sonner";

const Dashboard = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sellers, setSellers] = useState<any[]>([]);
  const { products, fetchProducts, setProducts } = useCheckout();
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [recommendedSellers, setRecommendedSellers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotificationsLoading(true);
        const response = await dashboardApi.getBuyerNotifications(1, 3);
        setNotifications(response.data || response.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsApi.getProducts();
        setAllProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    const getWishlistProducts = async () => {
      try {
        setIsLoading(true);
        const response = await wishlistApi.getWishlist();
        setWishlistProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    const getSellers = async () => {
      try {
        setIsLoading(true);
        const response = await sellerApi.getSellers();
        setSellers(response);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
      }
    };

    const fetchRecommendedProducts = async () => {
      try {
        const response = await productsApi.getRecommendedProducts(10);
        setRecommendedProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      }
    }

    const fetchRecommendedSuppliers = async () => {
      try {
        const response = await productsApi.getRecommendedSuppliers(10);
        setRecommendedSellers(response.data);
      } catch (error) {
        console.error("Failed to fetch recommended suppliers:", error);
      }
    }

    fetchRecommendedSuppliers();


    fetchRecommendedProducts();

    getProducts();
    getWishlistProducts();
    getSellers();
    fetchProducts();

    if (products && wishlistProducts) {
      setIsLoading(false);
    }
  }, []);

  const isInCart = (productId: string) => {
    return products.findIndex((p: any) => p.product.id === productId) > -1;
  };

  const isInWishlist = (productId: string) => {
    return (
      wishlistProducts.findIndex((p: any) => p.product.id === productId) > -1
    );
  };

  const removeFromCart = (productId: string) => {
    const item = products.find((p: any) => p.product.id === productId);
    const itemId = item?.id;
    cartApi.removeFromCart(itemId);
    setProducts(products.filter((p: any) => p.id !== itemId));
  };

  const removeFromWishlist = (productId: string) => {
    try {
      const item = wishlistProducts.find(
        (p: any) => p.product.id === productId
      );
      const itemId = item?.id;
      wishlistApi.removeFromWishlist(itemId);
      setWishlistProducts(wishlistProducts.filter((p: any) => p.id !== itemId));
    } catch {
      console.error("Failed to remove product from wishlist");
    }
  };

  return (
    <main className="min-h-screen md:px-6 max-w-screen overflow-x-hidden overflow-hidden">
      <div className="space-y-3 sm:space-y-6">
        {/* Top section with 4 feature boxes */}
        {/* <FeatureBoxes /> */}

        {/* Middle section with Quick Action and Account Activity */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-6 bg-white rounded-xl p-3 sm:p-5">
          {/* Quick Action */}
          <div className="w-full md:w-2/3">
            <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">
              Quick Action
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <ActionCards />
            </div>
          </div>

          {/* Account Activity */}
          <div className="w-full md:w-1/3 mt-3 md:mt-0">
            <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">
              Account Activity
            </h2>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              {notificationsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                  <Link
                    href="/buyer/notifications"
                    className="text-xs text-blue-600 hover:underline mt-2 block text-center"
                  >
                    View all activity
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Bell className="w-8 h-8 text-gray-400 mb-2" />
                  <h3 className="font-medium text-sm text-gray-900 mb-1">
                    No activities yet
                  </h3>
                  <p className="text-xs text-gray-500 text-center">
                    Once you start engaging with KollaBee, your activities will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:p-6">
          <h2 className="text-base sm:text-lg max-md:p-2 font-medium mb-2 sm:mb-4">
            Recommended Supplier
          </h2>
          <SupplierCards sellers={recommendedSellers} />
        </div>

        {/* Promotional Banner */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-400 to-pink-600 p-3 sm:p-8 max-w-6xl mx-auto">
          <div className="relative z-10 max-w-full sm:max-w-2xl">
            <span className="text-white/90 mb-1 sm:mb-2 block text-xs sm:text-base">
              Upgrade Your Plan
            </span>
            <h2 className="text-base sm:text-3xl font-bold text-white mb-1 sm:mb-2 line-clamp-2 sm:line-clamp-none">
              Discover new markets and expand your reach with Kollabee.
            </h2>
            <p className="text-white/80 mb-3 sm:mb-6 text-xs sm:text-base line-clamp-3 sm:line-clamp-none">
              Reduce Trade Barriers. Find reliable partners, negotiate deals,
              and grow your exports/imports effortlessly on Kollabee.
            </p>
            <button className="border border-white text-white hover:text-orange-500 px-2 py-1 sm:py-2 rounded-md font-medium hover:bg-white/90 transition-colors text-xs sm:text-base">
              Upgrade my KollaBee
            </button>
          </div>
          <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 text-[180px] font-bold leading-none text-white/90">
            <div className="relative">
              <span>65%</span>
              <span className="block text-[120px]">Better</span>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/30 to-transparent" />
            </div>
          </div>
        </div>



        {/* Recommended Products */}
        <div className="space-y-2 sm:space-y-4 bg-white rounded-xl p-3 sm:p-5 mt-3 sm:mt-6">
          <h2 className="font-semibold text-base sm:text-lg">
            Recommended Products
          </h2>
          <div className="w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      className="h-[300px] sm:h-[450px] w-full bg-gray-200 flex flex-col gap-2 sm:gap-4 p-2 sm:p-4"
                    >
                      <Skeleton className="h-24 sm:h-40 w-full bg-gray-400" />
                      <Skeleton className="h-2 sm:h-4 w-6 sm:w-10 bg-gray-400" />
                      <Skeleton className="h-2 sm:h-4 w-10 sm:w-16 bg-gray-400" />
                      <Skeleton className="h-4 sm:h-6 w-20 sm:w-32 bg-gray-400" />
                      <Skeleton className="h-5 sm:h-8 w-20 sm:w-32 bg-gray-400" />
                      <div className="space-y-2 sm:space-y-4">
                        <Skeleton className="h-6 sm:h-10 w-full bg-gray-400" />
                        <Skeleton className="h-6 sm:h-10 w-full bg-gray-400" />
                      </div>
                    </Skeleton>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
                {recommendedProducts &&
                  recommendedProducts.map((product, index) => {
                    return (
                      <ProductCard
                        key={index + 1}
                        product={product}
                        isInCart={isInCart}
                        isInWishlist={isInWishlist}
                        removeFromCart={removeFromCart}
                        removeFromWishlist={removeFromWishlist}
                        setWishlistProducts={setWishlistProducts}
                        wishlistProducts={wishlistProducts}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export function ActionCards() {
  return (
    <>
      {actionCards.map((card, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-2 sm:p-6 flex flex-col"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col max-w-[75%]">
              <div
                className={`w-6 h-6 sm:w-12 sm:h-12 rounded-full ${card.bgColor} flex items-center justify-center mb-1 sm:mb-4`}
              >
                <span className="text-xs sm:text-lg">{card.icon}</span>
              </div>
              <h3 className="font-medium mb-0.5 sm:mb-1 text-xs sm:text-base truncate">
                {card.title}
              </h3>
              <p className="text-[10px] sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-none">
                {card.description}{" "}
                {card.actionText && (
                  <Link
                    href={card.actionLink || "#"}
                    className="text-red-500 hover:underline"
                  >
                    {card.actionText}
                  </Link>
                )}
              </p>
            </div>
            <Link
              href={card.link}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}

export function FeatureBoxes() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 overflow-hidden">
      {featureBoxes.map((box, index) => (
        <div key={index} className="bg-white rounded-xl p-2 sm:p-4 shadow-sm">
          <h2 className="text-gray-500 font-medium mb-1 sm:mb-2 text-[10px] sm:text-sm truncate">
            {box.title}
          </h2>
          <div className="flex justify-between items-center gap-1 sm:gap-4">
            <span className="text-[8px] sm:text-[10px] font-semibold whitespace-nowrap">
              {box.action}
            </span>
            <div className="flex items-center gradient-text">
              <span className="text-[9px] sm:text-[12px] font-medium mr-0.5 sm:mr-1">
                {box.count}
              </span>
              <span className="text-[8px] sm:text-[12px] text-gray-500 hidden xs:inline">
                Suppliers
              </span>
              <ArrowUpRightFromCircle className="w-2 h-2 sm:w-3 sm:h-3 cursor-pointer ml-0.5 sm:ml-2 text-gray-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;



const actionCards = [
  {
    icon: "👤",
    bgColor: "bg-red-100",
    title: "Saved Suppliers",
    description: "You don't have any suppliers here, saved",
    link: "/buyer/my-suppliers",
  },
  {
    icon: "💬",
    bgColor: "bg-blue-100",
    title: "Chat Requests",
    description: "Your chat requests from the suppliers and admins",
    link: "/buyer/chat",
  },
  {
    icon: "📱",
    bgColor: "bg-pink-100",
    title: "Saved Products",
    description: "You don't have saved products right now,",
    link: "/buyer/wishlist",
    actionText: "browse products",
    actionLink: "/buyer/marketplace",
  },
];
