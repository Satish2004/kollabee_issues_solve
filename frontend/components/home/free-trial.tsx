import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Workflow, HeadphonesIcon } from "lucide-react";
import Image from "next/image";

export default function FreeTrialContact() {
  const trialFeatures = [
    {
      icon: <ArrowRightCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "Seamless transition to paid subscription upon trial completion.",
    },
    {
      icon: <HeadphonesIcon className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "Dedicated customer support during your trial period.",
    },
    {
      icon: <Workflow className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "Hands-on experience with real project scenarios.",
    },
  ];

  const stats = [
    {
      value: "5.6M +",
      label: "Downloads",
    },
    {
      value: "3.2+",
      label: "Active Users",
    },
    {
      value: "4.9",
      label: "Ratings",
    },
    {
      value: "60+",
      label: "Team Members",
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        {/* Left Column */}
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-block bg-gray-100 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm">
              Contact Us
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight">
              Experience KollaBee with Our Free Trial Offer!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Sign up for our free trial to experience SAP's powerful project
              management features firsthand and transform the way you work.
            </p>
          </div>

          {/* Trial Features */}
          <div className="space-y-3 md:space-y-4">
            {trialFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 text-gray-600 border pl-2 py-1.5 sm:py-2 pr-3 sm:pr-6 md:pr-10 rounded-full border-[#E6E9EE] text-xs sm:text-sm overflow-hidden"
              >
                <div className="text-[#ED4B5E] flex-shrink-0">
                  {feature.icon}
                </div>
                <span className="line-clamp-2 sm:line-clamp-1">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2 sm:pt-4">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="w-full rounded-2xl overflow-hidden bg-gray-100 aspect-video">
            {/* Image placeholder - to be replaced by actual image */}
            <Image
              src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/ggligctu42bjhisnp5j6"
              alt="Contact Us"
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full rounded-[5px] border-2 bg-gradient-to-r from-[#E91E63] to-[#F9A825] text-transparent bg-clip-text border-[#E91E63] font-semibold"
            >
              Create Account
            </Button>
            <Button className="w-full rounded-[5px] bg-gradient-to-r from-[#E91E63] to-[#F9A825] text-white hover:opacity-90">
              Log in
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
