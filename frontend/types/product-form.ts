export interface ProductFormData {
  id?: string
  name: string
  description: string
  price: number
  wholesalePrice: number
  minOrderQuantity: number
  availableQuantity: number
  categoryIds: string[]
  attributes: Record<string, string>
  images: string[]
  thumbnail: string[]
  documents: string[]
  isDraft: boolean
  discount?: number
  deliveryCost?: number
}

export interface FormErrors {
  name?: string
  price?: string
  discount?: string
  deliveryCost?: string
  minOrderQuantity?: string
  availableQuantity?: string
  categoryIds?: string
}

export interface ProductFormProps {
  initialData?: ProductFormData
  mode: "create" | "edit" | "view"
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export interface Attribute {
  key: string
  value: string
}

export interface Category {
  id: string
  name: string
}
