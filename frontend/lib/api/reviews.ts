import { api } from '../axios';

export const reviewsApi = {
  getProductReviews: async (productId: string) => {
    return api.get(`/reviews/product/${productId}`);
  },

  addReview: async (productId: string, data: { rating: number; comment: string }) => {
    return api.post(`/reviews/product/${productId}`, data);
  },

  updateReview: async (reviewId: string, data: { rating: number; comment: string }) => {
    return api.put(`/reviews/${reviewId}`, data);
  },

  deleteReview: async (reviewId: string) => {
    return api.delete(`/reviews/${reviewId}`);
  }
}; 