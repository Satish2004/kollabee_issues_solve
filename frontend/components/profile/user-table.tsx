// "use client"

// import * as React from "react"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Button } from "@/components/ui/button"
// import { MoreHorizontal, Pencil, Trash, Mail, Phone } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Role } from "@prisma/client"

// interface UserTableProps {
//   users: any[]
// }

// export function UserTable({ users }: UserTableProps) {
//   return (
//     <div className="w-full overflow-auto">
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>User</TableHead>
//             <TableHead>Contact</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Location</TableHead>
//             <TableHead className="text-right">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {users.map((user) => (
//             <TableRow key={user.id}>
//               <TableCell className="font-medium">
//                 <div className="flex items-center space-x-3">
//                   <Avatar className="h-10 w-10">
//                     <AvatarImage src={user.imageUrl} />
//                     <AvatarFallback>
//                       {user.name.slice(0, 1).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{user.name}</p>
//                     <p className="text-sm text-muted-foreground">
//                       {user.displayName || user.fullName}
//                     </p>
//                   </div>
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <div className="flex flex-col space-y-1">
//                   <div className="flex items-center">
//                     <Mail className="h-4 w-4 mr-2" />
//                     <span className="text-sm">{user.email}</span>
//                   </div>
//                   {user.phoneNumber && (
//                     <div className="flex items-center">
//                       <Phone className="h-4 w-4 mr-2" />
//                       <span className="text-sm">{user.phoneNumber}</span>
//                     </div>
//                   )}
//                 </div>
//               </TableCell>
//               <TableCell>
//                 <Badge variant={user.role === Role.ADMIN ? "destructive" : user.role === Role.SELLER ? "default" : "secondary"}>
//                   {user.role}
//                 </Badge>
//               </TableCell>
//               <TableCell>
//                 <div className="flex flex-col">
//                   {user.country && <span className="text-sm">{user.country}</span>}
//                   {user.state && <span className="text-sm text-muted-foreground">{user.state}</span>}
//                 </div>
//               </TableCell>
//               <TableCell className="text-right">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" className="h-8 w-8 p-0">
//                       <span className="sr-only">Open menu</span>
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                     <DropdownMenuItem>
//                       <Pencil className="mr-2 h-4 w-4" /> Edit User
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="text-destructive">
//                       <Trash className="mr-2 h-4 w-4" /> Delete User
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   )
// }


export function UserTable() {
  return <div>UserTable</div>;
}