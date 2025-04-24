import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface ProjectsHeaderProps {
  onCreateProject: () => void;
}

const ProjectsHeader = ({ onCreateProject }: ProjectsHeaderProps) => {
  return (
    <div className="w-full h-[100px] flex justify-end items-center rounded-xl mb-8 bg-white border px-5">
      <Button
        className="gradient-border gradient-text"
        onClick={onCreateProject}
      >
        <PlusIcon className="mr-2 h-4 w-4 text-rose-500" />
        Create Project
      </Button>
    </div>
  );
};

export default ProjectsHeader;
