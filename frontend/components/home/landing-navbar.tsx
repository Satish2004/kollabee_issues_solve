import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function LandingNavbar() {
  return (
    <div className="w-full border-b bg-white/80 backdrop-blur-sm max-w-6xl mx-auto rounded-xl p-2">
      <div className="container mx-auto px-3">
        <nav className="flex h-20 items-center justify-between">
          {/* Logo and tagline */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-60 w-60">
              <Image
                src="/kollabee-logo.png"
                alt="KollaBee Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center space-x-8 md:flex">
            <Link href="/" className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900">
              Home
            </Link>
            <Link href="/services" className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900">
              Services
            </Link>
            <Link href="/support" className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900">
              Support
            </Link>
            <Link href="/pricing" className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/process" className="text-lg font-semibold text-gray-800 transition-colors hover:text-gray-900">
              Process
            </Link>
          </div>

          {/* Get Started Button */}
          <Button size="lg" className="bg-gradient-to-r from-[#930a72] via-[#db4d60] to-[#f2bc6d] text-white hover:opacity-90 font-semibold text-lg h-14">
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </div>
    </div>
  )
}

