"use client";

import type React from "react";

import { memo, useRef } from "react";
import { User, Loader2 } from "lucide-react";

interface ProfileImageProps {
  imageUrl: string;
  isLoading: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
}

const ProfileImage = memo(
  ({
    imageUrl,
    isLoading,
    onImageChange,
    onDeleteImage,
  }: ProfileImageProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="flex flex-col items-center space-y-4 border border-[#e4e7eb] rounded-lg p-4 h-full">
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center w-96 h-96">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Profile"
              className="w-96 h-96 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center w-96 h-96">
              <User className="w-10 h-10 text-red-400" />
            </div>
          )}
          <div className="mt-4 text-center text-[11px] text-gray-500">
            Format: PNG, JPEG Size: 2MB
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <button className="flex items-center text-red-500 hover:text-red-600">
              <span
                className="underline"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                {imageUrl ? "Change" : "Upload"}
              </span>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={onImageChange}
              />
            </button>
            <button className="flex items-center text-red-500 hover:text-red-600">
              <span className="underline" onClick={onDeleteImage}>
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ProfileImage.displayName = "ProfileImage";

export default ProfileImage;
