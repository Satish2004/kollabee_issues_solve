import { api } from "../axios";

export const ordersApi = {
  createOrder: async (data: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: any;
    totalAmount: number;
  }) => {
    return api.post("/orders", data);
  },

  getOrdersForSeller: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get("/orders/seller", { params });
  },
  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get("/orders", { params });
  },

  getOrderDetails: async (id: string) => {
    return api.get(`/orders/${id}`);
  },

  getOrderTracking: async (id: string) => {
    return api.get(`/orders/${id}/tracking`);
  },

  acceptOrder: async (id: string) => {
    return api.put(`/orders/${id}/accept`);
  },

  declineOrder: async (id: string) => {
    return api.put(`/orders/${id}/decline`);
  },

  getManufactoringRequest: async () => {
    return api.get("/orders/manufacturing-requests");
  },
  approveOrRejectProject: async (data: {
    requestId: string;
    status: "APPROVED" | "REJECTED";
  }) => {
    return api.post("/orders/approve", data);
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return api.patch(`/orders/${orderId}/status`, { status });
  },

  // admin api

  getOrdersForAdmin: async (params?: {
    type: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    return api.get("/admin/getAllDetails", { params });
  },

  getOrderDetailsForAdmin: async (id: string) => {
    return api.get(`/admin/order/${id}`);
  },

  getTopBuyers: async (params?: {
    pageNo?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
  }) => {
    return api.get("/admin/top-buyer", { params });
  },

  // New order summary API
  getOrderSummary: async (params?: {
    period?: string;
  }) => {
    return api.get("/dashboard/order-summary", { params });
  },
};
