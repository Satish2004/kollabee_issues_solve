import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Workflow, HeadphonesIcon } from "lucide-react";
import Image from "next/image";

export default function FreeTrialContact() {
  const trialFeatures = [
    {
      icon: <ArrowRightCircle className="w-5 h-5" />,
      text: "Seamless transition to paid subscription upon trial completion.",
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5" />,
      text: "Dedicated customer support during your trial period.",
    },
    {
      icon: <Workflow className="w-5 h-5" />,
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
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-20">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-block bg-gray-100 rounded-full px-4 py-1.5 text-sm">
              Contact Us
            </div>
            <h2 className="text-5xl leading-tight">
              Experience KollaBee with Our Free Trial Offer!
            </h2>
            <p className="text-gray-600">
              Sign up for our free trial to experience SAP's powerful project
              management features firsthand and transform the way you work.
            </p>
          </div>

          {/* Trial Features */}
          <div className="space-y-4">
            {trialFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-gray-600 border pl-2 py-2 pr-10 rounded-full w-fit border-[#E6E9EE]"
              >
                <div className="text-[#ED4B5E]">{feature.icon}</div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 h-[400px]">
            {/* Image placeholder - to be replaced by actual image */}
            <Image
              src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/ggligctu42bjhisnp5j6"
              alt="Contact Us"
              width={500}
              height={400}
              className="w-full object-center"
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
