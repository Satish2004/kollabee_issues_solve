"use client";

import { Search } from "lucide-react";
import { IoFilterOutline } from "react-icons/io5";
import { HiArrowsUpDown } from "react-icons/hi2";
import { Input } from "@/components/ui/input";
import TableSkeleton from "./TableSkeleton";
import ProjectRow from "./ProjectRow";
import type { Project } from "@/types/api";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ProjectsTableProps {
  loading: boolean;
  filteredProjects: Project[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  router: AppRouterInstance;
}

const ProjectsTable = ({
  loading,
  filteredProjects,
  searchQuery,
  setSearchQuery,
  router,
}: ProjectsTableProps) => {
  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-6 bg-[#F7F9FB] rounded-lg p-2">
        <div className="flex items-center gap-3 text-black">
          <IoFilterOutline className="h-4 w-4" />
          <HiArrowsUpDown className="h-4 w-4" />
        </div>
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
      {/* Projects table */}
      <div>
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="py-2 px-4 font-medium">
                  <div className="flex items-center">Project Type</div>
                </th>
                <th className="py-2 px-4 font-medium">
                  <div className="flex items-center">Supplier</div>
                </th>
                <th className="py-2 px-4 font-medium">
                  <div className="flex items-center">Business Name</div>
                </th>
                <th className="py-2 px-4 font-medium">
                  <div className="flex items-center">Timeline</div>
                </th>
                <th className="py-2 px-4 font-medium">Shipping</th>
                <th className="py-2 px-4 font-medium">Budget</th>
                <th className="py-2 px-4 font-medium">
                  <div className="flex items-center">Status</div>
                </th>
                <th className="py-2 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rowCount={5} />
              ) : (
                filteredProjects.map((project) => (
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
    </div>
  );
};

export default ProjectsTable;
