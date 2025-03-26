"use client"

import { useState } from "react"
import { Calendar, Edit2, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"

const BuyerForm = ({ setActiveTab }: { setActiveTab: any }) => {
  // Form structure state
  const [formData, setFormData] = useState<any>({
    sections: {
      productDetails: {
        fields: [
          { id: "productName", name: "Product Name", required: true, type: "text" },
          { id: "additionalIngredients", name: "Additional Ingredients (Optional)", required: false, type: "text" },
          { id: "formulaDetails", name: "Formula Details", required: false, type: "file" },
        ],
        customFields: [],
      },
      quantityRequirements: {
        fields: [{ id: "totalQuantity", name: "Total Quantity Needed", required: true, type: "text" }],
        customFields: [],
      },
      packagingDetails: {
        fields: [
          {
            id: "packagingType",
            name: "Type of packaging",
            required: true,
            type: "dropdown",
            options: ["Bottle", "Tube", "Sachet"],
          },
          { id: "volumeSize", name: "Volume or size per unit", required: true, type: "text" },
          { id: "specialInstructions", name: "Special packaging instructions (if any)", required: false, type: "text" },
        ],
        customFields: [],
      },
      deliveryPreferences: {
        fields: [
          { id: "deliveryDeadline", name: "Delivery Deadline", required: true, type: "date" },
          { id: "deliveryLocation", name: "Delivery Location", required: true, type: "text" },
        ],
        customFields: [],
      },
      additionalNotes: {
        fields: [{ id: "additionalNotes", name: "Additional Notes", required: false, type: "text" }],
        customFields: [],
      },
    },
  })

  // State for editing field names
  const [editingField, setEditingField] = useState<{ section: string; index: number; isCustom: boolean } | null>(null)
  const [editFieldName, setEditFieldName] = useState("")

  // Dropdown options state
  const [showPackagingDropdown, setShowPackagingDropdown] = useState(false)
  const [newOption, setNewOption] = useState("")
  const [packagingOptions, setPackagingOptions] = useState(["Bottle", "Tube", "Sachet"])

  // Add a new custom field to a section
  const addCustomField = (section: string) => {
    setFormData((prev: any) => {
      const updatedSections = { ...prev.sections }
      const fieldId = `custom_${section}_${updatedSections[section].customFields.length + 1}`
      updatedSections[section].customFields = [
        ...updatedSections[section].customFields,
        {
          id: fieldId,
          name: `Field ${updatedSections[section].customFields.length + 1}`,
          required: false,
          type: "text",
        },
      ]
      return {
        ...prev,
        sections: updatedSections,
      }
    })
    toast.success(`New field added to ${section.replace(/([A-Z])/g, " $1").toLowerCase()}`)
  }

  // Remove a custom field
  const removeCustomField = (section: string, index: number) => {
    setFormData((prev: any) => {
      const updatedSections = { ...prev.sections }
      updatedSections[section].customFields = updatedSections[section].customFields.filter((_, i) => i !== index)
      return {
        ...prev,
        sections: updatedSections,
      }
    })
    toast.success("Field removed")
  }

  // Start editing a field name
  const startEditingField = (section: string, index: number, currentName: string, isCustom = true) => {
    setEditingField({ section, index, isCustom })
    setEditFieldName(currentName)
  }

  // Save edited field name
  const saveFieldName = () => {
    if (editingField) {
      setFormData((prev: any) => {
        const updatedSections = { ...prev.sections }
        if (editingField.isCustom) {
          updatedSections[editingField.section].customFields[editingField.index].name = editFieldName
        } else {
          updatedSections[editingField.section].fields[editingField.index].name = editFieldName
        }
        return {
          ...prev,
          sections: updatedSections,
        }
      })
      setEditingField(null)
      toast.success("Field name updated")
    }
  }

  // Toggle field requirement
  const toggleFieldRequired = (section: string, index: number, isCustom = true) => {
    setFormData((prev: any) => {
      const updatedSections = { ...prev.sections }
      if (isCustom) {
        updatedSections[section].customFields[index].required = !updatedSections[section].customFields[index].required
      } else {
        updatedSections[section].fields[index].required = !updatedSections[section].fields[index].required
      }
      return {
        ...prev,
        sections: updatedSections,
      }
    })
  }

  // Add a new option to the packaging dropdown
  const addPackagingOption = () => {
    if (newOption.trim()) {
      setPackagingOptions((prev) => [...prev, newOption.trim()])
      setNewOption("")

      // Update the options in the form data
      setFormData((prev: any) => {
        const updatedSections = { ...prev.sections }
        const packagingField = updatedSections.packagingDetails.fields.find((f: any) => f.id === "packagingType")

        if (packagingField) {
          packagingField.options = [...packagingOptions, newOption.trim()]
        }

        return {
          ...prev,
          sections: updatedSections,
        }
      })
    }
  }

  // Remove a packaging option
  const removePackagingOption = (option: string) => {
    setPackagingOptions((prev) => prev.filter((opt) => opt !== option))

    // Update the options in the form data
    setFormData((prev: any) => {
      const updatedSections = { ...prev.sections }
      const packagingField = updatedSections.packagingDetails.fields.find((f: any) => f.id === "packagingType")

      if (packagingField) {
        packagingField.options = packagingOptions.filter((opt) => opt !== option)
      }

      return {
        ...prev,
        sections: updatedSections,
      }
    })
  }

  // Handle form submission to save the template
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/form-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Manufacturing Form Template",
          structure: formData.sections,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save form template")
      }

      const data = await response.json()
      console.log("Form template saved:", data)
      toast.success("Form template saved successfully")
      setActiveTab("all")
    } catch (error) {
      console.error("Error saving form template:", error)
      toast.error("Failed to save form template")
    }
  }

  // Render default fields for a section
  const renderDefaultFields = (section: string) => {
    return formData.sections[section].fields.map((field: any, index: number) => (
      <div key={field.id} className="mb-4 relative">
        <div className="flex justify-between items-center mb-1">
          {editingField &&
          !editingField.isCustom &&
          editingField.section === section &&
          editingField.index === index ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editFieldName}
                onChange={(e) => setEditFieldName(e.target.value)}
                className="p-1 border border-gray-300 rounded text-sm"
                autoFocus
              />
              <button type="button" onClick={saveFieldName} className="text-green-500">
                <Save size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                {field.name}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <button
                type="button"
                onClick={() => startEditingField(section, index, field.name, false)}
                className="text-blue-500"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 flex items-center">
              <input
                type="checkbox"
                checked={field.required}
                onChange={() => toggleFieldRequired(section, index, false)}
                className="mr-1"
              />
              Required
            </label>
          </div>
        </div>

        {field.id === "packagingType" ? (
          <div className="relative">
            <div
              className="w-full p-2 border border-gray-300 rounded flex justify-between items-center cursor-pointer bg-gray-50 text-gray-400"
              onClick={() => setShowPackagingDropdown(!showPackagingDropdown)}
            >
              <span>Dropdown Field Placeholder</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>

            {showPackagingDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                <div className="p-2 border-b border-gray-200 flex">
                  <input
                    type="text"
                    placeholder="Add new option"
                    className="w-full p-1 border border-gray-300 rounded"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addPackagingOption}
                    className="ml-2 px-2 bg-green-500 text-white rounded"
                  >
                    +
                  </button>
                </div>
                <ul>
                  {packagingOptions.map((option, idx) => (
                    <li key={idx} className="p-2 hover:bg-gray-100 flex justify-between items-center">
                      {option}
                      <button type="button" onClick={() => removePackagingOption(option)} className="text-red-500">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : field.id === "formulaDetails" ? (
          <div className="border border-gray-300 rounded p-8 flex items-center justify-center">
            <div className="bg-gray-200 p-8 rounded flex items-center justify-center">
              <div className="text-gray-400">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        ) : field.id === "deliveryDeadline" ? (
          <div className="relative">
            <div className="w-full p-2 border border-gray-300 rounded pr-10 bg-gray-50 text-gray-400">
              Date Field Placeholder
            </div>
            <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        ) : (
          <div className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-400">
            Text Field Placeholder
          </div>
        )}
      </div>
    ))
  }

  // Render custom fields for a section
  const renderCustomFields = (section: string) => {
    return formData.sections[section].customFields.map((field: any, index: number) => (
      <div key={field.id} className="mb-4 relative">
        <div className="flex justify-between items-center mb-1">
          {editingField && editingField.isCustom && editingField.section === section && editingField.index === index ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editFieldName}
                onChange={(e) => setEditFieldName(e.target.value)}
                className="p-1 border border-gray-300 rounded text-sm"
                autoFocus
              />
              <button type="button" onClick={saveFieldName} className="text-green-500">
                <Save size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                {field.name}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <button
                type="button"
                onClick={() => startEditingField(section, index, field.name)}
                className="text-blue-500"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 flex items-center">
              <input
                type="checkbox"
                checked={field.required}
                onChange={() => toggleFieldRequired(section, index)}
                className="mr-1"
              />
              Required
            </label>
            <button type="button" onClick={() => removeCustomField(section, index)} className="text-red-500">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-400">
          {field.type === "text" && "Text Field Placeholder"}
          {field.type === "dropdown" && "Dropdown Field Placeholder"}
          {field.type === "date" && "Date Field Placeholder"}
          {field.type === "file" && "File Upload Placeholder"}
        </div>
      </div>
    ))
  }

  return (
    <div className="bg-white text-gray-800 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Form for the Buyer</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Product Details Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              <span className="mr-2">1</span>Product Details
            </h3>
            <button
              type="button"
              className="text-red-500 font-medium text-sm"
              onClick={() => addCustomField("productDetails")}
            >
              + Add Fields
            </button>
          </div>

          {/* Default fields for Product Details */}
          {renderDefaultFields("productDetails")}

          {/* Custom fields for Product Details */}
          {renderCustomFields("productDetails")}
        </div>

        {/* Quantity Requirements Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              <span className="mr-2">2</span>Quantity Requirements
            </h3>
            <button
              type="button"
              className="text-red-500 font-medium text-sm"
              onClick={() => addCustomField("quantityRequirements")}
            >
              + Add Fields
            </button>
          </div>

          {/* Default fields for Quantity Requirements */}
          {renderDefaultFields("quantityRequirements")}

          {/* Custom fields for Quantity Requirements */}
          {renderCustomFields("quantityRequirements")}
        </div>

        {/* Packaging Details Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              <span className="mr-2">3</span>Packaging Details
            </h3>
            <button
              type="button"
              className="text-red-500 font-medium text-sm"
              onClick={() => addCustomField("packagingDetails")}
            >
              + Add Fields
            </button>
          </div>

          {/* Default fields for Packaging Details */}
          {renderDefaultFields("packagingDetails")}

          {/* Custom fields for Packaging Details */}
          {renderCustomFields("packagingDetails")}
        </div>

        {/* Delivery Preferences Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              <span className="mr-2">4</span>Delivery Preferences
            </h3>
            <button
              type="button"
              className="text-red-500 font-medium text-sm"
              onClick={() => addCustomField("deliveryPreferences")}
            >
              + Add Fields
            </button>
          </div>

          {/* Default fields for Delivery Preferences */}
          {renderDefaultFields("deliveryPreferences")}

          {/* Custom fields for Delivery Preferences */}
          {renderCustomFields("deliveryPreferences")}
        </div>

        {/* Additional Notes Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              <span className="mr-2">5</span>Additional Notes (Optional)
            </h3>
            <button
              type="button"
              className="text-red-500 font-medium text-sm"
              onClick={() => addCustomField("additionalNotes")}
            >
              + Add Fields
            </button>
          </div>

          {/* Default fields for Additional Notes */}
          {renderDefaultFields("additionalNotes")}

          {/* Custom fields for Additional Notes */}
          {renderCustomFields("additionalNotes")}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 rounded-[6px] text-white bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
          >
            Save Form Template
          </button>
        </div>
      </form>
    </div>
  )
}

export default BuyerForm

