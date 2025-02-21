// types.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    quantityAvailable: number;
    createdDate: Date;
    updatedAt: Date;
    availability: 'In-Stock' | 'Low Stock' | 'Out of stock';
    status: 'draft' | 'active' | 'archived';
  }
  
  export interface ProductStats {
    categories: number;
    totalProducts: number;
    topSelling: number;
    lowStocks: number;
  }
  
  export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    discount?: number;
    deliveryCost?: number;
    wholesalePrice: number;
    minOrderQuantity: number;
    availableQuantity: number;
    images: string[];
    categoryId: string;
    attributes: {
      material?: string;
      fabricWeight?: string;
      technics?: string;
      color?: string;
      fabricType?: string;
      fitType?: string;
    };
  }
  
  export type ProductAvailability = 'In-Stock' | 'Low Stock' | 'Out of stock';
  
  export interface ProductTableItem {
    id: string;
    name: string;
    price: number;
    quantityAvailable: number;
    createdDate: string;
    availability: ProductAvailability;
  }