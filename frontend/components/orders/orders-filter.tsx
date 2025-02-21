import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface OrdersFilterProps {
  filters: {
    status?: string;
    dateRange?: string;
    search?: string;
  };
  onFilterChange: (filters: any) => void;
}

const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

export function OrdersFilter({ filters, onFilterChange }: OrdersFilterProps) {
  return (
    <div className="flex gap-4 items-center">
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange({ status: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DateRangePicker
        value={filters.dateRange}
        onChange={(value) => onFilterChange({ dateRange: value })}
      />

      <Input
        placeholder="Search orders..."
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        className="w-[250px]"
      />
    </div>
  );
} 