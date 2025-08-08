// components/admin/UserAvatar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
    name?: string | null
    imageUrl?: string | null
    size?: "sm" | "md" | "lg" | "xl"
}

export function UserAvatar({ name, imageUrl, size = "md" }: UserAvatarProps) {
    const sizeClasses = {
        sm: "h-12 w-12",
        md: "h-16 w-16",
        lg: "h-24 w-24",
        xl: "h-32 w-32"
    }

    const textSize = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-xl",
        xl: "text-2xl"
    }

    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "US"

    return (
        <Avatar className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-indigo-600`}>
            <AvatarImage src={imageUrl || undefined} alt={name || "User"} />
            <AvatarFallback className={`${textSize[size]} font-medium text-white`}>
                {initials}
            </AvatarFallback>
        </Avatar>
    )
}