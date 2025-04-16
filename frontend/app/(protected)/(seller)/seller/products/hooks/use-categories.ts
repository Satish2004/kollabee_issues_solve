"use client"

import { useState, useEffect } from "react"
import { categoryApi } from "@/lib/api/category"

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true)
        setError(null)
        const response: any = await categoryApi.getAll()

        if (response && Array.isArray(response.data)) {
          setCategories(response.data)
        } else {
          console.error("Invalid categories response format:", response)
          setCategories([])
        }
      } catch (err) {
        console.error("Failed to load categories:", err)
        setError(err instanceof Error ? err : new Error("Failed to load categories"))
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  return { categories, isLoading, error }
}
