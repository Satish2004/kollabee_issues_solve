"use client"

import { useRef, useState } from "react"
import { profileApi } from "@/lib/api/profile"
import { toast } from "sonner"

type Step = {
  id: string
  label: string
}

type ProfileFormProps = {
  steps: Step[]
  setIsSaving: (value: boolean) => void
  setSectionLoading: (value: string | null) => void
}

const exampleCertificatesResponse = {
  data: {
    certificates: [
      {
        id: "cert-123",
        title: "ISO 9001 Certification",
        filename: "iso-9001-2023.pdf",
        thumbnailUrl: "https://example.com/thumbnails/iso-9001.png",
        fileUrl: "https://example.com/certificates/iso-9001-2023.pdf",
        status: "completed", // Status can be: "completed", "pending", "rejected"
        uploadDate: "2023-05-15T10:30:00Z",
        expiryDate: "2026-05-15T00:00:00Z",
        issuer: "International Organization for Standardization",
        verificationCode: "ISO-9001-ABC-123456",
      },
      {
        id: "cert-456",
        title: "Fair Trade Certification",
        filename: "fair-trade-certificate.pdf",
        thumbnailUrl: "https://example.com/thumbnails/fair-trade.png",
        fileUrl: "https://example.com/certificates/fair-trade-certificate.pdf",
        status: "completed",
        uploadDate: "2023-08-22T14:15:00Z",
        expiryDate: "2025-08-22T00:00:00Z",
        issuer: "Fair Trade International",
        verificationCode: "FT-2023-XYZ-789012",
      },
      {
        id: "cert-789",
        title: "Organic Product Certification",
        filename: "organic-cert-2023.pdf",
        thumbnailUrl: "https://example.com/thumbnails/organic.png",
        fileUrl: "https://example.com/certificates/organic-cert-2023.pdf",
        status: "pending", // Still being verified
        uploadDate: "2023-11-05T09:45:00Z",
        expiryDate: null,
        issuer: "Global Organic Certification Agency",
        verificationCode: null, // Not yet verified
      },
    ],
  },
}

export function useProfileFormState({ steps, setIsSaving, setSectionLoading }: ProfileFormProps) {
  const [formStates, setFormStates] = useState<Record<string, any>>({
    categories: null,
    "production-services": null,
    "production-managed": null,
    "production-manufactured": null,
    "business-capabilities": null,
    "target-audience": null,
    "team-size": null,
    "annual-revenue": null,
    "minimum-order": null,
    "comments-notes": null,
    certificates: null,
  })

  const [originalFormStates, setOriginalFormStates] = useState<Record<string, any>>({})

  // useRef to track loading state of sections to prevent duplicate API calls
  const sectionLoadingRef = useRef<string[]>([])

  // Get default form state for a section
  const getDefaultFormState = (sectionId: string) => {
    switch (sectionId) {
      case "categories":
        return {
          selectedCategories: [],
          subcategories: {},
        }
      case "production-services":
        return {
          services: [],
        }
      case "production-managed":
        return {
          managementType: "",
        }
      case "production-manufactured":
        return {
          locations: [],
        }
      case "business-capabilities":
        return {
          capabilities: [],
        }
      case "target-audience":
        return {
          audiences: [],
        }
      case "team-size":
        return {
          size: "",
        }
      case "annual-revenue":
        return {
          revenue: "",
        }
      case "minimum-order":
        return {
          minimumOrderQuantity: "",
        }
      case "comments-notes":
        return {
          notes: "",
        }
      case "certificates":
        return {
          certificates: [],
        }
      default:
        return {}
    }
  }

  const loadSectionData = async (sectionId: string) => {
    // If data is already loaded or a request is in progress, don't make another call
    if (formStates[sectionId] !== null || sectionLoadingRef.current.includes(sectionId)) return

    // Add this section to the loading tracker
    sectionLoadingRef.current = [...sectionLoadingRef.current, sectionId]

    setSectionLoading(sectionId)
    try {
      let response: any

      switch (sectionId) {
        case "categories":
          response = await profileApi.getCategories()
          break
        case "production-services":
          response = await profileApi.getProductionServices()
          break
        case "production-managed":
          response = await profileApi.getProductionManagement()
          break
        case "production-manufactured":
          response = await profileApi.getManufacturingLocations()
          break
        case "business-capabilities":
          response = await profileApi.getBusinessCapabilities()
          break
        case "target-audience":
          response = await profileApi.getTargetAudience()
          break
        case "team-size":
          response = await profileApi.getTeamSize()
          break
        case "annual-revenue":
          response = await profileApi.getAnnualRevenue()
          break
        case "minimum-order":
          response = await profileApi.getMinimumOrder()
          break
        case "comments-notes":
          response = await profileApi.getCommentsNotes()
          break
        case "certificates":
          response = await profileApi.getCertificates()
          break
        default:
          break
      }

        console.log("Response: ", response)
      if (response) {
        const newFormState = response || getDefaultFormState(sectionId)

        setFormStates((prev) => ({
          ...prev,
          [sectionId]: newFormState,
        }))

        setOriginalFormStates((prev) => ({
          ...prev,
          [sectionId]: JSON.parse(JSON.stringify(newFormState)), // Deep copy
        }))
      }
    } catch (error) {
      console.error(`Error loading ${sectionId} data:`, error)
      toast.error(`Failed to load ${sectionId.replace("-", " ")} data`)

      // Set default state on error
      const defaultState = getDefaultFormState(sectionId)
      setFormStates((prev) => ({
        ...prev,
        [sectionId]: defaultState,
      }))
      setOriginalFormStates((prev) => ({
        ...prev,
        [sectionId]: JSON.parse(JSON.stringify(defaultState)),
      }))
    } finally {
      sectionLoadingRef.current = sectionLoadingRef.current.filter((id) => id !== sectionId)
      setSectionLoading(null)
    }
  }

  // Handle form changes
  const handleFormChange = (sectionId: string, newValue: any) => {
    setFormStates((prev) => ({
      ...prev,
      [sectionId]: newValue,
    }))
  }

  // Check if form has changes
  const hasFormChanges = (sectionId: string) => {
    if (!formStates[sectionId] || !originalFormStates[sectionId]) return false

    return JSON.stringify(formStates[sectionId]) !== JSON.stringify(originalFormStates[sectionId])
  }

  // Handle section updates
  const handleSectionUpdate = async (sectionId: string) => {
    if (!hasFormChanges(sectionId)) {
      toast.info("No changes to save")
      return
    }

    setIsSaving(true)
    try {
      let response: any
      const data = formStates[sectionId]

      switch (sectionId) {
        case "categories":
          response = await profileApi.updateCategories(data)
          break
        case "production-services":
          response = await profileApi.updateProductionServices(data)
          break
        case "production-managed":
          response = await profileApi.updateProductionManagement(data)
          break
        case "production-manufactured":
          response = await profileApi.updateManufacturingLocations(data)
          break
        case "business-capabilities":
          response = await profileApi.updateBusinessCapabilities(data)
          break
        case "target-audience":
          response = await profileApi.updateTargetAudience(data)
          break
        case "team-size":
          response = await profileApi.updateTeamSize(data)
          break
        case "annual-revenue":
          response = await profileApi.updateAnnualRevenue(data)
          break
        case "minimum-order":
          response = await profileApi.updateMinimumOrder(data)
          break
        case "comments-notes":
          response = await profileApi.updateCommentsNotes(data)
          break
        case "certificates":
          // Certificate updates are handled separately
          break
      }

      if (response) {
        // Update original form state to match current state
        setOriginalFormStates((prev) => ({
          ...prev,
          [sectionId]: JSON.parse(JSON.stringify(formStates[sectionId])),
        }))

        toast.success(`${sectionId.replace(/-/g, " ")} updated successfully`)
      }
    } catch (error) {
      console.error(`Error updating ${sectionId}:`, error)
      toast.error(`Failed to update ${sectionId.replace(/-/g, " ")}`)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    formStates,
    originalFormStates,
    loadSectionData,
    handleFormChange,
    hasFormChanges,
    handleSectionUpdate,
  }
}

