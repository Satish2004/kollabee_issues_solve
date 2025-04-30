"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { useFormContext } from "./create-projects-context";

export default function Step2({
  handleNext,
  errors,
  setErrors,
}: {
  handleNext: () => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const { formData, updateFormData } = useFormContext();
  const [quantity, setQuantity] = useState(formData.quantity || 100);
  const [budget, setBudget] = useState(formData.budget || 1000);

  const handleChange = (field: string, value: any) => {
    updateFormData(field, value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const incrementQuantity = () => {
    const newValue = quantity + 100;
    setQuantity(newValue);
    handleChange("quantity", newValue);
  };

  const decrementQuantity = () => {
    if (quantity > 100) {
      const newValue = quantity - 100;
      setQuantity(newValue);
      handleChange("quantity", newValue);
    }
  };

  const incrementBudget = () => {
    const newValue = budget + 100;
    setBudget(newValue);
    handleChange("budget", newValue);
  };

  const decrementBudget = () => {
    if (budget > 100) {
      const newValue = budget - 100;
      setBudget(newValue);
      handleChange("budget", newValue);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    setQuantity(value);
    handleChange("quantity", value);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    setBudget(value);
    handleChange("budget", value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white font-futura">
      <div className="mb-6">
        <h1 className="text-xl font-normal">Budget</h1>
        <p className="text-sm font-normal text-muted-foreground">
          Define your production quantity and budget expectations.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="quantity" className="text-base font-normal">
            How many units would you like to produce?
            <span className="text-[#EA3D4F]">*</span>
          </Label>
          <p className="text-sm font-normal text-gray-500">
            Estimated amount is fine.(IN USD only)
          </p>

          <div className="flex items-center max-w-xs">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-r-none h-12 w-12"
              onClick={decrementQuantity}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="rounded-none text-center h-12 border-x-0"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-l-none h-12 w-12"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.quantity && (
            <p className="text-red-500 text-sm font-normal">
              {errors.quantity}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="budget" className="text-base font-normal">
            What is your budget for this production?
            <span className="text-[#EA3D4F]">*</span>
          </Label>
          <p className="text-sm font-normal text-gray-500">
            Total or per unit (IN USD only)
          </p>

          <div className="flex items-center max-w-xs">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-r-none h-12 w-12"
              onClick={decrementBudget}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              className="rounded-none text-center h-12 border-x-0"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-l-none h-12 w-12"
              onClick={incrementBudget}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="budget-total"
              name="budgetType"
              value="total"
              checked={formData.budgetType === "total"}
              onChange={() => handleChange("budgetType", "total")}
              className="h-4 w-4"
            />
            <Label htmlFor="budget-total" className="text-sm font-normal ">
              Total budget
            </Label>

            <input
              type="radio"
              id="budget-per-unit"
              name="budgetType"
              value="per-unit"
              checked={formData.budgetType === "per-unit"}
              onChange={() => handleChange("budgetType", "per-unit")}
              className="h-4 w-4 ml-4"
            />
            <Label htmlFor="budget-per-unit" className="text-sm font-normal">
              Per unit
            </Label>
          </div>

          {errors.budget && (
            <p className="text-red-500 text-sm font-normal">{errors.budget}</p>
          )}
        </div>

        {formData.selectedServices.includes("services-brand-support") && (
          <div className="space-y-4">
            <Label className="text-base font-normal">
              Is your budget fixed or flexible?
              <span className="text-[#EA3D4F]">*</span>
            </Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="budget-fixed"
                  name="budgetFlexibility"
                  value="fixed"
                  checked={formData.budgetFlexibility === "fixed"}
                  onChange={() => handleChange("budgetFlexibility", "fixed")}
                  className="h-4 w-4"
                />
                <Label htmlFor="budget-fixed" className="text-sm font-normal ">
                  Fixed
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="budget-flexible"
                  name="budgetFlexibility"
                  value="flexible"
                  checked={formData.budgetFlexibility === "flexible"}
                  onChange={() => handleChange("budgetFlexibility", "flexible")}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor="budget-flexible"
                  className="text-sm font-normal "
                >
                  Flexible
                </Label>
              </div>
            </div>
            {errors.budgetFlexibility && (
              <p className="text-red-500 text-sm font-normal">
                {errors.budgetFlexibility}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-8">
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
}
