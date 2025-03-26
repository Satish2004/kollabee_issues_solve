"use client"

import { cn } from "@/lib/utils"

type AnnualRevenueFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const AnnualRevenueForm = ({ formState, onChange, onSave, hasChanges, isSaving }: AnnualRevenueFormProps) => {
  const revenueRanges = [
    "No Revenue",
    "< $100000",
    "$100000 - $200000",
    "$200000 - $500000",
    "$500000 - $1000000",
    "$1000000 - $5000000",
    "$5000000 +",
  ]

  const handleRevenueSelect = (revenue: string) => {
    onChange({ ...formState, revenue })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {revenueRanges.map((range) => (
        <button
          key={range}
          onClick={() => handleRevenueSelect(range)}
          className={cn(
            "text-sm border px-3 py-1.5 rounded-md",
            formState.revenue === range ? "bg-gray-700 text-white border-gray-700" : "bg-white border-gray-200",
          )}
        >
          {range}
        </button>
      ))}
    </div>
  )
}

export default AnnualRevenueForm

