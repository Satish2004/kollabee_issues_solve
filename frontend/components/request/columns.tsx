"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { RequestStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

export type Request = {
  id: string
  buyerName: string
  companyName: string
  country: string
  productName: string
  quantity: string
  packagingType: string
  volumePerUnit: string
  deliveryDeadline: string
  status: RequestStatus
  createdAt: string
}

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "buyerName",
    header: "Buyer",
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "productName",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "packagingType",
    header: "Packaging",
  },
  {
    accessorKey: "volumePerUnit",
    header: "Volume/Unit",
  },
  {
    accessorKey: "deliveryDeadline",
    header: "Deadline",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as RequestStatus
      return (
        <Badge variant={
          status === "PENDING" ? "warning" :
          status === "APPROVED" ? "success" :
          status === "REJECTED" ? "destructive" :
          status === "IN_PROGRESS" ? "default" :
          "secondary"
        }>
          {status.toLowerCase().replace('_', ' ')}
        </Badge>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="secondary"
          onClick={() => console.log(row.original.id)}
        >
          View
        </Button>
      )
    },
  },
] 