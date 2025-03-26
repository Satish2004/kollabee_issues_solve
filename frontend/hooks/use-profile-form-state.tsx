"use client"

import { useState } from "react"
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

  // Get default form state for a section
  const getDefaultFormState = (sectionId: string) => {
    switch (sectionId) {
      case "categories":
        return {
          apparel: {
            clothing: [],
            footwear: [],
            jewelry: [],
            designServices: [],
          },
          food: {
            other: "",
          },
          motherBaby: [],
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
          customLocation: "",
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
          quantity: "",
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

  // Load data for a specific section
  const loadSectionData = async (sectionId: string) => {
    if (formStates[sectionId] !== null) return // Already loaded

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

      if (response) {
        const newFormState = response.data || getDefaultFormState(sectionId)

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

