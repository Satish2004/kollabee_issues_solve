// Updated types to match your actual API response
export interface ApiSeller {
    id: string;
    userId: string;
    businessName: string;
    businessDescription: string;
    businessAddress: string;
    websiteLink: string;
    businessCategories: string[];
    businessTypes: string[];
    businessLogo: string;
    yearFounded: number | null;
    teamSize: string;
    annualRevenue: string;
    languagesSpoken: string[];
    businessAttributes: string[];
    servicesProvided: string[];
    minimumOrderQuantity: string;
    lowMoqFlexibility: boolean;
    productionModel: string;
    productionCountries: string[];
    providesSamples: boolean;
    sampleDispatchTime: string;
    productionTimeline: string;
    factoryImages: string[];
    businessRegistration: string[];
    certificationTypes: string[];
    certificates: string[];
    projectImages: string[];
    brandVideo: string;
    socialMediaLinks: string;
    additionalNotes: string;
    rating: number;
    location: string | null;
    country: string | null;
    state: string | null;
    roleInCompany: string;
    targetAudience: string[];
    comments: string;
    challenges: string[];
    objectives: string[];
    mainMarkets: string[];
    approved: boolean;
    createdAt: string;
    updatedAt: string;
    products: ApiProduct[];
    user: ApiUser;
}

export interface ApiProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    wholesalePrice: number;
    minOrderQuantity: number;
    availableQuantity: number;
    images: string[];
    status: string;
    stockStatus: string;
    rating: number;
    reviewCount: number;
    attributes: Record<string, string>;
    discount: number | null;
    deliveryCost: number | null;
    productCategories: string[];
}

export interface ApiUser {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    role: string;
    companyName: string;
    country: string;
    state: string;
    address: string;
    phoneNumber: string;
    imageUrl: string;
}

export interface ApiResponse {
    sellers: ApiSeller[];
    project: {
        id: string;
        selectedServices: string[];
        category: string;
        businessName: string;
        productType: string;
        budget: number;
        projectTitle: string;
        quantity: number;
        receiveDate: string;
        certifications: string[];
    };
    where: Record<string, any>;
}

// Transformed supplier interface for UI
export interface Supplier {
    id: string;
    name: string;
    logo: string;
    rating: number;
    reviews: number;
    description: string;
    productType: string;
    priceRange: string;
    minOrder: string;
    location: string;
    age: number;
    country: string;
    verified: boolean;
    tags: string[];
    // Additional fields from API
    businessTypes: string[];
    servicesProvided: string[];
    teamSize: string;
    annualRevenue: string;
    productionCountries: string[];
    certificationTypes: string[];
    websiteLink: string;
    productCount: number;
    averageProductPrice: number;
}
  