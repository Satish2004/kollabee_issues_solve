"use client"

import { useState, useCallback } from "react"
import type { ProductFormData, FormErrors } from "../types/product-form"
import { validateProductForm } from "../utils/validation"

const DEFAULT_FORM_DATA: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  wholesalePrice: 0,
  minOrderQuantity: 1,
  availableQuantity: 0,
  categoryIds: [],
  attributes: {},
  images: [],
  isDraft: true,
  thumbnail: [],
  documents: [],
}

export function useProductForm(initialData?: ProductFormData) {
  const [formData, setFormData] = useState<ProductFormData>(initialData || DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const updateField = useCallback(
    (field: keyof ProductFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear error if field becomes valid
      if (formSubmitted && errors[field as keyof FormErrors]) {
        const newErrors = validateProductForm({ ...formData, [field]: value })
        if (!newErrors[field as keyof FormErrors]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
      }
    },
    [formData, errors, formSubmitted],
  )

  const validateForm = useCallback(() => {
    const newErrors = validateProductForm(formData)
    setErrors(newErrors)
    setFormSubmitted(true)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setFormSubmitted(false)
  }, [])

  return {
    formData,
    errors,
    formSubmitted,
    updateField,
    validateForm,
    resetForm,
    setFormData,
  }
}
