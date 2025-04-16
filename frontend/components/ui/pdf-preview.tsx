"use client";

import type React from "react";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFPreviewProps {
  url: string;
  width?: number;
  height?: number;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
  url,
  width = 150,
  height = 128,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF");
    setLoading(false);
  }

  return (
    <div
      className="flex items-center justify-center bg-gray-50 rounded-md overflow-hidden"
      style={{ width: width, height: height }}
    >
      {loading && (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" />
          <span className="text-xs text-gray-500">Loading PDF...</span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center text-center p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500 mb-2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M9 15h6"></path>
            <path d="M9 11h6"></path>
          </svg>
          <span className="text-xs text-gray-500">PDF Preview Unavailable</span>
        </div>
      )}

      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading=""
        className={loading || error ? "hidden" : ""}
      >
        <Page
          pageNumber={1}
          width={width}
          height={height}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="pdf-page"
        />
      </Document>
    </div>
  );
};

export default PDFPreview;
