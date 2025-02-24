// "use client";
// import React, { useState } from "react";
// import { Product, Seller, PickupAddress, Category, User } from "@prisma/client";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import ChatContainer from "../chat/chat-container";
// import { toast } from "sonner";
// import { useAddToCart, useAddToWishlist } from "@/hooks/use-item";
// import { useGetUserFromDb } from "@/hooks/use-auth";
// import { useGlobalStore } from "@/store/store";
// import Link from "next/link";
// import { ProductImageViewer } from "./product-image-viewer";
// import ProductVariations from "./product-variations";
// import KeyAttributes from "./key-attributes";
// import SupplierCard from "./know-your-supplier";
// import RelatedSearches from "./related-searches";

// type ProductWithDetails = Product & {
//   images: string[];
//   seller: Seller & {
//     user: User;
//   };
//   pickupAddress: PickupAddress;
//   category: Category[];
// };

// interface ProductDetailsProps {
//   product: ProductWithDetails | null;
//   currentUser: User | null;
//   hasPreviousConversation: {
//     exists: boolean;
//     conversation_id: string | null;
//   };
// }

// const ProductDetails: React.FC<ProductDetailsProps> = ({
//   product,
//   currentUser,
//   hasPreviousConversation,
// }) => {
//   const { data: signedInUser } = useGetUserFromDb();
//   const { cart, setCart, wishList, setWishList } = useGlobalStore();
//   const [chatOpen, setChatOpen] = useState(false);
//   const { mutate: addToCart, isPending: addToCartLoading } = useAddToCart({
//     onSuccess: () => {
//       toast.success("Added to cart");
//       setCart([
//         ...cart,
//         {
//           id: String(product?.id),
//           name: product?.productName,
//           product: product?.productName,
//           image: product?.images[0],
//           quantity: 1,
//           sellerId: product?.seller.userId,
//         },
//       ]);
//     },
//     onError: () => {
//       toast.error("Something went wrong");
//     },
//   });
//   const { mutate: addToWishlist, isPending: addToWishlistLoading } =
//     useAddToWishlist({
//       onSuccess: () => {
//         toast.success("Added to wishlist");
//         setWishList([
//           ...wishList,
//           {
//             id: String(product?.id),
//             name: product?.productName,
//             product: product?.productName,
//             image: product?.images[0],
//             quantity: 1,
//             sellerId: product?.seller.userId,
//           },
//         ]);
//       },
//       onError: () => {
//         toast.error("Something went wrong");
//       },
//     });

//   const handleChat = () => {
//     if (product?.seller.userId === currentUser?.id) {
//       toast.error("Cannot message yourself");
//     } else {
//       setChatOpen(true);
//     }
//   };

//   const handleAddToCart = () => {
//     const updatedCart = [
//       ...cart,
//       {
//         id: String(product?.id),
//         name: product?.productName,
//         product: product?.productName,
//         image: product?.images[0],
//         price: product?.price,
//         quantity: 1,
//         sellerId: product?.seller.userId,
//       },
//     ];
//     try {
//       if (signedInUser) {
//         addToCart(String(product?.id));
//       } else {
//         localStorage.setItem("cart", JSON.stringify(updatedCart));
//         setCart(updatedCart);
//         toast.success("Added to cart");
//       }
//     } catch (error) {
//       console.log("Error: ", error);
//       toast.error("Something went wrong");
//     }
//   };

//   const handleAddToWishlist = () => {
//     const updatedWishList = [
//       ...wishList,
//       {
//         id: String(product?.id),
//         name: product?.productName,
//         product: product?.productName,
//         image: product?.images[0],
//         price: product?.price,
//         quantity: 1,
//         sellerId: product?.seller.userId,
//       },
//     ];
//     try {
//       if (signedInUser) {
//         addToWishlist(String(product?.id));
//       } else {
//         localStorage.setItem("wishList", JSON.stringify(updatedWishList));
//         setWishList(updatedWishList);
//         toast.success("Added to wishlist");
//       }
//     } catch (error) {
//       console.log("Error: ", error);
//       toast.error("Something went wrong");
//     }
//   };

//   // const oldCard = (
//   //   <Card>
//   //     {/* Header Section */}
//   //     <CardHeader>
//   //       <CardTitle className="text-2xl font-bold">
//   //         {product?.productName}
//   //       </CardTitle>
//   //       <p className="text-gray-500">{product?.productDescription}</p>
//   //     </CardHeader>

//   //     <CardContent>
//   //       {/* Product Images */}
//   //       <div className="grid grid-cols-2 gap-4 mb-6">
//   //         {product?.image.map((img, index) => (
//   //           <img
//   //             key={index}
//   //             src={img}
//   //             alt={`Product Image ${index + 1}`}
//   //             className="rounded-md shadow-sm"
//   //           />
//   //         ))}
//   //       </div>

//   //       {/* Categories */}
//   //       <div className="mb-4">
//   //         <h3 className="font-semibold text-lg mb-2">Categories:</h3>
//   //         <div className="flex gap-2">
//   //           {product?.category.map((cat) => (
//   //             <Badge key={cat.id} className="bg-gray-200 text-gray-800">
//   //               {cat.categoryName}
//   //             </Badge>
//   //           ))}
//   //         </div>
//   //       </div>

//   //       {/* Seller Information */}
//   //       <div className="mb-4">
//   //         <h3 className="font-semibold text-lg mb-2">Seller:</h3>
//   //         <div className="flex items-center gap-4">
//   //           <Avatar>
//   //             <AvatarImage
//   //               src={`https://avatar.io/${product?.seller.user.email}`}
//   //             />
//   //             <AvatarFallback>
//   //               {product?.seller.user.name.charAt(0)}
//   //             </AvatarFallback>
//   //           </Avatar>
//   //           <div>
//   //             <p className="font-medium">{product?.seller.user.name}</p>
//   //             <p className="text-gray-500 text-sm">
//   //               {product?.seller.user.email}
//   //             </p>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </CardContent>

//   //     {product?.seller.user.id === currentUser?.id ? (
//   //       <CardFooter className="flex justify-end">
//   //         <Link href={`/profile/seller/product/update/${product?.id}`}>
//   //           <Button variant="default" className="mr-2">
//   //             Edit Product
//   //           </Button>
//   //         </Link>
//   //         <Button variant="secondary">Delete Product</Button>
//   //       </CardFooter>
//   //     ) : (
//   //       <CardFooter className="flex justify-end">
//   //         <Button
//   //           variant="default"
//   //           className="mr-2"
//   //           onClick={handleAddToWishlist}
//   //           disabled={addToWishlistLoading}
//   //         >
//   //           {addToWishlistLoading ? "Adding to wishlist..." : "Add to Wishlist"}
//   //         </Button>
//   //         <Button
//   //           variant="default"
//   //           className="mr-2"
//   //           onClick={handleAddToCart}
//   //           disabled={addToCartLoading}
//   //         >
//   //           {addToCartLoading ? "Adding to cart..." : "Add to Cart"}
//   //         </Button>
//   //         <Button variant="default" className="mr-2">
//   //           Buy Now!
//   //         </Button>
//   //         <Button variant="secondary" onClick={() => handleChat()}>
//   //           Have doubts? Chat With the Seller!
//   //         </Button>
//   //       </CardFooter>
//   //     )}
//   //   </Card>
//   // );

//   return (
//     <div className="w-full flex justify-center gap-24">
//       {chatOpen ? (
//         <div className="fixed inset-0 z-50 bg-opacity-50 flex justify-center items-center transition-all duration-300">
//           <div className="relative dark:bg-black bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4 sm:mx-auto p-10">
//             {/* Close Button */}
//             <button
//               onClick={() => {
//                 setChatOpen(false);
//               }}
//               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-6 h-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             {/* Modal Content */}
//             <div className="flex flex-col items-center space-y-6">
//               <div className="w-full h-full overflow-hidden rounded-lg">
//                 <ChatContainer
//                   currentUser={currentUser}
//                   initialConversation_id={
//                     hasPreviousConversation.exists
//                       ? hasPreviousConversation.conversation_id
//                       : null
//                   }
//                   receiver_id={product?.seller.userId}
//                   isModal={true}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         ""
//       )}
//       {/* left side */}
//       <div className="flex flex-col gap-3 max-w-2xl">
//         <h1 className="text-xl font-semibold">{product?.productDescription}</h1>
//         <div className="flex items-center gap-4">
//           <h6>No reviews yet</h6>
//           <h5>
//             <span className="text-lg font-semibold">#13</span> Most popular in
//             Men's Regular Sleeve Hoodies & Sweatshirts
//           </h5>
//         </div>
//         {/* supplier details */}
//         <div className="bg-white flex gap-4">
//           {/* <img src="" alt="supplier image" /> */}
//           <h3>{product?.seller.user.name}</h3>
//         </div>
//         <ProductImageViewer images={product?.images} />
//         <div className="border-t border-[#DDDDDD]" />
//         <KeyAttributes />
//         <SupplierCard />
//         {/* Seperator */}
//         <div className="border-t border-[#DDDDDD]" />
//         <RelatedSearches />
//       </div>
//       <ProductVariations setChatOpen={() => setChatOpen(!chatOpen)} />
//     </div>
//   );
// };

// export default ProductDetails;


export function ProductDetails() {
  return <div>ProductDetails</div>;
}
