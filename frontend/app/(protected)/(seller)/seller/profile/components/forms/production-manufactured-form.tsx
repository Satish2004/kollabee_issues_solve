"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type ProductionManufacturedFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const ProductionManufacturedForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
}: ProductionManufacturedFormProps) => {
  const locations = [
    { id: "india", label: "India (City/State Optional)" },
    { id: "usa", label: "USA (City/State Optional)" },
    { id: "china", label: "China (City/State Optional)" },
    { id: "europe", label: "Europe (Country Optional)" },
  ]

  const handleLocationToggle = (locationId: string) => {
    const newLocations = formState.locations.includes(locationId)
      ? formState.locations.filter((id: string) => id !== locationId)
      : [...formState.locations, locationId]

    onChange({ ...formState, locations: newLocations })
  }

  const handleCustomLocationChange = (value: string) => {
    onChange({ ...formState, customLocation: value })
  }

  return (
    <div className="mt-4">
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Location</p>
        <Input
          type="text"
          placeholder="Text here..."
          value={formState.customLocation}
          onChange={(e) => handleCustomLocationChange(e.target.value)}
          className="border p-2 w-full rounded text-sm"
        />
      </div>
      <div className="space-y-2">
        {locations.map((location) => (
          <div key={location.id} className="flex items-center">
            <Checkbox
              id={location.id}
              checked={formState.locations.includes(location.id)}
              onCheckedChange={() => handleLocationToggle(location.id)}
              className="mr-2"
            />
            <Label htmlFor={location.id} className="text-sm">
              {location.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductionManufacturedForm

