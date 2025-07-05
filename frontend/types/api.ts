import { ReactNode } from "react";

// Enums from schema
export enum StockStatus {
  IN_STOCK = "IN_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  LOW_STOCK = "LOW_STOCK",
}

export enum BankType {
  SAVINGS = "SAVINGS",
  CURRENT = "CURRENT",
}

export enum Role {
  BUYER = "BUYER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

export enum CategoryEnum {
  BRAND_STRATEGY_DEVELOPMENT = "BRAND_STRATEGY & DEVELOPMENT",
  DESIGN_CREATIVE_SERVICES = "DESIGN & CREATIVE_SERVICES",
  DIGITAL_MARKETING = "DIGITAL_MARKETING",
  WEB_ECOMMERCE_DEVELOPMENT = "WEB & ECOMMERCE_DEVELOPMENT",
  PHOTOGRAPHY_VIDEOGRAPHY = "PHOTOGRAPHY & VIDEOGRAPHY",
  MARKET_RESEARCH_ANALYTICS = "MARKET_RESEARCH & ANALYTICS",
  PUBLIC_RELATIONS_OUTREACH = "PUBLIC_RELATIONS & OUTREACH",
  RETAIL_ECOMMERCE_STRATEGY = "RETAIL & COMMERCE_STRATEGY",
  CONTENT_CREATION_COPYWRITING = "CONTENT_CREATION & COPYWRITING",
  CONSULTING_SERVICES = "CONSULTING_SERVICES",
  PRIMARY_PACKAGING = "PRIMARY_PACKAGING",
  FLEXIBLE_PACKAGING = "FLEXIBLE_PACKAGING",
  RIGID_PACKAGING = "RIGID_PACKAGING",
  COMPONENTS_ACCESSORIES = "COMPONENTS & ACCESSORIES",
  SUSTAINABLE_PACKAGING = "SUSTAINABLE_PACKAGING",
  SECONDARY_PACKAGING = "SECONDARY_PACKAGING",
  AYURVEDA_HERBAL = "AYURVEDA & HERBAL",
  BEAUTY = "BEAUTY",
  BEVERAGES = "BEVERAGES",
  COSMETICS = "COSMETICS",
  CLEANING_HOME_CARE_KITCHEN = "CLEANING, HOME_CARE & KITCHEN",
  CONSUMER_ELECTRONICS = "CONSUMER_ELECTRONICS",
  FOOD = "FOOD",
  FURNITURE_HOME_DECOR = "FURNITURE & HOME_DECOR",
  FASHION_ACCESSORIES = "FASHION & ACCESSORIES",
  HEALTH_WELLNESS_DUPLICATE = "HEALTH & WELLNESS",
  INGREDIENTS = "INGREDIENTS",
  FLAVOURS = "FLAVOURS",
  FRAGRANCES = "FRAGRANCES",
  MOTHER_BABY_CARE = "MOTHER & BABY_CARE",
  NATURAL_ORGANIC_PRODUCTS = "NATURAL & ORGANIC_PRODUCTS",
  PERSONAL_CARE_HYGIENE = "PERSONAL_CARE & HYGIENE",
  PET_CARE_PRODUCTS = "PET_CARE_PRODUCTS",
  TEA_COFFEE = "TEA & COFFEE",
  TEXTILES_APPAREL = "TEXTILES & APPAREL",
  TOYS = "TOYS",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}


export enum ProjectStatus {
  Order_Placed = "Order Placed",
  Scheduled = "Scheduled",
  Picked_Up = "Picked Up",
  In_Transit = "In Transit",
  Out_For_Delivery = "Out For Delivery",
}

export enum AddressTypeEnum {
  BILLING = "BILLING",
  SHIPPING = "SHIPPING",
}

export enum AdvertisementStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

// Additional enums
export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CANCELLED = "CANCELLED",
}

export enum SubscriptionTier {
  FREE = "FREE",
  PRO = "PRO",
  PREMIUM = "PREMIUM",
}

export enum InquiryStatus {
  PENDING = "PENDING",
  RESPONDED = "RESPONDED",
  CLOSED = "CLOSED",
}

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum RequestType {
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Main Entity Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
  companyWebsite?: string;
  conversations: string[];
  country?: string;
  displayName?: string;
  fullName?: string;
  imageUrl?: string;
  phoneNumber?: string;
  secondaryEmail?: string;
  state?: string;
  address?: string;
  zipCode?: string;
  lastLogin?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  wholesalePrice: number;
  minOrderQuantity: number;
  availableQuantity: number;
  images: string[];
  isDraft: boolean;
  stockStatus: StockStatus;
  rating: number;
  reviewCount: number;
  dimensions?: string;
  material?: string;
  artistName?: string;
  certifications?: string;
  rarity?: string;
  label?: string;
  techniques?: string;
  color?: string;
  fabricType?: string;
  fabricWeight?: string;
  fitType?: string;
  discount?: number;
  deliveryCost?: number;
  seller: Seller;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string[];
  categories: {
    id: string;
    name: string;
  }[];
}

export interface Seller {
  id: string;
  userId: string;
  businessName?: string;
  businessAddress?: string;
  websiteLink?: string;
  businessCategories: CategoryEnum[];
  businessTypes: BusinessType[];
  annualRevenue?: number;
  employeeCount?: number;
  exportPercentage?: number;
  moq?: number;
  yearEstablished?: number;
  rating: number;
  location?: string;
  country?: string;
  state?: string;
  qualityControl?: string;
  rd?: string;
  roleInCompany?: string;
  challenges: string[];
  metrics: string[];
  objectives: string[];
  mainMarkets: string[];
  user: User;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
  isAccepted: boolean;
  buyer?: {
    id: string;
    userId: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      companyName: string;
      country: string | null;
      imageUrl: string | null;
      phoneNumber: string;
    };
  };
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  isAccepted: boolean;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryId: string;
    attributes: Record<string, string>;
    reviews?: Review[];
  };
  seller: {
    id: string;
    businessName: string;
    businessAddress: string;
    user: {
      name: string;
      imageUrl: string | null;
    };
  };
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  email: string;
  phoneNumber: string;
  type: AddressTypeEnum;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  productId: string;
  buyerId: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    user: {
      name: string;
      imageUrl?: string;
    };
  };
}

export interface Advertisement {
  id: string;
  sellerId: string;
  productId: string;
  budget: number;
  startDate: string;
  endDate: string;
  targetAudience: string[];
  adType: string;
  description?: string;
  status: AdvertisementStatus;
  createdAt: string;
  updatedAt: string;
  metrics: AdvertisementMetrics[];
}

export interface AdvertisementMetrics {
  id: string;
  advertisementId: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

export interface Cart {
  id: string;
  buyerId: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Wishlist {
  id: string;
  buyerId: string;
  items: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  product: Product;
}

export interface BankDetail {
  id: string;
  userId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankType: BankType;
  ifscCode: string;
  upiId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  address?: string;
  email?: string;
  companyName?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  zipCode?: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

// Additional interfaces
export interface Category {
  id: string;
  categoryName: CategoryEnum;
  buyers?: Buyer[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  receiver: User;
  sender: User;
}

export interface Analytics {
  id: string;
  userId: string;
  pageViews: number;
  inquiries: number;
  responses: number;
  date: string;
  user: User;
}

export interface TrustBadge {
  id: string;
  name: string;
  description: string;
  criteria: string;
  suppliers: Seller[];
}

export interface AIMatchingPreference {
  id: string;
  userId: string;
  keywords: string[];
  weights: Record<string, any>;
  user: User;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  paymentInfo?: Record<string, any>;
  autoRenew: boolean;
  plan: Plan;
  user: User;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  subscriptions?: Subscription[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionTransaction {
  id: string;
  userId: string;
  amount: number;
  subscriptionExpiry?: string;
  createdAt: string;
  providerId: string;
  isCompleted: boolean;
  type: string;
  user: User;
}

export interface Notification {
  id: string;
  message: string;
  title?: string;
  type: 'ORDER' | 'REQUEST' | 'MESSAGE' | 'SYSTEM' | 'PROJECT_REQUEST';
  read: boolean;
  createdAt: string;
  metadata?: {
    orderId?: string;
    requestId?: string;
    messageId?: string;
    projectId?: string;
  };
}

export interface Buyer {
  id: string;
  userId: string;
  location?: string;
  maxMOQ?: number;
  minMOQ?: number;
  preferences?: Record<string, any>;
  user: User;
  cart?: Cart;
  inquiries?: Inquiry[];
  orders?: Order[];
  requests?: Request[];
  savedSearches?: SavedSearch[];
  wishlist?: Wishlist;
  requiredCertifications?: Certification[];
  products?: Product[];
  favoriteSuppliers?: Seller[];
  interestedCategories?: Category[];
  reviews?: Review[];
}

export interface Certification {
  id: string;
  name: string;
  description?: string;
  image?: string;
  issueDate?: string;
  productId: string;
  product: Product;
  buyers?: Buyer[];
  suppliers?: Seller[];
}

export interface SavedSearch {
  id: string;
  buyerId: string;
  criteria: Record<string, any>;
  name?: string;
  createdAt: string;
  buyer: Buyer;
}

export interface Inquiry {
  id: string;
  buyerId: string;
  supplierId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  status: InquiryStatus;
  buyer: Buyer;
  supplier: Seller;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
  productId: string;
  product: Product;
}

export interface PickupAddress {
  id: string;
  fullName: string;
  businessName?: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Request {
  id: string;
  buyerId: string;
  sellerId: string;
  productName: string;
  category: string;
  subCategory?: string;
  productType?: string;
  quantity: number;
  targetPrice?: number;
  orderFrequency?: string;
  country: string;
  leadSize?: number;
  status: RequestStatus;
  requestType: RequestType;
  createdAt: string;
  updatedAt: string;
  buyer: Buyer;
  seller: Seller;
}

// Also add BusinessType enum
export enum BusinessType {
  MANUFACTURER = "MANUFACTURER",
  DISTRIBUTOR = "DISTRIBUTOR",
  SERVICE_PROVIDER = "SERVICE_PROVIDER",
  PACKAGING_SUPPLIER = "PACKAGING_SUPPLIER",
  CO_PACKER = "CO_PACKER",
  OTHER = "OTHER",
}

// Add this interface with the other interfaces
export interface DashboardMetrics {
  totalOrders: {
    current: number;
    past: number;
    percentageChange: string;
  };
  totalReceived: {
    current: number;
    past: number;
    percentageChange: string;
  };
  returnedOrders: {
    current: number;
    past: number;
    percentageChange: string;
  };
  onWayToShip: {
    current: number;
    past: number;
    percentageChange: string;
  };
  averageSales: {
    current: number;
    past: number;
    percentageChange: string;
  };
  averageResponseTime: {
    current: string;
    past: string;
    percentageChange: string;
  };
}

export interface OrderAnalytics {
  data: {
    chartData: Array<{
      name: string;
      orders: number;
      requests: number;
    }>;
    metrics: {
      activeProducts: number;
      messages: number;
      requests: {
        current: number;
        previous: number;
        difference: number;
        percentageChange: number;
      };
    };
  };
}

export interface OrderSummary {
  data: {
    period: string;
    currentPeriod: {
      start: string;
      end: string;
    };
    previousPeriod: {
      start: string;
      end: string;
    };
    metrics: {
      orders: {
        current: number;
        previous: number;
        difference: number;
        percentageChange: number;
      };
      revenue: {
        current: number;
        previous: number;
        difference: number;
        percentageChange: number;
      };
      buyers: {
        new: {
          current: number;
          previous: number;
          difference: number;
          percentageChange: number;
        };
        repeated: {
          current: number;
          previous: number;
          difference: number;
          percentageChange: number;
        };
        total: number;
      };
    };
    buyerDetails: {
      newBuyers: Array<{
        buyerId: string;
        buyerName: string;
        buyerEmail: string;
        buyerImage: string | null;
        orderId: string;
        orderAmount: number;
        orderDate: string;
        totalOrders: number;
      }>;
      repeatedBuyers: Array<{
        buyerId: string;
        buyerName: string;
        buyerEmail: string;
        buyerImage: string | null;
        orderId: string;
        orderAmount: number;
        orderDate: string;
        totalOrders: number;
        firstOrderDate: string;
      }>;
    };
    summaryData: Array<{
      name: string;
      new: number;
      repeated: number;
    }>;
  };
}

export interface StatCard {
  title: string;
  value: string;
  change?: string;
  changeText?: string;
  trend?: "up" | "down";
  percentage?: string;
}

export interface Project {
  requestedSeller: any;
  projectTitle: ReactNode;
  id: string;
  // Step 0
  selectedServices: string[];

  // Step 1
  category: string;
  businessName: string;
  productType: string;

  // Step 2
  formulationType: string;
  targetBenefit: string;
  texturePreferences: string;
  colorPreferences: string;
  fragrancePreferences: string;
  packagingType: string;
  materialPreferences: string;
  bottleSize: string;
  labelingNeeded: string;
  minimumOrderQuantity: string;
  certificationsRequired: string;
  sampleRequirements: string;

  // Step 3
  projectTimelineFrom: Date | undefined;
  projectTimelineTo: Date | undefined;

  budget: number;
  pricingCurrency: string;
  milestones: {
    id: number | string;
    name: string;
    description: string;
    paymentPercentage: string | number;
    dueDate: Date | undefined;
  }[];
  ownerId: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  paymentPercentage: number;
  dueDate: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturingRequest {
  id: string;
  buyerId: string;
  sellerId: string;
  projectId: string;
  status: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    selectedServices: string[];
    category: string;
    businessName: string;
    productType: string;
    formulationType?: string;
    targetBenefit?: string;
    texturePreferences?: string;
    colorPreferences?: string;
    fragrancePreferences?: string;
    packagingType?: string;
    materialPreferences?: string;
    bottleSize?: string;
    labelingNeeded?: string;
    minimumOrderQuantity?: string;
    certificationsRequired?: string;
    sampleRequirements?: string;
    projectTimeline: string[];
    budget: number;
    pricingCurrency: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    milestones: Milestone[];
  };
  buyer: {
    id: string;
    userId: string;
    location: string | null;
    maxMOQ: number | null;
    minMOQ: number | null;
    preferences: any | null;
    user: {
      name: string;
      email: string;
      phoneNumber: string;
      imageUrl?: string | null;
    };
  };
}

export interface Contact {
  id: string;
  name: string;
  image?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  buyer: {
    name: string;
    imageUrl?: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface DashboardData {
  orders: DashboardOrder[];
  requests: any[];
  projectRequests: any[];
  contacts: Contact[];
  chartData: any[];
  totalRevenue: number;
  topBuyers: any[];
  topProducts: any[];
  lowSellingProducts: any[];
}
