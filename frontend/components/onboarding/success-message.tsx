"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { PartyPopper } from "lucide-react"

export function SuccessMessage() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-2xl font-semibold">
          <PartyPopper className="w-7 h-7 text-yellow-500" />
          <h2>Success! Your Account is Registered.</h2>
        </div>
        <p className="text-muted-foreground">
          Welcome aboard! We're thrilled to have you join us.
        </p>
      </div>

      <div className="flex justify-center">
        <Button 
          className="bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white px-8"
          onClick={() => router.push('/seller/dashboard')}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
