import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type TargetAudienceFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const TargetAudienceForm = ({ formState, onChange, onSave, hasChanges, isSaving }: TargetAudienceFormProps) => {
  const audiences = [
    { id: "RETAILERS", label: "Retailers" },
    { id: "WHOLESALERS", label: "Wholesalers" },
    { id: "DISTRIBUTORS", label: "Distributors" },
    { id: "DIRECT-CONSUMERS", label: "Direct to Consumers" },
    { id: "MANUFACTURERS", label: "Other Manufacturers" },
    { id: "STARTUPS", label: "Startups and Small Businesses" },
  ]

  const handleAudienceToggle = (audienceId: string) => {
    const newAudiences = formState.audiences.includes(audienceId)
      ? formState.audiences.filter((id: string) => id !== audienceId)
      : [...formState.audiences, audienceId]

    onChange({ ...formState, audiences: newAudiences })
  }


  return (
    <div className="mt-4 space-y-2">
      {audiences.map((audience) => (
        <div key={audience.id} className="flex items-center">
          <Checkbox
            id={audience.id}
            checked={formState.audiences.includes(audience.id)}
            onCheckedChange={() => handleAudienceToggle(audience.id)}
            className="mr-2"
          />
          <Label htmlFor={audience.id} className="text-sm">
            {audience.label}
          </Label>
        </div>
      ))}
    </div>
  )
}

export default TargetAudienceForm

