"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import ContactSupplierForm from "./contact-supplier-form";

interface ContactSupplierButtonProps {
  supplierId: string;
  supplierName: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function ContactSupplierButton({
  supplierId,
  supplierName,
  variant = "default",
  size = "default",
  className = "",
}: ContactSupplierButtonProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = (conversationId: string) => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={"w-full gradient-border gradient-text font-bold py-2 sm:py-6 px-3 sm:px-4 text-xs sm:text-sm" + className}
          // size={size}
        >
          Contact Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <ContactSupplierForm
          supplierId={supplierId}
          supplierName={supplierName}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
