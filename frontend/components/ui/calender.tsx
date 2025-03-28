"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  className?: string;
};

function EnhancedCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    props.defaultMonth || new Date()
  );

  // Generate years for dropdown (10 years back, 10 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Custom dropdown components for month and year selection
  const CustomDropdowns = ({ displayMonth, onMonthChange }: DropdownProps) => {
    const handleMonthChange = (value: string) => {
      const newMonth = new Date(displayMonth);
      newMonth.setMonth(parseInt(value));
      onMonthChange(newMonth);
      setCurrentMonth(newMonth);
    };

    const handleYearChange = (value: string) => {
      const newMonth = new Date(displayMonth);
      newMonth.setFullYear(parseInt(value));
      onMonthChange(newMonth);
      setCurrentMonth(newMonth);
    };

    return (
      <div className="flex items-center justify-center gap-2">
        <Select
          value={displayMonth.getMonth().toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[110px] h-8 text-sm">
            <SelectValue>{format(displayMonth, "MMMM")}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={i.toString()}>
                {format(new Date(2000, i, 1), "MMMM")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[90px] h-8 text-sm">
            <SelectValue>{displayMonth.getFullYear()}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white rounded-lg shadow-sm border", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-6",
        caption: "flex justify-center relative items-center mb-4",
        caption_label: "hidden", // Hide default month/year label
        nav: "flex items-center gap-1 absolute right-0",
        nav_button: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-transparent p-0 hover:bg-muted"
        ),
        nav_button_previous: "mr-1",
        nav_button_next: "",
        table: "w-full border-collapse",
        head_row: "flex w-full justify-between mb-2",
        head_cell: "text-muted-foreground font-medium text-sm w-10 text-center",
        row: "flex w-full justify-between mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50 rounded-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/30 [&:has([aria-selected].day-range-end)]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-10 w-10 p-0 font-normal rounded-full aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
        day_today:
          "bg-accent text-accent-foreground rounded-full font-semibold",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/30 aria-selected:text-muted-foreground aria-selected:opacity-40",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Dropdown: CustomDropdowns,
        IconLeft: ({ ...props }) => <ChevronLeft className="h-5 w-5" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-5 w-5" />,
      }}
      onMonthChange={setCurrentMonth}
      month={currentMonth}
      {...props}
    />
  );
}
EnhancedCalendar.displayName = "EnhancedCalendar";

export { EnhancedCalendar };
