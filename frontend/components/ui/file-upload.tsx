"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, AlertCircle } from "lucide-react";

interface FileUploadProps {
  accept: string;
  maxSize: number;
  maxFiles?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  uploadProgress?: number;
  error?: string;
  className?: string;
  buttonText?: string;
  description?: string;
  isUploading?: boolean;
}

export function FileUpload({
  accept,
  maxSize,
  maxFiles = 1,
  multiple = false,
  onUpload,
  uploadProgress,
  error,
  className = "",
  buttonText = "Upload File",
  description,
  isUploading = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      await onUpload(files);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).slice(0, maxFiles);
      await onUpload(files);

      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-md p-6 ${
        dragActive ? "border-[#a11770] bg-[#a11770]/5" : "border-gray-300"
      } ${className}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center text-center">
        {isUploading ? (
          <Upload className="h-10 w-10 text-gray-400 mb-2 animate-pulse" />
        ) : (
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
        )}

        <p className="text-sm font-medium mb-1">{buttonText}</p>
        {description && (
          <p className="text-xs text-gray-500 mb-2">{description}</p>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="mt-2"
        >
          {isUploading ? "Uploading..." : "Select File"}
        </Button>

        <p className="text-xs text-gray-500 mt-2">
          {multiple ? `Up to ${maxFiles} files` : "One file"}, max {maxSize}MB
          <br />
          Drag & drop or click to browse
        </p>
      </div>

      {uploadProgress !== undefined && (
        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-xs">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-3">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
