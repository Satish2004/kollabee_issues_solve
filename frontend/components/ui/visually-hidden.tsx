import type React from "react"
import { cn } from "@/lib/utils"

interface VisuallyHiddenProps {
  children: React.ReactNode
  className?: string
}

export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return (
    <span
      className={cn("absolute h-px w-px p-0 overflow-hidden whitespace-nowrap border-0", className)}
      style={{
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        margin: "-1px",
      }}
    >
      {children}
    </span>
  )
}
