"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Calendar } from "./calender";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Label } from "./label";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function DatePicker({
  date,
  setDate,
  label,
  placeholder = "Pick a date",
  className,
  disabled,
  required,
}: DatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label htmlFor="date" className="text-sm">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
