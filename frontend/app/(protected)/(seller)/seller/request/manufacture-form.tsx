"use client"

import { useState, useEffect } from "react"
import { Calendar, Edit2, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"

const dummyProductName = {
  productName: "Aloe Vera Gel",
  additionalIngredients: "Aloe Vera, Water, Sugar, Citric Acid",
  formulaDetails: null,
  totalQuantity: "1000 units",
  packagingType: "Bottle",
  volumeSize: "250 ml per bottle",
  specialInstructions: "None",
  deliveryDeadline: "2025-03-03",
  deliveryLocation: "123 Main St, Anytown, USA",
  additionalNotes: "None",
  isAccepted: false,
  isManufactured: false,
  isShipped: false,
  isDelivered: false,
  isCancelled: false,
  isCompleted: false,
  isFailed: false,
  customFields: {
    productDetails: [],
    quantityRequirements: [],
    packagingDetails: [],
    deliveryPreferences: [],
    additionalNotes: [],
  },
}

const BuyerForm = ({ setActiveTab }: { setActiveTab: any }) => {
  // Form state
  const [formData, setFormData] = useState<any>({
    productName: "",
    additionalIngredients: "",
    formulaDetails: null,
    totalQuantity: "",
    packagingType: "",
    volumeSize: "",
    specialInstructions: "",
    deliveryDeadline: "",
    deliveryLocation: "",
    additionalNotes: "",
    customFields: {
      productDetails: [],
      quantityRequirements: [],
      packagingDetails: [],
      deliveryPreferences: [],
      additionalNotes: [],
    },
  })

  // State for editing field names
  const [editingField, setEditingField] = useState<{ section: string; index: number } | null>(null)
  const [editFieldName, setEditFieldName] = useState("")

  useEffect(() => {
    setFormData(dummyProductName)
  }, [])

  // Validation state
  const [errors, setErrors] = useState<any>({})
  const [touched, setTouched] = useState<any>({})

  // Dropdown options state
  const [packagingOptions] = useState(["Bottle", "Tube", "Sachet"])
  const [showPackagingDropdown, setShowPackagingDropdown] = useState(false)

  // Handle input change
  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Handle custom field input change
  const handleCustomFieldChange = (section: string, index: number, value: string) => {
    setFormData((prev: any) => {
      const updatedCustomFields = { ...prev.customFields }
      updatedCustomFields[section][index].value = value
      return {
        ...prev,
        customFields: updatedCustomFields,
      }
    })
  }

  // Handle blur event for validation
  const handleBlur = (e: any) => {
    const { name } = e.target
    setTouched((prev: any) => ({
      ...prev,
      [name]: true,
    }))
    validateField(name, formData[name])
  }

  // Validate a specific field
  const validateField = (name: any, value: any) => {
    let error = ""

    // Required fields
    if (name === "productName" && !value) {
      error = "Product Name is required"
    } else if (name === "totalQuantity" && !value) {
      error = "Total Quantity is required"
    } else if (name === "packagingType" && !value) {
      error = "Packaging Type is required"
    } else if (name === "volumeSize" && !value) {
      error = "Volume or size is required"
    } else if (name === "deliveryDeadline" && !value) {
      error = "Delivery Deadline is required"
    } else if (name === "deliveryLocation" && !value) {
      error = "Delivery Location is required"
    }

    // Update errors state
    setErrors((prev: any) => ({
      ...prev,
      [name]: error,
    }))

    return !error
  }

  // Handle packaging type selection
  const handleSelectPackaging = (option: any) => {
    setFormData((prev: any) => ({
      ...prev,
      packagingType: option,
    }))
    setShowPackagingDropdown(false)
    setErrors((prev: any) => ({
      ...prev,
      packagingType: "",
    }))
  }

  // Add a new custom field to a section
  const addCustomField = (section: string) => {
    setFormData((prev: any) => {
      const updatedCustomFields = { ...prev.customFields }
      updatedCustomFields[section] = [
        ...updatedCustomFields[section],
        { name: `Field ${updatedCustomFields[section].length + 1}`, value: "", required: false },
      ]
      return {
        ...prev,
        customFields: updatedCustomFields,
      }
    })
    toast.success(`New field added to ${section.replace(/([A-Z])/g, " $1").toLowerCase()}`)
  }

  // Remove a custom field
  const removeCustomField = (section: string, index: number) => {
    setFormData((prev: any) => {
      const updatedCustomFields = { ...prev.customFields }
      updatedCustomFields[section] = updatedCustomFields[section].filter((_, i) => i !== index)
      return {
        ...prev,
        customFields: updatedCustomFields,
      }
    })
    toast.success("Field removed")
  }

  // Start editing a field name
  const startEditingField = (section: string, index: number, currentName: string) => {
    setEditingField({ section, index })
    setEditFieldName(currentName)
  }

  // Save edited field name
  const saveFieldName = () => {
    if (editingField) {
      setFormData((prev: any) => {
        const updatedCustomFields = { ...prev.customFields }
        updatedCustomFields[editingField.section][editingField.index].name = editFieldName
        return {
          ...prev,
          customFields: updatedCustomFields,
        }
      })
      setEditingField(null)
      toast.success("Field name updated")
    }
  }

  // Toggle field requirement
  const toggleFieldRequired = (section: string, index: number) => {
    setFormData((prev: any) => {
      const updatedCustomFields = { ...prev.customFields }
      updatedCustomFields[section][index].required = !updatedCustomFields[section][index].required
      return {
        ...prev,
        customFields: updatedCustomFields,
      }
    })
  }

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Validate all fields
    let formIsValid = true
    const fields = [
      "productName",
      "totalQuantity",
      "packagingType",
      "volumeSize",
      "deliveryDeadline",
      "deliveryLocation",
    ]

    fields.forEach((field) => {
      const isValid = validateField(field, formData[field])
      if (!isValid) formIsValid = false

      // Mark all fields as touched
      setTouched((prev: any) => ({
        ...prev,
        [field]: true,
      }))
    })

    // Validate custom required fields
    Object.keys(formData.customFields).forEach((section) => {
      formData.customFields[section].forEach((field: any, index: number) => {
        if (field.required && !field.value) {
          formIsValid = false
          toast.error(`${field.name} is required`)
        }
      })
    })

    if (formIsValid) {
      try {
        const response = await fetch("/api/forms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Failed to save form")
        }

        const data = await response.json()
        console.log("Form submitted:", data)
        toast.success("Form saved successfully")
        setFormData({
          productName: "",
          additionalIngredients: "",
          formulaDetails: null,
          totalQuantity: "",
          packagingType: "",
          volumeSize: "",
          specialInstructions: "",
          deliveryDeadline: "",
          deliveryLocation: "",
          additionalNotes: "",
          customFields: {
            productDetails: [],
            quantityRequirements: [],
            packagingDetails: [],
            deliveryPreferences: [],
            additionalNotes: [],
          },
        })
        setActiveTab("all")
      } catch (error) {
        console.error("Error saving form:", error)
        toast.error("Failed to save form")
      }
    }
  }

  // Render custom fields for a section
  const renderCustomFields = (section: string) => {
    return formData.customFields[section].map((field: any, index: number) => (
      <div key={index} className="mb-4 relative">
        <div className="flex justify-between items-center mb-1">
          {editingField && editingField.section === section && editingField.index === index ? (
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
        <input
          type="text"
          placeholder={`Enter ${field.name.toLowerCase()}`}
          className={`w-full p-2 border ${field.required && !field.value ? "border-red-500" : "border-gray-300"} rounded`}
          value={field.value}
          onChange={(e) => handleCustomFieldChange(section, index, e.target.value)}
        />
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

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Product Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              placeholder="Name of the product (e.g., Aloe Vera Gel)"
              className={`w-full p-2 border ${errors.productName && touched.productName ? "border-red-500" : "border-gray-300"} rounded`}
              value={formData.productName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.productName && touched.productName && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">Additional Ingredients (Optional)</label>
            <input
              type="text"
              name="additionalIngredients"
              placeholder="Wants customization, you can add extra ingredients or specify preferences"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.additionalIngredients}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">Formula Details</label>
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
          </div>

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

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Total Quantity Needed<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="totalQuantity"
              placeholder="e.g., 1000 units"
              className={`w-full p-2 border ${errors.totalQuantity && touched.totalQuantity ? "border-red-500" : "border-gray-300"} rounded`}
              value={formData.totalQuantity}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.totalQuantity && touched.totalQuantity && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>

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

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Type of packaging<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div
                className={`w-full p-2 border ${errors.packagingType && touched.packagingType ? "border-red-500" : "border-gray-300"} rounded flex justify-between items-center cursor-pointer`}
                onClick={() => setShowPackagingDropdown(!showPackagingDropdown)}
              >
                <span className={formData.packagingType ? "text-black" : "text-gray-400"}>
                  {formData.packagingType || "Choose"}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>

              {showPackagingDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Type your Dropdown Options"
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </div>
                  <ul>
                    {packagingOptions.map((option, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 flex justify-between items-center cursor-pointer"
                        onClick={() => handleSelectPackaging(option)}
                      >
                        {option}
                        <span className="text-gray-500">×</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {errors.packagingType && touched.packagingType && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Volume or size per unit<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="volumeSize"
              placeholder="e.g., 250 ml per bottle"
              className={`w-full p-2 border ${errors.volumeSize && touched.volumeSize ? "border-red-500" : "border-gray-300"} rounded`}
              value={formData.volumeSize}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.volumeSize && touched.volumeSize && <span className="absolute right-3 top-9 text-red-500">×</span>}
          </div>

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">Special packaging instructions (if any)</label>
            <input
              type="text"
              name="specialInstructions"
              placeholder="Text Here.."
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.specialInstructions}
              onChange={handleChange}
            />
          </div>

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

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Delivery Deadline<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="deliveryDeadline"
                placeholder="DD/MM/YYYY"
                className={`w-full p-2 border ${errors.deliveryDeadline && touched.deliveryDeadline ? "border-red-500" : "border-gray-300"} rounded pr-10`}
                value={formData.deliveryDeadline}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
            {errors.deliveryDeadline && touched.deliveryDeadline && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>

          <div className="mb-4 relative">
            <label className="block mb-1 text-sm font-medium">
              Delivery Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="deliveryLocation"
              placeholder="Input for specifying delivery address or uploading detailed shipping instructions."
              className={`w-full p-2 border ${errors.deliveryLocation && touched.deliveryLocation ? "border-red-500" : "border-gray-300"} rounded`}
              value={formData.deliveryLocation}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.deliveryLocation && touched.deliveryLocation && (
              <span className="absolute right-3 top-9 text-red-500">×</span>
            )}
          </div>

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

          <div className="mb-4 relative">
            <input
              type="text"
              name="additionalNotes"
              placeholder="Text Here.."
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.additionalNotes}
              onChange={handleChange}
            />
          </div>

          {/* Custom fields for Additional Notes */}
          {renderCustomFields("additionalNotes")}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 rounded-[6px] text-white bg-gradient-to-r from-[#9e1171] to-[#f0b168]"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  )
}

export default BuyerForm

