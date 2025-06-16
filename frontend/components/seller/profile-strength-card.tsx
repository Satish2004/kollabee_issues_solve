import React, { useEffect } from "react";
import { useProfileData } from "@/app/(protected)/(seller)/seller/profile/hooks/use-profile-data";
import { useProfileSections } from "@/hooks/use-profile-sections";

const SECTION_COLORS = [
  "#6D28D9", // Company Details (purple-900)
  "#8B5CF6", // Personal Information (purple-700)
  "#A78BFA", // Describe your brand (purple-400)
  "#EC4899", // Certifications (pink-500)
  "#E5E7EB", // Add details (gray-200)
  "#FBBF24", // Extra (yellow-400, fallback)
  "#F59E42", // Extra (orange-400, fallback)
];

const ProfileStrengthCard = () => {
  const { steps } = useProfileSections();
  const {
    stepsToBeCompleted,
    loadProfileCompletion,
    isLoading,
  } = useProfileData();

  useEffect(() => {
    loadProfileCompletion();
    // eslint-disable-next-line
  }, []);

  const totalSteps = steps.length;
  const completedSteps = totalSteps - stepsToBeCompleted.length;
  const percent = Math.round((completedSteps / totalSteps) * 100);

  // Always use unique color for each section
  const getSectionColor = (idx: number) => SECTION_COLORS[idx] || "#E5E7EB";

  // Donut chart sizing
  const radius = 48; // Larger radius
  const stroke = 24; // Thicker stroke
  const gapAngle = 4; // More visible gap between segments
  const totalSegments = steps.length;
  const stepAngle = (360 - totalSegments * gapAngle) / totalSegments;

  // Helper to convert polar to cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Helper to describe an SVG arc
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-full flex flex-col items-center">
      <div className="flex items-center w-full mb-2">
        <svg width="20" height="20" className="mr-2" viewBox="0 0 20 20" fill="none"><path d="M3 17V15C3 13.8954 3.89543 13 5 13H15C16.1046 13 17 13.8954 17 15V17" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="7" r="4" stroke="#222" strokeWidth="1.5"/></svg>
        <span className="font-bold text-base text-black">Your Profile Strength</span>
      </div>
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg width="140" height="140" viewBox="0 0 140 140" className="block">
          {/* Segmented arcs for each step */}
          {steps.map((step, idx) => {
            const startAngle = idx * (stepAngle + gapAngle);
            const endAngle = startAngle + stepAngle;
            const isCompleted = idx < completedSteps;
            return (
              <path
                key={step.id}
                d={describeArc(70, 70, radius, startAngle, endAngle)}
                stroke={isCompleted ? getSectionColor(idx) : '#F3F4F6'}
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
              />
            );
          })}
          {/* Percentage text */}
          <text x="70" y="78" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#222">
            {isLoading ? "--" : `${percent}%`}
          </text>
        </svg>
      </div>
      <div className="w-full mt-2 mb-3">
        <div className="font-bold text-xl text-black mb-2">List to updates</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {steps.map((step, idx) => {
            const isIncomplete = stepsToBeCompleted.includes(idx + 1);
            return (
              <div key={step.id} className="flex items-center">
                <span
                  className="inline-block w-3.5 h-3.5 rounded mr-2"
                  style={{ background: getSectionColor(idx), opacity: isIncomplete ? 1 : 0.3 }}
                ></span>
                <span className="text-l text-black font-medium" style={{ opacity: isIncomplete ? 1 : 0.5 }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="w-full mt-2 py-2 rounded-lg font-semibold text-base text-white"
        style={{
          background: "linear-gradient(90deg, #6D28D9 0%, #FBBF24 50%, #EC4899 100%)",
          boxShadow: "0 2px 8px 0 rgba(236,72,153,0.10)",
        }}
        onClick={() => window.location.href = "/seller/profile"}
      >
        Take Action
      </button>
    </div>
  );
};

export default ProfileStrengthCard;