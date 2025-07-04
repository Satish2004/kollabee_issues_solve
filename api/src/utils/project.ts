const parseFilters = (queryParams: any): SellerFilters => {
    const {
        search,
        minRating,
        maxRating,
        country,
        supplierTypes,
        sortBy,
        sortOrder,
        minAge,
        maxAge,
        priceRange
    } = queryParams;

    return {
        search: search?.toString(),
        minRating: minRating ? Number(minRating) : undefined,
        maxRating: maxRating ? Number(maxRating) : undefined,
        country: country?.toString(),
        supplierTypes: supplierTypes?.toString().split(','),
        sortBy: ['rating', 'age', 'name'].includes(sortBy?.toString())
            ? sortBy.toString() as 'rating' | 'age' | 'name'
            : undefined,
        sortOrder: ['asc', 'desc'].includes(sortOrder?.toString())
            ? sortOrder.toString() as 'asc' | 'desc'
            : undefined,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        priceRange: priceRange?.toString().split('-').map(Number) as [number, number]
    };
};

const getProjectWithValidation = async (id: string) => {
    return await prisma.project.findUnique({
        where: { id },
        include: {
            owner: true,
            certifications: true
        },
    });
};

const buildSellerQuery = (filters: SellerFilters, project: any) => {
    const where: any = {
        businessCategories: {
            has: getCategoryFromProjectCategory(project.category || ''),
        },
    };

    // Location filtering
    if (filters.country && filters.country !== 'all') {
        where.country = filters.country;
    } else if (project.owner?.location) {
        where.country = project.owner.location;
    }

    // Rating filtering
    if (filters.minRating !== undefined || filters.maxRating !== undefined) {
        where.rating = {};
        if (filters.minRating !== undefined) where.rating.gte = filters.minRating;
        if (filters.maxRating !== undefined) where.rating.lte = filters.maxRating;
    }

    // Supplier type filtering
    if (filters.supplierTypes?.length) {
        where.businessTypes = { hasSome: filters.supplierTypes };
    }

    // Age filtering
    const currentYear = new Date().getFullYear();
    if (filters.minAge !== undefined || filters.maxAge !== undefined) {
        where.yearEstablished = {};
        if (filters.minAge !== undefined) {
            where.yearEstablished.lte = currentYear - filters.minAge;
        }
        if (filters.maxAge !== undefined) {
            where.yearEstablished.gte = currentYear - filters.maxAge;
        }
    }

    // Sorting
    const orderBy: any = {};
    if (filters.sortBy) {
        const order = filters.sortOrder === 'desc' ? 'desc' : 'asc';

        switch (filters.sortBy) {
            case 'rating':
                orderBy.rating = order;
                break;
            case 'age':
                orderBy.yearEstablished = order === 'asc' ? 'desc' : 'asc';
                break;
            case 'name':
                orderBy.businessName = order;
                break;
        }
    } else {
        orderBy.rating = 'desc';
    }

    return { where, orderBy };
};

const fetchAndProcessSellers = async (
    where: any,
    orderBy: any,
    filters: SellerFilters,
    project: any
) => {
    // Fetch sellers from database
    const sellers = await prisma.seller.findMany({
        where,
        orderBy,
        include: {
            products: true,
            user: true,
        },
    });

    // Apply post-fetch filters
    let filteredSellers = applyPostFilters(sellers, filters);

    // Format sellers for response
    return filteredSellers.map(seller => formatSeller(seller, project));
};

const applyPostFilters = (sellers: any[], filters: SellerFilters) => {
    let result = [...sellers];

    // Search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(seller =>
            seller.businessName?.toLowerCase().includes(searchTerm) ||
            seller.user?.name?.toLowerCase().includes(searchTerm) ||
            seller.businessAddress?.toLowerCase().includes(searchTerm) ||
            seller.products?.some(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            )
        );
    }

    // Price range filter
    if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        result = result.filter(seller =>
            seller.products?.some(p =>
                (p.price >= min && p.price <= max) ||
                (p.wholesalePrice >= min && p.wholesalePrice <= max)
            )
        );
    }

    return result;
};

const formatSeller = (seller: any, project: any): FormattedSeller => ({
    id: seller.id,
    name: seller.businessName || seller.user?.name || 'Unknown Seller',
    logo: seller.user?.imageUrl || DEFAULT_LOGO_URL,
    rating: seller.rating || 0,
    reviews: seller.products?.length || 0,
    description: getSellerDescription(seller, project),
    productType: getProductTypeDescription(seller, project),
    priceRange: getPriceRange(seller),
    minOrder: `Min. order: ${seller.minimumOrderQuantity || 'N/A'}`,
    location: seller.businessAddress || 'Unknown',
    age: new Date().getFullYear() - (seller.yearEstablished || new Date().getFullYear()),
    country: seller.country || seller.user?.country || 'Unknown',
    verified: true,
    tags: getRelevantTags(seller, project),
});

const formatProjectResponse = (project: any) => ({
    ...project,
    // Add any specific formatting for the project response here
});