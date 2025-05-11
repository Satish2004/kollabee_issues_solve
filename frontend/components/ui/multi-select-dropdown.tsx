"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

export type MultiSelectDropdownProps = {
  label: string;
  placeholder: string;
  options: string[] | Record<string, string[]>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  isRequired?: boolean;
  error?: string;
  allowCustomValues?: boolean;
  customValuesLabel?: string;
  customValueCategory?: string;
  customValues?: string[];
  onCustomValuesChange?: (values: string[]) => void;
  className?: string;
};

const MultiSelectDropdown = ({
  label,
  placeholder,
  options,
  selectedValues = [],
  onChange,
  isRequired = false,
  error,
  allowCustomValues = false,
  customValuesLabel = "Add custom values:",
  customValueCategory = "Other",
  customValues = [],
  onCustomValuesChange,
  className = "",
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCustomValue, setNewCustomValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Function to add a custom value
  const addCustomValue = () => {
    if (newCustomValue.trim() && onCustomValuesChange) {
      // Check if the value already exists
      if (!customValues.includes(newCustomValue.trim())) {
        const updatedCustomValues = [...customValues, newCustomValue.trim()];
        onCustomValuesChange(updatedCustomValues);

        // Also add to selected values if not already there
        if (!selectedValues.includes(newCustomValue.trim())) {
          onChange([...selectedValues, newCustomValue.trim()]);
        }
      }
      setNewCustomValue("");
    }
  };

  // Function to toggle a value selection
  const toggleValue = (value: string) => {
    const isSelected = selectedValues.includes(value);
    const newValues = isSelected
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  // Function to remove a value
  const removeValue = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value));

    // Also remove from custom values if it's there
    if (customValues.includes(value) && onCustomValuesChange) {
      onCustomValuesChange(customValues.filter((v) => v !== value));
    }
  };

  // Prepare options for rendering
  const flattenedOptions = Array.isArray(options)
    ? options
    : Object.values(options).flat();

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={`dropdown-${label}`} className="text-sm font-normal">
        {label}
        {isRequired && <span className="text-[#EA3D4F]">*</span>}
      </Label>

      <div className="relative" ref={dropdownRef}>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between font-normal"
          id={`dropdown-${label}`}
        >
          {selectedValues.length > 0
            ? `${selectedValues.length} ${
                selectedValues.length === 1 ? "item" : "items"
              } selected`
            : placeholder}
          <span className="ml-2 opacity-70">{isOpen ? "▲" : "▼"}</span>
        </Button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              {flattenedOptions.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <div
                    key={option}
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors duration-150 ${
                      isSelected ? "bg-pink-50" : "hover:bg-gray-100"
                    }`}
                    onClick={() => toggleValue(option)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      className="rounded border-gray-300"
                      readOnly
                    />
                    <span className="text-sm font-normal cursor-pointer w-full">
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedValues.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-normal mb-2">Selected {label}:</p>
          <div className="flex flex-wrap gap-2">
            {selectedValues.map((value) => (
              <div
                key={value}
                className="bg-gray-100 rounded-full px-3 py-1 text-sm font-normal flex items-center"
              >
                {value}
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => removeValue(value)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {allowCustomValues && selectedValues.includes(customValueCategory) && (
        <div className="mt-4 space-y-3 border rounded-md p-4">
          <p className="text-sm font-normal">{customValuesLabel}</p>

          <div className="flex items-center gap-2">
            <Input
              placeholder={`Enter custom ${label.toLowerCase()}`}
              value={newCustomValue}
              onChange={(e) => setNewCustomValue(e.target.value)}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomValue();
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              onClick={addCustomValue}
              className="flex items-center text-normal"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="font-normal">Add</span>
            </Button>
          </div>

          {customValues.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">
                Your custom {label.toLowerCase()}:
              </p>
              <div className="flex flex-wrap gap-2">
                {customValues.map((value) => (
                  <div
                    key={value}
                    className="bg-pink-50 rounded-full px-3 py-1 text-sm font-normal flex items-center"
                  >
                    {value}
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => removeValue(value)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Press Enter or click Add to add a custom {label.toLowerCase()}
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm font-normal">{error}</p>}
    </div>
  );
};

export default MultiSelectDropdown;
