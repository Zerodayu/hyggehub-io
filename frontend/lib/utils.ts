import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterNumbers(input: string): string {
  return input.replace(/\D/g, "");
}

export function removeSpaces(input: string): string {
  return input.replace(/\s+/g, "");
}
