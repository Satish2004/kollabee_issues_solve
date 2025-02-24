// "use client";

// import Image from "next/image";
// import { format } from "date-fns";
// import { Circle, Dot, Eye, Pencil, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Product } from "@/actions/seller-products";
// import Link from "next/link";
// import { deleteProduct } from "@/actions/products";
// import { toast } from "sonner";

// interface ProductTableProps {
//   products: Product[];
// }



// const AvailabilityBadge = ({ quantity }: { quantity: number }) => {
//   let status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
//   if (quantity >= 20000) {
//     status = "IN_STOCK";
//   } else if (quantity > 0) {
//     status = "LOW_STOCK";
//   } else {
//     status = "OUT_OF_STOCK";
//   }

//   const colors = {
//     IN_STOCK: { text: "text-[#4aa785]", hex: "#4aa785" },
//     LOW_STOCK: { text: "text-[#ffc555]", hex: "#ffc555" },
//     OUT_OF_STOCK: { text: "text-[#e00261]", hex: "#e00261" },
//   };

//   const labels = {
//     IN_STOCK: "In-Stock",
//     LOW_STOCK: "Low Stock",
//     OUT_OF_STOCK: "Out of stock",
//   };

//   return (
//     <span className={`px-2 py-1 flex items-center justify-start -ml-4 rounded-full text-medium font-semibold font-jost ${colors[status].text}`}>
//       <Circle className="h-2 w-2 mr-2" fill={colors[status].hex} />
//       <span>{labels[status]}</span>
//     </span>
//   );
// };

// export function ProductTable({ products }: ProductTableProps) {
// async function handleDelete(productId: string) {
//   const res = await fetch(`/api/product/delete/${productId}`, {
//     method: "DELETE",
//   });

//   const data = await res.json();
//   if (data.success) {
//     toast.success("Product deleted")
//   } else {
//     toast.error("Error deleting product", data.message)
//   }
// }
//   return (
//     <div className="overflow-x-auto bg-[#ffffff] rounded-lg font-jost">
//       <table className="w-full">
//         <thead>
//           <tr className="border-b border-[#e0e0e0] text-[#1C1C1C66]/40">
//             <th className="px-4 py-3 text-left">Products</th>
//             <th className="px-4 py-3 text-left">Selling Price</th>
//             <th className="px-4 py-3 text-left">Quantity Available</th>
//             <th className="px-4 py-3 text-left">Updated At</th>
//             <th className="px-4 py-3 text-left">Availability</th>
//             <th className="px-4 py-3 text-left">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((product) => (
//             <tr key={product.id} className="border-b border-[#e0e0e0]">
//               <td className="px-4 flex gap-2 items-center">
//                 {/* <Image
//                   src={product.images[0] || "/placeholder.svg"}
//                   alt={product.name}
//                   width={40}
//                   height={40}
//                   className="rounded-md object-cover"
//                 /> */}
//                 <span className="font-semibold text-gray-500 mt-2">
//                   {product.name}
//                 </span>
//               </td>
//               <td className="px-4 font-semibold text-gray-500">
//                 ${product.price.toFixed(2)}
//               </td>
//               <td className="px-4 font-semibold text-gray-500">
//                 {product.quantity.toLocaleString()}
//               </td>
//               <td className="px-4  font-semibold text-gray-500">
//                 {format(new Date(product.updatedAt), "MMM d, yyyy")}
//               </td>
//               <td className="px-4 ">
//                 <AvailabilityBadge quantity={product.quantity} />
//               </td>
//               <td className="px-4 ">
//                 {/* action buttons */}
//                 <div className="flex gap-2">
//                   <Link href={`/product/${product.id}`}>
//                     <Button variant="ghost" size="icon">
//                       <Eye className="h-8 w-8 text-[#78787a]" strokeWidth={3}/>
//                     </Button>
//                   </Link>
//                   <Link href={`/seller/update-product/${product.id}`} >
//                     <Button variant="ghost" size="icon">
//                       <Pencil className="h-4 w-4 text-[#78787a]" strokeWidth={3} />
//                     </Button>
//                   </Link>
//                   <Button onClick={() => handleDelete(product.id)} variant="ghost" size="icon">
//                     <Trash2 className="h-4 w-4 text-[#ffc555]" strokeWidth={3} />
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


export function ProductTable() {
  return <div>ProductTable</div>;
}
