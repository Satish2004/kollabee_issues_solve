import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type BusinessCapabilitiesFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const BusinessCapabilitiesForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
}: BusinessCapabilitiesFormProps) => {
  const capabilities = [
    { id: "eco-friendly", label: "Eco-Friendly Practices" },
    { id: "vegan", label: "Vegan Products" },
    { id: "organic", label: "Organic Ingredients" },
    { id: "small-batch", label: "Small Batch Production" },
    { id: "fair-trade", label: "Fair Trade Certified" },
    { id: "custom-design", label: "Custom Design Services" },
  ]

  const handleCapabilityToggle = (capabilityId: string) => {
    const newCapabilities = formState.capabilities.includes(capabilityId)
      ? formState.capabilities.filter((id: string) => id !== capabilityId)
      : [...formState.capabilities, capabilityId]

    onChange({ ...formState, capabilities: newCapabilities })
  }

  return (
    <div className="mt-4 space-y-2">
      {capabilities.map((capability) => (
        <div key={capability.id} className="flex items-center">
          <Checkbox
            id={capability.id}
            checked={formState.capabilities.includes(capability.id)}
            onCheckedChange={() => handleCapabilityToggle(capability.id)}
            className="mr-2"
          />
          <Label htmlFor={capability.id} className="text-sm">
            {capability.label}
          </Label>
        </div>
      ))}
    </div>
  )
}

export default BusinessCapabilitiesForm

