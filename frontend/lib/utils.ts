import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
} 


export function findYearDifference(startYear: string | null | undefined): number {
  const currentYear = new Date().getFullYear();
  const year = parseInt(startYear || "0");
  return year > 0 ? currentYear - year : 0;
}