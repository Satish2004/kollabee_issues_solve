import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FeatureGrid } from "@/components/home/feature-grid"
import { LandingNavbar } from "@/components/home/landing-navbar"
import { ArrowRight } from "lucide-react"
import ProductShowcase from "@/components/home/product-showcase";
import SAPFeatures from "@/components/home/sap-features";
import WhyKollabee from "@/components/home/why-kollabee"
import ContactSection from "@/components/home/contact-section"
import PricingSection from "@/components/home/pricing-section"
import TestimonialsSection from "@/components/home/testimonials-section"
import FreeTrialContact from "@/components/home/free-trial"
import WhatKollabee from "@/components/home/what-kollabee"
import KeyFeatures from "../components/home/key-features"
import Footer from "@/components/home/footer"


export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background gradient container */}
      <div
        className="absolute inset-0 h-[120vh] overflow-hidden"
        style={{
          background: `
            linear-gradient(to bottom, 
              transparent 60%, 
              white 100%
            ),
            linear-gradient(135deg, 
              #fef3ea 0%, 
              #ffd7a7 40%,
              #f95200 90%
            ),
            linear-gradient(135deg, 
              #fdd3b5 0%, 
              rgb(241, 83, 15) 100%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative pt-4">
        {/* Navigation */}
        <LandingNavbar />

        {/* Hero Section */}
        <main className="container mx-auto px-4 pt-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6 bg-white w-fit mx-auto p-3 rounded-xl">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                ))}
              </div>
              <span className="text-gray-800">30k+ Companies Joined Already</span>
              <Button size="lg" className="bg-gradient-to-r from-[#930a72] via-[#db4d60] to-[#f2bc6d] text-white hover:opacity-90 font-semibold text-lg h-12 flex justify-between rounded-[8px] items-center px-6">
                <span>
                  <Link href="/signup">Create Account</Link>
                </span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 max-w-6xl mx-auto">
              Transform Your Vision Into Reality in Weeks, Not Months
            </h1>
            <p className="text-gray-900 max-w-6xl mx-auto mb-20 text-lg">
              Turn your startup ideas into market-ready products with a technical partner who moves at startup speed.
            </p>

            {/* Dashboard Preview with double border and fade effect */}
            <div className="relative mx-auto max-w-7xl">
              {/* Outer blur border */}
              <div className="absolute inset-0 -m-14 rounded-lg bg-white/30 backdrop-blur-sm shadow-[0_0_1px_rgba(0,0,0,0.05)]" />

              {/* Inner blur border */}
              <div className="absolute inset-0 -m-8 rounded-lg bg-white/40 backdrop-blur-md shadow-[0_0_1px_rgba(0,0,0,0.08)]" />

              {/* Main content container */}
              <div className="relative rounded-lg bg-white overflow-hidden">
                <div className="relative w-full" style={{ paddingTop: "60%" }}>
                  <Image
                    src="/dashboard-preview.png"
                    alt="KollaBee Dashboard"
                    fill
                    className="object-cover object-top rounded-[1.25rem]"
                    priority
                    style={{
                      clipPath: "polygon(0% 0%, 100% 0%, 100% 80%, 0% 80%)",
                    }}
                  />
                  {/* Gradient overlay for fade effect */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.9) 60%, white 70%)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <FeatureGrid />
      <KeyFeatures />
      <SAPFeatures />
      <WhyKollabee />
      <FreeTrialContact />
      <WhatKollabee />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
~