"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type CollapsibleSectionProps = {
  id: string;
  heading: string;
  children: React.ReactNode;
};

export default function CollapsibleSection({
  id,
  heading,
  children,
}: CollapsibleSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="mb-4" id={id}>
      {/* Heading Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#171A1F]">{heading}</h2>
        <button
          type="button"
          onClick={toggleCollapse}
          className="text-gray-600 hover:text-gray-900 transition focus:outline-none"
        >
          {isCollapsed ? <ChevronDown /> : <ChevronUp />}
        </button>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && <div className="mt-2 flex flex-col gap-5">{children}</div>}
    </div>
  );
}
