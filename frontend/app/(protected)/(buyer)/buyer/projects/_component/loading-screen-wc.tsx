"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [activeBar, setActiveBar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBar((prev) => (prev === 2 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-amber-50 p-8 rounded-xl">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-2xl font-medium text-center">Loading...</h1>

        <div className="flex space-x-3 w-full max-w-md">
          {[0, 1, 2].map((bar) => (
            <div
              key={bar}
              className="flex-1 h-2 rounded-full overflow-hidden bg-pink-100"
            >
              <div
                className={`h-full bg-gradient-to-r from-[#FF0066] to-[#FF9933] rounded-full transition-all duration-500 ease-in-out ${
                  bar < activeBar
                    ? "w-full"
                    : bar === activeBar
                    ? "w-full animate-fill-bar"
                    : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
