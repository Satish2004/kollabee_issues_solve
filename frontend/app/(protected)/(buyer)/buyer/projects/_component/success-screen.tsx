"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "./create-projects-context";

interface SuccessScreenProps {
  onViewSuppliers: () => void;
}

export default function SuccessScreen({ onViewSuppliers }: SuccessScreenProps) {
  const { formData } = useFormContext();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-amber-50 p-8 rounded-xl">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="w-16 h-16 rounded-full border-2 border-[#FF0066] flex items-center justify-center">
          <Check className="w-8 h-8 text-[#FF0066]" />
        </div>

        <p className="text-xl text-center max-w-lg">
          Based on your requirements, we've found suppliers ready to fulfill
          your project needs!
        </p>

        <Button
          onClick={onViewSuppliers}
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold"
        >
          View Matched Suppliers
        </Button>
      </div>
    </div>
  );
}
