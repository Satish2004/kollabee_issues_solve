import { useQuery } from "@tanstack/react-query"
import { productsApi } from "@/lib/api/products"
import { wishlistApi } from "@/lib/api/wishlist"

interface UseMarketplaceParams {
  category?: string
  tag?: string
}

export function useMarketplaceProducts({ category, tag }: UseMarketplaceParams) {
  return useQuery({
    queryKey: ["marketplace-products", category, tag],
    queryFn: async () => {
      const query: any = {}

      if (category && category !== "all") {
        query["category"] = category
      }

      if (tag && tag !== "all") {
        query["tag"] = tag
      }

      const response = await productsApi.getProducts(query)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}


export function useWishlistProducts() {
  return useQuery({
    queryKey: ["wishlist-products"],
    queryFn: async () => {
      const response = await wishlistApi.getWishlist()
      return response.data?.items || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 