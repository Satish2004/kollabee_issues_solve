"use client"
import React,{ useState, useEffect } from "react"
import { format } from "date-fns"
import { authApi } from "@/lib/api/auth"
import { profileApi } from "@/lib/api/profile"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { title } from "process"

const KollaBeeProfile = () => {
  const [activeTab, setActiveTab] = useState<any>("categories")
  const [activeSection, setActiveSection] = useState(null)
  const [profileData, setProfileData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: "categories", label: "Categories" },
    { id: "production-services", label: "Production Services" },
    { id: "production-managed", label: "Production Managed" },
    { id: "production-manufactured", label: "Production Manufactured" },
    { id: "business-capabilities", label: "Business Capabilities" },
    { id: "target-audience", label: "Target Audience" },
    { id: "team-size", label: "Team Size" },
    { id: "annual-revenue", label: "Annual Revenue" },
    { id: "minimum-order", label: "Minimum Order Quantity" },
    { id: "comments-notes", label: "Comments & Notes" },
    { id: "certificates", label: "Certificates" },
  ]

  const sections: any = {
    categories: {
      title: "Define Your Categories",
      description: "Provide details about your business's unique attributes, subcategories, and target audience.",
    },
    "production-services": {
      title: "What Production Services Does Your Business Offer?",
      description: "Provide details about your business's unique attributes, subcategories, and target audience.",
    },
    "production-managed": {
      title: "How Is Your Production Managed?",
      description: "Provide insights into your production management to help buyers understand your capabilities.",
    },
    "production-manufactured": {
      title: "Where Are Your Products Manufactured?",
      description: "Specify your primary manufacturing locations to help buyers understand your production footprint",
    },
    "business-capabilities": {
      title: "Business Capabilities",
      description: "Match with the right buyers by selecting the category that best describes your business.",
    },
    "target-audience": {
      title: "Target Audience",
      description: "Choose the type of buyers you are looking to connect with. This helps us refine your experience",
    },
    "team-size": {
      title: "Team Size",
      description: "How many people work in the Company?",
    },
    "annual-revenue": {
      title: "Annual Revenue",
      description: "Help us to match your suitable suppliers",
    },
    "minimum-order": {
      title: "Minimum Order Quantity",
      description: "Set MOQs based on your production capabilities to help us connect you with the most appropriate clients.",
    },
    "comments-notes": {
      title: "Comments & Notes",
      description: "Share key details such as preferred proiect types, unique capabilities, or scheduling preferences to better match requests to your offering",
    },
    "certificates": {
      title: "",
      description: "",
    }
  }

  const toggleSection = (sectionId: any) => {
    if (activeSection === sectionId) {
      setActiveSection(null)
    } else {
      setActiveSection(sectionId)
    }
  }

  // Fetch initial profile data
  useEffect(() => {
    const getUser = async () => {
      const user = await authApi.getCurrentUser()
      setProfileData(user)
      setIsLoading(false)
    }
    getUser()

  }, [])

  // Handle section updates
  const handleSectionUpdate = async (section: string, data: any) => {
    setIsSaving(true)
    try {
      let response: any
      switch (section) {
        case "categories":
          response = await profileApi.updateCategories(data)
          break
        case "production-services":
          response = await profileApi.updateProductionServices(data)
          break
        case "production-managed":
          response = await profileApi.updateProductionManagement(data)
          break
        case "production-manufactured":
          response = await profileApi.updateManufacturingLocations(data)
          break
        case "business-capabilities":
          response = await profileApi.updateBusinessCapabilities(data)
          break
        case "target-audience":
          response = await profileApi.updateTargetAudience(data)
          break
        // Add other cases for remaining sections
      }

      setProfileData((prev: any) => ({
        ...prev,
        [section]: response.data,
      }))
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  // Content for each section
  const renderSectionContent = () => {
    // ifcons (isLoading) {
    //   return <div>Loading...</div>;
    // }
console.log("aa")
    switch (activeTab) {
      case "categories":
        return (
          <div className="mt-4 bg-gray-50 p-6 rounded-md">
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-1">Business Type</h4>
              <p className="text-xs text-gray-500">Subcategories by category</p>
            </div>

            {/* Apparel & Accessories */}
            <div className="mb-8">
              <h4 className="text-base font-semibold mb-4">Apparel & Accessories</h4>

              <div className="mb-4">
                <p className="text-sm mb-2">Clothing</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Ready-to-Wear Apparel
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Custom Tailored Clothing
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">Activewear</span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Outerwear (Jackets, Coats, etc.)
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm mb-2">Footwear</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">Whole Sale</span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">White Label</span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Private Label
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Custom Product Development
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm mb-2">Jewelry</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Agriculture Inputs
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Baby & Children
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Beauty & Personal Care
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Business Services
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">Chemicals</span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Design Services
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Design Services
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm mb-2">Design Services</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Design Services
                  </span>
                </div>
              </div>
            </div>

            {/* Food & Beverages */}
            <div className="mb-8">
              <h4 className="text-base font-semibold mb-4">Food & Beverages</h4>

              <div className="mb-4">
                <p className="text-sm mb-2">Other</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Tinned & Processed Food
                  </span>
                  <span className="text-sm bg-gray-700 text-white px-3 py-1.5 rounded-md">Other</span>
                </div>
                <input
                  type="text"
                  placeholder="Type Here"
                  className="border border-gray-200 p-2 w-full rounded text-sm"
                />
              </div>
            </div>

            {/* Mother and Baby */}
            <div className="mb-8">
              <h4 className="text-base font-semibold mb-4">Mother and Baby Care</h4>
              <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Ready-to-Wear Apparel
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Custom Tailored Clothing
                  </span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">Activewear</span>
                  <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
                    Outerwear (Jackets, Coats, etc.)
                  </span>
                </div>
            </div>
          </div>
        )
        case "production-services":
          return (
            <div className="mt-4 bg-gray-50 p-6 rounded-md space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="text-gray-700 font-medium mb-1">Bulk Manufacturing</p>
                    <p className="text-gray-500 text-sm">
                      High-volume production designed to meet wholesale and distribution needs.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
      case "production-managed":
        return (
          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <input type="radio" name="production" className="mr-2" />
              <label className="text-sm">In-House Production</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="production" className="mr-2" />
              <label className="text-sm">Outsourced Production</label>
            </div>
            <div className="flex items-center">
              <input type="radio" name="production" className="mr-2" />
              <label className="text-sm">Hybrid Model (Both In-House and Outsourced)</label>
            </div>
          </div>
        )
      case "production-manufactured":
        return (
          <div className="mt-4">
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Location</p>
              <input type="text" placeholder="Text here..." className="border p-2 w-full rounded text-sm" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">India (City/State Optional)</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">USA (City/State Optional)</label>
              </div>
            </div>
          </div>
        )
      case "business-capabilities":
        return (
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Eco-Friendly Practices</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Vegan Products</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Organic Ingredients</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Small Batch Production</label>
            </div>
          </div>
        )
        case "target-audience":
          return (
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">Eco-Friendly Practices</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">Vegan Products</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">Organic Ingredients</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-sm">Small Batch Production</label>
              </div>
            </div>
          )
        case "team-size":
          return (
            <div className="flex flex-wrap gap-2">
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
             Just me
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              2 - 5
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              6 - 10
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              11 - 50
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">Chemicals</span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              51 - 200
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              200 - 500
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              500 - 2000
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              2000 +
            </span>
          </div>
          )
        case "annual-revenue":
          return (
            <div className="flex flex-wrap gap-2">
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
              No Revenue
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
            &lt; $100000
            </span>
            <span className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md">
            $100000 - $200000
            </span>
          </div>
          )
        case "minimum-order":
          return (
            <div className="mb-4">
                              <div className="flex items-center font-semibold">
                    <h3 className="text-sm">Enter Quantity</h3>
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
            <input
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 p-2 w-full rounded text-sm"
            />
          </div>
          )
        case "comments-notes":
          return (
            <div className="mb-4">
              <div className="flex items-center font-semibold">
                <h3 className="text-sm">Enter Notes</h3>
                <span className="text-red-500 ml-0.5">*</span>
              </div>
            <input
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 p-2 w-full rounded text-sm"
            />
          </div>
          )
          case "certificates":
            return (
              <div className="mt-4 grid grid-cols-2 gap-6">
                {/* Company Registration Certificate */}
                <div>
                  <div className="flex items-center mb-4 font-semibold">
                    <h3 className="text-sm">Company Registration Certificate Number</h3>
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="relative">
                    <div className="border rounded-lg p-4 bg-white mb-4">
                      <div className="flex items-start">
                        <div className="bg-gray-100 w-24 h-32 rounded-lg flex-shrink-0"></div>
                        <div className="flex-grow min-w-0 ml-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">RoHS</p>
                              <p className="text-sm text-gray-500">INSPECTION_REPORT_ZTS22061602HR...</p>
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
                      <Button variant="outline" size="sm" className="h-8">
                        <Upload className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                      <span className="text-green-600 text-sm">Status: Completed</span>
                    </div>
                  </div>
                </div>

                {/* Tax Identification Number */}
                <div>
                  <div className="flex items-center mb-4 font-semibold">
                    <h3 className="text-sm ">Tax Identification Number</h3>
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="relative">
                    <div className="border rounded-lg p-4 bg-white mb-4">
                      <div className="flex items-start">
                        <div className="bg-gray-100 w-24 h-32 rounded-lg flex-shrink-0"></div>
                        <div className="flex-grow min-w-0 ml-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">RoHS</p>
                              <p className="text-sm text-gray-500">INSPECTION_REPORT_ZTS22061602HR...</p>
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
                      <Button variant="outline" size="sm" className="h-8">
                        <Upload className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                      <span className="text-red-500 text-sm">Status: Pending</span>
                    </div>
                  </div>
                </div>

                {/* Trade License 1 */}
                <div>
                  <div className="flex items-center mb-4 font-semibold">
                    <h3 className="text-sm ">Trade License</h3>
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="relative">
                    <div className="border rounded-lg p-4 bg-white mb-4">
                      <div className="flex items-start">
                        <div className="bg-gray-100 w-24 h-32 rounded-lg flex-shrink-0"></div>
                        <div className="flex-grow min-w-0 ml-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">RoHS</p>
                              <p className="text-sm text-gray-500">INSPECTION_REPORT_ZTS22061602HR...</p>
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
                      <Button variant="outline" size="sm" className="h-8">
                        <Upload className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                      <span className="text-orange-500 text-sm">Status: Rejected</span>
                    </div>
                  </div>
                </div>

                {/* Trade License 2 */}
                <div>
                  <div className="flex items-center mb-4 font-semibold">
                    <h3 className="text-sm">Trade License</h3>
                    <span className="text-red-500 ml-0.5">*</span>
                  </div>
                  <div className="relative">
                    <div className="border rounded-lg p-4 bg-white mb-4">
                      <div className="flex items-start">
                        <div className="bg-gray-100 w-24 h-32 rounded-lg flex-shrink-0"></div>
                        <div className="flex-grow min-w-0 ml-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">RoHS</p>
                              <p className="text-sm text-gray-500">INSPECTION_REPORT_ZTS22061602HR...</p>
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
                      <Button variant="outline" size="sm" className="h-8">
                        <Upload className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                      <span className="text-green-600 text-sm">Status: Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}

        {/* Main content area */}
        <div className="flex-1 overflow-visible">
          <div className="p-6">
            {/* Profile completion and updates */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="border rounded-md p-6 relative tour-profile-strength">
                <div className="mb-4">
                  <h3 className="text-base font-medium mb-5">List to updates</h3>

                  <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="15" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="15"
                      stroke="#4338ca"
                      strokeDasharray="251.2"
                      strokeDashoffset="67.8"
                      transform="rotate(-90 50 50)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="15"
                      stroke="#e11d48"
                      strokeDasharray="251.2"
                      strokeDashoffset="67.8"
                      transform="rotate(30 50 50)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="15"
                      stroke="#fbbf24"
                      strokeDasharray="251.2"
                      strokeDashoffset="188.4"
                      transform="rotate(190 50 50)"
                    />
                    <text x="50" y="55" textAnchor="middle" className="text-xl font-semibold">
                      73%
                    </text>
                  </svg>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-900 mr-2"></div>
                    <div className="text-sm">Company Details</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-700 mr-2"></div>
                    <div className="text-sm">Personal Information</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 mr-2"></div>
                    <div className="text-sm">Describe your brand</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-pink-600 mr-2"></div>
                    <div className="text-sm">Certifications</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 mr-2"></div>
                    <div className="text-sm">Add details</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-6 col-span-2 tour-customer-reach">
                <h3 className="text-base font-medium mb-1">Helps your reach broader customers base</h3>

                <div className="flex">
                  <div className="pr-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center mt-2 justify-between">
                        <img
                          src={profileData?.imageUrl || "/placeholder.svg"}
                          alt="company logo"
                          className="rounded-full mr-2 h-20 w-20"
                        />
                        <div>
                          <div className="text-sm font-medium">{profileData?.name}</div>
                          <div className="text-xs text-gray-500">Supplier</div>
                        </div>
                      </div>

                      <div className="mt-4 text-xs">
                        <div>
                          {profileData?.updatedAt ? format(new Date(profileData?.updatedAt), "MMMM, yyyy") : ""}
                        </div>
                        <div className="text-gray-600">More reach to customers</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex flex-col items-end">
                      <div className="flex h-16">
                        {Array(10)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="w-3 mx-1 rounded-t-sm"
                              style={{
                                height: `${30 + Math.random() * 60}%`,
                                backgroundColor: `hsl(${260 + i * 8}, 70%, ${50 + Math.random() * 20}%)`,
                              }}
                            ></div>
                          ))}
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-right">0</div>
                        <div className="text-xs text-right text-gray-600">
                          More sales compares to the other supplier on KollaBee
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex flex-wrap items-start justify-start h-auto mb-6 bg-transparent">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`px-4 py-2 text-sm data-[state=active]:bg-[#fdeced] data-[state=active]:text-gray-800 data-[state=active]:font-medium data-[state=active]:rounded-[8px] data-[state=inactive]:text-gray-500`}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id}>
                  {/* Section content */}
                  {sections[tab.id] && (
                    <div className="border rounded-md mb-6">
                      <div
                        className="p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection(tab.id)}
                      >
                        <div>
                          <h3 className="font-semibold">{sections[tab.id]?.title}</h3>
                          <p className="text-sm text-gray-500 ml-8">{sections[tab.id]?.description}</p>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transform ${activeSection === tab.id ? "rotate-180" : ""} transition-transform`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {activeSection === tab.id && (
                        <div className="px-4 pb-4 ml-8">{tab.id === activeTab && renderSectionContent()}</div>
                      )}
                    </div>
                  )}

                  {!sections[tab.id] && renderSectionContent()}
                </TabsContent>
              ))}
            </Tabs>

            {/* Footer actions */}
          </div>
        </div>

        {/* Right sidebar */}
      </div>

      {/* Add loading and saving indicators */}
    </div>
  )
}

export default KollaBeeProfile