"use client"

import { useState } from "react"

import { useEffect, useRef, useCallback } from "react"
import { debounce } from "../utils/debounce"
import type { ProductFormData } from "../types/product-form"

export function useAutoSave(
  formData: ProductFormData,
  mode: "create" | "edit" | "view",
  onSave?: (data: ProductFormData) => Promise<void>,
) {
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const isFirstRender = useRef(true)

  const saveChanges = useCallback(
    debounce(async () => {
      if (mode === "view") return

      setSaveStatus("saving")
      try {
        if (onSave) {
          await onSave(formData)
        } else {
          // Save to localStorage for create mode
          localStorage.setItem(
            "productDraft",
            JSON.stringify({
              formData,
              lastSaved: new Date().toISOString(),
            }),
          )
        }
        setSaveStatus("saved")
        setLastSaved(new Date())
      } catch (error) {
        setSaveStatus("unsaved")
        console.error("Auto-save failed:", error)
      }
    }, 1000),
    [formData, mode, onSave],
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    setSaveStatus("unsaved")
    saveChanges()
  }, [formData, saveChanges])

  return { saveStatus, lastSaved }
}
