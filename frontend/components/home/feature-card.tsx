import type React from "react"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-2 bg-[#fdfdfd] border border-[#e0e0e0] rounded-lg p-3">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-lg bg-[#ea3d4f] flex items-center justify-center text-white">{icon}</div>
        <h3 className="font-semibold text-normal">{title}</h3>
      </div>
      <p className="text-gray-600 text-xs">{description}</p>
    </div>
  )
}

