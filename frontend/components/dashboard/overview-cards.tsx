// "use client";

// import { ArrowDown, ArrowUp, Box, DollarSign, Package } from "lucide-react"
// import { Card, CardContent } from "../ui/card"
// import { useEffect, useState } from "react";
// import { getAverageSalesPerDayAction, getTotalEarningsAction, getTotalOrdersAction } from "@/actions/seller-dashboard";
// import { Skeleton } from "../ui/skeleton";

// interface OverviewCardData {
//   title: string;
//   value: string;
//   subValue?: string;
//   change: string;
//   changeText: string;
//   trend: "up" | "down";
//   icon: any;
//   percentage?: string;
//   subText?: string;
//   subTextLabel?: string;
// }

// export function OverviewCards() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [overviewData, setOverviewData] = useState<OverviewCardData[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [totalOrders, totalEarnings, averageSales] = await Promise.all([
//           getTotalOrdersAction(),
//           getTotalEarningsAction(),
//           getAverageSalesPerDayAction(),
//         ]);

//         const newOverviewData: OverviewCardData[] = [
//           {
//             title: "TOTAL ORDERS",
//             value: totalOrders.currMonthOrders.toString(),
//             change: totalOrders.percentageChange > 0 ? `+${totalOrders.percentageChange.toFixed(1)}%` : `${totalOrders.percentageChange.toFixed(1)}%`,
//             changeText: "from last month",
//             trend: totalOrders.increaseOrDecrease === "increase" ? "up" : "down",
//             icon: Package,
//           },
//           {
//             title: "TOTAL RECEIVED",
//             value: `$${(totalEarnings.currMonthEarnings._sum.total ?? 0).toFixed(2)}`,
//             change: totalEarnings.percentageChange > 0 ? `+${totalEarnings.percentageChange.toFixed(1)}%` : `${totalEarnings.percentageChange.toFixed(1)}%`,
//             changeText: "from last month",
//             trend: totalEarnings.increaseOrDecrease === "increase" ? "up" : "down",
//             icon: DollarSign,
//           },
//           {
//             title: "RETURNED PRODUCTS",
//             value: "10",
//             change: "-$2,123",
//             changeText: "from last month",
//             trend: "down",
//             icon: Box,
//           },
//           {
//             title: "AVERAGE SALES",
//             value: `$${averageSales.currMonthAverageSalesPerDay.toFixed(2)}`,
//             change: averageSales.percentageChange > 0 ? `+${averageSales.percentageChange.toFixed(1)}%` : `${averageSales.percentageChange.toFixed(1)}%`,
//             changeText: "from last month",
//             trend: averageSales.increaseOrDecrease === "increase" ? "up" : "down",
//             icon: DollarSign,
//           },
//         ];

//         setOverviewData(newOverviewData);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <div className="grid gap-4 md:grid-cols-3">
//           {[...Array(3)].map((_, i) => (
//             <Card key={i}>
//               <CardContent className="p-6">
//                 <Skeleton className="h-4 w-[150px]" />
//                 <Skeleton className="mt-4 h-8 w-[100px]" />
//                 <Skeleton className="mt-4 h-4 w-[200px]" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//         <div className="grid gap-4 md:grid-cols-1">
//           {[...Array(1)].map((_, i) => (
//             <Card key={i}>
//               <CardContent className="p-6">
//                 <Skeleton className="h-4 w-[150px]" />
//                 <Skeleton className="mt-4 h-8 w-[100px]" />
//                 <Skeleton className="mt-4 h-4 w-[200px]" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="grid gap-4 md:grid-cols-3">
//         {overviewData.slice(0, 3).map((item, index) => (
//           <Card key={index}>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-medium text-muted-foreground">
//                   {item.title}
//                 </p>
//                 <item.icon className="h-4 w-4 text-muted-foreground" />
//               </div>
//               <div className="mt-2">
//                 <div className="flex items-center gap-2">
//                   <h2 className="text-2xl font-bold">{item.value}</h2>
//                   {item.subValue && (
//                     <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-xs text-red-600">
//                       {item.subValue}
//                     </span>
//                   )}
//                 </div>
//                 {item.subText && (
//                   <p className="text-xs text-muted-foreground">
//                     {item.subText}{" "}
//                     <span className="opacity-60">{item.subTextLabel}</span>
//                   </p>
//                 )}
//               </div>
//               <div className="mt-4 flex items-center gap-1">
//                 {item.trend === "up" ? (
//                   <ArrowUp className="h-4 w-4 text-green-500" />
//                 ) : (
//                   <ArrowDown className="h-4 w-4 text-red-500" />
//                 )}
//                 <span
//                   className={`text-sm ${
//                     item.trend === "up" ? "text-green-500" : "text-red-500"
//                   }`}
//                 >
//                   {item.change}
//                 </span>
//                 <span className="text-sm text-muted-foreground">
//                   {item.changeText}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//       <div className="grid gap-4 md:grid-cols-1">
//         {overviewData.slice(3).map((item, index) => (
//           <Card key={index}>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">
//                     {item.title}
//                   </p>
//                   <div className="mt-2">
//                     <h2 className="text-2xl font-bold">{item.value}</h2>
//                     <p className="text-xs text-muted-foreground">
//                       <span className={item.trend === "up" ? "text-green-500" : "text-red-500"}>
//                         {item.change}
//                       </span>{" "}
//                       {item.changeText}
//                     </p>
//                   </div>
//                 </div>
//                 {item.percentage ? (
//                   <div className="flex items-center gap-1">
//                     <span className="rounded-md bg-green-100 px-1.5 py-0.5 text-xs text-green-600">
//                       {item.percentage}
//                     </span>
//                     <ArrowUp className="h-4 w-4 text-green-500" />
//                   </div>
//                 ) : (
//                   <item.icon className="h-4 w-4 text-muted-foreground" />
//                 )}
//               </div>
//               {item.subText && (
//                 <div className="mt-4 flex items-center gap-1">
//                   <span className="text-sm text-muted-foreground">
//                     {item.subText}{" "}
//                     <span className="opacity-60">{item.subTextLabel}</span>
//                   </span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }


export default function OverviewCards() {
  return <div>OverviewCards</div>;
}
