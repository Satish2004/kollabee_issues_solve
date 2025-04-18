"use client";
import React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronDown } from "lucide-react";

type FilterOption = {
  label: string;
  value: string;
};

// Filter Select component with search
export function FilterSelect({
  field,
  options,
  value,
  onChange,
}: {
  field: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {value === "all"
            ? "All"
            : options.find((option) => option.value === value)?.label ||
              "Select..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white" align="start">
        <Command>
          <CommandInput placeholder={`Search options...`} />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
                className="flex items-center justify-between"
              >
                <span>All</span>
                {value === "all" && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
