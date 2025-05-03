"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CategoryEnum, BusinessType } from "@/types/api"
import InfoButton from "@/components/ui/IButton"
import { Textarea } from "@/components/ui/textarea"

const businessTypes = Object.values(BusinessType).map((type) => ({
  value: type,
  label: type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "),
}))

const businessCategories = Object.values(CategoryEnum).map((category) => ({
  value: category,
  label: category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "),
}))

type BusinessInfoFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const BusinessInfoForm = ({ formState, onChange, onSave, hasChanges, isSaving }: BusinessInfoFormProps) => {
  const [errors, setErrors] = useState({
    businessName: "",
    businessDescription: "",
    websiteLink: "",
    businessAddress: "",
    businessTypes: "",
    businessCategories: "",
  })

  const handleBusinessTypeClick = (type: BusinessType) => {
    onChange({
      ...formState,
      businessTypes: formState.businessTypes?.includes(type)
        ? formState.businessTypes.filter((t: BusinessType) => t !== type)
        : [...(formState.businessTypes || []), type],
    })
  }

  const handleBusinessCategoryClick = (category: CategoryEnum) => {
    onChange({
      ...formState,
      businessCategories: formState.businessCategories?.includes(category)
        ? formState.businessCategories.filter((c: CategoryEnum) => c !== category)
        : [...(formState.businessCategories || []), category],
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Name{" "}
              <InfoButton
                text={
                  "Enter the official name of your business as it appears on legal documents and branding materials. This name will be visible to customers"
                }
              />
            </label>
            <Input
              placeholder="Enter your Business Name"
              value={formState.businessName || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  businessName: e.target.value,
                })
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Description{" "}
              <InfoButton
                text={
                  "Enter your business description to help customers understand what you offer. This description will be visible to customers."
                }
              />
            </label>
            <Textarea
              placeholder="Enter your Business description"
              value={formState.businessDescription || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  businessDescription: e.target.value,
                })
              }}
              className="min-h-[100px] bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Website Link
              <InfoButton
                text={
                  "Enter the complete URL of your business website (e.g., https://yourbusiness.com). Ensure the link is valid and accessible to customers."
                }
              />
            </label>
            <Input
              placeholder="Enter your Website Link"
              value={formState.websiteLink || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  websiteLink: e.target.value,
                })
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Type{" "}
              <InfoButton
                text={
                  "Match with the right buyers by selecting one or more categories that best describe your business."
                }
              />
            </label>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {businessTypes.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={formState.businessTypes?.includes(value) ? "default" : "outline"}
                  onClick={() => handleBusinessTypeClick(value)}
                  className={`rounded-md h-8 sm:h-9 px-1 sm:px-2 text-[10px] sm:text-xs bg-[#fcfcfc] border-[#e5e5e5] placeholder:text-black/50 ${
                    formState.businessTypes?.includes(value)
                      ? "border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
                      : "border-[#e5e5e5]"
                  }`}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Address{" "}
              <InfoButton
                text={
                  "Provide the full physical address of your business location, including street, city, state, and ZIP code. This helps customers find your business."
                }
              />
            </label>
            <Input
              placeholder="Enter your Business Address"
              value={formState.businessAddress || ""}
              onChange={(e) => {
                onChange({
                  ...formState,
                  businessAddress: e.target.value,
                })
              }}
              className="h-11 bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Category<span className="text-red-500 ml-0.5">*</span>
            </label>
            <p className="text-sm text-muted-foreground">
              Choose one or more categories your business primarily operates in.
            </p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {businessCategories.map(({ value, label }) => (
                <Button
                  key={value}
                  variant={formState.businessCategories?.includes(value) ? "default" : "outline"}
                  onClick={() => handleBusinessCategoryClick(value)}
                  className={`rounded-md h-8 sm:h-9 px-1 sm:px-2 text-[10px] sm:text-xs bg-[#fcfcfc] border-[#e5e5e5] rounded-[6px] placeholder:text-black/50 ${
                    formState.businessCategories?.includes(value)
                      ? "border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
                      : "border-[#e5e5e5]"
                  }`}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

    
    </div>
  )
}

export default BusinessInfoForm
