"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import projectApi, { type SellerFilters } from "@/lib/api/project"

interface ApiSeller {
  id: string
  userId: string
  businessName: string
  businessDescription: string
  businessAddress: string
  websiteLink: string
  businessCategories: string[]
  businessTypes: string[]
  businessLogo: string
  yearFounded: number | null
  teamSize: string
  annualRevenue: string
  languagesSpoken: string[]
  businessAttributes: string[]
  servicesProvided: string[]
  minimumOrderQuantity: string
  lowMoqFlexibility: boolean
  productionModel: string
  productionCountries: string[]
  providesSamples: boolean
  sampleDispatchTime: string
  productionTimeline: string
  factoryImages: string[]
  businessRegistration: string[]
  certificationTypes: string[]
  certificates: string[]
  projectImages: string[]
  brandVideo: string
  socialMediaLinks: string
  additionalNotes: string
  rating: number
  location: string | null
  country: string | null
  state: string | null
  roleInCompany: string
  targetAudience: string[]
  comments: string
  challenges: string[]
  objectives: string[]
  mainMarkets: string[]
  approved: boolean
  createdAt: string
  updatedAt: string
  products: ApiProduct[]
  user: ApiUser
}

interface ApiProduct {
  id: string
  name: string
  description: string
  price: number
  wholesalePrice: number
  minOrderQuantity: number
  availableQuantity: number
  images: string[]
  status: string
  stockStatus: string
  rating: number
  reviewCount: number
  attributes: Record<string, string>
  discount: number | null
  deliveryCost: number | null
  productCategories: string[]
}

interface ApiUser {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  role: string
  companyName: string
  country: string
  state: string
  address: string
  phoneNumber: string
  imageUrl: string
}

interface ApiResponse {
  sellers: ApiSeller[]
  project: {
    id: string
    selectedServices: string[]
    category: string
    businessName: string
    productType: string
    budget: number
    projectTitle: string
    quantity: number
    receiveDate: string
    certifications: string[]
  }
  where: Record<string, any>
}

export interface Supplier {
  id: string
  name: string
  logo: string
  rating: number
  reviews: number
  description: string
  productType: string
  priceRange: string
  minOrder: string
  location: string
  age: number
  country: string
  verified: boolean
  tags: string[]
  // Additional fields from API
  businessTypes: string[]
  servicesProvided: string[]
  teamSize: string
  annualRevenue: string
  productionCountries: string[]
  certificationTypes: string[]
  websiteLink: string
  productCount: number
  averageProductPrice: number
}

interface Project {
  id: string
  category?: string | string[]
  selectedServices?: string[]
  businessName?: string
  budget?: number
  projectTimelineFrom?: Date
  projectTimelineTo?: Date
}

interface SupplierContextType {
  // Data
  suppliers: Supplier[]
  filteredSuppliers: Supplier[]
  loading: boolean
  savedSuppliers: string[]
  requestedSuppliers: string[]
  countries: string[]
  hiredSuppliers: string[]
  project: Project | null

  // Tab state
  activeTab: string
  setActiveTab: (tab: string) => void

  // Filter states
  searchQuery: string
  setSearchQuery: (query: string) => void
  minPrice: string
  setMinPrice: (price: string) => void
  maxPrice: string
  setMaxPrice: (price: string) => void
  selectedSupplierTypes: string[]
  setSelectedSupplierTypes: (types: string[]) => void
  minRating: string
  setMinRating: (rating: string) => void
  maxRating: string
  setMaxRating: (rating: string) => void
  selectedCountry: string
  setSelectedCountry: (country: string) => void
  minAge: string
  setMinAge: (age: string) => void
  maxAge: string
  setMaxAge: (age: string) => void
  sortOption: string
  setSortOption: (option: string) => void
  activeFiltersCount: number

  // Actions
  fetchSuggestedSellers: (filters?: SellerFilters) => Promise<void>
  resetFilters: () => void
  toggleSupplierType: (type: string) => void
  toggleSaveSupplier: (id: string) => Promise<void>
  sendRequest: (supplier: Supplier) => Promise<void>
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFilterChange: (type: string, value: any) => void
  buildCurrentFilters: () => SellerFilters
  savingSuppliers: Record<string, boolean>
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined)

function transformApiSellerToSupplier(apiSeller: ApiSeller): Supplier {
  // Calculate average product price
  const averagePrice =
    apiSeller.products.length > 0
      ? apiSeller.products.reduce((sum, product) => sum + product.price, 0) / apiSeller.products.length
      : 0

  // Calculate age from creation date
  const createdDate = new Date(apiSeller.createdAt)
  const currentDate = new Date()
  const ageInYears = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365))

  // Determine price range based on products
  const productPrices = apiSeller.products.map((p) => p.price).filter((p) => p > 0)
  const minPrice = productPrices.length > 0 ? Math.min(...productPrices) : 0
  const maxPrice = productPrices.length > 0 ? Math.max(...productPrices) : 0
  const priceRange = productPrices.length > 0 ? `$${minPrice} - $${maxPrice}` : "Price on request"

  // Calculate total reviews from products
  const totalReviews = apiSeller.products.reduce((sum, product) => sum + product.reviewCount, 0)

  // Create tags from various fields
  const tags = [
    ...apiSeller.businessCategories,
    ...apiSeller.businessTypes,
    ...apiSeller.servicesProvided,
    ...apiSeller.businessAttributes,
    ...apiSeller.certificationTypes,
  ].filter(Boolean)

  return {
    id: apiSeller.id,
    name: apiSeller.businessName,
    logo: apiSeller.businessLogo || "/placeholder.svg?height=100&width=100",
    rating: apiSeller.rating || 0,
    reviews: totalReviews,
    description: apiSeller.businessDescription,
    productType: apiSeller.businessCategories[0] || "General",
    priceRange,
    minOrder: apiSeller.minimumOrderQuantity,
    location: apiSeller.businessAddress,
    age: ageInYears,
    country: apiSeller.user?.country || apiSeller.country || "Unknown",
    verified: apiSeller.approved,
    tags,
    businessTypes: apiSeller.businessTypes,
    servicesProvided: apiSeller.servicesProvided,
    teamSize: apiSeller.teamSize,
    annualRevenue: apiSeller.annualRevenue,
    productionCountries: apiSeller.productionCountries,
    certificationTypes: apiSeller.certificationTypes,
    websiteLink: apiSeller.websiteLink,
    productCount: apiSeller.products.length,
    averageProductPrice: averagePrice,
  }
}

export function SupplierProvider({
  children,
  projectId,
}: {
  children: React.ReactNode
  projectId: string
}) {
  const { toast } = useToast()
  // Data states
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [savedSuppliers, setSavedSuppliers] = useState<string[]>([])
  const [requestedSuppliers, setRequestedSuppliers] = useState<string[]>([])
  const [hiredSuppliers, setHiredSuppliers] = useState<string[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [countries, setCountries] = useState<string[]>([])

  // Tab state
  const [activeTab, setActiveTab] = useState("suggested")

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [minPrice, setMinPrice] = useState("0")
  const [maxPrice, setMaxPrice] = useState("10000")
  const [selectedSupplierTypes, setSelectedSupplierTypes] = useState<string[]>([])
  const [minRating, setMinRating] = useState("0")
  const [maxRating, setMaxRating] = useState("5")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [minAge, setMinAge] = useState("0")
  const [maxAge, setMaxAge] = useState("50")
  const [sortOption, setSortOption] = useState("rating-desc")
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Refs for debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add a new state for tracking suppliers that are currently being saved/unsaved
  const [savingSuppliers, setSavingSuppliers] = useState<Record<string, boolean>>({})

  // Fetch project data
  const fetchProjectData = async () => {
    try {
      const response = await projectApi.getProjectDetails(projectId)
      if (response && response.data) {
        setProject(response.data)
        console.log("Project data loaded:", response.data)
      }
    } catch (error) {
      console.error("Error fetching project data:", error)
      // Don't show toast for this as it's not critical for the main functionality
    }
  }

  // Memoize the buildCurrentFilters function to prevent unnecessary re-renders
  const buildCurrentFilters = useCallback((): SellerFilters => {
    // Parse sort option
    let sortParams = {}
    if (sortOption !== "reference") {
      const [sortBy, sortOrder] = sortOption.split("-")
      sortParams = {
        sortBy: sortBy as "rating" | "age" | "name",
        sortOrder: sortOrder as "asc" | "desc",
      }
    }

    // Include project category in filters if available
    const filters: SellerFilters = {
      ...sortParams,
      search: searchQuery,
      supplierTypes: selectedSupplierTypes,
    }

    // Add project category to filters for better supplier matching
    if (project?.category) {
      if (Array.isArray(project.category)) {
        // If category is an array, use the first category or join them
        filters.category = project.category[0] || project.category.join(",")
      } else {
        filters.category = project.category
      }
    }

    return filters
  }, [sortOption, searchQuery, selectedSupplierTypes, project])

  // Fetch data only once on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        await fetchProjectData()
        await fetchRequestedSellers()
        await fetchSuggestedSellers()
        await fetchHiredSellers()
        await fetchSavedSellers()
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
    // Cleanup timeouts on unmount
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current)
    }
    // We intentionally don't include dependencies here to prevent multiple fetches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // Count active filters and apply filtering
  useEffect(() => {
    // Count active filters
    let count = 0
    if (searchQuery) count++
    if (selectedSupplierTypes.length > 0) count++
    if (minPrice !== "0" || maxPrice !== "10000") count++
    if (minRating !== "0" || maxRating !== "5") count++
    if (selectedCountry) count++
    if (minAge !== "0" || maxAge !== "50") count++
    setActiveFiltersCount(count)

    // Apply filters to suppliers
    applyFilters()
  }, [
    suppliers,
    searchQuery,
    selectedSupplierTypes,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    selectedCountry,
    minAge,
    maxAge,
    sortOption,
    activeTab,
    savedSuppliers,
    requestedSuppliers,
  ])

  const fetchSuggestedSellers = async (filters?: SellerFilters) => {
    try {
      setLoading(true)
      // Parse sort option
      let sortParams = {}
      if (filters?.sortBy) {
        sortParams = {
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        }
      } else if (sortOption !== "reference") {
        const [sortBy, sortOrder] = sortOption.split("-")
        sortParams = {
          sortBy,
          sortOrder,
        }
      }

      // Combine all filters, including project category
      const combinedFilters = {
        ...filters,
        ...sortParams,
        search: filters?.search !== undefined ? filters.search : searchQuery,
        supplierTypes: filters?.supplierTypes || selectedSupplierTypes,
      }

      // Add project category to filters if not already present
      if (!combinedFilters.category && project?.category) {
        if (Array.isArray(project.category)) {
          combinedFilters.category = project.category[0] || project.category.join(",")
        } else {
          combinedFilters.category = project.category
        }
      }

      const response = await projectApi.suggestedSellers(projectId, combinedFilters)
      console.log("API response for suggested sellers:", response)

      if (response && response.sellers && Array.isArray(response.sellers)) {
        const transformedSuppliers = response.sellers.map(transformApiSellerToSupplier)

        setSuppliers(transformedSuppliers)
        setFilteredSuppliers(transformedSuppliers)

        if (response.project) {
          setProject(response.project)
        }

        const uniqueCountries = [...new Set(transformedSuppliers.map((s) => s.country))].filter(Boolean)
        setCountries(uniqueCountries as string[])

        console.log("Transformed suppliers:", transformedSuppliers)
      } else if (response && Array.isArray(response)) {
        // Fallback for old API response format
        const transformedSuppliers = response.map(transformApiSellerToSupplier)
        setSuppliers(transformedSuppliers)
        setFilteredSuppliers(transformedSuppliers)

        const uniqueCountries = [...new Set(transformedSuppliers.map((s) => s.country))].filter(Boolean)
        setCountries(uniqueCountries)
      } else {
        console.error("Invalid API response format:", response)
        toast({
          title: "Error",
          description: "Failed to fetch suppliers: Invalid response format",
          variant: "destructive",
        })
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching suggested sellers:", error)
      toast({
        title: "Error",
        description: "Failed to fetch suppliers",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const fetchSavedSellers = async () => {
    try {
      const response = await projectApi.getSavedSellers(projectId)
      console.log("Saved sellers response:", response)
      if (response && Array.isArray(response)) {
        setSavedSuppliers(response)
        console.log("Saved sellers loaded:", response)
      } else {
        console.error("Invalid response format for saved sellers:", response)
        setSavedSuppliers([])
      }
      
    } catch (error) {
      console.error("Error fetching saved sellers:", error)
      setSavedSuppliers([])
    }
  }

  const fetchRequestedSellers = async () => {
    try {
      // This endpoint would need to be implemented in your API
      const response = await projectApi.getRequestedSellers(projectId)
      console.log("Requested sellers response:", response)
      setRequestedSuppliers(response)
    } catch (error) {
      console.error("Error fetching requested sellers:", error)
      setRequestedSuppliers([])
    }
  }

  const fetchHiredSellers = async () => {
    try {
      // This endpoint would need to be implemented in your API
      const response = await projectApi.getHiredSellers(projectId)
      setHiredSuppliers(response)
    } catch (error) {
      console.error("Error fetching requested sellers:", error)
      setHiredSuppliers([])
    }
  }

  const applyFilters = () => {
    let filtered = [...suppliers]
    // Filter by tab
    if (activeTab === "saved") {
      filtered = filtered.filter((s) => savedSuppliers.includes(s.id))
    } else if (activeTab === "requested") {
      filtered = filtered.filter((s) => requestedSuppliers.includes(s.id))
    } else if (activeTab === "hired") {
      filtered = filtered.filter((s) => hiredSuppliers.includes(s.id))
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.country.toLowerCase().includes(query) ||
          s.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply supplier type filter
    if (selectedSupplierTypes.length > 0) {
      filtered = filtered.filter((s) => s.tags.some((tag) => selectedSupplierTypes.includes(tag)))
    }

    // Apply rating filter
    if (minRating !== "0" || maxRating !== "5") {
      filtered = filtered.filter((s) => s.rating >= Number(minRating) && s.rating <= Number(maxRating))
    }

    // Apply country filter
    if (selectedCountry && selectedCountry !== "all") {
      filtered = filtered.filter((s) => s.country === selectedCountry)
    }

    // Apply age filter
    if (minAge !== "0" || maxAge !== "50") {
      filtered = filtered.filter((s) => s.age >= Number(minAge) && s.age <= Number(maxAge))
    }

    // Apply price filter using averageProductPrice
    if (minPrice !== "0" || maxPrice !== "10000") {
      filtered = filtered.filter((s) => {
        return s.averageProductPrice >= Number(minPrice) && s.averageProductPrice <= Number(maxPrice)
      })
    }

    // Apply sorting
    if (sortOption !== "reference") {
      const [sortBy, sortOrder] = sortOption.split("-")
      filtered.sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case "rating":
            comparison = a.rating - b.rating
            break
          case "age":
            comparison = a.age - b.age
            break
          case "name":
            comparison = a.name.localeCompare(b.name)
            break
          case "price":
            comparison = a.averageProductPrice - b.averageProductPrice
            break
        }
        return sortOrder === "asc" ? comparison : -comparison
      })
    }

    setFilteredSuppliers(filtered)
  }

  const resetFilters = useCallback(() => {
    setSearchQuery("")
    setMinPrice("0")
    setMaxPrice("10000")
    setSelectedSupplierTypes([])
    setMinRating("0")
    setMaxRating("5")
    setSelectedCountry("")
    setMinAge("0")
    setMaxAge("50")
    setSortOption("reference")
    // Refetch with reset filters
    fetchSuggestedSellers()
  }, [])

  const toggleSupplierType = useCallback(
    (type: string) => {
      setSelectedSupplierTypes((prev) => {
        const newTypes = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        // Refetch with updated filter
        fetchSuggestedSellers({
          ...buildCurrentFilters(),
          supplierTypes: newTypes,
        })
        return newTypes
      })
    },
    [buildCurrentFilters],
  )

  // Replace the toggleSaveSupplier function with this optimistic version
  const toggleSaveSupplier = async (id: string) => {
    try {
      // Check if this supplier is already being processed
      if (savingSuppliers[id]) return
      // Mark this supplier as being processed
      setSavingSuppliers((prev) => ({ ...prev, [id]: true }))
      // Determine if we're saving or unsaving
      const isSaved = savedSuppliers.includes(id)
      // Optimistically update the UI
      if (isSaved) {
        // Optimistically remove from saved
        setSavedSuppliers((prev) => prev.filter((sid) => sid !== id))
      } else {
        // Optimistically add to saved
        setSavedSuppliers((prev) => [...prev, id])
      }

      // Make the API call
      if (isSaved) {
        // Remove from saved
        await projectApi.removeSavedSeller({
          sellerId: id,
          projectId: projectId,
        })
        toast({
          title: "Removed from saved",
          description: "Supplier has been removed from your saved list",
          variant: "default",
        })
      } else {
        // Add to saved
        await projectApi.saveSeller({
          sellerId: id,
          projectId: projectId,
        })
        toast({
          title: "Saved successfully",
          description: "Supplier has been added to your saved list",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error toggling save status:", error)
      // Revert the optimistic update on error
      const isSaved = !savedSuppliers.includes(id)
      if (isSaved) {
        // Revert removal
        setSavedSuppliers((prev) => [...prev, id])
      } else {
        // Revert addition
        setSavedSuppliers((prev) => prev.filter((sid) => sid !== id))
      }
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive",
      })
    } finally {
      // Clear the processing state
      setSavingSuppliers((prev) => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })
    }
  }

  const sendRequest = async (supplier: Supplier) => {
    try {
      await projectApi.sendRequest({
        sellerId: supplier.id,
        projectId: projectId,
      })
      setRequestedSuppliers((prev) => [...prev, supplier.id])
      toast({
        title: "Request Sent",
        description: `Your request has been sent to ${supplier.name}`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error sending request:", error)
      toast({
        title: "Error",
        description: "Failed to send request",
        variant: "destructive",
      })
    }
  }

  // Properly debounced search handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)

      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      // Set a new timeout
      searchTimeoutRef.current = setTimeout(() => {
        fetchSuggestedSellers({
          ...buildCurrentFilters(),
          search: value,
        })
        searchTimeoutRef.current = null
      }, 500)
    },
    [buildCurrentFilters],
  )

  // Properly debounced filter handler
  const handleFilterChange = useCallback(
    (type: string, value: any) => {
      switch (type) {
        case "minPrice":
          setMinPrice(value)
          break
        case "maxPrice":
          setMaxPrice(value)
          break
        case "minRating":
          setMinRating(value)
          break
        case "maxRating":
          setMaxRating(value)
          break
        case "minAge":
          setMinAge(value)
          break
        case "maxAge":
          setMaxAge(value)
          break
        case "country":
          setSelectedCountry(value)
          break
        case "sortOption":
          setSortOption(value)
          break
      }

      // Clear any existing timeout
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current)
      }

      // Set a new timeout
      filterTimeoutRef.current = setTimeout(() => {
        fetchSuggestedSellers(buildCurrentFilters())
        filterTimeoutRef.current = null
      }, 500)
    },
    [buildCurrentFilters],
  )

  // Add savingSuppliers to the context value
  const value = {
    // Data
    suppliers,
    filteredSuppliers,
    loading,
    savedSuppliers,
    requestedSuppliers,
    countries,
    savingSuppliers,
    project,
    // Tab state
    activeTab,
    setActiveTab,
    // Filter states
    searchQuery,
    setSearchQuery,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    selectedSupplierTypes,
    setSelectedSupplierTypes,
    minRating,
    setMinRating,
    maxRating,
    setMaxRating,
    selectedCountry,
    setSelectedCountry,
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
    sortOption,
    setSortOption,
    activeFiltersCount,
    hiredSuppliers,
    // Actions
    fetchSuggestedSellers,
    resetFilters,
    toggleSupplierType,
    toggleSaveSupplier,
    sendRequest,
    handleSearchChange,
    handleFilterChange,
    buildCurrentFilters,
  }

  return <SupplierContext.Provider value={value}>{children}</SupplierContext.Provider>
}

export function useSuppliers() {
  const context = useContext(SupplierContext)
  if (context === undefined) {
    throw new Error("useSuppliers must be used within a SupplierProvider")
  }
  return context
}

export { SupplierContext }
