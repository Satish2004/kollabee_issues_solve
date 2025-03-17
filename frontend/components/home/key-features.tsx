import { Bell, CheckSquare, ClipboardList, FileText, MessageCircle, RefreshCw, Settings, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type React from "react" // Added import for React

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center pt-6">
        <div className="p-3 bg-[#ED4B5E] text-white rounded-lg mb-4">{icon}</div>
        <h3 className="text-lg font-bold mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-center text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function KeyFeatures() {
  const features = [
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Efficient Task Tracking",
      description: "Streamline task monitoring for productivity.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Smooth Communication",
      description: "Enhance team collaboration with messaging.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Automated Reminders",
      description: "Never miss a deadline with automated reminders.",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Simple Data Syncing",
      description: "Sync data effortlessly across platforms.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Member Management",
      description: "Effortlessly manage team members' roles.",
    },
    {
      icon: <CheckSquare className="w-6 h-6" />,
      title: "Automated Reminders",
      description: "Never miss a deadline with automated reminders.",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Seamless Integrations",
      description: "Easily share the relevant task seamlessly.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Document Sharing",
      description: "Easily share the relevant task documents.",
    },
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto -translate-y-20">
      <div className="text-center mb-12">
        <div className="inline-block bg-gray-100 rounded-full px-4 py-1.5 text-sm mb-4">KollaBee Key Features</div>
        <h2 className="text-4xl mb-4">Explore KollaBee's Key Features</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the core functionalities that make SAP the ultimate solution for efficient project management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {features.slice(0, 6).map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {features.slice(6, 8).map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  )
}

