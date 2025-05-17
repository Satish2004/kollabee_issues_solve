import FaqSection from "@/components/common/faq-section";

export default function FaqPage() {
  return (
    <div className=" bg-white rounded-lg py-12 px-4">
      <div className="">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about our platform and services
          </p>
        </div>

        <FaqSection />
      </div>
    </div>
  );
}
