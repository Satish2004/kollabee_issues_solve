// "use client";

// import { Card } from "@/components/ui/card";
// import { OrdersChart } from "./orders-chart";
// import { TopSellingProducts } from "./top-selling-products";
// import { TrendingProducts } from "./trending-products";
// import { LowSeller } from "./low-seller";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useEffect, useState } from "react";
// import { getPublishedProductsCountAction, getTotalOrdersAction } from "@/actions/seller-dashboard";
// import { Skeleton } from "@/components/ui/skeleton";

// type Period = 'today' | 'week' | 'month' | 'year' | 'all';

// interface MetricsData {
//   publishedProducts: number;
//   totalOrders: number;
// }

// export function DashboardMetrics() {
//   const [selectedPeriod, setSelectedPeriod] = useState<Period>('today');
//   const [isLoading, setIsLoading] = useState(true);
//   const [metricsData, setMetricsData] = useState<MetricsData>({
//     publishedProducts: 0,
//     totalOrders: 0,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [publishedProducts, totalOrders] = await Promise.all([
//           getPublishedProductsCountAction(selectedPeriod),
//           getTotalOrdersAction(),
//         ]);

//         setMetricsData({
//           publishedProducts: publishedProducts || 0,
//           totalOrders: totalOrders?.data?.length || 0,
//         });
//       } catch (error) {
//         console.error("Error fetching metrics data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedPeriod]);

//   return (
//     <div className="rounded-lg border border-gray-100 bg-white p-6">
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Dashboard Overview</h2>
//         <Select 
//           defaultValue={selectedPeriod} 
//           onValueChange={(value: Period) => setSelectedPeriod(value)}
//         >
//           <SelectTrigger className="w-[120px]">
//             <SelectValue placeholder="Select period" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="today">Today</SelectItem>
//             <SelectItem value="week">This Week</SelectItem>
//             <SelectItem value="month">This Month</SelectItem>
//             <SelectItem value="year">This Year</SelectItem>
//             <SelectItem value="all">All</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
      
//       <div className="space-y-6">
//         {/* Top Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-3">
//           <Card className="bg-pink-50 p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-sm font-medium text-gray-600">Requests</h3>
//               <span className="text-xs text-green-600">+6.08%</span>
//             </div>
//             <p className="mt-2 text-2xl font-bold">239</p>
//           </Card>
//           <Card className="bg-gray-50 p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-sm font-medium text-gray-600">Messages</h3>
//             </div>
//             <p className="mt-2 text-2xl font-bold">12</p>
//           </Card>
//           <Card className="bg-gray-50 p-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-sm font-medium text-gray-600">Published Products</h3>
//             </div>
//             {isLoading ? (
//               <Skeleton className="mt-2 h-8 w-20" />
//             ) : (
//               <p className="mt-2 text-2xl font-bold">{metricsData.publishedProducts}</p>
//             )}
//           </Card>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid gap-6 md:grid-cols-7">
//           {/* Left Column - Charts */}
//           <div className="space-y-6 md:col-span-4">
//             <Card className="p-6">
//               <div className="mb-4">
//                 <h3 className="text-lg font-medium">Total Orders</h3>
//                 {isLoading ? (
//                   <Skeleton className="mt-2 h-8 w-20" />
//                 ) : (
//                   <p className="mt-2 text-2xl font-bold">{metricsData.totalOrders}</p>
//                 )}
//               </div>
//               <OrdersChart period={selectedPeriod} />
//             </Card>
//             <Card className="p-6">
//               <TopSellingProducts period={selectedPeriod} />
//             </Card>
//           </div>

//           {/* Right Column - Trending & Low Seller */}
//           <div className="space-y-6 md:col-span-3">
//             <Card className="p-6">
//               <div className="mb-4">
//                 <h3 className="text-lg font-medium">Trending Products</h3>
//               </div>
//               <TrendingProducts period={selectedPeriod} />
//             </Card>
//             <Card className="bg-pink-50 p-6">
//               <div className="mb-4">
//                 <h3 className="text-lg font-medium">Low seller</h3>
//               </div>
//               <LowSeller period={selectedPeriod} />
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function DashboardMetrics() {
  return (
    <div>
      <h1>Dashboard Metrics</h1>
    </div>
  );
}
