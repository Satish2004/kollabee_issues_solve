import { api } from '../axios';

export const cartApi = {
  getCart: async () => {
    return api.get('/cart');
  },

  addToCart: async (data: { productId: string; quantity: number }) => {
    return api.post('/cart', data);
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    return api.put(`/cart/items/${itemId}`, { quantity });
  },

  removeFromCart: async (itemId: string) => {
    return api.delete(`/cart/items/${itemId}`);
  },

  clearCart: async () => {
    return api.delete('/cart');
  }
}; 