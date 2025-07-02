import type { ProductFormData, FormErrors } from "../types/product-form"

export function isValidDecimal(value: string): boolean {
  return /^\d*(\.\d{0,2})?$/.test(value)
}

export function validateProductForm(data: ProductFormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.name?.trim()) {
    errors.name = "Product name is required"
  }

  if (!data.price) {
    errors.price = "Price is required"
  } else if (typeof data.price === "string" && !isValidDecimal(data.price)) {
    errors.price = "Enter a valid number (e.g. 12 or 12.50)"
  }

  if (data.discount && (isNaN(Number(data.discount)) || Number(data.discount) < 0 || Number(data.discount) > 100)) {
    errors.discount = "Discount must be between 0 and 100"
  }

  if (!data.deliveryCost) {
    errors.deliveryCost = "Delivery cost is required"
  } else if (typeof data.deliveryCost === "string" && !isValidDecimal(data.deliveryCost)) {
    errors.deliveryCost = "Enter a valid number (e.g. 12 or 12.50)"
  }

  if (!data.minOrderQuantity) {
    errors.minOrderQuantity = "Minimum order quantity is required"
  }

  if (!data.availableQuantity) {
    errors.availableQuantity = "Available quantity is required"
  }

  if (!data.categoryIds || data.categoryIds.length === 0) {
    errors.categoryIds = "At least one category is required"
  }

  return errors
}
