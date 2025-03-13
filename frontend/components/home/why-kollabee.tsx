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
    <section className="py-40 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="inline-block bg-gray-100 rounded-full px-4 py-1.5 text-sm">Why KollaBee</div>
          <h2 className="text-5xl font-bold leading-tight">Choose KollaBee for Seamless Supply Management</h2>
          <p className="text-gray-600">
            KollaBee simplifies teamwork by combining project management, file sharing, and communication tools in one
            seamless platform.
          </p>
          <Button className="bg-gradient-to-r from-[#9b0f71] via-[#e4715d] to-[#f2bb6d] text-white text-lg hover:opacity-90 rounded-[5px]">
            Get Started
          </Button>
        </div>

        {/* Right Column - Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="bg-[#ED4B5E] rounded-[10px] text-white w-fit p-2">{feature.icon}</div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}