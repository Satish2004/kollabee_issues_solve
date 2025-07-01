"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { useState } from "react";
import { CategoryEnum, CategoryOptions } from "../lib/data/category";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  selected: CategoryEnum[];
  onChange: (categories: CategoryEnum[]) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const toggleCategory = (category: CategoryEnum) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  const selectedLabels = CategoryOptions.filter((opt) =>
    selected.includes(opt.value as CategoryEnum)
  )
    .map((opt) => opt.label)
    .join(", ");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start", {
            "text-muted-foreground": selected.length === 0,
          })}
        >
          {selected.length > 0 ? selectedLabels : "Select categories"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto p-2">
        {CategoryOptions.map((option) => (
          <div
            key={option.value}
            className="flex items-center gap-2 py-1 px-2 hover:bg-muted rounded-md cursor-pointer"
            onClick={() => toggleCategory(option.value as CategoryEnum)}
          >
            <Checkbox
              checked={selected.includes(option.value as CategoryEnum)}
              onCheckedChange={() => toggleCategory(option.value as CategoryEnum)}
            />
            <span className="text-sm">{option.label}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
export default CategorySelector;