export interface TopSellingProduct {
  name: string;
  price: number;
  quantity: number;
  amount: number;
}

export interface LowPerformingAd {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export const topSellingProducts: TopSellingProduct[] = [
  {
    name: "ASOS Ridley High Waist",
    price: 79.49,
    quantity: 82,
    amount: 6518.18,
  },
  {
    name: "Marco Lightweight Shirt",
    price: 128.5,
    quantity: 37,
    amount: 4754.5,
  },
  {
    name: "Half Sleeve Shirt",
    price: 39.99,
    quantity: 64,
    amount: 2559.36,
  },
  {
    name: "Lightweight Jacket",
    price: 20.0,
    quantity: 184,
    amount: 3680.0,
  },
  {
    name: "Marco Shoes",
    price: 79.49,
    quantity: 64,
    amount: 1965.81,
  },
];

export const lowPerformingAds: LowPerformingAd[] = [
  {
    name: "Tata Salt",
    amount: 300.56,
    percentage: 38.6,
    color: "#1c1c1c",
  },
  {
    name: "Lays",
    amount: 135.18,
    percentage: 25.7,
    color: "#baedbd",
  },
  {
    name: "Pops",
    amount: 154.02,
    percentage: 20.4,
    color: "#95a4fc",
  },
  {
    name: "Crops",
    amount: 48.96,
    percentage: 15.3,
    color: "#b1e3ff",
  },
];
