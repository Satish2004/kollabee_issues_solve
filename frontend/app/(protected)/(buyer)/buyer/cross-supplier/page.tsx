"use client";

import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Search,
  Eye,
  MessageSquare,
  SlidersHorizontal,
  ArrowDownUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import CreateProjects from "./_component/CreateProjects";
import { FilterButton } from "./_component/filter-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IoFilterOutline } from "react-icons/io5";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FormProvider } from "./_component/create-projects-context";

interface Project {
  id: number;
  type: string;
  supplier: number;
  timeline: string;
  process: string;
  health: string;
  paymentMilestone: string;
  shipping: string;
  status: {
    label: string;
    color: string;
  };
  action: string;
}

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

  const statusOptions = [
    { id: "awaiting-approval", label: "Awaiting Approval" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ];

  // Simulate loading projects from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // const demoProjects: Project[] = [
      //   {
      //     id: 1,
      //     type: "Custom Manufacturing",
      //     supplier: 1,
      //     timeline: "27th Sept 2025",
      //     process: "-",
      //     health: "-",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "Awaiting Approval", color: "text-amber-500" },
      //     action: "",
      //   },
      //   {
      //     id: 2,
      //     type: "Custom Manufacturing",
      //     supplier: 1,
      //     timeline: "27th Sept 2025",
      //     process: "-",
      //     health: "-",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "Rejected", color: "text-red-500" },
      //     action: "",
      //   },
      //   {
      //     id: 3,
      //     type: "Custom Manufacturing",
      //     supplier: 1,
      //     timeline: "27th Sept 2025",
      //     process: "-",
      //     health: "-",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "Approved", color: "text-green-500" },
      //     action: "",
      //   },
      //   {
      //     id: 4,
      //     type: "Custom Manufacturing",
      //     supplier: 1,
      //     timeline: "27th Sept 2025",
      //     process: "-",
      //     health: "-",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "Pending Form", color: "text-amber-500" },
      //     action: "",
      //   },
      //   {
      //     id: 5,
      //     type: "Custom Manufacturing",
      //     supplier: 1,
      //     timeline: "27th Sept 2025",
      //     process: "-",
      //     health: "-",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "Under Review", color: "text-amber-500" },
      //     action: "",
      //   },
      //   {
      //     id: 6,
      //     type: "Custom Manufacturing",
      //     supplier: 1,
      //     timeline: "27th Sept 2025",
      //     process: "-",
      //     health: "On Track",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "In Progress", color: "text-blue-500" },
      //     action: "",
      //   },
      //   {
      //     id: 7,
      //     type: "End to End Product Development",
      //     supplier: 3,
      //     timeline: "27th Sept 2025",
      //     process: "8",
      //     health: "Delayed",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "Pending Approval", color: "text-amber-500" },
      //     action: "",
      //   },
      //   {
      //     id: 8,
      //     type: "Packaging Only",
      //     supplier: 2,
      //     timeline: "27th Sept 2025",
      //     process: "2",
      //     health: "Critical",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "In Progress", color: "text-blue-500" },
      //     action: "",
      //   },
      //   {
      //     id: 9,
      //     type: "End to End Product Development",
      //     supplier: 3,
      //     timeline: "27th Sept 2025",
      //     process: "3",
      //     health: "On Track",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "In Progress", color: "text-blue-500" },
      //     action: "",
      //   },
      //   {
      //     id: 10,
      //     type: "End to End Product Development",
      //     supplier: 3,
      //     timeline: "27th Sept 2025",
      //     process: "3",
      //     health: "Good",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "Pending Feedback", color: "text-amber-500" },
      //     action: "",
      //   },
      //   {
      //     id: 11,
      //     type: "End to End Product Development",
      //     supplier: 3,
      //     timeline: "27th Sept 2025",
      //     process: "3",
      //     health: "Good",
      //     paymentMilestone: "-",
      //     shipping: "-",
      //     status: { label: "Completed", color: "text-green-500" },
      //     action: "",
      //   },
      // ];

      const demoProjects: Project[] = [];

      setProjects(demoProjects);
      setLoading(false);
    }, 1500);
  }, []);

  // Filter projects based on search query and active filters
  const filteredProjects = projects.filter((project) => {
    // Search filter
    const matchesSearch =
      project.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.timeline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.status.label.toLowerCase().includes(searchQuery.toLowerCase());

    // If no active filters, just use search
    if (activeFilters.length === 0) {
      return matchesSearch;
    }

    // Check if project matches any active filter
    const matchesFilter = activeFilters.some((filter) => {
      if (
        filter === "custom-manufacturing" &&
        project.type === "Custom Manufacturing"
      )
        return true;
      if (filter === "packaging-only" && project.type === "Packaging Only")
        return true;
      if (
        filter === "end-to-end" &&
        project.type === "End to End Product Development"
      )
        return true;

      if (
        filter === "awaiting-approval" &&
        project.status.label === "Awaiting Approval"
      )
        return true;
      if (filter === "approved" && project.status.label === "Approved")
        return true;
      if (filter === "rejected" && project.status.label === "Rejected")
        return true;
      if (filter === "in-progress" && project.status.label === "In Progress")
        return true;
      if (filter === "completed" && project.status.label === "Completed")
        return true;

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
                  placeholder="Search"
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
                      Project Type
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-2 px-4 font-medium">
                    <div className="flex items-center">
                      Supplier
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-2 px-4 font-medium">
                    <div className="flex items-center">
                      Timeline
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-2 px-4 font-medium">Process</th>
                  <th className="py-2 px-4 font-medium">Health</th>
                  <th className="py-2 px-4 font-medium">Payment Milestone</th>
                  <th className="py-2 px-4 font-medium">Shipping</th>
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
                    <td className="py-3 px-4 text-sm">{project.type}</td>
                    <td className="py-3 px-4 text-sm">
                      <p className="bg-gray-200 w-4 rounded-lg">
                        {project.supplier}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center bg-gray-200 w-auto rounded-lg p-1">
                        <span className="mr-2">📅</span>
                        {project.timeline}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{project.process}</td>
                    <td className="py-3 px-4 text-sm">
                      {getHealthBadge(project.health)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {project.paymentMilestone}
                    </td>
                    <td className="py-3 px-4 text-sm">{project.shipping}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`flex items-center ${project.status.color}`}
                      >
                        • {project.status.label}
                      </span>
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
