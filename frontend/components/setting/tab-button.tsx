"use client";

import type React from "react";

import { memo } from "react";

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = memo(({ isActive, onClick, children }: TabButtonProps) => {
  return (
    <button
      className={`rounded-md text-sm shadow-none py-1.5 px-2 font-medium ${
        isActive ? "bg-rose-100" : "border-transparent text-gray-500"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

TabButton.displayName = "TabButton";

export default TabButton;
