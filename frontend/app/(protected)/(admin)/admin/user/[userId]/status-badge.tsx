// components/admin/StatusBadge.tsx
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
    status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const statusColors: Record<string, string> = {
        Active: "bg-green-100 text-green-800",
        Approved: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Rejected: "bg-red-100 text-red-800",
        default: "bg-gray-100 text-gray-800"
    }

    const colorClass = statusColors[status] || statusColors.default

    return <Badge className={`${colorClass} capitalize`}>{status}</Badge>
}