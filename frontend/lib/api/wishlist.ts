import { api } from '../axios';

export const wishlistApi = {
  getWishlist: async () => {
    return api.get('/wishlist');
  },

  addToWishlist: async (productId: string) => {
    return api.post('/wishlist', { productId });
  },

  removeFromWishlist: async (itemId: string) => {
    return api.delete(`/wishlist/items/${itemId}`);
  },

  clearWishlist: async () => {
    return api.delete('/wishlist');
  }
}; 