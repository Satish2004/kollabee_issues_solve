"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type ProductionManagedFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const ProductionManagedForm = ({ formState, onChange, onSave, hasChanges, isSaving }: ProductionManagedFormProps) => {
  const handleChange = (value: string) => {
    onChange({ ...formState, managementType: value })
  }

  return (
    <div className="mt-4 space-y-3">
      <RadioGroup value={formState.managementType} onValueChange={handleChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="INHOUSE" id="in-house" />
          <Label htmlFor="in-house">In-House Production</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="OUSOURCED" id="outsourced" />
          <Label htmlFor="outsourced">Outsourced Production</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="HYBRID" id="hybrid" />
          <Label htmlFor="hybrid">Hybrid Model (Both In-House and Outsourced)</Label>
        </div>
      </RadioGroup>
    </div>
  )
}

export default ProductionManagedForm

