import { api } from "../axios";
import { DashboardMetrics, OrderAnalytics, OrderSummary, Notification, DashboardOrder, Contact, PaginatedResponse } from "@/types/api";

export const dashboardApi = {
  // getSellerDashboard: async (period?: '7d' | '30d') => {
  //   return api.get('/dashboard/seller', { params: { period } });
  // },

  // getBuyerDashboard: async () => {
  //   return api.get('/dashboard/buyer');
  // },

  getMetrics: async () => {
    return api.get<DashboardMetrics>("/dashboard/metrics");
  },

  getOrderAnalytics: async (period?: "today" | "week" | "month" | "year") => {
    return api.get<OrderAnalytics>("/dashboard/order-analytics", {
      params: { period },
    });
  },

  getOrderSummary: async (period?: "today" | "week" | "month" | "year") => {
    return api.get<OrderSummary>("/dashboard/order-summary", {
      params: { period },
    });
  },

  // getTopProducts: async () => {
  //   return api.get('/dashboard/products/top');
  // },

  getTopBuyers: async () => {
    return api.get("/dashboard/buyers/top");
  },

  getDashboard: async (period?: "today" | "week" | "month" | "year") => {
    return api.get("/dashboard", {
      params: { period },
    });
  },

  // New API functions for dashboard components
  getNotifications: async (page = 1, limit = 10, type = 'all') => {
    return api.get<PaginatedResponse<Notification>>("/dashboard/notifications", {
      params: { page, limit, type },
    });
  },

  getBuyerNotifications: async (page = 1, limit = 10, type = 'all') => {
    return api.get<PaginatedResponse<Notification>>("/dashboard/buyer-notifications", {
      params: { page, limit, type },
    });
  },

  getLatestOrders: async (page = 1, limit = 10) => {
    return api.get<PaginatedResponse<DashboardOrder>>("/dashboard/orders", {
      params: { page, limit },
    });
  },

  getContacts: async (page = 1, limit = 10) => {
    return api.get<PaginatedResponse<Contact>>("/dashboard/contacts", {
      params: { page, limit },
    });
  },

  // Notification management
  markNotificationAsRead: async (notificationId: string) => {
    return api.patch(`/dashboard/notifications/${notificationId}/read`);
  },

  markAllNotificationsAsRead: async () => {
    return api.patch("/dashboard/notifications/mark-all-read");
  },
};
