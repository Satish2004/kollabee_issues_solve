"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import ContactSupplierForm from "./contact-supplier-form"
import { useRouter } from "next/navigation"

interface ContactSupplierButtonProps {
  supplierId: string
  supplierName: string
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function ContactSupplierButton({
  supplierId,
  supplierName,
  variant = "default",
  size = "default",
}: ContactSupplierButtonProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = (conversationId: string) => {
    setOpen(false)
    // Navigate to the chat page with the new conversation selected
    router.push(`/chat?conversation=${conversationId}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          Contact Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <ContactSupplierForm
          supplierId={supplierId}
          supplierName={supplierName}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

