"use client"

import { useState } from "react"
import { toast } from "sonner"
import { productsApi } from "@/lib/api/products"

export function useImageUpload() {
  const [isLoading, setIsLoading] = useState(false)

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setIsLoading(true)
      const response = await productsApi.uploadImage(file)
      toast.success("Image uploaded successfully")
      return response?.url || null
    } catch (error) {
      toast.error("Failed to upload image")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = async (url: string): Promise<void> => {
    try {
      await productsApi.deleteImage(url)
      toast.success("Image removed successfully")
    } catch (error) {
      toast.error("Failed to remove image")
    }
  }

  return { uploadImage, removeImage, isLoading }
}
