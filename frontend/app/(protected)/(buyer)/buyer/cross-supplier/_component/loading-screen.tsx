"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Searching", "Matching", "Finalizing"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev === 2 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-amber-50 p-8 rounded-xl">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-2xl font-medium text-center">
          {steps[activeStep]} Suppliers for Your Project
        </h1>

        <div className="flex space-x-3 w-full max-w-md">
          {[0, 1, 2].map((step) => (
            <div
              key={step}
              className="flex-1 h-2 rounded-full overflow-hidden bg-pink-100"
            >
              <div
                className={`h-full bg-gradient-to-r from-[#FF0066] to-[#FF9933] rounded-full transition-all duration-500 ease-in-out ${
                  step < activeStep
                    ? "w-full"
                    : step === activeStep
                    ? "w-full animate-fill-bar"
                    : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* <div className="flex justify-between w-full max-w-md mt-2 text-sm text-gray-500">
          {steps.map((label, index) => (
            <div
              key={index}
              className={`transition-colors duration-300 ${
                index <= activeStep ? "text-[#FF0066] font-medium" : ""
              }`}
            >
              {label}
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
}
