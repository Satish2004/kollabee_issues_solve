// components/admin/DetailCard.tsx
import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DetailCardProps {
    title: string
    children: ReactNode
    className?: string
}

export function DetailCard({ title, children, className = "" }: DetailCardProps) {
    return (
        <Card className={`shadow-sm ${className}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}