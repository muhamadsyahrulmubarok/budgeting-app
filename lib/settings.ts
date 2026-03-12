import { prisma } from "@/lib/prisma";
import {
  DEFAULT_CURRENCY,
  DEFAULT_DATE_FORMAT,
  DEFAULT_FIRST_DAY_OF_WEEK,
  type DateFormatOption,
  type AppSettings,
} from "@/lib/settings-constants";

const SETTING_KEYS = {
  currency: "currency",
  dateFormat: "dateFormat",
  firstDayOfWeek: "firstDayOfWeek",
} as const;

async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function getSettings(): Promise<AppSettings> {
  const [currency, dateFormat, firstDayOfWeek] = await Promise.all([
    getSetting(SETTING_KEYS.currency),
    getSetting(SETTING_KEYS.dateFormat),
    getSetting(SETTING_KEYS.firstDayOfWeek),
  ]);

  return {
    currency: currency ?? DEFAULT_CURRENCY,
    dateFormat: (dateFormat as DateFormatOption) ?? DEFAULT_DATE_FORMAT,
    firstDayOfWeek:
      firstDayOfWeek === "monday" ? "monday" : DEFAULT_FIRST_DAY_OF_WEEK,
  };
}

export { CURRENCIES, DATE_FORMATS, FIRST_DAY_OPTIONS } from "@/lib/settings-constants";
export type { AppSettings, DateFormatOption } from "@/lib/settings-constants";
