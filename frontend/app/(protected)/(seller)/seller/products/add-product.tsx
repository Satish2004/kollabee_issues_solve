"use client"

import type { ProductFormData } from "./types"
import { categoryApi } from "@/lib/api/category"
import { productsApi } from "@/lib/api/products"
import type { Category } from "@/types/api"
import { Upload, X, Loader2, Plus, ChevronLeft, Check, FileText, Menu, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { CATEGORY_OPTIONS } from "@/lib/data/category"

interface ProductFormProps {
  initialData?: any
  mode: "create" | "edit" | "view"
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const INDUSTRY_SPECIFIC_ATTRIBUTES = [
  { key: "Material", value: "" },
  { key: "Fabric Weight", value: "" },
  { key: "Technics", value: "" },
]




const OTHER_ATTRIBUTES = [
  { key: "Collar", value: "" },
  { key: "Fabric Type", value: "" },
  { key: "Fit Type", value: "" },
]

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

const isValidDecimal = (value: string) => {
  return /^\d*(\.\d{0,2})?$/.test(value)
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  mode = "create",
  onSubmit,
  isSubmitting: externalIsSubmitting,
}) => {
  const router = useRouter()

  // Main form state
  const [formData, setFormData] = useState<any>(
    () =>
      initialData || {
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
      },
  )

  // Loading states
  const [imageLoading, setImageLoading] = useState(false)
  const [thumbnailLoading, setThumbnailLoading] = useState(false)
  const [documentLoading, setDocumentLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Data states
  const [categories, setCategories] = useState<Category[]>([])
  const [coverImage, setCoverImage] = useState<any>(null)
  const [thumbnail, setThumbnail] = useState<any[]>([])
  const [documents, setDocuments] = useState<any>([])

  // UI states
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("upload")
  const [activeNumber, setActiveNumber] = useState<number>(1)
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false)

  // Attribute states
  const [industryAttributes, setIndustryAttributes] =
    useState<Array<{ key: string; value: string }>>(INDUSTRY_SPECIFIC_ATTRIBUTES)
  const [otherAttributes, setOtherAttributes] = useState<Array<{ key: string; value: string }>>(OTHER_ATTRIBUTES)
  const [customAttributes, setCustomAttributes] = useState<Array<{ key: string; value: string }>>([])

  // Editing states
  const [editingIndustryIndex, setEditingIndustryIndex] = useState<number | null>(null)
  const [editingOtherIndex, setEditingOtherIndex] = useState<number | null>(null)
  const [editingCustomIndex, setEditingCustomIndex] = useState<number | null>(null)
  const [isAddingAttribute, setIsAddingAttribute] = useState(false)
  const [newAttributeKey, setNewAttributeKey] = useState("")
  const [newAttributeValue, setNewAttributeValue] = useState("")
  const [newAttributeCategory, setNewAttributeCategory] = useState<"industry" | "other" | "custom">("other")

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [errors, setErrors] = useState<{
    name?: string
    price?: string
    discount?: string
    deliveryCost?: string
    minOrderQuantity?: string
    availableQuantity?: string
    categoryIds?: string
  }>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const [isInitialized, setIsInitialized] = useState(false)

  const thumbnailRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<HTMLDivElement>(null)
  const generalInfoRef = useRef<HTMLDivElement>(null)
  const productDetailsRef = useRef<HTMLDivElement>(null)
  const documentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const response = await categoryApi.getAll()
        if (isMounted) {
          setCategories(response.data)
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Failed to load categories")
        }
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      if (!initialData) return

      let categoryIds = []
      if (initialData.productCategories) {
        categoryIds = initialData.productCategories
      } else {
        categoryIds = initialData.categoryIds || (initialData.categoryId ? [initialData.categoryId] : [])
      }

      setFormData((prev) => ({
        ...initialData,
        categoryIds: categoryIds,
      }))

      if (initialData.images && initialData.images.length > 0) {
        setCoverImage(initialData.images[0])
      }

      if (initialData.thumbnail) {
        const thumbnailArray = Array.isArray(initialData.thumbnail)
          ? initialData.thumbnail
          : initialData.thumbnail
            ? [initialData.thumbnail]
            : []
        setThumbnail(thumbnailArray)
      }

      if (initialData.documents) {
        setDocuments(initialData.documents)
      }

      if (initialData.attributes) {
        const attributesObj = initialData.attributes || {}
        const allAttributes = Object.entries(attributesObj).map(([key, value]) => ({
          key,
          value: value as string,
        }))

        const industryKeys = INDUSTRY_SPECIFIC_ATTRIBUTES.map((attr) => attr.key)
        const otherKeys = OTHER_ATTRIBUTES.map((attr) => attr.key)

        const existingIndustryAttrs = allAttributes.filter((attr) => industryKeys.includes(attr.key))
        const existingOtherAttrs = allAttributes.filter((attr) => otherKeys.includes(attr.key))
        const existingCustomAttrs = allAttributes.filter(
          (attr) => !industryKeys.includes(attr.key) && !otherKeys.includes(attr.key),
        )

        const existingIndustryKeys = existingIndustryAttrs.map((attr) => attr.key)
        const missingIndustryAttrs = INDUSTRY_SPECIFIC_ATTRIBUTES.filter(
          (attr) => !existingIndustryKeys.includes(attr.key),
        )

        const existingOtherKeys = existingOtherAttrs.map((attr) => attr.key)
        const missingOtherAttrs = OTHER_ATTRIBUTES.filter((attr) => !existingOtherKeys.includes(attr.key))

        setIndustryAttributes([...existingIndustryAttrs, ...missingIndustryAttrs])
        setOtherAttributes([...existingOtherAttrs, ...missingOtherAttrs])
        setCustomAttributes(existingCustomAttrs)
      }
    }

    // Mark as initialized after initial setup
    setIsInitialized(true)
  }, [initialData, mode])

  // Load draft only once on mount for create mode
  useEffect(() => {
    if (mode !== "create" || !isInitialized) return

    const loadDraft = () => {
      const savedDraft = localStorage.getItem("productDraft")
      if (!savedDraft) return

      try {
        const parsedDraft = JSON.parse(savedDraft)
        console.log("Parsed draft:", parsedDraft)

        setFormData(parsedDraft.formData || formData)
        setCoverImage(parsedDraft.coverImage || null)
        setThumbnail(parsedDraft.thumbnail || [])
        setDocuments(parsedDraft.documents || [])
        setIndustryAttributes(parsedDraft.industryAttributes || INDUSTRY_SPECIFIC_ATTRIBUTES)
        setOtherAttributes(parsedDraft.otherAttributes || OTHER_ATTRIBUTES)
        setCustomAttributes(parsedDraft.customAttributes || [])

        if (parsedDraft.lastSaved) {
          setLastSaved(new Date(parsedDraft.lastSaved))
        }

        toast.info("Draft loaded successfully")
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }

    loadDraft()
  }, [mode, isInitialized])

  const saveChanges = useCallback(
    debounce(async () => {
      if (!isInitialized) return

      setSaveStatus("saving")

      try {
        const allAttributes = [...industryAttributes, ...otherAttributes, ...customAttributes]
        const attributesObject = allAttributes.reduce(
          (acc, { key, value }) => {
            if (key.trim()) {
              acc[key] = value
            }
            return acc
          },
          {} as Record<string, string>,
        )

        const productData = {
          ...formData,
          attributes: attributesObject,
          thumbnail: thumbnail,
          documents: documents,
          categoryIds: formData.categoryIds || [],
        }

        if (mode === "edit" && initialData?.id) {
          await productsApi.updateProduct(initialData.id, productData)
          setSaveStatus("saved")
          const now = new Date()
          setLastSaved(now)
          localStorage.removeItem("productDraft")
        } else if (mode === "create") {
          const draftData = {
            productId: formData.id || null,
            formData: formData,
            coverImage: coverImage,
            thumbnail: thumbnail,
            documents: documents,
            industryAttributes: industryAttributes,
            otherAttributes: otherAttributes,
            customAttributes: customAttributes,
            lastSaved: new Date().toISOString(),
          }

          localStorage.setItem("productDraft", JSON.stringify(draftData))
          setSaveStatus("saved")
          setLastSaved(new Date())
        }
      } catch (error) {
        console.error("Error auto-saving product:", error)
        setSaveStatus("unsaved")
        toast.error("Failed to save changes")
      }
    }, 1500),
    [
      formData,
      industryAttributes,
      otherAttributes,
      customAttributes,
      thumbnail,
      documents,
      coverImage,
      mode,
      initialData,
      isInitialized,
    ],
  )

  // Optimized auto-save effect - only track essential fields
  useEffect(() => {
    if (!isInitialized) return

    setSaveStatus("unsaved")
    saveChanges()
  }, [
    formData.name,
    formData.price,
    formData.categoryIds,
    formData.description,
    formData.minOrderQuantity,
    formData.availableQuantity,
    formData.discount,
    formData.deliveryCost,
    industryAttributes,
    otherAttributes,
    customAttributes,
    saveChanges,
    isInitialized,
  ])

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setImageLoading(true)
        const response: any = await productsApi.uploadImage(file)
        setFormData((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), response?.url],
        }))
        setCoverImage(response?.url)
        toast.success("Image uploaded successfully")
      } catch (error) {
        toast.error("Failed to upload image")
      } finally {
        setImageLoading(false)
      }
    }
  }

  // Thumbnail upload handler
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setThumbnailLoading(true)
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const response: any = await productsApi.uploadImage(file)
        setThumbnail((prev) => [...prev, response?.url])
        setFormData((prev: any) => ({
          ...prev,
          thumbnail: [...(prev.thumbnail || []), response?.url],
        }))
      }
      toast.success("Thumbnails uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload thumbnails")
    } finally {
      setThumbnailLoading(false)
    }
  }

  // Document upload handler
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setDocumentLoading(true)
        const response: any = await productsApi.uploadImage(file)
        const newDocuments = [...documents, response?.url]
        setFormData((prev: any) => ({
          ...prev,
          documents: newDocuments,
        }))
        setDocuments(newDocuments)
        toast.success(`${file.type.includes("pdf") ? "PDF" : "Document"} uploaded successfully`)
      } catch (error) {
        toast.error("Failed to upload document")
      } finally {
        setDocumentLoading(false)
      }
    }
  }

  // Form validation
  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Product name is required"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (typeof formData.price === "string" && !isValidDecimal(formData.price)) {
      newErrors.price = "Enter a valid number (e.g. 12 or 12.50)"
    }

    if (
      formData.discount &&
      (isNaN(Number(formData.discount)) || Number(formData.discount) < 0 || Number(formData.discount) > 100)
    ) {
      newErrors.discount = "Discount must be between 0 and 100"
    }

    if (!formData.deliveryCost) {
      newErrors.deliveryCost = "Delivery cost is required"
    } else if (typeof formData.deliveryCost === "string" && !isValidDecimal(formData.deliveryCost)) {
      newErrors.deliveryCost = "Enter a valid number (e.g. 12 or 12.50)"
    }

    if (!formData.minOrderQuantity) {
      newErrors.minOrderQuantity = "Minimum order quantity is required"
    }

    if (!formData.availableQuantity) {
      newErrors.availableQuantity = "Available quantity is required"
    }

    if (!formData.categoryIds || formData.categoryIds.length === 0) {
      newErrors.categoryIds = "At least one category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent, isDraft = true) => {
    e.preventDefault()
    setFormSubmitted(true)

    const isValid = validateForm()
    if (!isValid) {
      toast.error("Please fill the required fields before saving")
      return
    }

    setIsSubmitting(true)

    try {
      const allAttributes = [...industryAttributes, ...otherAttributes, ...customAttributes]
      const attributesObject = allAttributes.reduce(
        (acc, { key, value }) => {
          if (key.trim()) {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, string>,
      )

      const productData = {
        ...formData,
        attributes: attributesObject,
        thumbnail: thumbnail,
        documents: documents,
        categoryIds: formData.categoryIds || [], // Ensure categoryIds is always an array
      }

      console.log("Submitting product data:", productData) // Debug log

      let response: any

      if (mode === "edit") {
        response = await productsApi.updateProduct(initialData.id, productData)
        localStorage.removeItem("productDraft")
      } else {
        response = await productsApi.create(productData)
        localStorage.removeItem("productDraft")
        console.log("Draft Removed")

        // Reset form after successful creation
        setFormData({
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
        })
        setCoverImage(null)
        setThumbnail([])
        setDocuments([])
      }

      toast.success(mode === "create" ? "Product created successfully" : "Product updated successfully")
      onSubmit(response.data)
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Failed to save product")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if ((field === "price" || field === "deliveryCost") && typeof value === "string") {
      if (!isValidDecimal(value)) {
        return
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (formSubmitted) {
      if (field === "name" && value.trim()) {
        setErrors((prev) => ({ ...prev, name: undefined }))
      }
      if (field === "price" && value) {
        setErrors((prev) => ({ ...prev, price: undefined }))
      }
      if (field === "discount") {
        if (!value || (Number(value) >= 0 && Number(value) <= 100)) {
          setErrors((prev) => ({ ...prev, discount: undefined }))
        } else {
          setErrors((prev) => ({
            ...prev,
            discount: "Discount must be between 0 and 100",
          }))
        }
      }
      if (field === "deliveryCost" && value) {
        setErrors((prev) => ({ ...prev, deliveryCost: undefined }))
      }
      if (field === "minOrderQuantity" && value) {
        setErrors((prev) => ({ ...prev, minOrderQuantity: undefined }))
      }
      if (field === "availableQuantity" && value) {
        setErrors((prev) => ({ ...prev, availableQuantity: undefined }))
      }
      if (field === "categoryIds" && value && value.length > 0) {
        setErrors((prev) => ({ ...prev, categoryIds: undefined }))
      }
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev: any) => {
      const currentCategories = prev.categoryIds || []

      if (currentCategories.includes(categoryId)) {
        return {
          ...prev,
          categoryIds: currentCategories.filter((id: string) => id !== categoryId),
        }
      } else {
        return {
          ...prev,
          categoryIds: [...currentCategories, categoryId],
        }
      }
    })
  }

  const scrollToSection = (sectionId: string) => {
    const refs: any = {
      upload: uploadRef,
      "general-info": generalInfoRef,
      "product-details": productDetailsRef,
      documents: documentsRef,
    }

    refs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })

    setActiveSection(sectionId)
    setActiveNumber(
      sectionId === "upload" ? 1 : sectionId === "general-info" ? 2 : sectionId === "product-details" ? 3 : 4,
    )

    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const handleScroll = () => {
    const sections = [
      { id: "upload", ref: uploadRef },
      { id: "general-info", ref: generalInfoRef },
      { id: "product-details", ref: productDetailsRef },
      { id: "documents", ref: documentsRef },
    ]

    for (const section of sections) {
      const element = section.ref.current
      if (element) {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top <= 100 && rect.bottom >= 100
        if (isVisible) {
          setActiveSection(section.id)
          break
        }
      }
    }

    const documentsElement = documentsRef.current
    if (documentsElement) {
      const rect = documentsElement.getBoundingClientRect()
      const isAtEndOfPage = rect.bottom <= window.innerHeight + 100
      if (isAtEndOfPage) {
        setActiveSection("documents")
      }
    }

    setActiveNumber(
      activeSection === "upload"
        ? 1
        : activeSection === "general-info"
          ? 2
          : activeSection === "product-details"
            ? 3
            : 4,
    )
  }

  // Attribute update functions
  const updateIndustryAttribute = (index: number, key?: string, value?: string) => {
    const updated = [...industryAttributes]
    if (key !== undefined) updated[index].key = key
    if (value !== undefined) updated[index].value = value
    setIndustryAttributes(updated)
  }

  const updateOtherAttribute = (index: number, key?: string, value?: string) => {
    const updated = [...otherAttributes]
    if (key !== undefined) updated[index].key = key
    if (value !== undefined) updated[index].value = value
    setOtherAttributes(updated)
  }

  const updateCustomAttribute = (index: number, key?: string, value?: string) => {
    const updated = [...customAttributes]
    if (key !== undefined) updated[index].key = key
    if (value !== undefined) updated[index].value = value
    setCustomAttributes(updated)
  }

  const removeCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index))
  }

  const addNewAttribute = () => {
    if (newAttributeKey.trim()) {
      const newAttr = { key: newAttributeKey, value: newAttributeValue }
      switch (newAttributeCategory) {
        case "industry":
          setIndustryAttributes([...industryAttributes, newAttr])
          break
        case "other":
          setOtherAttributes([...otherAttributes, newAttr])
          break
        case "custom":
          setCustomAttributes([...customAttributes, newAttr])
          break
      }
      setNewAttributeKey("")
      setNewAttributeValue("")
      setIsAddingAttribute(false)
    }
  }

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return ""

    const now = new Date()
    const diffMs = now.getTime() - lastSaved.getTime()
    const diffMins = Math.round(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins === 1) return "1 minute ago"
    if (diffMins < 60) return `${diffMins} minutes ago`

    const hours = lastSaved.getHours()
    const minutes = lastSaved.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `Today at ${formattedHours}:${formattedMinutes} ${ampm}`
  }

  // Remove document handler
  const removeDocument = async (index: number) => {
    const newDocuments = [...documents]
    const documentToRemove = newDocuments[index]
    newDocuments.splice(index, 1)

    try {
      await productsApi.deleteImage(documentToRemove)
      setDocuments(newDocuments)
      setFormData((prev: any) => ({
        ...prev,
        documents: newDocuments,
      }))
    } catch (error) {
      toast.error("Failed to remove document")
    }
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b sticky top-0 bg-white z-30">
        <div className="flex items-center space-x-2 sm:space-x-4 cursor-pointer" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
          <p className="text-red-500">Back</p>
        </div>

        {/* Mobile menu toggle */}
        <button
          title="Toggle sidebar"
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Save status indicator */}
        <div className="hidden sm:flex items-center text-sm">
          {saveStatus === "saving" && (
            <div className="flex items-center text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="flex items-center text-green-600">
              <Check className="w-4 h-4 mr-2" />
              {mode === "create" ? "Saved in draft" : "Saved"} {lastSaved && `• ${formatLastSaved()}`}
            </div>
          )}
          {saveStatus === "unsaved" && <div className="text-amber-500">Unsaved changes</div>}
        </div>
      </header>

      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {/* Left Sidebar */}
        <div className={`fixed inset-0 z-40 md:relative md:z-0 ${sidebarOpen ? "block" : "hidden"} md:block`}>
          {/* Backdrop for mobile */}
          <div className="absolute inset-0 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}></div>

          {/* Sidebar content */}
          <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs md:max-w-none md:w-full md:static bg-white shadow-xl md:shadow-none p-4 overflow-y-auto">
            <div className="flex justify-end md:hidden mb-4">
              <button
                title="Close sidebar"
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {mode !== "create" && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="text-sm text-gray-500 mb-2">Last update</div>
                  <div>{lastSaved ? formatLastSaved() : "Not saved yet"}</div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow p-4">
                <div className="text-sm text-gray-500 mb-2">Status</div>
                <div>{formData.isDraft ? "Draft" : "Active"}</div>
              </div>

              {/* Navigation Section */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="space-y-2">
                  <button onClick={() => scrollToSection("upload")} className="flex items-center space-x-1 w-full">
                    <div
                      className={`w-8 sm:w-10 aspect-square ${activeNumber >= 1 ? "bg-green-500" : "bg-neutral-200"
                        } rounded-full flex items-center justify-center`}
                    >
                      <span className={`font-semibold text-xs sm:text-sm ${activeNumber >= 1 ? "text-white" : ""}`}>
                        01
                      </span>
                    </div>
                    <div
                      className={`w-full text-left p-2 rounded text-sm ${activeSection === "upload" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"
                        }`}
                    >
                      Upload Art Cover
                    </div>
                  </button>

                  <div
                    className={`h-8 w-0.5 rounded-full ml-4 ${activeNumber > 1 ? "bg-green-500" : " bg-neutral-200 "}`}
                  ></div>

                  <button
                    onClick={() => scrollToSection("general-info")}
                    className="flex items-center space-x-1 w-full"
                  >
                    <div
                      className={`w-8 sm:w-10 aspect-square ${activeNumber >= 2 ? "bg-green-500" : "bg-neutral-200"
                        } rounded-full flex items-center justify-center`}
                    >
                      <span className={`font-semibold text-xs sm:text-sm ${activeNumber >= 2 ? "text-white" : ""}`}>
                        02
                      </span>
                    </div>
                    <div
                      className={`w-full text-left p-2 rounded text-sm ${activeSection === "general-info" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"
                        }`}
                    >
                      General Information
                    </div>
                  </button>

                  <div
                    className={`h-8 w-0.5 rounded-full ml-4 ${activeNumber > 2 ? "bg-green-500" : " bg-neutral-200 "}`}
                  ></div>

                  <button
                    onClick={() => scrollToSection("product-details")}
                    className="flex items-center space-x-1 w-full"
                  >
                    <div
                      className={`w-8 sm:w-10 aspect-square ${activeNumber >= 3 ? "bg-green-500" : "bg-neutral-200"
                        } rounded-full flex items-center justify-center`}
                    >
                      <span className={`font-semibold text-xs sm:text-sm ${activeNumber >= 3 ? "text-white" : ""}`}>
                        03
                      </span>
                    </div>
                    <div
                      className={`w-full text-left p-2 rounded text-sm ${activeSection === "product-details" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"
                        }`}
                    >
                      Product Details
                    </div>
                  </button>

                  <div
                    className={`h-8 w-0.5 rounded-full ml-4 ${activeNumber > 3 ? "bg-green-500" : " bg-neutral-200 "}`}
                  ></div>

                  <button onClick={() => scrollToSection("documents")} className="flex items-center space-x-1 w-full">
                    <div
                      className={`w-8 sm:w-10 aspect-square ${activeNumber >= 4 ? "bg-green-500" : "bg-neutral-200"
                        } rounded-full flex items-center justify-center`}
                    >
                      <span className={`font-semibold text-xs sm:text-sm ${activeNumber >= 4 ? "text-white" : ""}`}>
                        04
                      </span>
                    </div>
                    <div
                      className={`w-full text-left p-2 rounded text-sm ${activeSection === "documents" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"
                        }`}
                    >
                      Documents
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || externalIsSubmitting}
                className="w-full rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-6 py-2 transition-all duration-200"
                onClick={(e) => handleSubmit(e, true)}
              >
                {isSubmitting || externalIsSubmitting ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="col-span-1 md:col-span-3 bg-white rounded-lg shadow p-4 sm:p-6 overflow-auto max-h-[calc(100vh-120px)]"
          onScroll={handleScroll}
        >
          <form>
            {/* Upload Cover Section */}
            <section id="upload" ref={uploadRef} className="mb-8">
              <h2 className="text-lg font-semibold mb-2">Upload cover</h2>
              <p className="text-gray-600 mb-4 text-sm">Upload the art cover to capture your audience's attention</p>

              <div className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center h-full">
                {coverImage ? (
                  <div className="relative">
                    <img
                      src={coverImage || "/placeholder.svg"}
                      alt="Cover preview"
                      className="max-h-48 sm:max-h-64 mx-auto"
                    />
                  </div>
                ) : (
                  <div>
                    {imageLoading ? (
                      <div className="w-8 h-8 text-gray-400 mx-auto mb-4">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    )}
                    <p className="text-gray-600 mb-2 text-xs sm:text-sm">Drag and drop your image here</p>
                    <p className="text-gray-600 mb-2 text-xs sm:text-sm">
                      Recommended image size: 400 x 300 px for optimal display
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-4 sm:px-6 py-2 transition-all duration-200 text-sm cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </div>
                )}
              </div>

              {coverImage && (
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="text-[#898989] text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-[6px] font-semibold"
                    onClick={async () => {
                      await productsApi.deleteImage(coverImage)
                      setCoverImage(null)
                      setFormData((prev: any) => ({
                        ...prev,
                        images: [],
                      }))
                    }}
                  >
                    Remove
                  </button>
                  <label
                    htmlFor="cover-upload"
                    className="text-[#898989] border border-[#898989] text-xs sm:text-sm px-3 sm:px-4 py-1 rounded-[14px] font-semibold cursor-pointer"
                  >
                    Change
                  </label>
                </div>
              )}
            </section>

            {/* Product Details Section */}
            <section id="general-info" ref={generalInfoRef} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Product Details</h2>

              {/* Categories Multi-select */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-4">
                  Categories <span className="text-red-500">*</span>
                </h3>
                <div className="w-full">
                  <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button
                        title="Select categories"
                        type="button"
                        role="combobox"
                        aria-controls="category-popover-content"
                        aria-expanded={!!categoryPopoverOpen}
                        className={`w-full flex items-center justify-between rounded-md border border-input bg-[#fcfcfc] px-3 py-2 text-sm ${errors.categoryIds ? "border-red-500" : ""
                          }`}
                      >
                        <div className="flex flex-wrap gap-1">
                          {formData.categoryIds && formData.categoryIds.length > 0 ? (
                            formData.categoryIds.map((categoryId: string) => {
                              const category = CATEGORY_OPTIONS.find((c) => c.value === categoryId)
                              return (
                                <Badge key={categoryId} variant="secondary" className="mr-1">
                                  {category?.label || categoryId}
                                </Badge>
                              )
                            })
                          ) : (
                            <span className="text-muted-foreground">Select categories...</span>
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent id="category-popover-content" className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {CATEGORY_OPTIONS.map((category, i) => (
                              <CommandItem
                                key={i}
                                value={category.value}
                                onSelect={() => {
                                  handleCategorySelect(category.value)
                                }}
                              >
                                <div className="flex items-center gap-2 bg-white">
                                  <div
                                    className={cn(
                                      "flex h-4 w-4 items-center justify-center rounded-sm border ",
                                      formData.categoryIds?.includes(category.value)
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "opacity-50 [&_svg]:invisible",
                                    )}
                                  >
                                    <Check className={cn("h-3 w-3")} />
                                  </div>
                                  <span>{category.label}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.categoryIds && <p className="text-red-500 text-xs mt-1">{errors.categoryIds}</p>}
                </div>
              </div>

              {/* Thumbnail Section */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-4">Thumbnail</h3>
                <div className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center h-full">
                  {thumbnailLoading ? (
                    <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                      <Loader2 className="w-12 h-12 animate-spin" />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2 text-xs sm:text-sm">Upload thumbnails for your product</p>
                      <p className="text-gray-600 mb-2 text-xs sm:text-sm">
                        Recommended image size: 400 x 300 px for optimal display
                      </p>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        ref={thumbnailRef}
                        className="hidden"
                        onChange={handleThumbnailUpload}
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-4 sm:px-6 py-2 transition-all duration-200 text-sm cursor-pointer"
                      >
                        Browse Files
                      </label>
                    </>
                  )}

                  {thumbnail.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {thumbnail.map((doc: string, index: number) => (
                        <div key={index} className="relative border rounded-md p-2">
                          <img
                            src={doc || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-24 sm:h-32 object-cover mx-auto"
                          />
                          <button
                            title="Remove thumbnail"
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={async () => {
                              const newThumbnails = [...thumbnail]
                              const thumbnailToRemove = newThumbnails[index]
                              newThumbnails.splice(index, 1)

                              try {
                                await productsApi.deleteImage(thumbnailToRemove)
                                setThumbnail(newThumbnails)
                                setFormData((prev: any) => ({
                                  ...prev,
                                  thumbnail: newThumbnails,
                                }))
                              } catch (error) {
                                toast.error("Failed to remove thumbnail")
                              }
                            }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Details */}
              <h3 className="text-md font-medium mb-4">Price Details</h3>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="text-sm text-gray-600 w-full sm:w-[50%]">
                    Name <span className="text-red-500">*</span>
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Enter product name"
                      className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${errors.name ? "border-red-500" : ""}`}
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-1/3 text-sm text-gray-600">
                    Add product price <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="^\d*(\.\d{0,2})?$"
                      placeholder="122.00"
                      className={`w-full p-2 pl-8 border rounded-md bg-[#fcfcfc] ${errors.price ? "border-red-500" : ""
                        }`}
                      value={formData.price || ""}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-1/3 text-sm text-gray-600">Discount</div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter discount"
                      pattern="^\d*(\.\d{0,2})?$"
                      className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${errors.discount ? "border-red-500" : ""}`}
                      value={formData.discount || ""}
                      onChange={(e) => handleInputChange("discount", e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount}</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-1/3 text-sm text-gray-600">
                    Delivery cost <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="^\d*(\.\d{0,2})?$"
                      placeholder="Enter delivery cost"
                      className={`w-full p-2 pl-8 border rounded-md bg-[#fcfcfc] ${errors.deliveryCost ? "border-red-500" : ""
                        }`}
                      value={formData.deliveryCost || ""}
                      onChange={(e) => handleInputChange("deliveryCost", e.target.value)}
                    />
                    {errors.deliveryCost && <p className="text-red-500 text-xs mt-1">{errors.deliveryCost}</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-1/3 text-sm text-gray-600">
                    Minimum order <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Enter minimum order quantity"
                      className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${errors.minOrderQuantity ? "border-red-500" : ""
                        }`}
                      value={formData.minOrderQuantity || ""}
                      onChange={(e) => handleInputChange("minOrderQuantity", e.target.value)}
                    />
                    {errors.minOrderQuantity && <p className="text-red-500 text-xs mt-1">{errors.minOrderQuantity}</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-1/3 text-sm text-gray-600">
                    Available quantity <span className="text-red-500">*</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Enter available quantity"
                      className={`w-full p-2 border rounded-md bg-[#fcfcfc] ${errors.availableQuantity ? "border-red-500" : ""
                        }`}
                      value={formData.availableQuantity || ""}
                      onChange={(e) => handleInputChange("availableQuantity", e.target.value)}
                    />
                    {errors.availableQuantity && (
                      <p className="text-red-500 text-xs mt-1">{errors.availableQuantity}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Product Attributes Section */}
            <section id="product-details" ref={productDetailsRef} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Key attributes</h2>

              {/* Industry-specific attributes */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Industry-specific attributes</h3>
                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {industryAttributes.map((attr, index) => (
                        <tr key={index}>
                          <td className="p-2 sm:p-3 border-b border-r w-1/3 relative bg-gray-50">
                            {editingIndustryIndex === index ? (
                              <input
                                type="text"
                                className="w-full bg-transparent focus:outline-none text-sm"
                                value={attr.key}
                                onChange={(e) => updateIndustryAttribute(index, e.target.value)}
                                onBlur={() => setEditingIndustryIndex(null)}
                                autoFocus
                              />
                            ) : (
                              <div
                                className="w-full cursor-pointer text-sm"
                                onDoubleClick={() => setEditingIndustryIndex(index)}
                                title="Double-click to edit"
                              >
                                {attr.key}
                              </div>
                            )}
                          </td>
                          <td className="p-2 sm:p-3 border-b bg-white">
                            <input
                              type="text"
                              placeholder="Add your answer"
                              className="w-full p-1 sm:p-2 bg-transparent focus:outline-none text-sm"
                              value={attr.value}
                              onChange={(e) => updateIndustryAttribute(index, undefined, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Other attributes */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3">Other attributes</h3>
                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {otherAttributes.map((attr, index) => (
                        <tr key={index}>
                          <td className="p-2 sm:p-3 border-b border-r w-1/3 relative bg-gray-50">
                            {editingOtherIndex === index ? (
                              <input
                                type="text"
                                className="w-full bg-transparent focus:outline-none text-sm"
                                value={attr.key}
                                onChange={(e) => updateOtherAttribute(index, e.target.value)}
                                onBlur={() => setEditingOtherIndex(null)}
                                autoFocus
                              />
                            ) : (
                              <div
                                className="w-full cursor-pointer text-sm"
                                onDoubleClick={() => setEditingOtherIndex(index)}
                                title="Double-click to edit"
                              >
                                {attr.key}
                              </div>
                            )}
                          </td>
                          <td className="p-2 sm:p-3 border-b bg-white">
                            <input
                              type="text"
                              placeholder="Add your answer"
                              className="w-full p-1 sm:p-2 bg-transparent focus:outline-none text-sm"
                              value={attr.value}
                              onChange={(e) => updateOtherAttribute(index, undefined, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Custom attributes */}
              {customAttributes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Custom attributes</h3>
                  <div className="border rounded-md overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        {customAttributes.map((attr, index) => (
                          <tr key={index}>
                            <td className="p-2 sm:p-3 border-b border-r w-1/3 relative bg-gray-50">
                              {editingCustomIndex === index ? (
                                <input
                                  type="text"
                                  className="w-full bg-transparent focus:outline-none text-sm"
                                  value={attr.key}
                                  onChange={(e) => updateCustomAttribute(index, e.target.value)}
                                  onBlur={() => setEditingCustomIndex(null)}
                                  autoFocus
                                />
                              ) : (
                                <div
                                  className="w-full cursor-pointer text-sm"
                                  onDoubleClick={() => setEditingCustomIndex(index)}
                                  title="Double-click to edit"
                                >
                                  {attr.key}
                                  <button
                                    title="Remove attribute"
                                    type="button"
                                    className="absolute right-2 text-gray-500 hover:text-red-500"
                                    onClick={() => removeCustomAttribute(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="p-2 sm:p-3 border-b bg-white">
                              <input
                                type="text"
                                placeholder="Add your answer"
                                className="w-full p-1 sm:p-2 bg-transparent focus:outline-none text-sm"
                                value={attr.value}
                                onChange={(e) => updateCustomAttribute(index, undefined, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Add new attribute */}
              {isAddingAttribute ? (
                <div className="mt-4 p-4 border rounded-md">
                  <div className="flex items-center mb-3">
                    <h3 className="text-md font-medium">Add new attribute</h3>
                    <button
                      title="Close"
                      type="button"
                      className="ml-auto text-gray-500 hover:text-red-500"
                      onClick={() => setIsAddingAttribute(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Attribute Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter attribute name"
                        value={newAttributeKey}
                        onChange={(e) => setNewAttributeKey(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Attribute Value</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter attribute value"
                        value={newAttributeValue}
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">Attribute Category</label>
                    <select
                      title="Select attribute category"
                      className="w-full p-2 border rounded-md"
                      value={newAttributeCategory}
                      onChange={(e) => setNewAttributeCategory(e.target.value as any)}
                    >
                      <option value="industry">Industry-specific attributes</option>
                      <option value="other">Other attributes</option>
                      <option value="custom">Custom attributes</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addNewAttribute}
                    className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-4 sm:px-6 py-2 transition-all duration-200 text-sm"
                  >
                    Add Attribute
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingAttribute(true)}
                  className="mt-4 text-[#898989] hover:text-[#666] flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add other options
                </button>
              )}
            </section>

            {/* Documents Section */}
            <section id="documents" ref={documentsRef}>
              <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
              <div className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center">
                {documentLoading ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2 text-xs sm:text-sm">Drag and drop your documents here</p>
                    <p className="text-gray-600 mb-2 text-xs sm:text-sm">
                      Recommended image size: 400 x 300 px for optimal display
                    </p>
                    <input
                      id="documents-upload"
                      type="file"
                      accept="image/*,.pdf"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleDocumentUpload}
                    />
                    <label
                      htmlFor="documents-upload"
                      className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-4 sm:px-6 py-2 transition-all duration-200 text-sm cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </>
                )}
              </div>

              {/* Display uploaded documents */}
              {documents.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {documents.map((doc: string, index: number) => {
                    // Check if the document is a PDF by looking at the file extension
                    const isImage = [".png", ".jpg", ".jpeg"].some((ext) => doc.toLowerCase().endsWith(ext))

                    return (
                      <div key={index} className="relative border rounded-md p-2">
                        {isImage ? (
                          <img
                            src={doc || "/placeholder.svg"}
                            alt={`Document ${index + 1}`}
                            className="w-full h-24 sm:h-32 object-cover"
                          />
                        ) : (
                          <div className="w-full h-24 sm:h-32 flex items-center justify-center bg-gray-100">
                            <div className="flex flex-col items-center justify-center">
                              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mb-2" />
                              <span className="text-xs sm:text-sm font-medium">PDF Document</span>
                              <a
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 mt-1 hover:underline"
                              >
                                View PDF
                              </a>
                            </div>
                          </div>
                        )}
                        <button
                          title="Remove document"
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={() => removeDocument(index)}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </form>
        </div>
      </div>

      {/* Mobile fixed save button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
        <div className="text-xs">
          {saveStatus === "saving" && (
            <div className="flex items-center text-gray-500">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Saving...
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="flex items-center text-green-600">
              <Check className="w-3 h-3 mr-1" />
              {lastSaved && formatLastSaved()}
            </div>
          )}
          {saveStatus === "unsaved" && <div className="text-amber-500">Unsaved changes</div>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || externalIsSubmitting}
          className="rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-4 py-2 transition-all duration-200 text-sm"
          onClick={(e) => handleSubmit(e, true)}
        >
          {isSubmitting || externalIsSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  )
}

export default ProductForm
