// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select"
// import { useEffect, useState } from "react";
// import { getOrderQuantityAnalyticsAction, getOrderCustomerAnalyticsAction } from "@/actions/seller-dashboard";
// import { CustomerAnalyticsChartData, OrderAnalyticsChartData } from "@/types/dashboard";
// import { Skeleton } from "../ui/skeleton";

// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-2 border rounded shadow">
//         <p className="text-sm font-medium">{label}</p>
//         {payload.map((entry: any, index: number) => (
//           <p key={index} style={{ color: entry.color }} className="text-sm">
//             {entry.name}: {entry.value}
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// export function OrderAnalytics() {
//   const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
//   const [isLoading, setIsLoading] = useState(true);
//   const [orderData, setOrderData] = useState<OrderAnalyticsChartData[]>([]);
//   const [customerData, setCustomerData] = useState<CustomerAnalyticsChartData[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
        
//         // Fetch both analytics in parallel
//         const [quantityAnalytics, customerAnalytics] = await Promise.all([
//           getOrderQuantityAnalyticsAction(period),
//           getOrderCustomerAnalyticsAction(period)
//         ]);

//         // Process quantity analytics data
//         let processedOrderData: OrderAnalyticsChartData[] = [];
//         if (period === 'week') {
//           // For week, show last 7 days
//           const today = new Date();
//           for (let i = 6; i >= 0; i--) {
//             const date = new Date(today);
//             date.setDate(date.getDate() - i);
//             processedOrderData.push({
//               name: `${date.getDate()}/${date.getMonth() + 1}`,
//               "Bulk Quantity": quantityAnalytics.bulkQuantityOrders / 7,
//               "Single Quantity": quantityAnalytics.singleQuantityOrders / 7,
//             });
//           }
//         } else if (period === 'month') {
//           // For month, show last 30 days grouped by week
//           for (let i = 0; i < 4; i++) {
//             processedOrderData.push({
//               name: `Week ${i + 1}`,
//               "Bulk Quantity": quantityAnalytics.bulkQuantityOrders / 4,
//               "Single Quantity": quantityAnalytics.singleQuantityOrders / 4,
//             });
//           }
//         } else {
//           // For year, show months
//           monthNames.forEach((month, index) => {
//             processedOrderData.push({
//               name: month,
//               "Bulk Quantity": quantityAnalytics.bulkQuantityOrders / 12,
//               "Single Quantity": quantityAnalytics.singleQuantityOrders / 12,
//             });
//           });
//         }

//         // Process customer analytics data
//         let processedCustomerData: CustomerAnalyticsChartData[] = [];
//         if (period === 'week') {
//           // For week, show last 7 days
//           const today = new Date();
//           for (let i = 6; i >= 0; i--) {
//             const date = new Date(today);
//             date.setDate(date.getDate() - i);
//             processedCustomerData.push({
//               name: `${date.getDate()}/${date.getMonth() + 1}`,
//               "Repeated Customers": customerAnalytics.repeatedCustomers / 7,
//               "New Customers": customerAnalytics.newCustomers / 7,
//             });
//           }
//         } else if (period === 'month') {
//           // For month, show last 30 days grouped by week
//           for (let i = 0; i < 4; i++) {
//             processedCustomerData.push({
//               name: `Week ${i + 1}`,
//               "Repeated Customers": customerAnalytics.repeatedCustomers / 4,
//               "New Customers": customerAnalytics.newCustomers / 4,
//             });
//           }
//         } else {
//           // For year, show months
//           monthNames.forEach((month, index) => {
//             processedCustomerData.push({
//               name: month,
//               "Repeated Customers": customerAnalytics.repeatedCustomers / 12,
//               "New Customers": customerAnalytics.newCustomers / 12,
//             });
//           });
//         }

//         setOrderData(processedOrderData);
//         setCustomerData(processedCustomerData);
//       } catch (error) {
//         console.error('Error fetching analytics:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [period]);

//   if (isLoading) {
//     return (
//       <div className="rounded-lg border border-gray-100 bg-white p-6">
//         <div className="mb-6 flex items-center justify-between">
//           <h2 className="text-xl font-semibold">Order Analytics Overview</h2>
//           <div className="w-[120px]">
//             <Skeleton className="h-10" />
//           </div>
//         </div>
//         <div className="grid gap-4 md:grid-cols-2">
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Analytics</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[300px]">
//                 <Skeleton className="h-full w-full" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-[300px]">
//                 <Skeleton className="h-full w-full" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-lg border border-gray-100 bg-white p-6">
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Order Analytics Overview</h2>
//         <Select 
//           defaultValue={period}
//           onValueChange={(value) => setPeriod(value as 'week' | 'month' | 'year')}
//         >
//           <SelectTrigger className="w-[120px]">
//             <SelectValue placeholder="Select period" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="week">Weekly</SelectItem>
//             <SelectItem value="month">Monthly</SelectItem>
//             <SelectItem value="year">Yearly</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Order Analytics</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={orderData}>
//                   <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
//                   <XAxis 
//                     dataKey="name" 
//                     angle={period === 'year' ? -45 : 0}
//                     textAnchor={period === 'year' ? "end" : "middle"}
//                     height={60}
//                   />
//                   <YAxis />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Line
//                     type="monotone"
//                     dataKey="Bulk Quantity"
//                     stroke="#ff5c5c"
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                     activeDot={{ r: 6 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="Single Quantity"
//                     stroke="#ffa600"
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                     activeDot={{ r: 6 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Order Summary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={customerData}>
//                   <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
//                   <XAxis 
//                     dataKey="name" 
//                     angle={period === 'year' ? -45 : 0}
//                     textAnchor={period === 'year' ? "end" : "middle"}
//                     height={60}
//                   />
//                   <YAxis />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Line
//                     type="monotone"
//                     dataKey="Repeated Customers"
//                     stroke="#ffa600"
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                     activeDot={{ r: 6 }}
//                   />
//                   <Line
//                     type="monotone"
//                     dataKey="New Customers"
//                     stroke="#ff5c5c"
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                     activeDot={{ r: 6 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


export default function OrderAnalytics() {
  return <div>OrderAnalytics</div>;
}