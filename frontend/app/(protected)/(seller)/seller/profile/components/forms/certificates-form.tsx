"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Eye, Upload, X, Plus } from "lucide-react"

type CertificatesFormProps = {
  formState: any
  onAddCertificate: () => void
  onRemoveCertificate: (certificateId: string) => void
  isSaving: boolean
}

const CertificatesForm = ({ formState, onAddCertificate, onRemoveCertificate, isSaving }: CertificatesFormProps) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Existing Certificates */}
      {formState.certificates.map((certificate: any) => (
        <div key={certificate.id}>
          <div className="flex items-center mb-4 font-semibold">
            <h3 className="text-sm">{certificate.title}</h3>
            <span className="text-red-500 ml-0.5">*</span>
          </div>
          <div className="relative">
            <div className="border rounded-lg p-4 bg-white mb-4">
              <div className="flex items-start">
                <div className="bg-gray-100 w-24 h-32 rounded-lg flex-shrink-0">
                  {certificate.thumbnailUrl && (
                    <img
                      src={certificate.thumbnailUrl || "/placeholder.svg"}
                      alt={certificate.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="flex-grow min-w-0 ml-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{certificate.title}</p>
                      <p className="text-sm text-gray-500">{certificate.filename}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 -mt-1 -mr-2">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Upload className="w-4 h-4 mr-2" />
                  Change
                </Button>
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
                Status: {certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Add Certificate Button */}
      <div className="col-span-full mt-4">
        <Button onClick={onAddCertificate} disabled={isSaving}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </Button>
      </div>
    </div>
  )
}

export default CertificatesForm

