"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { IoFilterOutline } from "react-icons/io5"
import { HiArrowsUpDown } from "react-icons/hi2"
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

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  const filteredByStatus = filteredProjects.filter((project) =>
    selectedStatus.length > 0 ? selectedStatus.includes(project.status) : true
  )

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6 bg-[#F7F9FB] rounded-lg p-2">
        {/* Filters Dropdown */}
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <IoFilterOutline className="h-4 w-4" />
              <span className="text-sm">Filters</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 space-y-4" align="start">
            <div>
              <p className="font-medium text-sm mb-2">Filter by Status</p>
              <div className="space-y-2">
                {["Pending", "In Progress", "Completed"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedStatus.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
            {/* Future filters like Timeline, Project Type can go here */}
          </PopoverContent>
        </Popover>

        {/* Search */}
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
            ) : (
              filteredByStatus.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  router={router}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProjectsTable
