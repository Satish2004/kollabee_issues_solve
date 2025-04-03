"use client";

import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Search,
  Eye,
  MessageSquare,
  ArrowDownUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import CreateProjects from "./_component/CreateProjects";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IoFilterOutline } from "react-icons/io5";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FormProvider } from "./_component/create-projects-context";
import projectApi from "@/lib/api/project";
import type { Project } from "@/types/api";

const ProjectsPage = () => {
  const [formActive, setFormActive] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Filter options
  const projectTypeOptions = [
    { id: "custom-manufacturing", label: "Custom Manufacturing" },
    { id: "packaging-only", label: "Packaging Only" },
    { id: "end-to-end", label: "End to End Development" },
  ];

  // Update to match the actual data structure
  const categoryOptions = [
    { id: "Apparel & Fashion", label: "Apparel & Fashion" },
    // Add other categories as needed
  ];

  const formulationOptions = [
    { id: "cream", label: "Cream" },
    // Add other formulation types as needed
  ];

  const fetchData = async () => {
    try {
      const data = await projectApi.getProjects();
      console.log("Projects data:", data);

      // Format the data to include status if needed
      const formattedData = data.map((project: Project) => ({
        ...project,
        status: {
          label: "Pending", // Default status since it's not in your data
          color: "text-yellow-500",
        },
      }));

      return formattedData;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  };

  useEffect(() => {
    // Simulate API call
    const fetchProjects = async () => {
      const data: any[] = await fetchData();
      console.log("Fetched projects:", data);
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Filter projects based on search query and active filters
  const filteredProjects = projects.filter((project) => {
    // Search filter
    const matchesSearch =
      project.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.productType?.toLowerCase().includes(searchQuery.toLowerCase());

    // If no active filters, just use search
    if (activeFilters.length === 0) {
      return matchesSearch;
    }

    // Check if project matches any active filter
    const matchesFilter = activeFilters.some((filter) => {
      // Check if the selectedServices array includes the filter
      if (
        project.selectedServices &&
        project.selectedServices.includes(filter)
      ) {
        return true;
      }

      // Check category
      if (filter === project.category) {
        return true;
      }

      // Check formulation type
      if (filter === project.formulationType) {
        return true;
      }

      return false;
    });

    return matchesSearch && matchesFilter;
  });

  if (formActive) {
    return (
      <FormProvider>
        <CreateProjects setOpen={setFormActive} />
      </FormProvider>
    );
  }

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "On Track":
        return (
          <Badge className="bg-pink-500 hover:bg-pink-600">{health}</Badge>
        );
      case "Delayed":
        return <Badge className="bg-red-500 hover:bg-red-600">{health}</Badge>;
      case "Critical":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">{health}</Badge>
        );
      case "Good":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">{health}</Badge>
        );
      default:
        return health;
    }
  };

  // Empty state - no projects
  if (!loading && projects.length === 0) {
    return (
      <div className="w-full h-full rounded-xl bg-white border flex flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-xl font-semibold text-gray-700">
          You don't have any projects
        </h1>
        <p className="text-gray-500 text-center max-w-md">
          Create your first project to start collaborating with suppliers and
          track your manufacturing process.
        </p>
        <div className="flex items-center justify-center mt-4">
          <Button
            variant="outline"
            className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold"
            onClick={() => setFormActive(true)}
          >
            <PlusIcon size={20} className="text-white mr-2" />
            Create Project
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full h-full rounded-xl bg-white border flex flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-[#9e1171] border-r-[#f0b168] border-b-[#9e1171] border-l-[#f0b168] rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading your projects...</p>
        </div>
      </div>
    );
  }

  // Projects dashboard
  return (
    <>
      <div className="w-full h-[100px] flex justify-end items-center rounded-xl mb-8 bg-white border p-5">
        <Button
          className="gradient-border text-gradient"
          onClick={() => setFormActive(true)}
        >
          <PlusIcon className="mr-2 h-4 w-4 text-rose-500" />
          Create Project
        </Button>
      </div>

      <div className="w-full h-full bg-white rounded-xl   border flex flex-col p-4 gap-3">
        {/* Projects section */}
        <h2 className="text-base font-medium mr-4">Projects Overview</h2>

        <div className="p-0">
          <div className="flex justify-between items-center mb-6 bg-[#F7F9FB] rounded-lg p-2 ">
            <div className="flex items-center gap-3 text-black ">
              <IoFilterOutline className="h-4 w-4 " />
              <HiArrowsUpDown className="h-4 w-4 " />
            </div>
            <div className="flex items-center bg-white rounded-md gap-2">
              <div className="relative">
                <Input
                  placeholder="Search with bussiness name"
                  className="h-8 w-60 rounded-md border border-gray-300 pl-8 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Projects table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="py-2 px-4 font-medium">
                    <div className="flex items-center">
                      Services
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-2 px-4 font-medium">
                    <div className="flex items-center">
                      Business Name
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-2 px-4 font-medium">
                    <div className="flex items-center">
                      Timeline
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-2 px-4 font-medium">Formulation</th>
                  <th className="py-2 px-4 font-medium">Health</th>
                  <th className="py-2 px-4 font-medium">Budget</th>
                  <th className="py-2 px-4 font-medium">Min Order Qty</th>
                  <th className="py-2 px-4 font-medium">
                    <div className="flex items-center">
                      Status
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-2 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">
                      {project.selectedServices?.join(", ")}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="bg-gray-200 w-fit px-2 rounded-lg">
                        {project.businessName || "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center bg-gray-200 w-auto rounded-lg p-1">
                        <span className="mr-2">📅</span>
                        {project.projectTimeline
                          ? new Date(
                              project.projectTimeline[0]
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {project.formulationType || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge className="bg-gray-500 hover:bg-gray-600">
                        N/A
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {project.budget
                        ? `$${project.budget} ${
                            project.pricingCurrency?.toUpperCase() || "USD"
                          }`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {project.minimumOrderQuantity || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="flex items-center">• Pending</span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
