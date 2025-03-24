"use client";
import { ProgressStepper } from "@/components/onboarding/progress-stepper";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { number } from "zod";

interface Step {
  number: string;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

const CreateProjects = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [currentStage, setCurrentStage] = useState(1);

  const allSteps = [
    {
      number: "01",
      label: "Business Requirements",
      isActive: currentStage === 1,
      isCompleted: currentStage > 1,
    },
    {
      number: "02",
      label: "Product Requirements",
      isActive: currentStage === 2,
      isCompleted: currentStage > 2,
    },
    {
      number: "03",
      label: "Payment and Timeline",
      isActive: currentStage === 3,
      isCompleted: currentStage > 3,
    },
  ];

  const category = [
    {
      id: 1,
      name: "Apparel & Fashion",
    },
    {
      id: 2,
      name: "Automobiles & Motorcycles",
    },
  ];

  return (
    <ErrorBoundary
      FallbackComponent={() => (
        <div>
          <div> An error occurred: </div>
          <div onClick={() => window.location.reload()}>Try Again</div>
        </div>
      )}
    >
      <div className="h-full w-full flex flex-col gap-4">
        <div
          className="flex h-20 gap-1 text-[#EA3D4F] items-center px-6 rounded-md bg-white hover:cursor-pointer"
          onClick={() => {
            if (currentStage === 1) setOpen(false);
            setCurrentStage((curr) => curr - 1);
          }}
        >
          <ArrowLeft className="" />
          {"Back "}
        </div>

        <div className="bg-white w-full h-auto rounded-xl border flex flex-col p-8 gap-4">
          <div className="flex justify-center">
            <ProgressStepper steps={allSteps} />
          </div>

          <div className="p-4">
            <h1 className="text-2xl font-semibold">Business Requirements</h1>
            <p className="text-[#78787A] text-sm mt-2">
              Define the industry and category of the product to ensure accurate
              supplier matching.
            </p>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div>
                <label htmlFor="category" className="text-[#78787A] text-sm">
                  Category
                  <span className="text-[#EA3D4F]">*</span>
                </label>
                <Select
                  value={"Select Category"}
                  onValueChange={(value) => {
                    console.log("Selected Category", value);
                  }}
                >
                  <SelectTrigger className="w-full h-10 rounded-l-md bg-white border border-gray-300 px-3">
                    <SelectValue placeholder="Select Category">
                      Select Category
                    </SelectValue>
                    <SelectContent>
                      {category.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {item.name}
                        </div>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
              </div>
              <div>
                <label htmlFor="industry" className="text-[#78787A] text-sm">
                  Bussiness Name
                  <span className="text-[#EA3D4F]">*</span>
                </label>
                <input
                  type="text"
                  id="industry"
                  className="border border-[#D2D2D2] rounded-md p-2 w-full"
                  placeholder="Type here..."
                />
              </div>

              <div>
                <label htmlFor="category" className="text-[#78787A] text-sm">
                  Product Type
                  <span className="text-[#EA3D4F]">*</span>
                </label>
                <Select
                  value={"Select Category"}
                  onValueChange={(value) => {
                    console.log("Selected Category", value);
                  }}
                >
                  <SelectTrigger className="w-full h-10 rounded-l-md bg-white border border-gray-300 px-3">
                    <SelectValue placeholder="Select Category">
                      Select Category
                    </SelectValue>
                    <SelectContent>
                      {category.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {item.name}
                        </div>
                      ))}
                    </SelectContent>
                  </SelectTrigger>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="ghost"
              className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold"
              onClick={() => setCurrentStage((curr) => curr + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CreateProjects;
