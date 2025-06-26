import { Heart, ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cartApi } from "@/lib/api/cart";
import { wishlistApi } from "@/lib/api/wishlist";
import { chatApi } from "@/lib/api/chat";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/contexts/checkout-context";
import { BsCartDashFill } from "react-icons/bs";
import ContactSupplierButton from "../chat/contact-supplier-button";
import { toast } from 'sonner';

interface ProductCardProps {
  product: any;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  removeFromCart: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  setWishlistProducts: (products: any[]) => void;
  wishlistProducts: any[]; // Add wishlistProducts to props
  fromWishlistPage?: boolean;
}

export default function ProductCard({
  product,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromWishlist,
  setWishlistProducts,
  wishlistProducts,
  fromWishlistPage = false,
}: ProductCardProps) {
  const { setProducts } = useCheckout();
  const [isLoading, setIsLoading] = React.useState(false);

  const router = useRouter();

  const handleCart = async () => {
    try {
      if (!isInCart(product.id)) {
        setIsLoading(true);
        const response = await cartApi.addToCart({
          productId: product.id,
          quantity: product.minOrderQuantity,
        }) as unknown as { items: any[] };
        const updatedCart = response.items;
        setProducts(updatedCart);
        toast('Added to cart');
      } else {
        removeFromCart(product.id);
        toast('Removed from cart');
      }
    } catch (error) {
      toast('Failed to update cart');
    }
    setIsLoading(false);
  };

  const handleWishlist = async () => {
    try {
      if (!isInWishlist(product.id)) {
        const response = await wishlistApi.addToWishlist(product.id) as unknown as { items: any[] };
        const updatedWishlist = response.items;
        setWishlistProducts(updatedWishlist);
        toast('Added to wishlist');
      } else {
        removeFromWishlist(product.id);
        toast('Removed from wishlist');
      }
    } catch (error) {
      toast('Failed to update wishlist');
    }
  };

  // Move to Cart handler
  const handleMoveToCart = async () => {
    try {
      if (!isInCart(product.id)) {
        setIsLoading(true);
        const response = await cartApi.addToCart({
          productId: product.id,
          quantity: product.minOrderQuantity,
        }) as unknown as { items: any[] };
        const updatedCart = response.items;
        setProducts(updatedCart);
        toast('Item is moved to cart');
        // Remove from wishlist after adding to cart
        removeFromWishlist(product.id);
      } else {
        // No toast for already in cart
      }
    } catch (error) {
      toast('Failed to move to cart');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white w-full rounded-2xl border border-gray-200 overflow-hidden">
      <div className="relative">
        <Image
          src={
            (product.images.length > 0 && product?.images[0]) ||
            "/placeholder.svg"
          }
          alt="Product"
          width={400}
          height={300}
          className="w-full aspect-[4/3] object-cover bg-gray-200"
        />
        <Button
          onClick={handleWishlist}
          className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-white p-0"
        >
          <Heart
            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
            fill={`${isInWishlist(product.id) ? "red" : "white"}`}
            stroke={`${isInWishlist(product.id) ? "red" : "black"}`}
          />
        </Button>
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-4">
        <div className="flex items-center justify-end text-xs sm:text-sm">
          <span className="font-medium">{product.rating}</span>
          <span className="text-gray-500">/5.0</span>
          <span className="text-gray-500 ml-1">
            ({product.reviewCount} reviews)
          </span>
        </div>

        <div>
          <div className="text-lg sm:text-2xl mb-0.5 sm:mb-1 font-medium">
            {product.price}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Min. order: {product.minOrderQuantity}
          </div>
        </div>

        <div className="space-y-0.5 sm:space-y-1">
          <div className="font-medium text-sm sm:text-base line-clamp-1">
            {product.seller.businessName}
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span>
                {findYearDifference(product.seller.yearEstablished) || 0} yrs
              </span>
              <div className="flex items-center">
                <span className="w-3 h-2 sm:w-4 sm:h-3 bg-red-500 mr-1" />{" "}
                <span>{product.seller.country} Supplier</span>
              </div>
            </div>
            {product.seller.verified && (
              <div className="flex items-center text-green-600">
                <span className="text-xs sm:text-sm font-semibold">
                  Verified
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
          {/* Only show Add/Remove Cart button if not on wishlist page */}
          {!fromWishlistPage && (
            <Button
              type="button"
              onClick={handleCart}
              className={`w-full py-2 sm:py-6 px-3 sm:px-4 rounded-md text-white text-xs sm:text-sm font-semibold ${
                isInCart(product.id)
                  ? "bg-zinc-700 hover:bg-zinc-600"
                  : "button-bg"
              }`}
            >
              {isLoading ? (
                "Adding..."
              ) : isInCart(product.id) ? (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span>Remove From Cart</span>
                  <BsCartDashFill className="" />
                </div>
              ) : (
                "Add to Cart"
              )}
            </Button>
          )}

          {/* Only show Move to Cart button on wishlist page and not in cart */}
          {fromWishlistPage && isInWishlist(product.id) && !isInCart(product.id) && (
            <Button
              type="button"
              onClick={handleMoveToCart}
              className="w-full py-2 sm:py-6 px-3 sm:px-4 rounded-md text-white text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 mt-2"
            >
              {isLoading ? 'Moving...' : 'Move to Cart'}
            </Button>
          )}

          <ContactSupplierButton
            supplierId={product.seller.userId}
            supplierName={product.seller.businessName}
          />
        </div>
      </div>
    </div>
  );
}

const findYearDifference = (startYear: string) => {
  const currentYear = new Date().getFullYear();
  const startYearNum = parseInt(startYear);
  return currentYear - startYearNum;
};
