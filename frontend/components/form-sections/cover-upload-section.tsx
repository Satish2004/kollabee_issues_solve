"use client"

import { Upload, Loader2 } from "lucide-react"
import { useImageUpload } from "../../hooks/use-image-upload"

interface CoverUploadSectionProps {
  coverImage: string | null
  onImageChange: (url: string | null) => void
}

export function CoverUploadSection({ coverImage, onImageChange }: CoverUploadSectionProps) {
  const { uploadImage, isLoading, removeImage } = useImageUpload()

  const handleUpload = async (file: File) => {
    const url = await uploadImage(file)
    if (url) onImageChange(url)
  }

  const handleRemove = async () => {
    if (coverImage) {
      await removeImage(coverImage)
      onImageChange(null)
    }
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Upload cover</h2>
      <p className="text-gray-600 mb-4 text-sm">Upload the art cover to capture your audience's attention</p>

      <div className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center">
        {coverImage ? (
          <div className="relative">
            <img src={coverImage || "/placeholder.svg"} alt="Cover preview" className="max-h-48 sm:max-h-64 mx-auto" />
          </div>
        ) : (
          <div>
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
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
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
              }}
              className="hidden"
              id="cover-upload"
            />
            <label
              htmlFor="cover-upload"
              className="inline-block rounded-[6px] border border-[#9e1171] bg-clip-text text-transparent bg-gradient-to-r from-[#9e1171] to-[#f0b168] px-4 sm:px-6 py-2 transition-all duration-200 text-sm cursor-pointer"
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
            onClick={handleRemove}
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
  )
}
