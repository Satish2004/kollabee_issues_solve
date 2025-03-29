"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Eye, Upload, X, Plus } from "lucide-react"

type Certificate = {
  id: string
  title: string
  filename: string
  thumbnailUrl?: string
  fileUrl?: string
  status: "completed" | "pending" | "rejected"
  uploadDate?: string
  expiryDate?: string | null
  issuer?: string
  approved?: boolean
  verificationCode?: string | null
}

type CertificatesFormProps = {
  formState: {
    certificates: Certificate[]
  }
  onAddCertificate: () => void
  onRemoveCertificate: (certificateId: string) => void
  isSaving: boolean
}

const CertificatesForm = ({ formState, onAddCertificate, onRemoveCertificate, isSaving }: CertificatesFormProps) => {
  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  console.log(formState)

  return (
    <>
          <div className="w-full flex justify-end">
        <Button onClick={onAddCertificate} disabled={isSaving} className="bg-zinc-900 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </Button>
      </div>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Existing Certificates */}
      {formState.certificates.map((certificate) => (
        <div key={certificate.id}>
          <div className="relative">
            <div className="border rounded-lg p-4 bg-white mb-4">
              <div className="flex items-start">
                <div className="bg-gray-100 w-24 h-32 rounded-lg flex-shrink-0">
                  {certificate.image && (
                    <img
                      src={certificate.image || "/placeholder.svg"}
                      alt={certificate.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="flex-grow min-w-0 ml-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-xl">{certificate.name}</p>
                      <p className="text-sm text-gray-500">{certificate.filename}</p>
                      {certificate.issuerName && <p className="text-xs text-gray-500 mt-1">Issued By: {certificate.issuerName}</p>}
                      {certificate.createdAt && (
                        <p className="text-xs text-gray-500">Uploaded: {formatDate(certificate.createdAt)}</p>
                      )}
                      {certificate.expiryDate && (
                        <p className="text-xs text-gray-500">Expires: {formatDate(certificate.expiryDate)}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -mt-1 -mr-2"
                      onClick={() => {
                        if (certificate.image) {
                          window.open(certificate.image, "_blank")
                        }
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {/* <Button variant="outline" size="sm" className="h-8">
                  <Upload className="w-4 h-4 mr-2" />
                  Change
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-red-500 hover:text-red-700"
                  onClick={() => onRemoveCertificate(certificate.id)}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
              <span
                className={cn(
                  "text-sm",
                  certificate.status === "completed"
                    ? "text-green-600"
                    : certificate.status === "pending"
                      ? "text-orange-500"
                      : certificate.status === "rejected"
                        ? "text-red-500"
                        : "",
                )}
              >
                Status: {certificate.approved ? <span className="text-green-500 font-semibold">Approved</span> : <span className="text-yellow-500 font-semibold" >Pending</span>}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Add Certificate Button */}

    </div>
    </>
  )
}

export default CertificatesForm

