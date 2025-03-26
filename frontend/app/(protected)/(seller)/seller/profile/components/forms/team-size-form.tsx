"use client"

import { cn } from "@/lib/utils"

type TeamSizeFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const TeamSizeForm = ({ formState, onChange, onSave, hasChanges, isSaving }: TeamSizeFormProps) => {
  const teamSizes = ["Just me", "2 - 5", "6 - 10", "11 - 50", "51 - 200", "200 - 500", "500 - 2000", "2000 +"]

  const handleSizeSelect = (size: string) => {
    onChange({ ...formState, size })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {teamSizes.map((size) => (
        <button
          key={size}
          onClick={() => handleSizeSelect(size)}
          className={cn(
            "text-sm border px-3 py-1.5 rounded-md",
            formState.size === size ? "bg-gray-700 text-white border-gray-700" : "bg-white border-gray-200",
          )}
        >
          {size}
        </button>
      ))}
    </div>
  )
}

export default TeamSizeForm

