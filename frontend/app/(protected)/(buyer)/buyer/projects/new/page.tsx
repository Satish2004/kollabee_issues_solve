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
import CreateProjects from "../_component/CreateProjects";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IoFilterOutline } from "react-icons/io5";
import { HiArrowsUpDown } from "react-icons/hi2";
import { FormProvider } from "../_component/create-projects-context";
import projectApi from "@/lib/api/project";
import type { Project } from "@/types/api";

const ProjectsPage = () => {
  return (
    <FormProvider>
      <CreateProjects />
    </FormProvider>
  );
};

export default ProjectsPage;
