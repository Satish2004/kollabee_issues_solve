export interface OrderData {
  month: string;
  bulkQuantity: number;
  singleQuantity: number;
}

export interface SpendingCategory {
  name: string;
  value: number;
  color: string;
}

export const orderData: OrderData[] = [
  { month: "Jan", bulkQuantity: 20, singleQuantity: 30 },
  { month: "Feb", bulkQuantity: 25, singleQuantity: 35 },
  { month: "Mar", bulkQuantity: 35, singleQuantity: 45 },
  { month: "Apr", bulkQuantity: 45, singleQuantity: 55 },
  { month: "May", bulkQuantity: 40, singleQuantity: 60 },
  { month: "Jun", bulkQuantity: 42, singleQuantity: 58 },
  { month: "Jul", bulkQuantity: 48, singleQuantity: 52 },
];

export const spendingData: SpendingCategory[] = [
  { name: "YOU ARE SAVING", value: 20, color: "#339af0" },
  { name: "COST", value: 40, color: "#51cf66" },
  { name: "EXPENSE", value: 15, color: "#ff922b" },
  { name: "OTHERS", value: 15, color: "#dee2e6" },
];

export const highlightedAmount = 59492.1;
export const highlightedDate = "15 Aug 2022";
