import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeaderActions() {
  return (
    <div className="flex items-center gap-4 w-full justify-end bg-white p-4 rounded-lg">
      <Button
        variant="outline"
        className="border-[#ea3d4f] text-[#ea3d4f] hover:bg-[#ea3d4f]/10"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Report
      </Button>
      <Button className="bg-[#ea3d4f] text-white hover:bg-[#ea3d4f]/90">
        Promote New Product
      </Button>
    </div>
  );
}
