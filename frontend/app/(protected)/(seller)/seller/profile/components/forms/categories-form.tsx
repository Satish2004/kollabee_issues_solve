"use client"

import { cn } from "@/lib/utils"

type CategoriesFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

const CategoriesForm = ({ formState, onChange, onSave, hasChanges, isSaving }: CategoriesFormProps) => {
  const handleCategoryChange = (category: string, subcategory: string, item: string, isSelected: boolean) => {
    const newState = { ...formState }

    if (category === "apparel") {
      if (isSelected) {
        newState.apparel[subcategory] = [...newState.apparel[subcategory], item]
      } else {
        newState.apparel[subcategory] = newState.apparel[subcategory].filter((i: string) => i !== item)
      }
    } else if (category === "motherBaby") {
      if (isSelected) {
        newState.motherBaby = [...newState.motherBaby, item]
      } else {
        newState.motherBaby = newState.motherBaby.filter((i: string) => i !== item)
      }
    }

    onChange(newState)
  }

  const handleOtherChange = (value: string) => {
    onChange({
      ...formState,
      food: {
        ...formState.food,
        other: value,
      },
    })
  }

  return (
    <div className="mt-4 bg-gray-50 p-6 rounded-md">
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-1">Business Type</h4>
        <p className="text-xs text-gray-500">Subcategories by category</p>
      </div>

      {/* Apparel & Accessories */}
      <div className="mb-8">
        <h4 className="text-base font-semibold mb-4">Apparel & Accessories</h4>

        <div className="mb-4">
          <p className="text-sm mb-2">Clothing</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Ready-to-Wear Apparel",
              "Custom Tailored Clothing",
              "Activewear",
              "Outerwear (Jackets, Coats, etc.)",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  handleCategoryChange("apparel", "clothing", item, !formState.apparel.clothing.includes(item))
                }
                className={cn(
                  "text-sm border px-3 py-1.5 rounded-md",
                  formState.apparel.clothing.includes(item)
                    ? "bg-gray-700 text-white border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm mb-2">Footwear</p>
          <div className="flex flex-wrap gap-2">
            {["Whole Sale", "White Label", "Private Label", "Custom Product Development"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  handleCategoryChange("apparel", "footwear", item, !formState.apparel.footwear.includes(item))
                }
                className={cn(
                  "text-sm border px-3 py-1.5 rounded-md",
                  formState.apparel.footwear.includes(item)
                    ? "bg-gray-700 text-white border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm mb-2">Jewelry</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Agriculture Inputs",
              "Baby & Children",
              "Beauty & Personal Care",
              "Business Services",
              "Chemicals",
              "Design Services",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  handleCategoryChange("apparel", "jewelry", item, !formState.apparel.jewelry.includes(item))
                }
                className={cn(
                  "text-sm border px-3 py-1.5 rounded-md",
                  formState.apparel.jewelry.includes(item)
                    ? "bg-gray-700 text-white border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm mb-2">Design Services</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                handleCategoryChange(
                  "apparel",
                  "designServices",
                  "Design Services",
                  !formState.apparel.designServices.includes("Design Services"),
                )
              }
              className={cn(
                "text-sm border px-3 py-1.5 rounded-md",
                formState.apparel.designServices.includes("Design Services")
                  ? "bg-gray-700 text-white border-gray-700"
                  : "bg-white border-gray-200",
              )}
            >
              Design Services
            </button>
          </div>
        </div>
      </div>

      {/* Food & Beverages */}
      <div className="mb-8">
        <h4 className="text-base font-semibold mb-4">Food & Beverages</h4>

        <div className="mb-4">
          <p className="text-sm mb-2">Other</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              Tinned & Processed Food
            </span>
            <span className="text-sm bg-gray-700 text-white px-3 py-1.5 rounded-md">Other</span>
          </div>
          <input
            type="text"
            placeholder="Type Here"
            value={formState.food.other}
            onChange={(e) => handleOtherChange(e.target.value)}
            className="border border-gray-200 p-2 w-full rounded text-sm"
          />
        </div>
      </div>

      {/* Mother and Baby */}
      <div className="mb-8">
        <h4 className="text-base font-semibold mb-4">Mother and Baby Care</h4>
        <div className="flex flex-wrap gap-2">
          {["Ready-to-Wear Apparel", "Custom Tailored Clothing", "Activewear", "Outerwear (Jackets, Coats, etc.)"].map(
            (item) => (
              <button
                key={item}
                onClick={() => handleCategoryChange("motherBaby", "", item, !formState.motherBaby.includes(item))}
                className={cn(
                  "text-sm border px-3 py-1.5 rounded-md",
                  formState.motherBaby.includes(item)
                    ? "bg-gray-700 text-white border-gray-700"
                    : "bg-white border-gray-200",
                )}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoriesForm

