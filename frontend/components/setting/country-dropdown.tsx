"use client";

import { memo, useState, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";

import { ChevronDown } from "lucide-react";
import { countries } from "@/app/(auth)/signup/seller/onboarding/signup-form";
import { getCountryCode, getSpecialCaseCountryCode } from "../country-utils";

interface CountryDropdownProps {
  selectedCountry: string;
  onSelect: (country: string) => void;
}

const CountryDropdown = memo(
  ({ selectedCountry, onSelect }: CountryDropdownProps) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const [isSelecting, setIsSelecting] = useState(false);

    // Filter countries based on search
    useEffect(() => {
      if (search) {
        setFilteredCountries(
          countries.filter(
            (country) =>
              country.name.toLowerCase().includes(search.toLowerCase()) ||
              country.code.toLowerCase().includes(search.toLowerCase())
          )
        );
      } else {
        setFilteredCountries(countries);
      }
    }, [search]);

    // Handle keyboard input for search
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const { key } = event;

        if (/^[a-zA-Z0-9]$/.test(key)) {
          setSearch((prev) => prev + key);
        } else if (key === "Backspace") {
          setSearch((prev) => prev.slice(0, -1));
        }
      };

      if (isSelecting) window.addEventListener("keydown", handleKeyDown);

      return () => {
        if (isSelecting) window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isSelecting]);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (showDropdown && !target.closest(".country-dropdown-container")) {
          setShowDropdown(false);
          setIsSelecting(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showDropdown]);

    // Clean up on unmount
    useEffect(() => {
      return () => {
        setFilteredCountries([]);
        setSearch("");
      };
    }, []);

    const handleToggleDropdown = () => {
      setShowDropdown(!showDropdown);
      setIsSelecting(!showDropdown);
      setSearch("");
    };

    const handleSelectCountry = (country: any) => {
      onSelect(country.name);
      setShowDropdown(false);
      setIsSelecting(false);
      setSearch("");
    };

    const selectedCountryObj = countries.find(
      (c) => c.name === selectedCountry || c.code === selectedCountry
    );

    return (
      <div className="relative country-dropdown-container">
        <div
          className="flex items-center justify-between bg-[#fcfcfc] border-l border-t border-b border-[#e5e5e5] rounded-l-[6px] px-2 py-2 w-[90px] cursor-pointer"
          onClick={handleToggleDropdown}
        >
          <span className="flex items-center">
            <ReactCountryFlag
              countryCode={getCountryCode(
                selectedCountryObj?.code || "+1",
                countries
              )}
              svg
              style={{
                width: "1.5em",
                height: "1.5em",
                marginRight: "0.2em",
              }}
              title={selectedCountryObj?.code || "United States"}
            />
            {selectedCountryObj?.code || "+1"}
          </span>
          <ChevronDown className="h-4 w-4 ml-1" />
        </div>

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-[300px] max-h-[300px] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="p-2">
              <input
                autoFocus
                type="text"
                placeholder="Search country..."
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country.name}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectCountry(country)}
                  >
                    <ReactCountryFlag
                      countryCode={getSpecialCaseCountryCode(
                        country.code,
                        country.name
                      )}
                      svg
                      style={{
                        width: "1.5em",
                        height: "1.5em",
                      }}
                      title={country.name}
                    />
                    <span>{country.name}</span>
                    <span className="text-gray-500 ml-auto">
                      {country.code}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-2">No countries found</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

CountryDropdown.displayName = "CountryDropdown";

export default CountryDropdown;
