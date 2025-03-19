import { api } from '../axios';

export const paymentApi = {
  createCheckoutSession: async (data: {
    amount: number;
    products: any[];
    currency: string;
  }) => {
    return api.post('/payment/checkout', data);
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    return api.post('/payment/callback', data);
  },

  getBankDetails: async () => {
    return api.get('/payment/bank-details');
  },

  addBankDetail: async (data: any) => {
    return api.post('/payment/bank-details', data);
  },

  // updateBankDetail: async (id: string, data: Partial<BankDetail>) => {
  //   return api.put<BankDetail>(`/payment/bank-details/${id}`, data);
  // }
}; 

