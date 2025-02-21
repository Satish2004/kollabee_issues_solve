import { DollarSign, ShoppingCart, BarChart2, Eye } from "lucide-react";

export interface Metric {
  id: string;
  title: string;
  value: number;
  percentageChange: number;
  additionalValue: number;
  icon: typeof DollarSign;
  format: "currency" | "number" | "compact";
  suffix?: string;
}

export const metrics: Metric[] = [
  {
    id: "profit",
    title: "Profit",
    value: 23000,
    percentageChange: 10.3,
    additionalValue: 2123,
    icon: DollarSign,
    format: "currency",
  },
  {
    id: "sales",
    title: "Total Sales",
    value: 23000,
    percentageChange: 3.4,
    additionalValue: 21123,
    icon: ShoppingCart,
    format: "number",
  },
  {
    id: "orders",
    title: "Total Orders",
    value: 4000,
    percentageChange: -10.3,
    additionalValue: 223,
    icon: BarChart2,
    format: "number",
  },
  {
    id: "impressions",
    title: "Impression",
    value: 345000,
    percentageChange: 10.3,
    additionalValue: -223000,
    icon: Eye,
    format: "compact",
    suffix: "K",
  },
];
