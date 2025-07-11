"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { IoFilterOutline } from "react-icons/io5"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import TableSkeleton from "./TableSkeleton"
import ProjectRow from "./ProjectRow"
import type { Project } from "@/types/api"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface ProjectsTableProps {
  loading: boolean
  filteredProjects: Project[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  router: AppRouterInstance
}

const ProjectsTable = ({
  loading,
  filteredProjects,
  searchQuery,
  setSearchQuery,
  router,
}: ProjectsTableProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedTimeline, setSelectedTimeline] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const toggleFilter = (
    selectedArray: string[],
    setArray: (value: string[]) => void,
    value: string
  ) => {
    setArray(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const applyFilters = (project: Project) => {
    // Status filter
    const statusMatch = selectedStatus.length === 0 ||
      selectedStatus.includes(project.status)

    // Type filter
    const typeMatch = selectedTypes.length === 0 ||
      selectedTypes.includes(project.projectType)

    // Timeline filter
    const timelineMatch = selectedTimeline.length === 0 ||
      selectedTimeline.some(range => {
        const days = parseInt(project.timeline) || 0
        switch (range) {
          case "< 1 week": return days <= 7
          case "1–2 weeks": return days > 7 && days <= 14
          case "2–4 weeks": return days > 14 && days <= 30
          case "1+ month": return days > 30
          default: return true
        }
      })

    // Budget filter
    const budgetMatch = selectedBudget.length === 0 ||
      selectedBudget.some(range => {
        const budget = parseInt(project.budget || "0")
        switch (range) {
          case "< ₹10K": return budget < 10000
          case "₹10K–₹50K": return budget >= 10000 && budget <= 50000
          case "₹50K–₹1L": return budget > 50000 && budget <= 100000
          case "> ₹1L": return budget > 100000
          default: return true
        }
      })

    return statusMatch && typeMatch && timelineMatch && budgetMatch
  }

  const finalFilteredProjects = filteredProjects.filter(applyFilters)

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6 bg-[#F7F9FB] rounded-lg p-2">
        {/* Filters Dropdown */}
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <IoFilterOutline className="h-4 w-4" />
              <span className="text-sm">Filters</span>
              {(selectedStatus.length > 0 ||
                selectedTimeline.length > 0 ||
                selectedBudget.length > 0 ||
                selectedTypes.length > 0) && (
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 space-y-6" align="start">
            <div>
              <p className="font-medium text-sm mb-2">Filter by Status</p>
              {["Pending", "In Progress", "Completed"].map(status => (
                <label key={status} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedStatus.includes(status)}
                    onCheckedChange={() =>
                      toggleFilter(selectedStatus, setSelectedStatus, status)
                    }
                  />
                  {status}
                </label>
              ))}
            </div>

            <div>
              <p className="font-medium text-sm mb-2">Filter by Timeline</p>
              {["< 1 week", "1–2 weeks", "2–4 weeks", "1+ month"].map(range => (
                <label key={range} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedTimeline.includes(range)}
                    onCheckedChange={() =>
                      toggleFilter(selectedTimeline, setSelectedTimeline, range)
                    }
                  />
                  {range}
                </label>
              ))}
            </div>

            <div>
              <p className="font-medium text-sm mb-2">Filter by Budget</p>
              {["< ₹10K", "₹10K–₹50K", "₹50K–₹1L", "> ₹1L"].map(range => (
                <label key={range} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedBudget.includes(range)}
                    onCheckedChange={() =>
                      toggleFilter(selectedBudget, setSelectedBudget, range)
                    }
                  />
                  {range}
                </label>
              ))}
            </div>

            <div>
              <p className="font-medium text-sm mb-2">Filter by Project Type</p>
              {["Standard", "Custom", "Packaging"].map(type => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() =>
                      toggleFilter(selectedTypes, setSelectedTypes, type)
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Input */}
        <div className="flex items-center bg-white rounded-md gap-2">
          <div className="relative">
            <Input
              placeholder="Search Project Names"
              className="h-8 w-48 rounded-md border border-gray-300 pl-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="py-2 px-4 font-medium">Project Type</th>
              <th className="py-2 px-4 font-medium">Supplier</th>
              <th className="py-2 px-4 font-medium">Business Name</th>
              <th className="py-2 px-4 font-medium">Timeline</th>
              <th className="py-2 px-4 font-medium">Shipping</th>
              <th className="py-2 px-4 font-medium">Budget</th>
              <th className="py-2 px-4 font-medium">Status</th>
              <th className="py-2 px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rowCount={5} />
            ) : finalFilteredProjects.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-4 text-center text-gray-500">
                  No projects match your filters
                </td>
              </tr>
            ) : (
              finalFilteredProjects.map(project => (
                <ProjectRow key={project.id} project={project} router={router} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProjectsTable