export interface RevenueData {
  date: string;
  total: number;
  firstCampaign: number;
  secondCampaign: number;
}

export interface LocationRevenue {
  city: string;
  amount: number;
  coordinates: [number, number];
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  prefix?: string;
  suffix?: string;
}

export const revenueData: RevenueData[] = [
  {
    date: "Dec19",
    total: 1500000,
    firstCampaign: 1100000,
    secondCampaign: 608000,
  },
  {
    date: "Dec21",
    total: 1450000,
    firstCampaign: 1050000,
    secondCampaign: 610000,
  },
  {
    date: "Dec23",
    total: 1480000,
    firstCampaign: 1080000,
    secondCampaign: 605000,
  },
  {
    date: "Dec25",
    total: 1460000,
    firstCampaign: 1060000,
    secondCampaign: 600000,
  },
];

export const locationRevenue: LocationRevenue[] = [
  { city: "New York", amount: 72000, coordinates: [40.7128, -74.006] },
  { city: "San Francisco", amount: 39000, coordinates: [37.7749, -122.4194] },
  { city: "Sydney", amount: 25000, coordinates: [-33.8688, 151.2093] },
  { city: "Singapore", amount: 61000, coordinates: [1.3521, 103.8198] },
];

export const metrics: MetricCard[] = [
  { label: "Customers", value: 3781, change: 11.01 },
  { label: "Revenue", value: 695, change: 15.03, prefix: "$" },
  { label: "Orders", value: 1219, change: -0.03 },
  { label: "Growth", value: 30.1, change: 6.08, suffix: "%" },
];

export const netIncome = {
  percentage: 75,
  amount: 23100.0,
};

export const averageSpend = {
  percentage: 24,
  amount: 3070.0,
};
