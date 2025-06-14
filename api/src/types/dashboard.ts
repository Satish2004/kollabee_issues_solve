export interface DashboardMetrics {
  totalOrders: number;
  totalProducts: number;
  totalRequests: number;
  totalReturns: number;
  totalRevenue: number;
  ordersDifference: number;
  pendingOrders: number;
  pendingOrdersWorth: number;
  requestsDifference: number;
  returnedProductsWorth: number;
  returnsDifference: number;
  revenueDifference: number;
  totalMessages: number;
  requestsRevenue: number;
  requestsRevenueDifference: number;
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

export interface Notification {
  id: string;
  message: string;
  type: 'ORDER' | 'REQUEST' | 'MESSAGE' | 'SYSTEM';
  read: boolean;
  createdAt: string;
  metadata?: {
    orderId?: string;
    requestId?: string;
    messageId?: string;
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