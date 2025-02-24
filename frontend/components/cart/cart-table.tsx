// // CartTable.tsx
// import { decreaseCartItemsQuantityAction, increaseCartItemsQuantityAction, removeFromCartAction } from "@/actions/cart";
// import { useGlobalStore } from "@/store/store";
// import React, { useState } from "react";
// import { toast } from "sonner";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
// }

// interface CartTableProps {
//   cartItems: CartItem[];
// }

// const QuantitySetter = ({
//   quantity,
//   setQuantity,
//   item,
// }: {
//   quantity: number;
//   setQuantity: (quantity: number) => void;
//   item: CartItem;
// }) => {
//   const { cart, setCart } = useGlobalStore();

//   const increment = async (itemId: number) => {
//     try {
//       setCart(
//         cart.map((item) => {
//           if (item.id === itemId) {
//             return { ...item, quantity: item.quantity + 1 };
//           }
//           return item;
//         })
//       );
//       setQuantity(quantity + 1);
//       await increaseCartItemsQuantityAction(String(itemId));
//       toast.success("Quantity incremented");
//     } catch (error) {
//       console.log("Error incrementing quantity:", error);
//       toast.error("Failed to increment quantity");
//     }
//   };

//   const decrement = async (itemId: number) => {
//     try {
//       if (quantity > 1) {
//         setCart(
//           cart.map((item) => {
//             if (item.id === itemId) {
//               return { ...item, quantity: item.quantity - 1 };
//             }
//             return item;
//           })
//         );
//         setQuantity(quantity - 1);
//         await decreaseCartItemsQuantityAction(String(itemId));
//       } else {
//         setCart(cart.filter((item) => item.id !== itemId));
//         setQuantity(0);
//         await removeFromCartAction(String(itemId));
//       }

//       toast.success("Quantity decremented");
//     } catch (error) {
//       console.log("Error decrementing quantity:", error);
//       toast.error("Failed to decrement quantity");
//     }
//   };

//   return (
//     <div className="flex items-center space-x-2">
//       <button
//         onClick={async () => await decrement(item.id)}
//         className="border px-2 rounded text-sm"
//       >
//         -
//       </button>
//       <span className="bg-[#F4F4F4] px-1 py-1 rounded-md w-20 text-center">{quantity}</span>
//       <button
//         onClick={async() => await increment(item.id)}
//         className="border px-2 rounded text-sm"
//       >
//         +
//       </button>
//     </div>
//   );
// };

// const CartTable = ({ cartItems }: CartTableProps) => {
//   return (
//     <div className="overflow-x-auto shadow-md sm:rounded-lg max-w-[600px] min-w-[600px]">
//       <header className="flex justify-between items-center p-4 bg-white">
//         <h1 className="font-bold">Your Cart</h1>
//         <span className="text-gray-400">({cartItems.length})</span>
//       </header>
//       <hr />
//       <table className="min-w-full table-auto text-sm">
//         <tbody className="bg-white">
//           {cartItems.map((item) => (
//             <CartRow key={item.id} item={item} />
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// const CartRow = ({ item }: { item: CartItem }) => {
//   const [quantity, setQuantity] = useState(item.quantity);
//   const totalPrice = quantity * item.price;

//   return (
//     <tr className="border-b">
//       {/* Adjusted the width of columns */}
//       <td className="px-4 py-4 text-sm font-medium text-gray-700 w-[50%]">
//         {item.name}
//       </td>
//       <td className="py-4 w-[30%]">
//         <QuantitySetter quantity={quantity} setQuantity={setQuantity} item={item} />
//       </td>
//       <td className="px-4 py-4 text-sm font-bold text-gray-900 text-right w-[20%]">{`$${totalPrice.toFixed(
//         2
//       )}`}</td>
//     </tr>
//   );
// };


// export default CartTable;


export default function CartTable() {
  return <div>CartTable</div>;
}
