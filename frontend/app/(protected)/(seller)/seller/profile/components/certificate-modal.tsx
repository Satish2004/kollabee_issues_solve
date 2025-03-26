"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"

type CertificateModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  newCertificate: { title: string; file: File | null }
  setNewCertificate: (certificate: { title: string; file: File | null }) => void
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Certificate</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="certificate-title">Certificate Title</Label>
            <Input
              id="certificate-title"
              value={newCertificate.title}
              onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
              placeholder="Enter certificate title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificate-file">Certificate File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="certificate-file"
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewCertificate({ ...newCertificate, file: e.target.files[0] })
                  }
                }}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                {newCertificate.file ? newCertificate.file.name : "Select file"}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isSaving || !newCertificate.title || !newCertificate.file}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CertificateModal

