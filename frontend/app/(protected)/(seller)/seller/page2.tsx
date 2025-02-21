"use client";

import { ItemCard } from '@/components/item-card'
import { Suspense, useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { sellerApi } from '@/lib/api/seller'
import { Product } from '@/types/api'

const PRICE_RANGE = {
    MIN: 0,
    MAX: 100000
};

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default function SellerPage({ searchParams }: PageProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    const filters = {
        sortBy: String(searchParams.sortBy) || 'latest-first',
        priceRange: [
            Number(searchParams.minPrice || PRICE_RANGE.MIN),
            Number(searchParams.maxPrice || PRICE_RANGE.MAX)
        ] as [number, number],
        category: Array.isArray(searchParams.category) 
            ? searchParams.category[0] 
            : (searchParams.category || "ALL")
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await sellerApi.getProducts({
                    sortBy: filters.sortBy,
                    minPrice: filters.priceRange[0],
                    maxPrice: filters.priceRange[1],
                    category: filters.category
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [filters.sortBy, filters.priceRange, filters.category]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="animate-spin w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="flex gap-6">
            <div className="flex-1">
                <div className="container p-6 space-y-6">
                    <h1 className='text-3xl font-bold'>My Products</h1>
                    <Suspense fallback={
                        <div className="flex justify-center items-center min-h-[200px]">
                            <Loader2 className="animate-spin w-10 h-10" />
                        </div>
                    }>
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {products.length > 0 && products.map((product) => (
                                <ItemCard 
                                    product={product} 
                                    currentUser={currentUser} 
                                    key={product.id} 
                                />
                            ))}
                            {products.length === 0 && (
                                <div className="col-span-full text-center py-10 text-muted-foreground">
                                    No products found
                                </div>
                            )}
                        </div>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}