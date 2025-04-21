import { api } from '../axios';

export const AdminApi = {

    getBuyerMetrics: async () => {
        return api.get('/admin/buyer-metrics');
    },

    getTimePeriodMetrics: async (period: string) => {
        return api.get(`/admin/time-period-metrics/${period}`);
    },

    getMonthlyOnboarding: async () => {
        return api.get('/admin/monthly-onboarding');
    },

    getProductPerformance: async () => {
        return api.get('/admin/product-performance');
    },

    getTrendingProducts: async () => {
        return api.get('/admin/trending-products');
    },

    getTopBuyers: async () => {
        return api.get('/admin/top-buyers');
    },

    getSupplierMetrics: async () => {
        return api.get('/admin/supplier-metrics');
    },

    getTopCountries: async () => {
        return api.get('/admin/top-countries');
    },

    getTopSuppliers: async () => {
        return api.get('/admin/top-suppliers');
    },

    getSupplierAnalytics: async (supplierId: string) => {
        return api.get(`/admin/supplier-analytics/${supplierId}`);
    },

    getPlatformMetrics: async () => {
        return api.get('/admin/platform-metrics');
    },

    getOrderMetrics: async () => {
        return api.get('/admin/order-metrics');
    },

}; 

