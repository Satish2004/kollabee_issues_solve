import Image from "next/image"
import { Instagram, Linkedin, QuoteIcon, Twitter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaXTwitter } from "react-icons/fa6";










export default function TestimonialsSection() {
  const testimonials = [
    {
      title: "Game-changer for project efficiency!",
      content: "SAP's collaborative tools have transformed how...",
      author: "John Doe",
      position: "CEO At Zenith",
      image: "/dashboard1.png"
    },
    {
      title: "Effortless collaboration with SAP!",
      content: "SAP's collaborative tools have transformed how...",
      author: "John Doe",
      position: "CEO At Zenith",
      image: "/dashboard2.png"
    },
    {
      image: "/dashboard3.png",
      title: "Efficient, reliable, and user-friendly!",
      content: "SAP's collaborative tools have transformed how...",
      author: "John Doe",
      position: "CEO At Zenith",
    },
    {
      image: "/dashboard4.png",
      title: "Streamlined workflows, great results!",
      content: "SAP's collaborative tools have transformed how...",
      author: "John Doe",
      position: "CEO At Zenith",
    },
  ]

  const metrics = [
    {
      percentage: "25%",
      label: "Operational Efficiency",
      type: "Increased",
    },
    {
      percentage: "20%",
      label: "Project Turnaround Time",
      type: "Reduced",
    },
    {
      percentage: "30%",
      label: "Resource Utilization",
      type: "Increased",
    },
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-6 mb-16">
        <div className="inline-block bg-gray-100 rounded-full px-4 py-1.5 text-sm">Our Testimonials</div>
        <h2 className="text-4xl font-bold">What Our Customers Are Saying</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Read testimonials from our satisfied customers and learn how KollaBee has transformed their project management
          experience.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white border border-gray-200 p-2 rounded-lg shadow-sm flex overflow-hidden">
            <div className="relative w-[180px] flex-shrink-0">
              <Image
                src={testimonial.image || "/placeholder.svg"}
                alt={testimonial.author}
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <div className="p-2 flex flex-col w-full justify-between">
              <div className="mb-20">
                <QuoteIcon className="text-2xl rotate-180 leading-none" fill="currentColor" />
                <h3 className="text-lg font-bold leading-tight">{testimonial.title}</h3>
                <p className="text-gray-600 text-sm">{testimonial.content}</p>
              </div>
              <div className="flex items-center justify-between w-full  mt-4">
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.position}</div>







                </div>
                <button className="ml-auto p-2 bg-gray-100 rounded-[5px]">
                  <FaXTwitter className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study */}
      <div className=" h-80 rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid md:grid-cols-[1.5fr,1fr]">
          <div className="relative h-[300px]">
            <Image src="/placeholder.svg?height=600&width=800" alt="Office building" fill className="object-cover" />
          </div>
          <div className="p-8 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">How KollaBee Helped Businesses</h3>
            <p className="text-gray-600 mb-8">
              KollaBee has been instrumental in streamlining our project management processes, enabling seamless
              collaboration and enhancing overall efficiency.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>EJ</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Emily Johnson</div>
                <div className="text-sm text-gray-600">CEO at Zenith</div>
              </div>
              <div className="flex gap-4 ml-auto">
                <Linkedin className="w-5 h-5 text-gray-400" />
                <FaXTwitter className="w-5 h-5 text-gray-400" />
                <Instagram className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {metrics.map((metric, index) => (
                <div key={index}>
                  <div className="text-2xl font-bold mb-1">{metric.percentage}</div>
                  <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                  <div className="text-sm text-[#ED4B5E]">{metric.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}