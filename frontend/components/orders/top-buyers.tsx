// "use client";

// import { useOrdersStore } from "@/store/orders";
// import { Button } from "@/components/ui/button";
// import { Plus, ArrowUpDown } from "lucide-react";
// import Image from "next/image";
// import { format } from "date-fns";
// import { TableSkeleton } from "./table-skeleton";

// type BuyerStatus = "Active buying" | "Not Active";

// interface TopBuyer {
//   id: string;
//   name: string;
//   image: string;
//   lastProduct: string;
//   address: string;
//   lastOrderDate: Date;
//   status: BuyerStatus;
// }

// export function TopBuyers() {
//   const { orders, isLoading } = useOrdersStore();

//   // Process orders to get unique buyers with their latest order
//   const topBuyers = orders.reduce<TopBuyer[]>((acc, order) => {
//     const existingBuyer = acc.find((buyer) => buyer.id === order.buyerId);
//     const buyerData = {
//       id: order.buyerId,
//       name: order.buyer.user.name,
//       image: order.buyer.user.image || "/placeholder.svg?height=40&width=40",
//       lastProduct: order.items[0]?.product.name || "N/A",
//       address: order.buyer.location || "N/A",
//       lastOrderDate: new Date(order.createdAt),
//       status:
//         order.status === "COMPLETED" || order.status === "IN_PROGRESS"
//           ? "Active buying"
//           : "Not Active",
//     };

//     if (!existingBuyer) {
//       return [...acc, buyerData];
//     }

//     if (new Date(order.createdAt) > existingBuyer.lastOrderDate) {
//       return acc.map((buyer) =>
//         buyer.id === order.buyerId ? buyerData : buyer
//       );
//     }

//     return acc;
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="w-full max-w-7xl mx-auto p-6">
//         <TableSkeleton />
//       </div>
//     );
//   }

//   if (topBuyers.length === 0) {
//     return (
//       <div className="w-full max-w-7xl mx-auto p-6">
//         <h2 className="text-2xl font-semibold mb-6">Top Buyers List</h2>
//         <div className="text-center py-12 bg-gray-50 rounded-lg">
//           <p className="text-gray-500">No buyers found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-semibold">Top Buyers List</h2>
//       </div>

//       <div className="flex items-center justify-between mb-6 bg-gray-50 p-2 rounded-lg">
//         <div className="flex gap-4">
//           <Button
//             variant="outline"
//             size="icon"
//             className="bg-transparent shadow-none border-none"
//           >
//             <Plus className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="bg-transparent shadow-none border-none"
//           >
//             <ArrowUpDown className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b">
//               <th className="text-left p-4 text-sm font-medium text-gray-500">
//                 Buyer Name
//               </th>
//               <th className="text-left p-4 text-sm font-medium text-gray-500">
//                 Product Ordered
//               </th>
//               <th className="text-left p-4 text-sm font-medium text-gray-500">
//                 Address
//               </th>
//               <th className="text-left p-4 text-sm font-medium text-gray-500">
//                 Order Date
//               </th>
//               <th className="text-left p-4 text-sm font-medium text-gray-500">
//                 Status of Customer
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {topBuyers.map((buyer) => (
//               <tr key={buyer.id} className="border-b last:border-b-0">
//                 <td className="p-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-8 h-8 rounded-full overflow-hidden">
//                       <Image
//                         src={buyer.image || "/placeholder.svg"}
//                         alt={buyer.name}
//                         width={32}
//                         height={32}
//                         className="object-cover"
//                       />
//                     </div>
//                     <span className="text-sm">{buyer.name}</span>
//                   </div>
//                 </td>
//                 <td className="p-4 text-sm">{buyer.lastProduct}</td>
//                 <td className="p-4 text-sm">{buyer.address}</td>
//                 <td className="p-4 text-sm">
//                   {format(buyer.lastOrderDate, "dd/MM/yy")}
//                 </td>
//                 <td className="p-4">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`h-2 w-2 rounded-full ${
//                         buyer.status === "Active buying"
//                           ? "bg-red-500"
//                           : "bg-gray-500"
//                       }`}
//                     />
//                     <span
//                       className={`text-sm ${
//                         buyer.status === "Active buying"
//                           ? "text-red-500"
//                           : "text-gray-500"
//                       }`}
//                     >
//                       {buyer.status}
//                     </span>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex items-center justify-center p-4 border-t">
//           <nav className="flex gap-1">
//             <Button variant="outline" size="icon" disabled>
//               {"<"}
//             </Button>
//             {[1, 2, 3, 4, 5].map((page) => (
//               <Button
//                 key={page}
//                 variant={page === 1 ? "default" : "outline"}
//                 size="icon"
//               >
//                 {page}
//               </Button>
//             ))}
//             <Button variant="outline" size="icon">
//               {">"}
//             </Button>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// }

export function TopBuyers() {
  return <div>TopBuyers</div>;
}
