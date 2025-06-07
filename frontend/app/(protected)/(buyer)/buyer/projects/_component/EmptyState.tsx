import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface EmptyStateProps {
  onCreateProject: () => void;
}

const EmptyState = ({ onCreateProject }: EmptyStateProps) => {
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
          onClick={onCreateProject}
        >
          <PlusIcon size={20} className="text-white mr-2" />
          Create Project
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
