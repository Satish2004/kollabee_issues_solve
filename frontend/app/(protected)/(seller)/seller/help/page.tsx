"use client";

import Feedback from "./components/Feedback";
import FaqSection from "@/components/common/faq-section";

// Form validation schema

const FeedbackPage = () => {
  return (
    <div className=" bg-gray-50 rounded-md">
      {/* Main content */}
      <main className="w-full px-5 py-12 ">
        <div className="flex flex-col gap-10">
          {/* Left column - Form */}
          <Feedback />

          <FaqSection />
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
