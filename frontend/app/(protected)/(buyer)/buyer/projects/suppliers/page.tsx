"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Star,
  Info,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Supplier {
  id: number;
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  description: string;
  productType: string;
  priceRange: string;
  minOrder: string;
  location: string;
  age: number;
  country: string;
  verified: boolean;
  tags: string[];
}

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("suggested");

  // Filter states
  const [minBudget, setMinBudget] = useState(1000);
  const [maxBudget, setMaxBudget] = useState(1000000);
  const [timeline, setTimeline] = useState("Less than a Month");
  const [selectedSupplierTypes, setSelectedSupplierTypes] = useState<string[]>(
    []
  );

  // Sort state
  const [sortOption, setSortOption] = useState("reference");

  // Load suppliers data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const demoSuppliers: Supplier[] = [
        {
          id: 1,
          name: "Shandong Great Steel Co. Ltd",
          logo: "/placeholder.svg?height=120&width=120",
          rating: 5.0,
          reviews: 11,
          description:
            "Stamped in 316 304 stainless steel 3d-wall panel design embossed stainless steel plate",
          productType:
            "Most popular Supplier in Men's Regular Sleeve Hoodies & Sweatshirts",
          priceRange: "$850.00-1,100.00",
          minOrder: "Min. order: 1 ton",
          location: "Shandong, China",
          age: 2,
          country: "CN",
          verified: true,
          tags: ["Manufacturing", "Steel", "Wall Panels"],
        },
        {
          id: 2,
          name: "Guangzhou Textile Co. Ltd",
          logo: "/placeholder.svg?height=120&width=120",
          rating: 4.8,
          reviews: 24,
          description:
            "Premium cotton fabric for clothing and apparel manufacturing",
          productType: "Top Supplier in Textile & Fabric Materials",
          priceRange: "$3.50-5.00",
          minOrder: "Min. order: 500 meters",
          location: "Guangzhou, China",
          age: 5,
          country: "CN",
          verified: true,
          tags: ["Manufacturing", "Textile", "Fabric"],
        },
        {
          id: 3,
          name: "Shenzhen Packaging Solutions",
          logo: "/placeholder.svg?height=120&width=120",
          rating: 4.7,
          reviews: 18,
          description: "Custom eco-friendly packaging boxes and materials",
          productType: "Leading Supplier in Packaging Solutions",
          priceRange: "$0.50-2.00",
          minOrder: "Min. order: 1000 pieces",
          location: "Shenzhen, China",
          age: 3,
          country: "CN",
          verified: true,
          tags: ["Packaging", "Eco-friendly", "Custom"],
        },
        {
          id: 4,
          name: "Mumbai Labelling Industries",
          logo: "/placeholder.svg?height=120&width=120",
          rating: 4.5,
          reviews: 9,
          description: "Premium quality custom labels and tags for apparel",
          productType: "Specialized in Private Labelling & Tags",
          priceRange: "$0.10-0.30",
          minOrder: "Min. order: 5000 pieces",
          location: "Mumbai, India",
          age: 4,
          country: "IN",
          verified: true,
          tags: ["Private Labelling", "Tags", "Apparel"],
        },
        {
          id: 5,
          name: "Seoul Cosmetics Manufacturing",
          logo: "/placeholder.svg?height=120&width=120",
          rating: 4.9,
          reviews: 32,
          description: "Full-service cosmetics manufacturing and formulation",
          productType: "Premium Supplier in Cosmetics Manufacturing",
          priceRange: "$5,000-25,000",
          minOrder: "Min. order: 1000 units",
          location: "Seoul, South Korea",
          age: 7,
          country: "KR",
          verified: true,
          tags: ["Manufacturing", "Cosmetics", "Formulation"],
        },
        {
          id: 6,
          name: "Bangkok Packaging Experts",
          logo: "/placeholder.svg?height=120&width=120",
          rating: 4.6,
          reviews: 15,
          description: "Innovative packaging solutions for food and beverages",
          productType: "Specialized in Food & Beverage Packaging",
          priceRange: "$0.80-3.50",
          minOrder: "Min. order: 10000 pieces",
          location: "Bangkok, Thailand",
          age: 5,
          country: "TH",
          verified: false,
          tags: ["Packaging", "Food", "Beverage"],
        },
      ];

      setSuppliers(demoSuppliers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter suppliers based on search query, filters, and active tab
  const filteredSuppliers = suppliers.filter((supplier) => {
    // Search filter
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.productType.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    const matchesTab =
      activeTab === "suggested" ||
      (activeTab === "bookmarked" && Math.random() > 0.5) || // Simulating bookmarked suppliers
      (activeTab === "hired" && Math.random() > 0.7); // Simulating hired suppliers

    // Supplier type filter
    const matchesSupplierType =
      selectedSupplierTypes.length === 0 ||
      selectedSupplierTypes.some((type) => supplier.tags.includes(type));

    // Budget filter - this is simplified since we don't have actual numeric values in our demo data
    const matchesBudget = true; // In a real app, you would parse the price range and check against min/max budget

    return matchesSearch && matchesTab && matchesSupplierType && matchesBudget;
  });

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.age - a.age; // Newer suppliers first (lower age)
      case "oldest":
        return a.age - b.age; // Older suppliers first (higher age)
      case "budget-low-high":
        // In a real app, you would parse the price range and sort
        return a.id - b.id; // Using ID as placeholder
      case "budget-high-low":
        // In a real app, you would parse the price range and sort
        return b.id - a.id; // Using ID as placeholder
      default:
        return 0; // Default sorting (reference)
    }
  });

  // Reset filters
  const resetFilters = () => {
    setMinBudget(1000);
    setMaxBudget(1000000);
    setTimeline("Less than a Month");
    setSelectedSupplierTypes([]);
  };

  // Reset sort
  const resetSort = () => {
    setSortOption("reference");
  };

  // Toggle supplier type selection
  const toggleSupplierType = (type: string) => {
    setSelectedSupplierTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-t-[#e00261] border-r-[#f0b168] border-b-[#e00261] border-l-[#f0b168] rounded-full animate-spin"></div>
        <p className="text-gray-500 mt-4">Loading suppliers...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/projects"
              className="text-[#e00261] flex items-center mr-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Link>

            <Tabs
              defaultValue="suggested"
              className="w-auto"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="suggested">Suggested</TabsTrigger>
                <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
                <TabsTrigger value="hired">Hired</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Search by Supplier Name"
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Filter Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Filters</h3>

                  <div className="space-y-2">
                    <h4 className="text-sm">Budget</h4>
                    <div className="flex justify-between text-sm">
                      <span>₹ {minBudget}</span>
                      <span>₹ {maxBudget}</span>
                    </div>
                    {/* <Slider
                      defaultValue={[minBudget, maxBudget]}
                      min={1000}
                      max={1000000}
                      step={1000}
                      onValueChange={(values) => {
                        setMinBudget(values[0]);
                        setMaxBudget(values[1]);
                      }}
                    /> */}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm">Timeline</h4>
                    <div className="flex items-center justify-between border rounded-md p-2">
                      <span className="text-sm">{timeline}</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm">Suppliers</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="manufacturing"
                          checked={selectedSupplierTypes.includes(
                            "Manufacturing"
                          )}
                          onCheckedChange={() =>
                            toggleSupplierType("Manufacturing")
                          }
                        />
                        <label htmlFor="manufacturing" className="text-sm">
                          Manufacturing
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="packaging"
                          checked={selectedSupplierTypes.includes("Packaging")}
                          onCheckedChange={() =>
                            toggleSupplierType("Packaging")
                          }
                        />
                        <label htmlFor="packaging" className="text-sm">
                          Packaging
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="private-labelling"
                          checked={selectedSupplierTypes.includes(
                            "Private Labelling"
                          )}
                          onCheckedChange={() =>
                            toggleSupplierType("Private Labelling")
                          }
                        />
                        <label htmlFor="private-labelling" className="text-sm">
                          Private Labelling
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetFilters}
                    >
                      Clear
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-[#e00261] to-[#f0b168] hover:from-[#c80057] hover:to-[#e0a058] text-white border-none">
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 5h10"></path>
                    <path d="M11 9h7"></path>
                    <path d="M11 13h4"></path>
                    <path d="m3 17 3 3 3-3"></path>
                    <path d="M6 18V4"></path>
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Sort</h3>

                  <RadioGroup value={sortOption} onValueChange={setSortOption}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reference" id="reference" />
                      <Label htmlFor="reference" className="text-sm">
                        Reference (Default, based on project details & supplier
                        match)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="newest" id="newest" />
                      <Label htmlFor="newest" className="text-sm">
                        Newest First (Latest projects/suppliers added)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oldest" id="oldest" />
                      <Label htmlFor="oldest" className="text-sm">
                        Oldest First (Earliest projects/suppliers added)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="budget-low-high"
                        id="budget-low-high"
                      />
                      <Label htmlFor="budget-low-high" className="text-sm">
                        Budget (Low to High)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="budget-high-low"
                        id="budget-high-low"
                      />
                      <Label htmlFor="budget-high-low" className="text-sm">
                        Budget (High to Low)
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetSort}
                    >
                      Clear
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-[#e00261] to-[#f0b168] hover:from-[#c80057] hover:to-[#e0a058] text-white border-none">
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <div className="relative p-4 flex justify-center items-center bg-blue-900 h-40">
                <img
                  src={supplier.logo || "/placeholder.svg"}
                  alt={supplier.name}
                  className="h-24 w-24 object-contain"
                />
                <button className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <Info className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-1">
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">
                      {supplier.rating}/5.0
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({supplier.reviews} reviews)
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {supplier.description}
                </p>

                <h3 className="font-medium text-sm mb-2">
                  #{supplier.id} {supplier.productType}
                </h3>

                <div className="font-bold mb-1">{supplier.priceRange}</div>
                <div className="text-sm text-gray-600 mb-3">
                  {supplier.minOrder}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm">{supplier.name}</div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      {supplier.age} yrs
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-500 border-red-200 text-xs"
                    >
                      {supplier.country} Supplier
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {supplier.verified && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-500 border-blue-200"
                    >
                      Verified
                    </Badge>
                  )}
                  <Button className="w-full ml-2 bg-gradient-to-r from-[#e00261] to-[#f0b168] hover:from-[#c80057] hover:to-[#e0a058] text-white border-none">
                    Send Request
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {sortedSuppliers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              onClick={() => {
                resetFilters();
                setSearchQuery("");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuppliersPage;
