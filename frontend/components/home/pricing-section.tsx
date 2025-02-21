import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Box, Building2, CheckCircle2, CheckSquare, CheckSquare2, ClipboardList, FileText, Info, MessageCircle, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

export default function PricingSection() {
  const features = [
    "Task Management",
    "Real-time Collaboration",
    "Customizable Dashboards",
    "Advanced Analytics",
    "Resource Allocation",
    "Mobile Accessibility",
  ]

  const includedFeatures = [
    {
      icon: <ClipboardList className="w-5 h-5" />,
      text: "Task Management",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Real-time Collaboration",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      text: "Document Sharing",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      text: "Client Communication",
    },
  ]

  const plans = [
    {
      name: "Starter",
      badge: "For Individuals",
      price: "$599",
      description: "Affordable option for small teams seeking essential project management.",
      icon: <Box className="w-8 h-8" />,
      features: [true, true, true, false, false, false],
    },
    {
      name: "Pro",
      badge: "For Startups",
      price: "$999",
      description: "Comprehensive package tailored for growing businesses.",
      icon: <Building2 className="w-8 h-8" />,
      features: [true, true, true, true, false, false],
      highlight: true,
    },
    {
      name: "Enterprise",
      badge: "For Organizations",
      price: "$1,999",
      description: "Customized solutions for large enterprises with robust features.",
      icon: <Building2 className="w-8 h-8" />,
      features: [true, true, true, true, true, true],
    },
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center space-y-6 mb-12">
        <div className="inline-block bg-gray-100 rounded-full px-4 py-1.5 text-sm">Plans</div>
        <h2 className="text-4xl font-bold max-w-3xl mx-auto leading-tight">
          Flexible and Scalable Pricing Plans
          <br />
          Designed to Empower Teams of All Sizes
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Discover KollaBee, your ultimate solution for seamless project management. From Startups to Enterprises— With
          Powerful Collaboration, Seamless Project Management, and Growth-Driven Features
        </p>

        {/* Pricing Toggle */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button variant="default" className="bg-[#ED4B5E] hover:bg-[#ED4B5E]/90">
            Monthly
          </Button>
          <Button variant="ghost">Yearly</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className={cn("relative", plan.highlight && "bg-gray-100")}>
            {plan.highlight && (
              <div className="absolute -top-3 left-0 right-0 mx-auto w-max">
                <div className="bg-gradient-to-r from-[#ED4B5E] to-[#F9A825] text-white text-sm px-4 py-1 rounded-full">
                  Use "FIRST100" code for 60% Discount
                </div>
              </div>
            )}
            <CardHeader className="space-y-4 pt-8">
              <div className="text-[#ED4B5E]">{plan.icon}</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <span className="bg-gray-100 text-xs px-2 py-1 rounded-full">{plan.badge}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/ Per Yearly</span>
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                className={cn(
                  "w-full",
                  plan.highlight
                    ? "bg-gradient-to-r from-[#ED4B5E] to-[#F9A825] text-white hover:opacity-90"
                    : "border-2 bg-gradient-to-r from-[#ED4B5E] to-[#F9A825] text-transparent bg-clip-text border-[#ED4B5E]",
                )}
              >
                Get Started
              </Button>

              <div className="space-y-4">
                <div className="font-semibold">Features Included:</div>
                {features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {plan.features[featureIndex] ? (
                        <CheckSquare2 fill="#ED4B5E" className="w-8 h-8 text-white" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={cn("", !plan.features[featureIndex] && "text-gray-400")}>{feature}</span>
                    </div>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-20 text-center">
        <h3 className="text-xl font-semibold mb-8">All Plans Include</h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {includedFeatures.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2">
                <span className="text-[#ED4B5E]">{feature.icon}</span>
                <span className="text-sm">{feature.text}</span>
              </div>
              {index < includedFeatures.length - 1 && <div className="hidden md:block w-px h-4 bg-gray-200" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

