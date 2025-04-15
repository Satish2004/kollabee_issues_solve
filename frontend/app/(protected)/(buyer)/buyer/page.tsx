"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bell, TrendingUp, TrendingDown, AlertCircle, User, CheckCircle, Bug, Info, ArrowRight, ArrowUpRightFromCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import SupplierCards from '../../../../components/buyer/supplier-cards';
import Link from 'next/link';
import ProductCard from '../../../../components/product/product-card';
import { wishlistApi } from '@/lib/api/wishlist';
import { cartApi } from '@/lib/api/cart';
import { productsApi } from '@/lib/api/products';
import { Skeleton } from '@/components/ui/skeleton';
import { sellerApi } from '@/lib/api/seller';
import { useCheckout } from '@/contexts/checkout-context';

const Dashboard = () => {
    const [allProducts, setAllProducts] = useState<any[]>([])
    const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [sellers, setSellers] = useState<any[]>([])
    const {products, fetchProducts, setProducts } = useCheckout()
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        const response = await productsApi.getProducts()
        setAllProducts(response.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    const getWishlistProducts = async () => {
      try {
        setIsLoading(true)
        const response = await wishlistApi.getWishlist()
        setWishlistProducts(response.items)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    const getSellers = async () => {
      try {
        setIsLoading(true)
        const response = await sellerApi.getSellers()
        setSellers(response)
      } catch (error) {
        console.error('Failed to fetch sellers:', error)
      }
    }

    getProducts()
    getWishlistProducts()
    getSellers()
    fetchProducts()

    if (products && wishlistProducts) {
      setIsLoading(false)
    }
  }, [])

  
      const isInCart = ( productId: string) => {
        return products.findIndex((p:any) => p.product.id === productId) > -1
      }
  
      const isInWishlist = ( productId: string) => {
        return wishlistProducts.findIndex((p:any) => p.product.id === productId) > -1
      }
    
      const removeFromCart = (productId: string) => {
        const item = products.find((p:any) => p.product.id === productId)
        const itemId = item?.id
        cartApi.removeFromCart(itemId)
        setProducts(products.filter((p:any) => p.id !== itemId))
      }
      
      const removeFromWishlist = (productId: string) => {
        try {
          const item = wishlistProducts.find((p:any) => p.product.id === productId)
          const itemId = item?.id
          wishlistApi.removeFromWishlist(itemId)
          setWishlistProducts(wishlistProducts.filter((p:any) => p.id !== itemId))
        } catch {
          console.error('Failed to remove product from wishlist')
        }
      }
  
  return (
    <main className="min-h-screen">
      <div className=" mx-auto space-y-6">
        {/* Top section with 4 feature boxes */}
        <FeatureBoxes />

        {/* Middle section with Quick Action and Account Activity */}
        <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl p-5">
          {/* Quick Action */}
          <div className="md:w-2/3">
            <h2 className="text-lg font-medium mb-4">Quick Action</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionCards />
            </div>
          </div>

          {/* Account Activity */}
          <div className="md:w-1/3">
            <h2 className="text-lg font-medium mb-4">Account Activity</h2>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col items-start">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <Info className="w-5 h-5 text-gray-500" />
                </div>
                <h3 className="font-medium mb-1">No Activities Yet</h3>
                <p className="text-sm text-gray-500">
                  Once you start engaging with the KollaBee, your activities
                  will be shown here..
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with Recommended Supplier */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Recommended Supplier</h2>
          <SupplierCards sellers={sellers} />
        </div>

        {/* Promotional Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-pink-600 p-8 max-w-6xl mx-auto">
          <div className="relative z-10 max-w-2xl">
            <span className="text-white/90 mb-2 block">Upgrade Your Plan</span>
            <h2 className="text-3xl font-bold text-white mb-2">
              Discover new markets and expand your reach with Kollabee.
            </h2>
            <p className="text-white/80 mb-6">
              Reduce Trade Barriers. Find reliable partners, negotiate deals,
              and grow your exports/imports effortlessly on Kollabee.
            </p>
            <button className="border border-white text-white hover:text-orange-500 px-6 py-2 rounded-md font-medium hover:bg-white/90 transition-colors">
              Upgrade my KollaBee
            </button>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[180px] font-bold leading-none text-white/90">
            <div className="relative">
              <span>65%</span>
              <span className="block text-[120px]">Better</span>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-600/30 to-transparent" />
            </div>
          </div>
        </div>

    {/* Recently Viewed Products */}
    <div className="space-y-4 bg-white rounded-xl p-5">
        <h2 className=" font-semibold">Recently Viewed Products</h2>
        <div className=" w-full">
        {isLoading ? ( 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            { Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[450px] w-full bg-gray-200 flex flex-col gap-4 p-4">
            <Skeleton className="h-40 w-full bg-gray-400" />
            <Skeleton className="h-4 w-10 bg-gray-400" />
            <Skeleton className="h-4 w-16 bg-gray-400" />
            <Skeleton className="h-6 w-32 bg-gray-400" />
            <Skeleton className="h-8 w-32 bg-gray-400" />
            <div className='space-y-4'> 
              <Skeleton className="h-10 w-full bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-400" />
            </div>
          </Skeleton>
        )) }
        </div> ): (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {
              allProducts && allProducts.map((product, index) => {
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
              />)
})
            }

          </div>
        )}
      </div>
        </div>
    </div>

    {/* Recommended Products */}
    <div className="space-y-4 bg-white rounded-xl p-5">
    <h2 className=" font-semibold">Recommended Products</h2>
    <div className="w-full">
    {isLoading ? ( 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            { Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[450px] w-full bg-gray-200 flex flex-col gap-4 p-4">
            <Skeleton className="h-40 w-full bg-gray-400" />
            <Skeleton className="h-4 w-10 bg-gray-400" />
            <Skeleton className="h-4 w-16 bg-gray-400" />
            <Skeleton className="h-6 w-32 bg-gray-400" />
            <Skeleton className="h-8 w-32 bg-gray-400" />
            <div className='space-y-4'> 
              <Skeleton className="h-10 w-full bg-gray-400" />
              <Skeleton className="h-10 w-full bg-gray-400" />
            </div>
          </Skeleton>
        )) }
        </div> ): (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {
              allProducts && allProducts.map((product, index) => {
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
              />)
})
            }

          </div>
        )}
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
          className="border border-gray-200 rounded-lg p-6 flex flex-col"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div
                className={`w-12 h-12 rounded-full ${card.bgColor} flex items-center justify-center mb-4`}
              >
                <span className="text-lg">{card.icon}</span>
              </div>
              <h3 className="font-medium mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500">
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
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}

export function FeatureBoxes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {featureBoxes.map((box, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-gray-500 font-medium mb-2 text-sm">
            {box.title}
          </h2>
          <div className="flex justify-between items-center gap-4">
            <span className="text-[10px] font-semibold">{box.action}</span>
            <div className="flex items-center gradient-text">
              <span className="text-[12px]  font-medium mr-1">{box.count}</span>
              <span className="text-[12px] text-gray-500">Suppliers for you</span>
              <ArrowUpRightFromCircle className="w-3 h-3 cursor-pointer ml-2 text-gray-500" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;

const featureBoxes = [
  {
    title: "AI Personalized Suppliers For You",
    action: "Find Supplier",
    count: 321,
  },
  {
    title: "Top Deals of Today",
    action: "Top Deals",
    count: 431,
  },
  {
    title: "Top Ranking Products",
    action: "Best For You",
    count: 431,
  },
  {
    title: "Trending Products",
    action: "Find Supplier",
    count: 431,
  },
];

  const actionCards = [
    {
      icon: "👤",
      bgColor: "bg-red-100",
      title: "Saved Suppliers",
      description: "You don't have any suppliers here, saved",
      link: "#",
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
    {
      icon: "📩",
      bgColor: "bg-yellow-100",
      title: "Chat Requests",
      description: "Your chat requests from the suppliers and admins",
      link: "/buyer/chat",
    },
  ];

const products = Array(3).fill({
  image: "/placeholder.svg?height=300&width=400",
  rating: 5.0,
  reviews: 11,
  priceRange: "$850.00-1,100.00",
  minOrder: "200 Pieces",
  supplier: {
    name: "Marcos Cottons Co.,Ltd",
    years: 2,
    country: "CN",
    verified: true,
  },
});
