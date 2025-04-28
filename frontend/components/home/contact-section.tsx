"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { MoveUpRight } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would add your API call to send the message
      // await sendMessage(formData);

      toast.success("Message sent successfully!");
      // Clear form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              Contact Us
            </span>
            <h2 className="text-3xl font-bold mt-4 mb-4">
              Get in Touch with Us
            </h2>
            <p className="text-gray-600 mb-8">
              Reach out to us for inquiries, support, or partnership
              opportunities. We're here to assist you!
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 rounded-xl border border-[#e6e9ee] p-2">
                <div className="p-3 border border-gray-300 rounded-xl bg-gray-100">
                  <Mail className="w-8 h-8 md:w-8 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">You can email us here</p>
                  <a
                    href="mailto:hello@sap.com"
                    className="text-base font-semibold"
                  >
                    hello@sap.com
                  </a>
                </div>
                <div className="bg-[#f8f9fa] flex justify-start rounded-3xl border border-[#e6e9ee] w-20 sm:w-40 md:w-80">
                  <div className="p-2 border border-gray-300 rounded-full w-auto bg-[#f8f9fa]">
                    <MoveUpRight className=" text-gray-700" strokeWidth={1.7} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-[#e6e9ee] p-2">
                <div className="p-3 border border-gray-300 rounded-xl bg-gray-100">
                  <Phone className="w-8 h-8 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Or give us a call</p>
                  <a href="tel:+1234567890" className="text-lg font-semibold">
                    Book a Call
                  </a>
                </div>
                <div className="bg-[#f8f9fa] flex w-20 sm:w-40 justify-start rounded-3xl border border-[#e6e9ee]  md:w-80">
                  <div className="p-2 border  border-gray-300 rounded-full w-fit bg-[#f8f9fa]">
                    <MoveUpRight className=" text-gray-700" strokeWidth={1.7} />
                  </div>
                </div>
              </div>

              <div className="flex items-center   gap-4 rounded-xl border border-[#e6e9ee] p-2">
                <div className="p-3 border border-gray-300 rounded-xl bg-gray-100">
                  <MapPin className="w-8 h-8 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <a
                    className="text-lg font-semibold cursor-pointer"
                    onClick={() =>
                      window.open(
                        "https://maps.app.goo.gl/1234567890",
                        "_blank"
                      )
                    }
                  >
                    Get Directions
                  </a>
                </div>
                <div className="bg-[#f8f9fa] flex w-20 sm:w-40 justify-start  rounded-3xl border border-[#e6e9ee]  md:w-80">
                  <div className="p-2 border border-gray-300 rounded-full w-fit bg-[#f8f9fa]">
                    <MoveUpRight className=" text-gray-700" strokeWidth={1.7} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-[#e6e9ee]">
            <h3 className="text-xl font-bold mb-2">Send Us a Message</h3>
            <p className="text-sm text-neutral-500 mb-4 font-semibold">
              Use our convenient contact form to reach out with questions,
              feedback, or collaboration inquiries.
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={6}
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                required
                className="w-full h-full px-4 py-3 rounded-lg  bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#930a72] via-[#db4d60] to-[#f2bc6d]"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
