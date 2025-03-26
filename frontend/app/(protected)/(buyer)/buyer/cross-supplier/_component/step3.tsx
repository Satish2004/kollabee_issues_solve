"use client";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "./create-projects-context";
import "react-datepicker/dist/react-datepicker.css";
import { EnhancedCalendar } from "@/components/ui/calender";
import { useEffect } from "react";

const Step3 = ({ handleNext }: { handleNext: () => void }) => {
  const { formData, updateFormData, updateNestedFormData } = useFormContext();

  const { projectTimeline, budget, pricingCurrency, milestones } = formData;

  const handleAddMilestone = () => {
    const newId =
      milestones.length > 0 ? Math.max(...milestones.map((m) => m.id)) + 1 : 1;
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
  };

  const handleDeleteMilestone = (id: number) => {
    updateFormData(
      "milestones",
      milestones.filter((milestone) => milestone.id !== id)
    );
  };

  const incrementBudget = () => updateFormData("budget", budget + 1);
  const decrementBudget = () =>
    updateFormData("budget", budget > 0 ? budget - 1 : 0);

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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10"
                id="project-timeline"
              >
                {projectTimeline ? (
                  format(projectTimeline, "dd/MM/yyyy")
                ) : (
                  <span className="text-muted-foreground">DD/MM/YYYY</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <input
                type="date"
                className="border rounded p-2"
                onChange={(e) =>
                  updateFormData("projectTimeline", e.target.value.split("T"))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Pricing and Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pricing-currency" className="text-sm">
              Pricing Currency<span className="text-red-500">*</span>
            </Label>
            <Select
              value={pricingCurrency}
              onValueChange={(value) =>
                updateFormData("pricingCurrency", value)
              }
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
                onChange={(e) =>
                  updateFormData("budget", Number(e.target.value))
                }
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
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4"
          >
            <Input
              placeholder="Type Here"
              value={milestone.name}
              onChange={(e) =>
                updateNestedFormData(
                  "milestones",
                  "name",
                  e.target.value,
                  milestone.id
                )
              }
            />
            <Input
              placeholder="Type Here"
              value={milestone.description}
              onChange={(e) =>
                updateNestedFormData(
                  "milestones",
                  "description",
                  e.target.value,
                  milestone.id
                )
              }
            />
            <Select
              value={milestone.paymentPercentage}
              onValueChange={(value) =>
                updateNestedFormData(
                  "milestones",
                  "paymentPercentage",
                  value,
                  milestone.id
                )
              }
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-10"
                >
                  {milestone.dueDate ? (
                    format(milestone.dueDate, "dd/MM/yyyy")
                  ) : (
                    <span className="text-muted-foreground">DD/MM/YYYY</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <input
                  type="date"
                  className="border rounded p-2"
                  value={
                    milestone.dueDate
                      ? format(milestone.dueDate, "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    updateNestedFormData(
                      "milestones",
                      "dueDate",
                      e.target.value.split("T"),
                      milestone.id
                    )
                  }
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => handleDeleteMilestone(milestone.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
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
