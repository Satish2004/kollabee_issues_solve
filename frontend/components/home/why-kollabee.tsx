import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Users, Medal, Shield } from "lucide-react"

export default function WhyKollabee() {
  const features = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Innovative Solutions",
      description: "Cutting-edge tools for modern project management needs.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Reliable Support",
      description: "Cutting-edge tools for modern project management needs.",
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: "Proven Results",
      description: "Track record of driving success and delivering exceptional.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Proven Results",
      description: "Robust measures safeguarding your.",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Why KollaBee</span>
          <h2 className="text-3xl font-bold mt-4">Choose KollaBee for Seamless Supply Management</h2>
          <p className="text-gray-600 mt-2">
            KollaBee simplifies teamwork by combining project management, file sharing, and communication tools in one seamless platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovative Solutions</h3>
            <p className="text-gray-600">Cutting-edge tools for modern project management needs.</p>
          </div>
          {/* Add more reasons */}
        </div>
      </div>
    </section>
  )
}

