"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrls: string[];
  initialIndex: number;
}

export default function MediaViewer({
  isOpen,
  onClose,
  mediaUrls,
  initialIndex = 0,
}: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const currentUrl = mediaUrls[currentIndex];
  const fileExt = currentUrl?.split(".").pop()?.toLowerCase() || "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExt);
  const isVideo = ["mp4", "webm", "ogg"].includes(fileExt);
  const fileName = currentUrl?.split("/").pop() || "file";

  const handleDownload = async () => {
    if (!currentUrl) return;

    setIsDownloading(true);

    try {
      // Show loading toast
      toast({
        title: "Downloading...",
        description: `Downloading ${fileName}`,
      });

      // Fetch the file from the CDN
      const response = await fetch(currentUrl);

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);

      toast({
        title: "Download complete",
        description: `${fileName} has been downloaded successfully`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description:
          error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowRight":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrevious();
          break;
        case "Escape":
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || mediaUrls.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`p-0 max-w-5xl ${
          isFullscreen
            ? "fixed inset-0 max-w-none w-screen h-screen rounded-none"
            : ""
        }`}
      >
        <DialogTitle className="sr-only">
          {isImage ? "Image" : isVideo ? "Video" : "File"}: {fileName}
        </DialogTitle>

        <div className="relative flex bg-white flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-sm font-medium truncate max-w-[200px]">
              {fileName}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                disabled={isDownloading}
                aria-label="Download file"
              >
                <Download
                  className={`h-4 w-4 ${isDownloading ? "animate-pulse" : ""}`}
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                aria-label="Close viewer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Media Content */}
          <div
            className="flex-1 flex items-center justify-center bg-black/90 relative overflow-hidden"
            style={{ minHeight: "60vh" }}
          >
            {isImage ? (
              <img
                src={currentUrl || "/placeholder.svg"}
                alt={fileName}
                className="max-h-full max-w-full object-contain"
                onClick={toggleFullscreen}
              />
            ) : isVideo ? (
              <video
                src={currentUrl}
                controls
                autoPlay
                className="max-h-full max-w-full"
                aria-label={`Video: ${fileName}`}
              />
            ) : (
              <div className="text-white flex flex-col items-center justify-center">
                <p className="mb-4">This file type cannot be previewed</p>
                <Button onClick={handleDownload} disabled={isDownloading}>
                  {isDownloading ? "Downloading..." : "Download File"}
                </Button>
              </div>
            )}

            {/* Navigation Controls */}
            {mediaUrls.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 z-15 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
                  onClick={handlePrevious}
                  aria-label="Previous media"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 z-100 top-1/2 transform -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
                  onClick={handleNext}
                  aria-label="Next media"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>

          {/* Footer */}
          {mediaUrls.length > 1 && (
            <div className="p-2 border-t flex justify-center items-center bg-white">
              <div className="text-sm text-gray-500">
                {currentIndex + 1} of {mediaUrls.length}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
