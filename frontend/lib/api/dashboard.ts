import { api } from '../axios';
import { DashboardMetrics, OrderAnalytics } from '@/types/api';

export const dashboardApi = {
  // getSellerDashboard: async (period?: '7d' | '30d') => {
  //   return api.get('/dashboard/seller', { params: { period } });
  // },

  // getBuyerDashboard: async () => {
  //   return api.get('/dashboard/buyer');
  // },

  getMetrics: async () => {
    return api.get<DashboardMetrics>('/dashboard/metrics');
  },

  getOrderAnalytics: async (period?: '7d' | '30d' | '1y') => {
    return api.get<OrderAnalytics>('/dashboard/order-analytics', {
      params: { period }
    });
  },

  // getTopProducts: async () => {
  //   return api.get('/dashboard/products/top');
  // },

  getTopBuyers: async () => {
    return api.get('/dashboard/buyers/top');
  }
}; 