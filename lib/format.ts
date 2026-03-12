import type { DateFormatOption } from "@/lib/settings-constants";

const DEFAULT_CURRENCY = "USD";
const DEFAULT_DATE_STYLE: DateFormatOption = "medium";

export function formatCurrency(value: number, currency: string = DEFAULT_CURRENCY) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(
  value: Date | string,
  dateStyle: DateFormatOption = DEFAULT_DATE_STYLE
) {
  const options: Intl.DateTimeFormatOptions =
    dateStyle === "short"
      ? { year: "numeric", month: "2-digit", day: "2-digit" }
      : dateStyle === "long"
        ? { year: "numeric", month: "long", day: "numeric" }
        : { year: "numeric", month: "short", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(value));
}

export function monthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
