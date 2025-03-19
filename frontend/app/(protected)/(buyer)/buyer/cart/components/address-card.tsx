"use client"
import React from "react"
import { Radio } from "@/components/ui/form"
import { Address } from "../../../../../../checkout-context"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AddressCardProps {
  address: Address
  isSelected: boolean
  onSelect: (id: string) => void
}

export function AddressCard({ address, isSelected, onSelect }: AddressCardProps) {
  return (
    <div
      className={`p-4 border rounded-md cursor-pointer ${isSelected ? "border-green-500 bg-green-50" : "border-gray-200"}`}
      onClick={() => onSelect(address.id)}
    >
      <div className="flex items-start">
        <RadioGroup defaultValue={isSelected ? address.id : undefined} className="mt-1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={address.id}
              id={`address-${address.id}`}
              checked={isSelected}
              onClick={() => onSelect(address.id)}
            />
          </div>
        </RadioGroup>
        <div className="ml-3">
          <p className="font-medium">
            {address.firstName} {address.lastName}
          </p>
          <p className="text-sm text-gray-600">{address.address}</p>
          <p className="text-sm text-gray-600">
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p className="text-sm text-gray-600">{address.phone}</p>
          <p className="text-sm text-gray-600">{address.email}</p>
          {address.isDefault && (
            <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Default</span>
          )}
        </div>
      </div>
    </div>
  )
}



