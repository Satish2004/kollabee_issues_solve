"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";

export function FilterDialog({ open, onOpenChange, onApplyFilters }) {
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [productChannel, setProductChannel] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleApplyFilters = () => {
    onApplyFilters({
      status,
      dateRange,
      productChannel,
      startDate,
      endDate,
    });
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    setStatus("all");
    setDateRange("all");
    setProductChannel("all");
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Orders</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Order Status</Label>
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-progress" id="in-progress" />
                <Label htmlFor="in-progress">In Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="canceled" id="canceled" />
                <Label htmlFor="canceled">Canceled</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Product Channel</Label>
            <Select value={productChannel} onValueChange={setProductChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Select product channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="lux">LUX</SelectItem>
                <SelectItem value="life-boy">Life Boy</SelectItem>
                <SelectItem value="oil">Oil</SelectItem>
                <SelectItem value="almond">Almond</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Additional Filters</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="has-tracking" />
                <Label htmlFor="has-tracking">Has Tracking Number</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="new-customers" />
                <Label htmlFor="new-customers">New Customers Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="repeat-customers" />
                <Label htmlFor="repeat-customers">Repeat Customers Only</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
