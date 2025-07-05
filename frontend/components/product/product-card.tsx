"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCartIcon } from "lucide-react";
import { BsCartDashFill } from "react-icons/bs";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cartApi } from "@/lib/api/cart";
import { wishlistApi } from "@/lib/api/wishlist";
import { useCheckout } from "@/contexts/checkout-context";
import ContactSupplierButton from "../chat/contact-supplier-button";

interface ProductCardProps {
  product: any;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  removeFromCart: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  setWishlistProducts: (products: any[]) => void;
  wishlistProducts: any[];
  fromWishlistPage?: boolean;
}

export default function ProductCard({
  product,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromWishlist,
  setWishlistProducts,
  fromWishlistPage = false,
}: ProductCardProps) {
  const { setProducts } = useCheckout();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCart = async () => {
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
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = async () => {
    try {
      if (!isInWishlist(product.id)) {
        const response = await wishlistApi.addToWishlist(product.id) as unknown as { items: any[] };
        setWishlistProducts(response.items);
        toast.success("Added to wishlist");
      } else {
        removeFromWishlist(product.id);
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleMoveToCart = async () => {
    try {
      if (!isInCart(product.id)) {
        setIsLoading(true);
        const response = await cartApi.addToCart({
          productId: product.id,
          quantity: product.minOrderQuantity,
        }) as unknown as { items: any[] };
        setProducts(response.items);
        toast.success("Moved to cart");
        removeFromWishlist(product.id);
      }
    } catch (error) {
      toast.error("Failed to move to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full rounded-2xl border border-gray-200 overflow-hidden"
      onClick={(e) => {
        // window.location.href = `/buyer/marketplace/product/${product.id}`;
        // e.stopPropagation();
      }}
    >
      {/* Product Image + Wishlist */}
      <div className="relative">
        <Image
          src={product.images?.[0] ?? "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full aspect-[4/3] object-cover bg-gray-100"
        />
        <Button
          onClick={handleWishlist}
          className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-white p-0"
        >
          <Heart
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill={isInWishlist(product.id) ? "red" : "white"}
            stroke={isInWishlist(product.id) ? "red" : "black"}
          />
        </Button>
      </div>

      {/* Product Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-4">
        {/* Ratings */}
        <div className="flex items-center justify-end text-xs sm:text-sm">
          <span className="font-medium">{product.rating?.toFixed(1)}</span>
          <span className="text-gray-500">/5.0</span>
          <span className="text-gray-500 ml-1">
            ({product.reviewCount ?? 0} reviews)
          </span>
        </div>

        {/* Name + Description */}
        <div>
          <h3 className="text-sm sm:text-base font-semibold line-clamp-2">{product.name}</h3>
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Price Info */}
        <div>
          <div className="text-lg sm:text-2xl font-medium">
            ₹{product.price?.toFixed(2)}
          </div>
          {product.discount && (
            <div className="text-xs sm:text-sm text-green-600">
              {product.discount}% off
            </div>
          )}
          <div className="text-xs sm:text-sm text-gray-500">
            Min. Order: {product.minOrderQuantity}
          </div>
        </div>

        {/* Extra Details */}
        <div className="text-xs sm:text-sm text-gray-600 space-y-0.5">
          {product.material && <div>Material: {product.material}</div>}
          {product.color && <div>Color: {product.color}</div>}
          {product.dimensions && <div>Size: {product.dimensions}</div>}
          {product.label && <div>Label: {product.label}</div>}
          {product.rarity && <div>Rarity: {product.rarity}</div>}
          {product.availableQuantity && <div>Available: {product.availableQuantity}</div>}
          {product.wholesalePrice && <div>Wholesale: ₹{product.wholesalePrice}</div>}
        </div>

        {/* Seller Info */}
        <div className="space-y-0.5 sm:space-y-1">
          <div className="font-medium text-sm sm:text-base line-clamp-1">
            {product.seller?.businessName}
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span>{findYearDifference(product.seller?.yearEstablished)} yrs</span>
              <div className="flex items-center">
                <span className="w-3 h-2 sm:w-4 sm:h-3 bg-red-500 mr-1" />
                <span>{product.seller?.country} Supplier</span>
              </div>
            </div>
            {product.seller?.verified && (
              <span className="text-green-600 font-semibold">Verified</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 sm:space-y-3">
          {!fromWishlistPage && (
            <Button
              type="button"
              onClick={handleCart}
              disabled={isLoading}
              className={`w-full py-2 sm:py-6 px-3 sm:px-4 rounded-md text-white text-xs sm:text-sm font-semibold ${isInCart(product.id)
                ? "bg-zinc-700 hover:bg-zinc-600"
                : "button-bg"
                }`}
            >
              {isLoading ? (
                "Updating..."
              ) : isInCart(product.id) ? (
                <div className="flex items-center space-x-2">
                  <span>Remove From Cart</span>
                  <BsCartDashFill />
                </div>
              ) : (
                "Add to Cart"
              )}
            </Button>
          )}

          {fromWishlistPage && isInWishlist(product.id) && !isInCart(product.id) && (
            <Button
              type="button"
              onClick={handleMoveToCart}
              disabled={isLoading}
              className="w-full py-2 sm:py-6 px-3 sm:px-4 rounded-md text-white text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 mt-2"
            >
              {isLoading ? "Moving..." : "Move to Cart"}
            </Button>
          )}

          <ContactSupplierButton
            supplierId={product.seller?.userId}
            supplierName={product.seller?.businessName}
          />
        </div>
      </div>
    </div>
  );
}

function findYearDifference(startYear: string | null | undefined): number {
  const currentYear = new Date().getFullYear();
  const year = parseInt(startYear || "0");
  return year > 0 ? currentYear - year : 0;
}
