"use client"

import type { ProductFormData, FormErrors } from "../../types/product-form"
import { FormField } from "../ui/form-field"

interface PriceDetailsSectionProps {
  formData: ProductFormData
  errors: FormErrors
  onFieldChange: (field: keyof ProductFormData, value: any) => void
}

export function PriceDetailsSection({ formData, errors, onFieldChange }: PriceDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <FormField label="Name" required error={errors.name}>
        <input
          type="text"
          placeholder="Enter product name"
          className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${errors.name ? "border-red-500" : ""}`}
          value={formData.name || ""}
          onChange={(e) => onFieldChange("name", e.target.value)}
        />
      </FormField>

      <FormField label="Add product price" required error={errors.price}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="text"
            inputMode="decimal"
            pattern="^\d*(\.\d{0,2})?$"
            placeholder="122.00"
            className={`w-full p-2 pl-8 border rounded-md bg-[#fcfcfc] ${errors.price ? "border-red-500" : ""}`}
            value={formData.price || ""}
            onChange={(e) => onFieldChange("price", e.target.value)}
          />
        </div>
      </FormField>

      <FormField label="Discount" error={errors.discount}>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Enter discount"
            pattern="^\d*(\.\d{0,2})?$"
            className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${errors.discount ? "border-red-500" : ""}`}
            value={formData.discount || ""}
            onChange={(e) => onFieldChange("discount", e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
      </FormField>

      <FormField label="Delivery cost" required error={errors.deliveryCost}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="text"
            inputMode="decimal"
            pattern="^\d*(\.\d{0,2})?$"
            placeholder="Enter delivery cost"
            className={`w-full p-2 pl-8 border rounded-md bg-[#fcfcfc] ${errors.deliveryCost ? "border-red-500" : ""}`}
            value={formData.deliveryCost || ""}
            onChange={(e) => onFieldChange("deliveryCost", e.target.value)}
          />
        </div>
      </FormField>

      <FormField label="Minimum order" required error={errors.minOrderQuantity}>
        <input
          type="number"
          placeholder="Enter minimum order quantity"
          className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${errors.minOrderQuantity ? "border-red-500" : ""}`}
          value={formData.minOrderQuantity || ""}
          onChange={(e) => onFieldChange("minOrderQuantity", e.target.value)}
        />
      </FormField>

      <FormField label="Available quantity" required error={errors.availableQuantity}>
        <input
          type="number"
          placeholder="Enter available quantity"
          className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${errors.availableQuantity ? "border-red-500" : ""}`}
          value={formData.availableQuantity || ""}
          onChange={(e) => onFieldChange("availableQuantity", e.target.value)}
        />
      </FormField>
    </div>
  )
}
