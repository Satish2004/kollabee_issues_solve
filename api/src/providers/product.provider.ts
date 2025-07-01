import { Prisma } from "@prisma/client";
import prisma from "../db";


type ProductWithStats = Prisma.ProductGetPayload<{
    include: {
        seller: {
            include: {
                user: {
                    select: {
                        name: true;
                        email: true;
                    };
                };
            };
        };
        orderItems: {
            select: {
                id: true;
            };
        };
        reviews: {
            select: {
                rating: true;
            };
        };
    };
}> & {
    popularityScore: number;
    matchedTerms: string[];
    avgRating: string;
    salesCount: number;
};

export const ProductProvider = {
    // Base product queries
    async findProducts(where: Prisma.ProductWhereInput, options: { limit?: number; include?: Prisma.ProductInclude }) {
        return prisma.product.findMany({
            where,
            include: options.include,
            take: options.limit,
        });
    },

    // Trending products based on recent searches
    async getTrendingProducts(limit: number = 10, days: number = 7) {
        const trendingTerms = await prisma.searchLog.groupBy({
            by: ['query'],
            where: {
                createdAt: {
                    gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
                }
            },
            orderBy: {
                _count: {
                    query: 'desc'
                }
            },
            take: limit,
        });

        return this.findProducts(
            {
                OR: trendingTerms.map(term => ({
                    name: { contains: term.query, mode: 'insensitive' }
                }))
            },
            {
                limit,
                include: {
                    seller: true,
                    orderItems: {
                        select: { id: true }
                    },
                    reviews: {
                        select: { rating: true }
                    }
                }
            }
        );
    },

    async getPopularProducts(limit: number = 10, days: number = 30): Promise<ProductWithStats[]> {
        console.log('Fetching popular products with limit:', limit, 'and days:', days);
        const now = new Date();
        const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        try {
            // 1. Get most frequently searched terms within time window
            const popularTerms = await prisma.searchLog.groupBy({
                by: ['query'],
                _sum: {
                    searchCount: true,
                },
                orderBy: {
                    _sum: {
                        searchCount: 'desc',
                    },
                },
                take: 20,
            });
              
            console.log('Popular search terms:', popularTerms.flatMap(term => term.query));
            if (popularTerms.length === 0) {
                return [];
            }

            // 2. Find products matching these popular search terms
            const products = await prisma.product.findMany({
                where: {
                    isDraft: false,
                    // status: 'ACTIVE',
                    OR: popularTerms.map(term => ({
                        name: { contains: term.query, mode: 'insensitive' },
                    })),
                },
                include: {
                    seller: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    orderItems: {
                        select: { id: true },
                    },
                    reviews: {
                        select: { rating: true },
                    },
                },
                take: limit * 3, // safer margin to allow scoring and sorting
            });
              
            console.log('Found products:', products.length);
            // 3. Calculate popularity score for each product
            const productsWithScores = products.map(product => {
                let popularityScore = 0;
                let matchedTerms: string[] = [];

                popularTerms.forEach(term => {
                    const termLower = term.query.toLowerCase();
                    const matches = [
                        product.name.toLowerCase().includes(termLower),
                        product.description.toLowerCase().includes(termLower),
                        product.seller.businessName && product.seller.businessName.toLowerCase().includes(termLower)
                    ].some(Boolean);

                    if (matches) {
                        popularityScore += term._sum.searchCount || 0; // Use search count as score
                        matchedTerms.push(term.query);
                    }
                });
                popularityScore = Math.min(popularityScore, 100); // Cap score to prevent overflow
                return {
                    ...product,
                    popularityScore,
                    matchedTerms,
                    avgRating: product.reviews.length > 0
                        ? Number((product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(2))
                        : '0',
                    salesCount: product.orderItems.length
                };
            });

            // 4. Sort by popularity score, then by sales, then by rating
            const sortedProducts = productsWithScores.sort((a, b) => {
                if (b.popularityScore !== a.popularityScore) {
                    return b.popularityScore - a.popularityScore;
                }
                if (b.salesCount !== a.salesCount) {
                    return b.salesCount - a.salesCount;
                }
                return Number(b.avgRating) - Number(a.avgRating);
            });

            // 5. Return the top products
            return sortedProducts.slice(0, limit).map(product => ({
                ...product,
                avgRating: product.avgRating.toString(), // Ensure avgRating is a string
                salesCount: product.salesCount || 0 // Ensure salesCount is a number
            }));

        } catch (error) {
            console.error('Error in getPopularProducts:', error);
            throw new Error('Failed to fetch popular products');
        }
    },

    // Hot selling products based on sales
    async getHotSellingProducts(limit: number = 10, days: number = 30) {
        return prisma.product.findMany({
            where: {
                orderItems: {
                    some: {
                        createdAt: {
                            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
                        }
                    }
                }
            },
            include: {
                seller: true,
                orderItems: {
                    select: { id: true }
                },
                reviews: {
                    select: { rating: true }
                }
            },
            orderBy: [
                {
                    orderItems: {
                        _count: 'desc'
                    }
                }
            ],
            take: limit
        });
    },

    enhanceProducts(products: any[]) {
        return products.map(product => ({
            ...product,
            salesCount: product.orderItems?.length || 0,
            avgRating: product.reviews?.length > 0
                ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / product.reviews.length
                : 0
        }));
    }
};