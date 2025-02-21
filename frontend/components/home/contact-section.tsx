import { Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Contact Us</span>
            <h2 className="text-3xl font-bold mt-4 mb-4">Get in Touch with Us</h2>
            <p className="text-gray-600 mb-8">
              Reach out to us for inquiries, support, or partnership opportunities.
              We're here to assist you!
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">You can email us here</p>
                  <a href="mailto:hello@sap.com" className="text-lg font-semibold">hello@sap.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Or give us a call</p>
                  <a href="tel:+1234567890" className="text-lg font-semibold">Book a Call</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <a href="#" className="text-lg font-semibold">Get Directions</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <Button className="w-full bg-gradient-to-r from-[#930a72] via-[#db4d60] to-[#f2bc6d]">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

