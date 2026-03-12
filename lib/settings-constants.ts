/**
 * Client-safe settings types and constants (no Node/Prisma imports).
 * Use this in client components to avoid bundling better-sqlite3.
 */

export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_DATE_FORMAT = "medium";
export const DEFAULT_FIRST_DAY_OF_WEEK = "sunday";

export type DateFormatOption = "short" | "medium" | "long";

export type AppSettings = {
  currency: string;
  dateFormat: DateFormatOption;
  firstDayOfWeek: "sunday" | "monday";
};

export const CURRENCIES = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "IDR", label: "Indonesian Rupiah (IDR)" },
  { value: "JPY", label: "Japanese Yen (JPY)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "CHF", label: "Swiss Franc (CHF)" },
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "MYR", label: "Malaysian Ringgit (MYR)" },
  { value: "SGD", label: "Singapore Dollar (SGD)" },
] as const;

export const DATE_FORMATS: { value: DateFormatOption; label: string }[] = [
  { value: "short", label: "Short (e.g. 01/15/2025)" },
  { value: "medium", label: "Medium (e.g. Jan 15, 2025)" },
  { value: "long", label: "Long (e.g. January 15, 2025)" },
];

export const FIRST_DAY_OPTIONS = [
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
] as const;
