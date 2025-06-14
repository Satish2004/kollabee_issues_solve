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
  const radius = 36;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const completedCirc = (completedSteps / totalSteps) * circumference;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-full flex flex-col items-center">
      <div className="flex items-center w-full mb-2">
        <svg width="20" height="20" className="mr-2" viewBox="0 0 20 20" fill="none"><path d="M3 17V15C3 13.8954 3.89543 13 5 13H15C16.1046 13 17 13.8954 17 15V17" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="7" r="4" stroke="#222" strokeWidth="1.5"/></svg>
        <span className="font-bold text-base text-black">Your Profile Strength</span>
      </div>
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg width="90" height="90" viewBox="0 0 100 100" className="block">
          {/* Background circle */}
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
          {/* Completed arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#profileStrengthGradient)"
            strokeWidth={stroke}
            strokeDasharray={`${completedCirc} ${circumference}`}
            strokeDashoffset={circumference - completedCirc}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <defs>
            <linearGradient id="profileStrengthGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6D28D9" />
              <stop offset="0.5" stopColor="#FBBF24" />
              <stop offset="1" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          {/* Percentage text */}
          <text x="50" y="56" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#222">
            {isLoading ? "--" : `${percent}%`}
          </text>
        </svg>
      </div>
      <div className="w-full mt-2 mb-3">
        <div className="font-bold text-xl text-black mb-2">List to updates</div>
        <div className="flex flex-col gap-1">
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