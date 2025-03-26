import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type ProductionServicesFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const ProductionServicesForm = ({ formState, onChange, onSave, hasChanges, isSaving }: ProductionServicesFormProps) => {
  const services = [
    {
      id: "bulk-manufacturing",
      label: "Bulk Manufacturing",
      description: "High-volume production designed to meet wholesale and distribution needs.",
    },
    {
      id: "custom-manufacturing",
      label: "Custom Manufacturing",
      description: "Tailored production services for unique client specifications and requirements.",
    },
    {
      id: "small-batch-production",
      label: "Small Batch Production",
      description: "Limited quantity production runs ideal for testing markets or exclusive releases.",
    },
    {
      id: "product-development",
      label: "Product Development",
      description: "End-to-end creation services from concept to prototype to final product.",
    },
  ]

  const handleServiceToggle = (serviceId: string) => {
    const newServices = formState.services.includes(serviceId)
      ? formState.services.filter((id: string) => id !== serviceId)
      : [...formState.services, serviceId]

    onChange({ ...formState, services: newServices })
  }

  return (
    <div className="mt-4 bg-gray-50 p-6 rounded-md space-y-6">
      {services.map((service) => (
        <div key={service.id} className="flex items-start gap-3">
          <Checkbox
            id={service.id}
            checked={formState.services.includes(service.id)}
            onCheckedChange={() => handleServiceToggle(service.id)}
            className="mt-1"
          />
          <div>
            <Label htmlFor={service.id} className="text-gray-700 font-medium mb-1">
              {service.label}
            </Label>
            <p className="text-gray-500 text-sm">{service.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductionServicesForm

