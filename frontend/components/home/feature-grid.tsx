import React from "react"
import {
  BarChart3,
  Users,
  LineChart,
  Rocket,
  Shield,
  Scale,
  CheckSquare,
  MessageSquare,
  Bell,
  Database,
  UserPlus,
  Share2,
} from "lucide-react"
import { FeatureCard } from "./feature-card"
import { StatsCard } from "./stats.card"
import KeyFeatures from "./key-features"

export function FeatureGrid() {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Enhanced Efficiency",
      description: "Streamline workflows for increased productivity and project success.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Improved Collaboration",
      description: "Facilitate team communication, fostering synergy among project stakeholders.",
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Real-time Insights",
      description: "Gain actionable data and insights instantly for informed decision-making.",
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Faster Time-to-Market",
      description: "Accelerate project timelines and deliver products or services to market quickly.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Increased Accountability",
      description: "Promote accountability among team with clear roles and responsibilities.",
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Scalability",
      description: "Easily scale to meet evolving business needs and project requirements.",
    },
  ]

  const additionalFeatures = [
    {
      icon: <CheckSquare className="w-6 h-6" />,
      title: "Efficient Task Tracking",
      description: "Streamline task monitoring for productivity.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Smooth Communication",
      description: "Enhance team collaboration with messaging.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Automated Reminders",
      description: "Never miss a deadline with automated reminders.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Simple Data Syncing",
      description: "Sync data effortlessly across platforms.",
    },
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: "Member Management",
      description: "Effortlessly manage team members' roles.",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Seamless Integrations",
      description: "Easily share the relevant team information.",
    },
  ]

  return (
    <section className="container mx-auto px-4 z-50 -translate-y-40 max-w-7xl">
      <div className="text-center mb-16">
        <div className="text-sm text-gray-900 mb-2 bg-gray-100 py-1 px-3 rounded-full w-fit mx-auto">How KollaBee Works</div>
        <h2 className="text-4xl mb-4">Explore KollaBee's Key Features</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the core functionalities that make SAP the ultimate solution for efficient project management.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-24">
        <div className="grid gap-3">
          {features.slice(0, 3).map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
        <div className=" h-full">
          <StatsCard />
        </div>
        <div className="grid gap-3">
          {features.slice(3).map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>

        {/* <KeyFeatures /> */}
    </section>
  )
}