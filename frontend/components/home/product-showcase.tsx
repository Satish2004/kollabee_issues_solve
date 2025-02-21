import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Users, Clock, Layout, Share2 } from "lucide-react"
import Image from "next/image"

export default function ProductShowcase() {
  const features = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-pink-600" />,
      title: "Intuitive Task Management for Streamlined Workflow",
      description: "Streamline task monitoring for productivity."
    },
    {
      icon: <Users className="w-6 h-6 text-pink-600" />,
      title: "Real-time Collaboration Tools",
      description: "Enhance team collaboration with messaging."
    },
    {
      icon: <Layout className="w-6 h-6 text-pink-600" />,
      title: "Customizable Dashboards",
      description: "Create personalized views that match your workflow."
    },
    {
      icon: <Share2 className="w-6 h-6 text-pink-600" />,
      title: "Seamless Integration",
      description: "Integrate with your existing tools seamlessly."
    }
  ];

  const benefitCards = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Dynamic Task Management",
      description:
        "Effortlessly assign, track, and prioritize tasks to keep projects on schedule and teams aligned for success.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Collaboration",
      description: "Enhance teamwork and productivity with instant communication and file sharing.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Agile Workflow Optimization",
      description: "Adapt quickly to the changing project requirements with flexible workflows designed.",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">KollaBee Key Features</span>
          <h2 className="text-3xl font-bold mt-4 mb-2">Discover the Remarkable Features of SAP</h2>
          <p className="text-gray-600">
            Explore SAP's standout features that drive productivity and success. From task tracking to seamless collaboration, discover how SAP transforms project management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-r from-pink-500 to-orange-400 rounded-2xl p-8 text-white">
            <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
              <Image
                src="/keyExample.png"
                alt="Product Demo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold">4.9</span>
                <span className="text-sm ml-1">Rating</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold">240K+</span>
                <span className="text-sm ml-1">Views</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Intuitive Task Management for Streamlined Workflow</h3>
            <p className="text-sm opacity-90">Real-time Collaboration Tools for Enhanced Teamwork</p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

