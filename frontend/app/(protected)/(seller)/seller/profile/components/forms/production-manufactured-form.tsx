"use client"
import { useState } from "react"
import { Check, ChevronsUpDown, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

type ProductionManufacturedFormProps = {
  formState: any
  onChange: (newValue: any) => void
  onSave: () => void
  hasChanges: boolean
  isSaving: boolean
}

// List of countries with their flags
const countries = [
  { id: "us", name: "United States", flag: "🇺🇸" },
  { id: "cn", name: "China", flag: "🇨🇳" },
  { id: "in", name: "India", flag: "🇮🇳" },
  { id: "gb", name: "United Kingdom", flag: "🇬🇧" },
  { id: "de", name: "Germany", flag: "🇩🇪" },
  { id: "fr", name: "France", flag: "🇫🇷" },
  { id: "jp", name: "Japan", flag: "🇯🇵" },
  { id: "it", name: "Italy", flag: "🇮🇹" },
  { id: "br", name: "Brazil", flag: "🇧🇷" },
  { id: "ca", name: "Canada", flag: "🇨🇦" },
  { id: "kr", name: "South Korea", flag: "🇰🇷" },
  { id: "au", name: "Australia", flag: "🇦🇺" },
  { id: "es", name: "Spain", flag: "🇪🇸" },
  { id: "mx", name: "Mexico", flag: "🇲🇽" },
  { id: "id", name: "Indonesia", flag: "🇮🇩" },
  { id: "nl", name: "Netherlands", flag: "🇳🇱" },
  { id: "sa", name: "Saudi Arabia", flag: "🇸🇦" },
  { id: "tr", name: "Turkey", flag: "🇹🇷" },
  { id: "ch", name: "Switzerland", flag: "🇨🇭" },
  { id: "pl", name: "Poland", flag: "🇵🇱" },
  { id: "se", name: "Sweden", flag: "🇸🇪" },
  { id: "be", name: "Belgium", flag: "🇧🇪" },
  { id: "no", name: "Norway", flag: "🇳🇴" },
  { id: "at", name: "Austria", flag: "🇦🇹" },
  { id: "ie", name: "Ireland", flag: "🇮🇪" },
  { id: "dk", name: "Denmark", flag: "🇩🇰" },
  { id: "sg", name: "Singapore", flag: "🇸🇬" },
  { id: "fi", name: "Finland", flag: "🇫🇮" },
  { id: "hk", name: "Hong Kong", flag: "🇭🇰" },
  { id: "vn", name: "Vietnam", flag: "🇻🇳" },
]

const ProductionManufacturedForm = ({
  formState,
  onChange,
  onSave,
  hasChanges,
  isSaving,
}: ProductionManufacturedFormProps) => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  // Handle country selection
  const handleCountrySelect = (countryId: string) => {
    const isSelected = formState.locations.includes(countryId)

    // If already selected, remove it; otherwise, add it
    const newLocations = isSelected
      ? formState.locations.filter((id: string) => id !== countryId)
      : [...formState.locations, countryId]

    onChange({
      ...formState,
      locations: newLocations,
    })
  }

  // Handle removing a country
  const handleRemoveCountry = (countryId: string) => {
    const newLocations = formState.locations.filter((id: string) => id !== countryId)

    onChange({
      ...formState,
      locations: newLocations,
    })
  }

  // Get country details by ID
  const getCountryById = (countryId: string) => {
    return countries.find((country) => country.id === countryId)
  }

  // Filter countries based on search value
  const filteredCountries = searchValue
    ? countries.filter((country) => country.name.toLowerCase().includes(searchValue.toLowerCase()))
    : countries

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        
        <label className="text-sm font-medium">Where Are Your Products Manufactured?</label>
        <p className="text-sm text-gray-500">Select the countries where your products are manufactured</p>

        {/* Country Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              <span className="truncate">
                {formState.locations.length > 0
                  ? `${formState.locations.length} ${formState.locations.length === 1 ? "country" : "countries"} selected`
                  : "Select countries..."}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput
                  placeholder="Search countries..."
                  className="h-9 flex-1"
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
              </div>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {filteredCountries.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.id}
                      onSelect={() => {
                        handleCountrySelect(country.id)
                        setSearchValue("")
                      }}
                    >
                      <div className="flex items-center">
                        <span className="mr-2 text-lg" style={{ fontFamily: "emoji" }}>{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          formState.locations.includes(country.id) ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected Countries Badges */}
        {formState.locations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formState.locations.map((locationId: string) => {
              const country = getCountryById(locationId)
              if (!country) return null

              return (
                <Badge key={locationId} variant="secondary" className="pl-2 pr-1 py-1.5">
                  <div className="flex items-center">
                    <span className="mr-1 text-sm">{country.flag}</span>
                    <span>{country.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => handleRemoveCountry(locationId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </Badge>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductionManufacturedForm

