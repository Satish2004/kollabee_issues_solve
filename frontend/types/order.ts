export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sellerId?: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryId: string;
    attributes: Record<string, string>;
    discount?: number;
    deliveryCost?: number;
    material?: string;
    color?: string;
  };
  seller: {
    id: string;
    businessName: string;
    businessAddress?: string;
    user: {
      name: string;
      imageUrl?: string;
      email?: string;
      phoneNumber?: string;
    };
  };
}