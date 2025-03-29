"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type CertificateData = {
  name: string
  file: File | null
  issuerName: string
  expiryDate?: Date | null
}

type CertificateModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  newCertificate: CertificateData
  setNewCertificate: (certificate: CertificateData) => void
  handleUpload: () => Promise<void>
  isSaving: boolean
}

const CertificateModal = ({
  open,
  setOpen,
  newCertificate,
  setNewCertificate,
  handleUpload,
  isSaving,
}: CertificateModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Allowed file types
  const allowedFileTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/gif"]

  // File extensions for display
  const allowedExtensions = ".pdf, .jpg, .jpeg, .png, .gif"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file type
      if (!allowedFileTypes.includes(file.type)) {
        setFileError(`Invalid file type. Please upload ${allowedExtensions}`)
        return
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size exceeds 5MB limit")
        return
      }

      setNewCertificate({ ...newCertificate, image: file })
    }
  }

  const isFormValid = () => {
    return (
      newCertificate.name.trim() !== "" &&
      newCertificate.issuerName.trim() !== "" &&
      newCertificate.file !== null &&
      !fileError
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Upload Certificate</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Certificate Title */}
          <div className="space-y-2">
            <Label htmlFor="certificate-title">
              Certificate Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="certificate-title"
              value={newCertificate.name}
              onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
              placeholder="Enter certificate title"
            />
          </div>

          {/* Issuer Organization */}
          <div className="space-y-2">
            <Label htmlFor="certificate-issuer">
              Issuer Organization <span className="text-red-500">*</span>
            </Label>
            <Input
              id="certificate-issuer"
              value={newCertificate.issuerName}
              onChange={(e) => setNewCertificate({ ...newCertificate, issuerName: e.target.value })}
              placeholder="Enter issuing organization name"
            />
          </div>

          {/* Expiry Date */}
          {/* <div className="space-y-2">
            <Label htmlFor="certificate-expiry">Expiry Date (if applicable)</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newCertificate.expiryDate && "text-muted-foreground",
                  )}
                >
                  {newCertificate.expiryDate ? format(newCertificate.expiryDate, "PPP") : "Select expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={newCertificate.expiryDate || undefined}
                  onSelect={(date) => {
                    setNewCertificate({ ...newCertificate, expiryDate: date })
                    setCalendarOpen(false)
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {newCertificate.expiryDate && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={() => setNewCertificate({ ...newCertificate, expiryDate: null })}
              >
                Clear date
              </Button>
            )}
          </div> */}

          {/* Certificate File */}
          <div className="space-y-2">
            <Label htmlFor="certificate-file">
              Certificate File <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="certificate-file"
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={allowedExtensions}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                {newCertificate.file ? newCertificate.file.name : "Select file"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Accepted formats: {allowedExtensions} (Max size: 5MB)</p>

            {fileError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="gradient-border gradient-text font-semibold">
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isSaving || !isFormValid()} className="button-bg text-white">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CertificateModal

