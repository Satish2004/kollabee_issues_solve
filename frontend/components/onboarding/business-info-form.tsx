"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { sellerApi } from "@/lib/api/seller"

const businessTypes = [
  "Manufacturer",
  "Distributor",
  "Service Provider",
  "Packaging Supplier",
  "Co-Packer",
  "Other",
]

const businessCategories = [
  "Fashion, Apparel & Accessories",
  "Beauty & Cosmetics",
  "Home & Cleaning Essentials",
  "Herbal & Natural Products (Ayurveda)",
  "Food & Beverages",
  "Health & Wellness",
  "Other",
]

interface BusinessInfoFormProps {
  formData: {
    businessName: string;
    websiteLink: string;
    businessAddress: string;
    businessTypes: string[];
    businessCategories: string[];
  };
  setFormData: (data: (prev: BusinessInfoFormProps['formData']) => BusinessInfoFormProps['formData']) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function BusinessInfoForm({
  formData,
  setFormData,
  onNext,
  onPrevious,
}: BusinessInfoFormProps) {
  const router = useRouter()

  const [errors, setErrors] = useState<{
    businessName?: string;
    websiteLink?: string;
    businessAddress?: string;
    businessTypes?: string;
    businessCategories?: string;
  }>({});

  const handleSubmit = async () => {
    if(!validateForm()){
      return
    }
    try {
      await sellerApi.updateBusinessInfo({
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        websiteLink: formData.websiteLink,
        businessTypes: formData.businessTypes,
        businessCategories: formData.businessCategories
      })
      toast.success("Business information updated successfully")
      onNext()
    } catch (error: any) {
      console.error("Error:", error)
      toast.error(error.response?.data?.message || "Failed to update business info")
    }
  }

  const handleBusinessTypeClick = (type: string) => {
    setFormData((prev: BusinessInfoFormProps['formData']) => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type) ? prev.businessTypes.filter(t => t !== type) : [...prev.businessTypes, type]
    }));
  }

  const handleBusinessCategoryClick = (category: string) => {
    setFormData(prev => ({
      ...prev,
      businessCategories: prev.businessCategories.includes(category) ? prev.businessCategories.filter(c => c !== category) : [...prev.businessCategories, category]
    }))
  }

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.businessName?.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.businessAddress?.trim()) {
      newErrors.businessAddress = 'Business address is required';
    }

    if (formData.businessTypes.length === 0) {
      newErrors.businessTypes = 'Please select at least one business type';
    }

    if (formData.businessCategories.length === 0) {
      newErrors.businessCategories = 'Please select at least one category';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields');
    }

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-8">
      <div className="text-start space-y-2">
        <h2 className="text-2xl font-bold">Business Information</h2>
        <p className="text-muted-foreground">
          Tell us about your business to unlock opportunities with the right buyers.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Name
              <Info className="w-4 h-4 text-muted-foreground" />
            </label>
            <Input
              placeholder="Enter your Business Name"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Website Link
              <Info className="w-4 h-4 text-muted-foreground" />
            </label>
            <Input
              placeholder="Enter your Website Link"
              value={formData.websiteLink}
              onChange={(e) => setFormData(prev => ({ ...prev, websiteLink: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Business Type</label>
            <p className="text-sm text-muted-foreground">
              Match with the right buyers by selecting one or more categories that best describe your business.
            </p>
            <div className="flex flex-wrap gap-2">
              {businessTypes.map((type) => (
                <Button
                  key={type}
                  variant={formData.businessTypes.includes(type) ? "default" : "outline"}
                  onClick={() => handleBusinessTypeClick(type)}
                  className="rounded-md h-9 px-4 text-sm"
                  size="sm"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Business Address
              <Info className="w-4 h-4 text-muted-foreground" />
            </label>
            <Input
              placeholder="Enter your Business Address"
              value={formData.businessAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
              className="h-11"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Business Category</label>
            <p className="text-sm text-muted-foreground">
              Choose one or more categories your business primarily operates in.
            </p>
            <div className="flex flex-wrap gap-2">
              {businessCategories.map((category) => (
                <Button
                  key={category}
                  variant={formData.businessCategories.includes(category) ? "default" : "outline"}
                  onClick={() => handleBusinessCategoryClick(category)}
                  className="rounded-md h-9 px-4 text-sm"
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button onClick={onPrevious} variant="ghost" size="sm" className="text-primary -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          className="bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white px-8"
          disabled={!validateForm()}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
