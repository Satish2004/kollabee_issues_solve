"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart } from "lucide-react";
import { BsCartDashFill } from "react-icons/bs";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cartApi } from "@/lib/api/cart";
import { wishlistApi } from "@/lib/api/wishlist";
import { useCheckout } from "@/contexts/checkout-context";
import ContactSupplierButton from "@/components/chat/contact-supplier-button";

interface SearchProductCardProps {
  product: any;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  removeFromCart: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  setWishlistProducts: (products: any[]) => void;
  wishlistProducts: any[];
  fromWishlistPage?: boolean;
}

export default function SearchProductCard({
  product,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromWishlist,
  setWishlistProducts,
  fromWishlistPage = false,
}: SearchProductCardProps) {
  const router = useRouter();
  const { setProducts } = useCheckout();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);
  const [wishlistFeedback, setWishlistFeedback] = React.useState<null | "added" | "removed">(null);

  const handleCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!isInCart(product.id)) {
        setIsLoading(true);
        const response = await cartApi.addToCart({
          productId: product.id,
          quantity: product.minOrderQuantity,
        }) as unknown as { items: any[] };
        setProducts(response.items);
        toast.success("Added to cart");
      } else {
        removeFromCart(product.id);
        toast.success("Removed from cart");
      }
    } catch {
      toast.error("Cart update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsWishlistLoading(true);
      if (!isInWishlist(product.id)) {
        const response = await wishlistApi.addToWishlist(product.id) as unknown as { items: any[] };
        setWishlistProducts(response.items);
        setWishlistFeedback("added");
        toast.success("Added to wishlist");
      } else {
        await removeFromWishlist(product.id);
        setWishlistFeedback("removed");
        toast.success("Removed from wishlist");
      }
    } catch {
      toast.error("Wishlist update failed");
    } finally {
      setIsWishlistLoading(false);
      setTimeout(() => setWishlistFeedback(null), 2000);
    }
  };

  const handleClick = () => {
    router.push(`/buyer/marketplace/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden flex flex-col sm:flex-row gap-4 p-4"
    >
      {/* Product Image */}
      <div className="relative w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
        />
        <Button
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white p-1 shadow hover:bg-gray-100"
        >
          {isWishlistLoading ? (
            <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
          ) : (
            <Heart
              className="w-4 h-4"
              fill={isInWishlist(product.id) ? "red" : "white"}
              stroke={isInWishlist(product.id) ? "red" : "black"}
            />
          )}
        </Button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between w-full gap-3">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-semibold line-clamp-1 text-gray-800">
            {product.name}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="space-y-1 text-sm">
          <div className="text-xl font-bold text-gray-900">
            ₹{Number(product.price).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            Min. Order:{" "}
            <span className="font-medium">
              {product.minOrderQuantity || 1}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {product.seller?.businessName || "Unknown Supplier"} |{" "}
            {product.seller?.country || "CN"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={handleCart}
            disabled={isLoading}
            className={`flex-1 font-semibold text-xs sm:text-sm py-2 sm:py-6 px-3 sm:px-4 ${isInCart(product.id)
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "flex-1 bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white font-semibold py-6"
              }`}
          >
            {isLoading ? (
              "Loading..."
            ) : isInCart(product.id) ? (
              <span className="flex items-center gap-1">
                Remove <BsCartDashFill className="text-sm" />
              </span>
            ) : (
              "Add to Cart"
            )}
          </Button>

          <ContactSupplierButton
            supplierId={product.seller?.userId}
            supplierName={product.seller?.businessName}
            variant="outline"
            className="flex-1 font-semibold text-xs sm:text-sm border border-[#C02090] text-[#C02090] hover:bg-[#fff0f6] transition"
          />
        </div>
      </div>
    </div>
  );
}