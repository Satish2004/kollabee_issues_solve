// import { Card, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { createClient } from "@/utils/supabase/server";
// import { prisma } from "@/lib/db";
// import { ProductTable } from "@/components/profile/product-table";
// import { redirect } from "next/navigation";
// import SellerProfileEditor from "@/components/profile/edit-profile-seller";

// export const dynamic = "force-dynamic";

// const page = async () => {
//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect("/home");
//   }

//   const authUser = await prisma.user.findUnique({
//     where: { id: user.id },
//     include: { seller: true },
//   });

//   if (!authUser?.seller) {
//     redirect("/home");
//   }

//   const products = await prisma.product.findMany({
//     where: { sellerId: authUser.seller.id },
//     include: {
//       seller: { include: { user: true } },
//       category: true,
//     },
//   });

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <Card>
//         <CardHeader className="flex flex-row items-center gap-4">
//           <Avatar className="h-16 w-16">
//             <AvatarImage src={authUser?.imageUrl || authUser.name.slice(0, 1)} />
//             <AvatarFallback>
//               {authUser.name.slice(0, 1).toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <h1 className="text-2xl font-bold">{authUser.name}</h1>
//             <p className="text-muted-foreground">{authUser.email}</p>
//             <Badge variant="outline" className="mt-2">
//               SELLER
//             </Badge>
//           </div>
//         </CardHeader>
//         <SellerProfileEditor
//           user={authUser}
//         />
//       </Card>

//       <h1 className="text-3xl font-bold">Your Seller Profile</h1>
//       <div className="flex justify-between items-center my-10">
//         <h2 className="text-xl font-medium">Your Listings</h2>
//         <Button>
//           <Link href="/profile/seller/product/create">Create</Link>
//         </Button>
//       </div>

//       <ProductTable products={products} currentUser={authUser} />
//     </div>
//   );
// };

// export default page;



import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page