import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface DateRangePickerProps {
  value?: string;
  onChange: (value: string) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start text-left">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value || "Pick a date range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex gap-2">
          <input 
            type="date" 
            className="border rounded p-2"
            onChange={(e) => onChange(e.target.value)}
          />
          <input 
            type="date" 
            className="border rounded p-2"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
} 