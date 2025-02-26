
// // import { ItemWithSeller } from "@/lib/types";
// // import { ItemCard } from "@/components/item-card";
// // import { getCurrentUser } from "../home/actions";
// import { redirect } from "next/navigation";
// import { createClient } from "@/utils/supabase/server";
// import { prisma } from "@/lib/db";

// export default async function ProfilePage() {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   const userData= await prisma.user.findUnique({
//     where:{
//       id: user?.id
//     }
//   })

//   if (!userData) {
//     redirect('/login')
//   }

//   if(userData.role==='BUYER'){
//     redirect('/profile/buyer')
//   } else if(userData.role==='SELLER') {
//     redirect('/profile/seller')
//   } else if(userData.role==='ADMIN') {
//     redirect('/profile/admin')
//   }


//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       {/* <Card>
//         <CardHeader className="flex flex-row items-center gap-4">
//           <Avatar className="h-16 w-16">
//             <AvatarImage src={userInfo?.name.slice(0, 1)} />
//             <AvatarFallback>{userInfo?.name.slice(0, 1).toUpperCase()}</AvatarFallback>
//           </Avatar>
//           <div>
//             <h1 className="text-2xl font-bold">{userInfo?.name}</h1>
//             <p className="text-muted-foreground">{userInfo?.email}</p>
//             <Badge variant="outline" className="mt-2">
//               {userInfo?.role}
//             </Badge>
//           </div>
//         </CardHeader>
//       </Card>

//       <h2 className="text-2xl font-semibold">Your Items</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//         {items?.map((item: ItemWithSeller) => (
//           <ItemCard
//             key={item.id}
//             item={item}
//             currentUser={currentUser!}
//           />
//         ))}
//         {items?.length === 0 && (
//           <div className="col-span-full text-center py-12">
//             <h2 className="text-2xl font-semibold mb-2">No items listed yet</h2>
//             <p className="text-muted-foreground">
//               {userInfo?.role === 'SELLER'
//                 ? 'Start selling by listing your first item!'
//                 : 'Check back later for items to buy.'}
//             </p>
//           </div>
//         )}
//       </div> */
//     }



      
//     </div>
//   );
// }


import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page