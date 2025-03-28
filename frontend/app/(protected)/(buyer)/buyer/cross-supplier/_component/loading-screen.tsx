"use client";

export default function LoadingScreen() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-amber-50 p-8 rounded-xl">
      <div className="flex flex-col items-center justify-center space-y-8">
        <h1 className="text-2xl font-medium text-center">
          Matching Suppliers for Your Project
        </h1>

        <div className="flex space-x-3">
          <div className="w-32 h-2 bg-gradient-to-r from-[#FF0066] to-[#FF9933] rounded-full animate-pulse"></div>
          <div className="w-24 h-2 bg-pink-200 rounded-full animate-pulse delay-75"></div>
          <div className="w-24 h-2 bg-pink-200 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}
