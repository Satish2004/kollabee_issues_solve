"use client"

import { Input } from "@/components/ui/input"

type MinimumOrderFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const MinimumOrderForm = ({ formState, onChange, onSave, hasChanges, isSaving }: MinimumOrderFormProps) => {
  const handleQuantityChange = (value: string) => {
    onChange({ ...formState, minimumOrderQuantity: value })
  }

  return (
    <div className="mb-4">
      <div className="flex items-center font-semibold">
        <h3 className="text-sm">Enter Quantity</h3>
        <span className="text-red-500 ml-0.5">*</span>
      </div>
      <Input
        type="text"
        placeholder="Type Here"
        value={formState.minimumOrderQuantity}
        onChange={(e) => handleQuantityChange(e.target.value)}
        className="border border-gray-200 p-2 w-full rounded text-sm"
      />
    </div>
  )
}

export default MinimumOrderForm

