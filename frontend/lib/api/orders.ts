import { api } from '../axios';

export const ordersApi = {
  createOrder: async (data: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: any;
    totalAmount: number;
  }) => {
    return api.post('/orders', data);
  },

  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get('/orders', { params });
  },

  getOrderDetails: async (id: string) => {
    return api.get(`/orders/${id}`);
  },

  getOrderTracking: async (id: string) => {
    return api.get(`/orders/${id}/tracking`);
  }
}; 