import type { ApiSeller, Supplier, ApiResponse } from '@/types/supplier';

export function transformApiSellerToSupplier(apiSeller: ApiSeller): Supplier {
    // Calculate average product price
    const averagePrice = apiSeller.products.length > 0
        ? apiSeller.products.reduce((sum, product) => sum + product.price, 0) / apiSeller.products.length
        : 0;

    // Calculate age from creation date
    const createdDate = new Date(apiSeller.createdAt);
    const currentDate = new Date();
    const ageInYears = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

    // Determine price range based on products
    const productPrices = apiSeller.products.map(p => p.price).filter(p => p > 0);
    const minPrice = productPrices.length > 0 ? Math.min(...productPrices) : 0;
    const maxPrice = productPrices.length > 0 ? Math.max(...productPrices) : 0;
    const priceRange = productPrices.length > 0
        ? `$${minPrice} - $${maxPrice}`
        : 'Price on request';

    // Calculate total reviews from products
    const totalReviews = apiSeller.products.reduce((sum, product) => sum + product.reviewCount, 0);

    // Create tags from various fields
    const tags = [
        ...apiSeller.businessCategories,
        ...apiSeller.businessTypes,
        ...apiSeller.servicesProvided,
        ...apiSeller.businessAttributes,
        ...apiSeller.certificationTypes
    ].filter(Boolean);

    return {
        id: apiSeller.id,
        name: apiSeller.businessName,
        logo: apiSeller.businessLogo || '/placeholder.svg?height=100&width=100',
        rating: apiSeller.rating || 0,
        reviews: totalReviews,
        description: apiSeller.businessDescription,
        productType: apiSeller.businessCategories[0] || 'General',
        priceRange,
        minOrder: apiSeller.minimumOrderQuantity,
        location: apiSeller.businessAddress,
        age: ageInYears,
        country: apiSeller.user?.country || apiSeller.country || 'Unknown',
        verified: apiSeller.approved,
        tags,
        businessTypes: apiSeller.businessTypes,
        servicesProvided: apiSeller.servicesProvided,
        teamSize: apiSeller.teamSize,
        annualRevenue: apiSeller.annualRevenue,
        productionCountries: apiSeller.productionCountries,
        certificationTypes: apiSeller.certificationTypes,
        websiteLink: apiSeller.websiteLink,
        productCount: apiSeller.products.length,
        averageProductPrice: averagePrice
    };
}

export function transformApiResponse(apiResponse: ApiResponse): {
    suppliers: Supplier[];
    project: any;
} {
    const suppliers = apiResponse.sellers.map(transformApiSellerToSupplier);

    return {
        suppliers,
        project: apiResponse.project
    };
}
