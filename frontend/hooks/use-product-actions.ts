import { useState } from "react";
import { cartApi } from "../lib/api/cart";
import { wishlistApi } from "../lib/api/wishlist";
import { useCheckout } from "../contexts/checkout-context";

export function useProductActions(initialWishlist: any[] = []) {
    const { products, setProducts } = useCheckout();
    const [wishlistProducts, setWishlistProducts] = useState<any[]>(initialWishlist);

    const isInCart = (productId: string) =>
        products.findIndex((p: any) => p.product.id === productId) > -1;

    const isInWishlist = (productId: string) =>
        wishlistProducts.findIndex((p: any) => p.product.id === productId) > -1;

    const addToCart = async (product: any) => {
        try {
            const response = await cartApi.addToCart(product.id);
            setProducts([...products, response.data.item]);
        } catch (error) {
            console.error("Add to cart failed", error);
        }
    };

    const removeFromCart = (productId: string) => {
        const item = products.find((p: any) => p.product.id === productId);
        const itemId = item?.id;
        if (itemId) {
            cartApi.removeFromCart(itemId);
            setProducts(products.filter((p: any) => p.id !== itemId));
        }
    };

    const addToWishlist = async (product: any) => {
        try {
            const response = await wishlistApi.addToWishlist(product.id);
            setWishlistProducts([...wishlistProducts, response.data.item]);
        } catch (error) {
            console.error("Add to wishlist failed", error);
        }
    };

    const removeFromWishlist = (productId: string) => {
        const item = wishlistProducts.find((p: any) => p.product.id === productId);
        const itemId = item?.id;
        wishlistApi.removeFromWishlist(itemId);
        setWishlistProducts(wishlistProducts.filter((p: any) => p.id !== itemId));
    };

    return {
        isInCart,
        isInWishlist,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        wishlistProducts,
        setWishlistProducts,
    };
}
