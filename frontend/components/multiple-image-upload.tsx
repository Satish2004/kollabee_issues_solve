import { ChangeEvent } from "react";
import Image from "next/image";

type MultipleImageUploadsProps = {
    label: string;
    images: (File|string|null)[];
    setImages: (images: (File|string|null)[]) => void;
}

export default function MultipleImageUploads({ images, setImages} : MultipleImageUploadsProps) {

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setImages([...images, ...uploadedFiles]);
    }
  };

  // Remove an image
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Upload Images</h2>
      <div className="flex gap-4 items-start">
        {/* Add button */}
        <label className="w-24 h-24 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer rounded">
          <span className="text-gray-500 text-2xl">+</span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Uploaded images */}
        <div className="flex gap-2 flex-wrap">
          {images.map((image, index) => image && (
            <div
              key={index}
              className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden shadow"
            >
              {/* Image preview */}
              <Image
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
              {/* Remove button */}
              <button
                className="absolute top-1 right-1 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
