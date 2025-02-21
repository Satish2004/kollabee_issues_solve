'use client'

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { signOut } from "@/app/home/actions"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Menu, ShoppingCart, Heart, Search } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useGetUserFromDb } from "@/hooks/use-auth"
import { useGlobalStore } from "@/store/store"
import { useEffect } from "react"
import { getCartItemsAction } from "@/actions/cart"
import { getWishlistItemsAction } from "@/actions/wish-list"
import { useQueryClient } from "@tanstack/react-query"
import SearchContainer from "./search/searchContainer"
import Image from "next/image"

export function Navbar() {
  const { data: currentUser } = useGetUserFromDb()
  const { cart, setCart, wishList, setWishList } = useGlobalStore();
  const queryClient = useQueryClient()

  useEffect(() => {
    const initialize = async () => {
      if(currentUser){
        const cartItems = await getCartItemsAction()
        
        if(cartItems) setCart(cartItems)
        const wishListItems = await getWishlistItemsAction()
        if(wishListItems) setWishList(wishListItems)
      } 
      else {
        const cart = localStorage.getItem('cart')
        if(cart) {
          setCart(JSON.parse(cart))
        } else {
          localStorage.setItem('cart', JSON.stringify([]))
          setCart([])
        }
        const wishList = localStorage.getItem('wishList')
        if(wishList) {
          setWishList(JSON.parse(wishList))
        } else {
          localStorage.setItem('wishList', JSON.stringify([]))
          setWishList([])
        }
      }
    }
    initialize()
  }, [currentUser])

  return (
    <header className="w-full border-b border-[#e5e5e5] bg-[#ffffff] fixed z-10">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={"/kollabee.jpg"}
                width={10000}
                height={2542}
                alt="logo"
                className="w-28"
              />
            </Link>
            {/* <nav className="hidden md:flex items-center ml-6 space-x-6 text-sm font-medium">
              {currentUser && (
                <Link
                  href="/home"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Home
                </Link>
              )}
            </nav> */}
          </div>
          <SearchContainer />
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col space-y-4 mt-4">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="text-xl font-bold">NextMarket</span>
                </Link>
                {currentUser && (
                  <Link
                    href="/home"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Link href="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:opacity-80 p-2 rounded-md border border-[#E5E5E5]"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/wishlist" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:opacity-80 p-2 rounded-md border border-[#E5E5E5]"
            >
              <Heart className="h-5 w-5" />
              {wishList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {wishList.length}
                </span>
              )}
            </Button>
          </Link>

          <ThemeToggle />
          {!currentUser ? (
            <Link href="/login">
              <Button variant="outline" size="sm" className="px-4">
                Login
              </Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href={`/profile`}>
                <Avatar className="h-8 w-8 transition-transform hover:scale-105">
                  <AvatarImage src={currentUser?.imageUrl || currentUser?.name?.slice(0, 1)} />
                  <AvatarFallback className="bg-primary/10">
                    {currentUser?.name?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                onClick={async () => {
                  queryClient.removeQueries({ queryKey: ["user"] });
                  await signOut();
                }}
                variant="outline"
                size="sm"
                className="hidden md:inline-flex hover:bg-destructive/10 hover:text-destructive"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
        <Button
          onClick={async () => {
            queryClient.removeQueries({ queryKey: ["user"] });
            await signOut();
          }}
          variant="outline"
          size="sm"
          className="hidden md:inline-flex hover:bg-destructive/10 hover:text-destructive"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
