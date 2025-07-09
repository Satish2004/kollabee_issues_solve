"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronLeft, FileText, Package, Wrench, CheckCircle, Clock } from "lucide-react"
import ShippingTimeline from "../../_component/shipping-timeline"
import { LiaShippingFastSolid } from "react-icons/lia"
import type { ManufacturingRequest } from "@/types/api"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ordersApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export default function ShippingDetailsPage() {
  const [manufacturingRequest, setManufacturingRequest] = useState<ManufacturingRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDetailsVisible, setIsDetailsVisible] = useState(true)
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  useEffect(() => {
    if (projectId) {
      fetchProjectData()
    }
  }, [projectId])

  const fetchProjectData = async () => {
    try {
      setIsLoading(true)

      // Fetch manufacturing requests
      const manufacturingResponse = await ordersApi.getManufactoringRequest()

      // Find the specific manufacturing request by projectId
      const matchingRequest = manufacturingResponse.find((request: ManufacturingRequest) => request.id === projectId)

      if (matchingRequest) {
        setManufacturingRequest(matchingRequest)
      } else {
        toast.error("Manufacturing project not found")
        router.push("/buyer/projects")
      }
    } catch (error) {
      console.error("Error fetching project data:", error)
      toast.error("Failed to load project data")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible)
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount)
  }

  const getManufacturingTimeline = (request: ManufacturingRequest) => {
    const project = request.rawData.project
    const createdDate = new Date(request.createdAt)
    const approvedDate = request.rawData.approvedAt ? new Date(request.rawData.approvedAt) : null
    const startDate = project.receiveDate ? new Date(project.receiveDate) : null
    const endDate = project.launchDate ? new Date(project.launchDate) : null

    return [
      {
        date: formatDate(request.createdAt),
        status: "Project Submitted",
        description: `Manufacturing request submitted`,
        completed: true,
        icon: <FileText className="w-4 h-4" />,
      },
      {
        date: approvedDate ? formatDate(approvedDate.toISOString()) : "-",
        status: "Request Approved",
        description: request.status === "APPROVED" ? "Project approved by manufacturer" : "Awaiting approval",
        completed: request.status === "APPROVED",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      {
        date: startDate && request.status === "APPROVED" ? formatDate(startDate.toISOString()) : "-",
        status: "Manufacturing Started",
        description:
          project.timelineStatus === "IN_TRANSIT" || project.timelineStatus === "COMPLETED"
            ? "Production has begun"
            : "Awaiting production start",
        completed: project.timelineStatus === "IN_TRANSIT" || project.timelineStatus === "COMPLETED",
        icon: <Wrench className="w-4 h-4" />,
      },
      {
        date: project.timelineStatus === "IN_TRANSIT" ? "In Progress" : "-",
        status: "Quality Control",
        description:
          project.timelineStatus === "IN_TRANSIT"
            ? "Product undergoing quality checks"
            : "Pending manufacturing completion",
        completed: false,
        icon: <Package className="w-4 h-4" />,
      },
      {
        date: endDate && project.timelineStatus === "COMPLETED" ? formatDate(endDate.toISOString()) : "-",
        status: "Ready for Delivery",
        description:
          project.timelineStatus === "COMPLETED" ? "Product ready for shipment" : "Estimated completion date",
        completed: project.timelineStatus === "COMPLETED",
        icon: <LiaShippingFastSolid className="w-4 h-4" />,
      },
    ]
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-100 p-4 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  if (!manufacturingRequest) {
    return (
      <div className="h-screen bg-gray-100 p-4 w-full">
        <div className="bg-white p-4 mb-8 h-16 rounded-lg shadow-sm">
          <Link href="/buyer/projects" className="inline-flex items-center text-rose-600 font-medium">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center py-12">
          <h2 className="text-xl font-semibold mb-4">Project Not Found</h2>
          <p className="text-gray-600">
            The manufacturing project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  const project = manufacturingRequest.rawData.project
  const buyer = manufacturingRequest.rawData.buyer
  const timelineItems = getManufacturingTimeline(manufacturingRequest)

  return (
    <div className="h-screen bg-gray-100 p-4 w-full overflow-y-auto">
      {/* Back button */}
      <div className="bg-white p-4 mb-8 h-16 rounded-lg shadow-sm">
        <Link href="/buyer/projects" className="inline-flex items-center text-rose-600 font-medium">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Main content */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{project.projectTitle || manufacturingRequest.productName}</h1>
            <p className="text-gray-600">Project ID: {projectId}</p>
          </div>
          <div className="text-right">
            {getStatusBadge(manufacturingRequest.status)}
            <p className="text-sm text-gray-500 mt-1">Created: {formatDate(manufacturingRequest.createdAt)}</p>
          </div>
        </div>

        {/* Status section with clickable dropdown */}
        <div
          className="bg-gray-50 p-4 rounded-md mb-6 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={toggleDetails}
        >
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-gray-600 mr-2">Timeline Status:</span>
            <Badge
              className={
                project.timelineStatus === "IN_TRANSIT"
                  ? "bg-blue-100 text-blue-800"
                  : project.timelineStatus === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
              }
            >
              {project.timelineStatus?.replace("_", " ") || "Pending"}
            </Badge>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isDetailsVisible ? "transform rotate-180" : ""
              }`}
          />
        </div>
       
        {/* Content that can be toggled */}
        {isDetailsVisible && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Project Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Project Details
              </h2>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-36 text-gray-600">Request Date:</div>
                  <div className="font-medium">{formatDate(manufacturingRequest.createdAt)}</div>
                </div>
                <div className="flex">
                  <div className="w-36 text-gray-600">Budget:</div>
                  <div className="font-medium">{formatCurrency(project.budget, project.pricingCurrency)}</div>
                </div>
                <div className="flex">
                  <div className="w-36 text-gray-600">Quantity:</div>
                  <div className="font-medium">{project.quantity || manufacturingRequest.quantity} units</div>
                </div>
                <div className="flex">
                  <div className="w-36 text-gray-600">Categories:</div>
                  <div className="flex flex-wrap gap-1">
                    {project.projectCategoies?.map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    )) || (
                        <Badge variant="outline" className="text-xs">
                          {manufacturingRequest.category}
                        </Badge>
                      )}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-36 text-gray-600">Description:</div>
                  <div className="font-medium">{project.productDescription || "N/A"}</div>
                </div>
                {project.additionalDetails && (
                  <div className="flex">
                    <div className="w-36 text-gray-600">Additional Details:</div>
                    <div className="font-medium">{project.additionalDetails}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Specifications */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Product Specifications
              </h2>
              <div className="space-y-4">
                {project.formulationType && (
                  <div className="flex">
                    <div className="w-36 text-gray-600">Formulation:</div>
                    <div className="font-medium">{project.formulationType}</div>
                  </div>
                )}
                {project.targetBenefit && (
                  <div className="flex">
                    <div className="w-36 text-gray-600">Target Benefit:</div>
                    <div className="font-medium">{project.targetBenefit}</div>
                  </div>
                )}
                {project.packagingType && (
                  <div className="flex">
                    <div className="w-36 text-gray-600">Packaging:</div>
                    <div className="font-medium">{project.packagingType}</div>
                  </div>
                )}
                {project.materialPreferences && (
                  <div className="flex">
                    <div className="w-36 text-gray-600">Materials:</div>
                    <div className="font-medium">{project.materialPreferences}</div>
                  </div>
                )}
                {project.certifications && project.certifications.length > 0 && (
                  <div className="flex">
                    <div className="w-36 text-gray-600">Certifications:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {project.supplierLocation && (
                  <div className="flex">
                    <div className="w-36 text-gray-600">Supplier Location:</div>
                    <div className="font-medium">{project.supplierLocation}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Project Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-600">Expected Start Date:</div>
                  <div className="font-medium">{project.receiveDate ? formatDate(project.receiveDate) : "TBD"}</div>
                </div>
                <div>
                  <div className="text-gray-600">Expected Completion:</div>
                  <div className="font-medium">{project.launchDate ? formatDate(project.launchDate) : "TBD"}</div>
                </div>
                {project.timelineUpdatedAt && (
                  <div>
                    <div className="text-gray-600">Last Updated:</div>
                    <div className="font-medium">{formatDate(project.timelineUpdatedAt)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Buyer Information */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Buyer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <div className="text-gray-600">Name:</div>
                  <div className="font-medium">{buyer.user.name || manufacturingRequest.buyerName}</div>
                </div>
                <div>
                  <div className="text-gray-600">Company:</div>
                  <div className="font-medium">{buyer.user.companyName || "N/A"}</div>
                </div>
                <div>
                  <div className="text-gray-600">Email:</div>
                  <div className="font-medium">{buyer.user.email}</div>
                </div>
                <div>
                  <div className="text-gray-600">Phone:</div>
                  <div className="font-medium">{buyer.user.phoneNumber || "N/A"}</div>
                </div>
                <div>
                  <div className="text-gray-600">Location:</div>
                  <div className="font-medium">
                    {[buyer.user.address, buyer.user.state, buyer.user.country].filter(Boolean).join(", ") || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Manufacturing Timeline
          </h2>
          <ShippingTimeline items={timelineItems} />
        </div>
      </div>
    </div>
  )
}
