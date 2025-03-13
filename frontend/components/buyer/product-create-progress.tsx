"use client";

import { useEffect, useState } from "react";

const ProgressSidebar = () => {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "upload-cover", label: "Upload Art Cover" },
    { id: "general-info", label: "General Information" },
    { id: "product-details", label: "Product Details" },
    { id: "documents", label: "Documents (if any)" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleSectionClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-72 bg-white shadow-lg rounded-xl pb-40 overflow-hidden overflow-y-auto  z-50 ">
      <div className="p-6">
        <section className="flex flex-col gap-3">
          <div className="mb-2">
            <p className="text-sm text-[#171A1F] mb-3">Last update</p>
            <p className="text-[1.125rem]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-[#171A1F] mb-3">Status</p>
            <p>Draft</p>
          </div>
        </section>

        {/* Separator */}
        <div className="border-t border-gray-200 my-4 w-full"></div>
        <h3 className="text-lg font-semibold mb-4">Artwork Information</h3>

        {/* Sidebar Menu with Vertical Line */}
        <div className="relative">
          {/* Vertical Line on the Right */}
          <div className="absolute right-0 top-0 h-full w-1 bg-white"></div>
          <div className="space-y-4 relative">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`w-full text-left py-2 px-4 rounded-md text-gray-700 focus:outline-none flex items-center gap-2 relative ${activeSection === section.id ? "font-bold text-black" : ""
                  }`}
              >
                {/* Active Indicator */}
                {activeSection === section.id && (
                  <div className="absolute right-0 h-full w-1 bg-black"></div>
                )}
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-4 w-full"></div>

        <div className="space-y-4">
          <h1 className="text-lg font-semibold mb-4">Publish Product</h1>
          <button
            className="w-full text-left py-2 px-4 rounded-md text-gray-700 focus:outline-none"
            onClick={() => handleSectionClick("price-details")}
          >
            Set selling price & Other
          </button>
          <button
            className="w-full text-left py-2 px-4 rounded-md text-gray-700 focus:outline-none"
            onClick={() => handleSectionClick("review-publish")}
          >
            Review and Publish
          </button>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-2"></div>
        <button className="text-red-600 pl-5">Cancel</button>
      </div>
    </div>
  );
};

export default ProgressSidebar;