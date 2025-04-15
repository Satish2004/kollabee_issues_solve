"use client";

import type React from "react";

import { format } from "date-fns";
import { CalendarIcon, Plus, Minus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useFormContext } from "./create-projects-context";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";

const Step3 = ({
  handleNext,
  errors,
  setErrors,
}: {
  handleNext: () => void;
  errors: { [key: string]: string | { [key: string]: string }[] };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      [key: string]: string | { [key: string]: string }[];
    }>
  >;
}) => {
  const { formData, updateFormData, updateNestedFormData } = useFormContext();

  const {
    projectTimelineFrom,
    projectTimelineTo,
    budget,
    pricingCurrency,
    milestones,
  } = formData;

  useEffect(() => {
    console.log("Errors data:", errors);
  }, [errors]);

  const handleAddMilestone = () => {
    const newId =
      milestones.length > 0
        ? Math.max(...milestones.map((m) => Number(m.id))) + 1
        : 1;

    updateFormData("milestones", [
      ...milestones,
      {
        id: newId,
        name: "",
        description: "",
        paymentPercentage: "",
        dueDate: undefined,
      },
    ]);

    setErrors((prevErrors) => ({
      ...prevErrors,
      milestones: Array.isArray(prevErrors.milestones)
        ? [...prevErrors.milestones, {}]
        : [{}],
    }));
  };

  const handleDeleteMilestone = (id: number) => {
    const updatedMilestones = milestones.filter(
      (milestone) => milestone.id !== id
    );
    updateFormData("milestones", updatedMilestones);

    setErrors((prevErrors) => ({
      ...prevErrors,
      milestones: Array.isArray(prevErrors.milestones)
        ? prevErrors.milestones.filter(
            (_, index) => milestones[index].id !== id
          )
        : [],
    }));
  };

  const incrementBudget = () => updateFormData("budget", budget + 1);
  const decrementBudget = () =>
    updateFormData("budget", budget > 0 ? budget - 1 : 0);

  const validateField = (field: string, value: any) => {
    let error = "";
    switch (field) {
      case "projectTimeline":
        if (!value) error = "Project timeline is required.";
        break;
      case "pricingCurrency":
        if (!value) error = "Pricing currency is required.";
        break;
      case "budget":
        if (value <= 0) error = "Budget must be greater than 0.";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const validateMilestoneField = (
    milestoneIndex: number,
    field: string,
    value: any
  ) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value) error = "Milestone Name is required.";
        break;
      case "description":
        if (!value) error = "Milestone Description is required.";
        break;
      case "paymentPercentage":
        if (!value) error = "Milestone Payment Percentage is required.";
        break;
      case "dueDate":
        if (!value) error = "Milestone Due Date is required.";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => {
      const updatedMilestones = Array.isArray(prevErrors.milestones)
        ? [...prevErrors.milestones]
        : [];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        [field]: error,
      };
      return { ...prevErrors, milestones: updatedMilestones };
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white">
      <div className="mb-6">
        <h1 className="text-xl font-medium">Payment & Timeline</h1>
        <p className="text-sm text-muted-foreground">
          Define payment terms, pricing expectations, and project timeline to
          ensure smooth execution.
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Timeline */}
        <div className="space-y-2">
          <Label htmlFor="project-timeline" className="text-sm">
            Project Timeline<span className="text-red-500">*</span>
          </Label>

          <div className="flex items-start space-x-4">
            <div className="flex flex-col w-full">
              <Label htmlFor="project-timeline-from" className="text-sm mb-1.5">
                From<span className="text-red-500">*</span>
              </Label>

              <div className="flex items-center relative">
                <input
                  type="date"
                  id="project-timeline-from"
                  className="w-full border rounded p-2 h-10 focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                  value={
                    projectTimelineFrom
                      ? format(projectTimelineFrom, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    updateFormData("projectTimelineFrom", value);
                    setErrors((prev) => ({ ...prev, projectTimelineFrom: "" }));
                  }}
                />
                <CalendarIcon className="absolute right-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>

              {errors.projectTimelineFrom && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.projectTimelineFrom}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <Label htmlFor="project-timeline-to" className="text-sm mb-1.5">
                To<span className="text-red-500">*</span>
              </Label>

              <div className="flex items-center relative">
                <input
                  type="date"
                  id="project-timeline-to"
                  className="w-full border rounded p-2 h-10 focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
                  value={
                    projectTimelineTo
                      ? format(projectTimelineTo, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    updateFormData("projectTimelineTo", value);
                    setErrors((prev) => ({ ...prev, projectTimelineTo: "" }));
                  }}
                />
                <CalendarIcon className="absolute right-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>

              {errors.projectTimelineTo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.projectTimelineTo}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing and Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pricing-currency" className="text-sm">
              Pricing Currency<span className="text-red-500">*</span>
            </Label>
            <Select
              value={pricingCurrency}
              onValueChange={(value) => {
                updateFormData("pricingCurrency", value);
                setErrors((prev) => ({ ...prev, pricingCurrency: "" }));
              }}
            >
              <SelectTrigger id="pricing-currency">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent className="bg-white z-100">
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
                <SelectItem value="jpy">JPY</SelectItem>
              </SelectContent>
            </Select>
            {errors.pricingCurrency && (
              <p className="text-red-500 text-sm">{errors.pricingCurrency}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm">
              Budget<span className="text-red-500">*</span>
            </Label>
            <div className="flex">
              <Button
                variant="outline"
                size="icon"
                className="rounded-r-none border-r-0 h-10 w-10"
                onClick={incrementBudget}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  updateFormData("budget", value);
                  setErrors((prev) => ({ ...prev, budget: "" }));
                }}
                className="rounded-none text-center h-10"
              />
              <Button
                variant="outline"
                size="icon"
                className="rounded-l-none border-l-0 h-10 w-10"
                onClick={decrementBudget}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            {errors.budget && (
              <p className="text-red-500 text-sm">{errors.budget}</p>
            )}
          </div>
        </div>

        {/* Milestone Headers */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="text-sm font-medium">
            Milestone Name<span className="text-red-500">*</span>
          </div>
          <div className="text-sm font-medium">
            Milestone Description<span className="text-red-500">*</span>
          </div>
          <div className="text-sm font-medium">
            Payment Percentage<span className="text-red-500">*</span>
          </div>
          <div className="text-sm font-medium">
            Due Date<span className="text-red-500">*</span>
          </div>
          <div className="text-sm font-medium">Actions</div>
        </div>

        {/* Milestone Rows */}
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4"
          >
            {/* Milestone Name */}
            <div className="space-y-1">
              <Input
                placeholder="Type Here"
                value={milestone.name}
                onChange={(e) => {
                  const value = e.target.value;
                  updateNestedFormData(
                    "milestones",
                    "name",
                    value,
                    milestone.id
                  );
                  validateMilestoneField(index, "name", value);
                }}
              />
              {Array.isArray(errors.milestones) &&
                errors.milestones[index]?.name && (
                  <p className="text-red-500 text-sm">
                    {errors.milestones[index].name}
                  </p>
                )}
            </div>

            {/* Milestone Description */}
            <div className="space-y-1">
              <Input
                placeholder="Type Here"
                value={milestone.description}
                onChange={(e) => {
                  const value = e.target.value;
                  updateNestedFormData(
                    "milestones",
                    "description",
                    value,
                    milestone.id
                  );
                  validateMilestoneField(index, "description", value);
                }}
              />
              {Array.isArray(errors.milestones) &&
                errors.milestones[index]?.description && (
                  <p className="text-red-500 text-sm">
                    {errors.milestones[index].description}
                  </p>
                )}
            </div>

            {/* Payment Percentage */}
            <div className="space-y-1">
              <Select
                value={milestone.paymentPercentage}
                onValueChange={(value) => {
                  updateNestedFormData(
                    "milestones",
                    "paymentPercentage",
                    value,
                    milestone.id
                  );
                  validateMilestoneField(index, "paymentPercentage", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent className="bg-white z-100">
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                </SelectContent>
              </Select>
              {Array.isArray(errors.milestones) &&
                errors.milestones[index]?.paymentPercentage && (
                  <p className="text-red-500 text-sm">
                    {errors.milestones[index].paymentPercentage}
                  </p>
                )}
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <div className="flex items-center">
                <input
                  type="date"
                  className="w-full border rounded p-2 h-10"
                  value={
                    milestone.dueDate
                      ? format(milestone.dueDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    updateNestedFormData(
                      "milestones",
                      "dueDate",
                      value,
                      milestone.id
                    );
                    validateMilestoneField(index, "dueDate", value);
                  }}
                />
                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
              </div>
              {Array.isArray(errors.milestones) &&
                errors.milestones[index]?.dueDate && (
                  <p className="text-red-500 text-sm">
                    {errors.milestones[index].dueDate}
                  </p>
                )}
            </div>

            {/* Delete Button */}
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => handleDeleteMilestone(milestone.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add Milestone Button */}
        <div>
          <Button
            onClick={handleAddMilestone}
            className="bg-[#FF0066] hover:bg-[#E5005C] text-white"
            size="sm"
          >
            Add Milestone
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step3;
