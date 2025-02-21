import Image from "next/image"
import { Instagram, Linkedin, Twitter, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Testimonial {
  quote?: string;
  text?: string;
  title?: string;
  content?: string;
  author: string;
  position: string;
  image: string;
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      quote: "Game-changer for project efficiency!",
      text: "SAP's collaborative tools have transformed how...",
      author: "John Doe",
      position: "CEO At Zenith",
      image: "/dashboard1.png"
    },
    {
      quote: "Effortless collaboration with SAP!",
      text: "SAP's collaborative tools have transformed how...",
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Our Testimonials</span>
          <h2 className="text-3xl font-bold mt-4">What Our Customers Are Saying</h2>
          <p className="text-gray-600 mt-2">
            Read testimonials from our satisfied customers and learn how KollaBee has
            transformed their project management experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={testimonial.image}
                  alt={testimonial.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">{testimonial.quote}</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">{testimonial.text}</p>
                <div className="mt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

