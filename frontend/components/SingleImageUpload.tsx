"use client"

import type React from "react"
import { useState, type ChangeEvent, useRef } from "react"
import Image from "next/image"
import { Box, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type SingleImageUploadProps = {
  label: string
  imageFile: File | string | null
  setImageFile: (imageFile: File | null) => void
}

export default function SingleImageUpload({ label, imageFile, setImageFile }: SingleImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0])
    }
  }

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full mx-auto">
      <div
        className={`relative bg-gray-100 rounded-lg w-full h-80 overflow-hidden cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBoxClick}
      >
        <input
          type="file"
          id={label}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {imageFile ? (
          <Image
            src={typeof imageFile === "string" ? imageFile : URL.createObjectURL(imageFile)}
            alt="Preview"
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Box className="w-16 h-16 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click or drag and drop to upload an image</p>
          </div>
        )}
      </div>
      {imageFile && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm truncate flex-1">
            {typeof imageFile === "string" ? imageFile.split("/").pop() : imageFile.name}
          </p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setImageFile(null)} className="flex items-center">
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
            <Button variant="outline" size="sm" onClick={handleBoxClick} className="flex items-center">
              <Upload className="w-4 h-4 mr-1" />
              Change
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

