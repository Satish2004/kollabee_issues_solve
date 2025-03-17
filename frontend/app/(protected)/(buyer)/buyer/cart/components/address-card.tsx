"use client"
import React from "react"
import { Radio } from "@/components/ui/form"
import { Address } from "../../../../../../checkout-context"

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
        <Radio
          id={`address-${address.id}`}
          name="selectedAddress"
          checked={isSelected}
          onChange={() => onSelect(address.id)}
          className="mt-1"
        />
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

