"use client";

import CreateProjects from "./_component/CreateProjects";
import EmptyState from "./_component/EmptyState";
import ProjectsHeader from "./_component/ProjectsHeader";
import ProjectsTable from "./_component/ProjectsTable";
import { FormProvider } from "./_component/create-projects-context";
import projectApi from "@/lib/api/project";
import type { Project } from "@/types/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const ProjectsPage = () => {
  const router = useRouter();
  const [formActive, setFormActive] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const data = await projectApi.getProjects();
      console.log("Projects data:", data.length);

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
    const fetchProjects = async () => {
      const data: any[] = await fetchData();
      // console.log("Fetched projects:", data);
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Filter projects based on search query and active filters
  const filteredProjects = projects.filter((project) => {
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

  // Empty state - no projects
  if (!loading && projects.length === 0) {
    return (
      <EmptyState onCreateProject={() => router.push("/buyer/projects/new")} />
    );
  }

  // Projects dashboard
  return (
    <div className=" px-0 md:px-6 w-full">
      <ProjectsHeader
        onCreateProject={() => router.push("/buyer/projects/new")}
      />

      <div className="w-full h-full bg-white rounded-xl border flex flex-col p-4 gap-3">
        {/* Projects section */}
        <h2 className="text-base font-medium mr-4">Projects Overview</h2>
        <ProjectsTable
          loading={loading}
          filteredProjects={filteredProjects}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          router={router}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
