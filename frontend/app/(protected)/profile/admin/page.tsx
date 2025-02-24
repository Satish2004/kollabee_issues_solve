// import { Card, CardHeader } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { createClient } from "@/utils/supabase/server";
// import { prisma } from "@/lib/db";
// import { redirect } from "next/navigation";
// import { Role } from "@prisma/client";
// import { UserTable } from "@/components/profile/user-table";

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
//     where: { id: user.id, role: Role.ADMIN },
//   });

//   if (!authUser) {
//     redirect("/home");
//   }

//   const users = await prisma.user.findMany();

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <Card>
//         <CardHeader className="flex flex-row items-center gap-4">
//           <Avatar className="h-16 w-16">
//             <AvatarImage src={authUser.name.slice(0, 1)} />
//             <AvatarFallback>
//               {authUser.name.slice(0, 1).toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <h1 className="text-2xl font-bold">{authUser.name}</h1>
//             <p className="text-muted-foreground">{authUser.email}</p>
//             <Badge variant="outline" className="mt-2">
//               ADMIN
//             </Badge>
//           </div>
//         </CardHeader>
//         {/* <ProfileEditor
//           userProfile={{ name: authUser.name, email: authUser.email }}
//         /> */}
//       </Card>

//       <h1 className="text-3xl font-bold">Your Admin Profile</h1>
//       <div className="flex justify-between items-center my-10">
//         <h2 className="text-xl font-medium">List of Users</h2>

//       </div>
//       <div className="bg-card rounded-lg border shadow-sm">
//         <UserTable users={users} />
//       </div>
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
