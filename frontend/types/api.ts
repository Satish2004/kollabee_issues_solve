// Enums from schema
export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW_STOCK = 'LOW_STOCK'
}

export enum BankType {
  SAVINGS = 'SAVINGS',
  CURRENT = 'CURRENT'
}

export enum Role {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum CategoryEnum {
  FASHION_APPAREL_ACCESSORIES = 'FASHION_APPAREL_ACCESSORIES',
  BEAUTY_COSMETICS = 'BEAUTY_COSMETICS',
  HOME_CLEANING_ESSENTIALS = 'HOME_CLEANING_ESSENTIALS',
  HERBAL_NATURAL_PRODUCTS = 'HERBAL_NATURAL_PRODUCTS',
  FOOD_BEVERAGES = 'FOOD_BEVERAGES',
  HEALTH_WELLNESS = 'HEALTH_WELLNESS',
  OTHER = 'OTHER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

export enum AddressTypeEnum {
  BILLING = 'BILLING',
  SHIPPING = 'SHIPPING'
}

export enum AdvertisementStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

// Additional enums
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

export enum InquiryStatus {
  PENDING = 'PENDING',
  RESPONDED = 'RESPONDED',
  CLOSED = 'CLOSED'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum RequestType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE'
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
    pages: number;
    currentPage: number;
    limit: number;
  }
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
  buyerId?: string;
  sellerId?: string;
  status: OrderStatus;
  totalAmount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  carrier?: string;
  trackingHistory: any[];
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId?: string;
  quantity: number;
  price: number;
  product: Product;
  seller?: Seller;
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
    }
  }
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
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  user: User;
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
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  PACKAGING_SUPPLIER = 'PACKAGING_SUPPLIER',
  CO_PACKER = 'CO_PACKER',
  OTHER = 'OTHER'
}

// Add this interface with the other interfaces
export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  returnedProducts: number;
  pendingShipments: number;
  averageOrderValue: number;
  totalRequests: number;
  unreadMessages: number;
  activeProducts: number;
}

export interface OrderAnalytics {
  orders: {
    createdAt: string;
    totalAmount: number;
    requestCount: number;
  }[];
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface StatCard {
  title: string;
  value: string;
  change?: string;
  changeText?: string;
  trend?: 'up' | 'down';
  percentage?: string;
} 

