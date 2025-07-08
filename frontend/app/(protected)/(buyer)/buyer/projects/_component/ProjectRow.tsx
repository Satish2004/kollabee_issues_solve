"use client";

import { Eye, MessageSquare, Wallet } from "lucide-react";
import { TbCash } from "react-icons/tb";
import { LiaShippingFastSolid } from "react-icons/lia";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/api";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface ProjectRowProps {
  project: Project;
  router: AppRouterInstance;
}

const ProjectRow = ({ project, router }: ProjectRowProps) => {
  return (
    <tr key={project.id} className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 text-sm">
        {
          project.projectTitle
        }
      </td>
      <td className="py-3 px-4 text-sm">
        {project.selectedServices?.join(", ")}
      </td>

      <td className="py-3 px-4 text-sm">
        <p className="bg-[#F4F4F4] w-fit px-2 rounded-md">
          {project.requestedSeller.length}
        </p>
      </td>

      <td className="py-3 px-4 text-sm">
        <p className="bg-[#F4F4F4] w-fit px-2 rounded-md">
          {project.businessName || "N/A"}
        </p>
      </td>

      <td className="py-3 px-4 text-sm">
        <div className="flex items-center bg-[#F4F4F4] px-2 w-fit rounded-md">
          <Wallet className="mr-2 text-[#78787a]" />
          {project.projectTimeline
            ? new Date(project.projectTimeline[0]).toLocaleDateString()
            : "N/A"}
        </div>
      </td>

      <td className="py-3 px-4 text-sm">
        <div className="flex items-center flex-col">-</div>
      </td>


      <td className="py-3 px-4 text-sm">
        {project.milestones?.length > 0 ? (
          <div className="flex flex-col items-center">
            <div
              className="flex w-fit items-center px-2 cursor-pointer bg-[#F4F4F4] gap-2 rounded-md"
              onClick={() => {
                router.push(`/buyer/projects/${project.id}/shipping-details`);
              }}
            >
              <LiaShippingFastSolid className="text-[#78787a]" height={96} />
              Not Started
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">-</div>
        )}
      </td>

      <td className="py-3 px-4 text-sm">
        {project.budget
          ? `$${project.budget} ${project.pricingCurrency?.toUpperCase() || "USD"
          }`
          : "N/A"}
      </td>

      <td className="py-3 px-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="relative w-4 h-4">
            <span className={`
                absolute top-1/2 left-1/2 w-2 h-2 rounded-full  -translate-x-1/2 -translate-y-1/2
                 ${
              project.requestedSeller?.[0]?.status === "APPROVED"
                ? "bg-green-500"
                : project.requestedSeller?.[0]?.status === "REJECTED"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }
        `}></span>
          </span>
          {project.requestedSeller?.length > 0 ? (
            <span className="text-xs text-gray-500">
              ({project.requestedSeller[0].status || "Pending"})
            </span>
          ) : (
            <span className="text-xs text-gray-500">Pending</span>
          )}

        </span>
      </td>

      <td className="py-3 px-4 text-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              router.push(`/buyer/projects/${project.id}/supplier`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>

        </div>
      </td>
    </tr>
  );
};

export default ProjectRow;
