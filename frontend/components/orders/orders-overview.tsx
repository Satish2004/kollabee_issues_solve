// "use client";

// import { useOrdersStore } from "@/store/orders";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Package2,
//   ArrowRight,
//   PackageCheck,
//   PackageX,
//   Truck,
// } from "lucide-react";
// import { formatCurrency } from "@/lib/utils";

// function MetricCard({
//   title,
//   value,
//   subtitle,
//   icon: Icon,
//   trend,
//   trendValue,
//   trendLabel,
// }: {
//   title: string;
//   value: string | number;
//   subtitle?: string;
//   icon: any;
//   trend?: "up" | "down";
//   trendValue?: string;
//   trendLabel?: string;
// }) {
//   return (
//     <Card>
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-sm font-medium text-gray-600">{title}</h3>
//           <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
//             <Icon className="w-5 h-5 text-gray-600" />
//           </div>
//         </div>
//         <div className="space-y-2">
//           <div className="flex items-center gap-2">
//             <span className="text-3xl font-bold">{value}</span>
//             {trend && (
//               <span
//                 className={`text-xs px-2 py-1 rounded-full ${
//                   trend === "up"
//                     ? "bg-red-50 text-red-600"
//                     : "bg-green-50 text-green-600"
//                 }`}
//               >
//                 {trendValue}
//               </span>
//             )}
//           </div>
//           {subtitle && (
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-500">{subtitle}</span>
//               <ArrowRight className="w-4 h-4 text-gray-400" />
//             </div>
//           )}
//           {trendLabel && (
//             <div className="flex items-center justify-between">
//               <span className="text-sm text-gray-500">
//                 {trend === "up" ? "+" : "-"}
//                 {trendLabel}
//               </span>
//               <ArrowRight className="w-4 h-4 text-gray-400" />
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export function OrdersOverview() {
//   const { orders, overview, isLoading } = useOrdersStore();

//   // Ensure we're using the overview object safely
//   const safeOverview = overview || {
//     totalOrders: 0,
//     totalOrdersChange: 0,
//     totalReceived: 0,
//     totalRevenue: 0,
//     revenuePercentage: 0,
//     returnedProducts: 0,
//     returnedProductsChange: 0,
//     onTheWayToShip: 0,
//     shippingValue: 0,
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full max-w-7xl mx-auto p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
//           {[...Array(4)].map((_, i) => (
//             <Card key={i}>
//               <CardContent className="p-6">
//                 <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
//                 <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-6">Orders Overview</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <MetricCard
//           title="TOTAL ORDERS"
//           value={safeOverview.totalOrders}
//           trendLabel={`${safeOverview.totalOrdersChange} from last month`}
//           trend="up"
//           icon={Package2}
//         />
//         <MetricCard
//           title="TOTAL RECEIVED"
//           value={safeOverview.totalReceived}
//           subtitle={`${formatCurrency(safeOverview.totalRevenue)} Revenue`}
//           trend="up"
//           trendValue={`${safeOverview.revenuePercentage}%`}
//           icon={PackageCheck}
//         />
//         <MetricCard
//           title="RETURNED PRODUCTS"
//           value={safeOverview.returnedProducts}
//           trendLabel={`${formatCurrency(
//             safeOverview.returnedProductsChange
//           )} from last month`}
//           trend="down"
//           icon={PackageX}
//         />
//         <MetricCard
//           title="ON THE WAY TO SHIP"
//           value={safeOverview.onTheWayToShip}
//           subtitle={`${formatCurrency(
//             safeOverview.shippingValue
//           )} Products shipping`}
//           icon={Truck}
//         />
//       </div>
//     </div>
//   );
// }


export default function OrdersOverview() {
  return <div>OrdersOverview</div>;
}