"use server";

import { prisma } from "@/lib/prisma";
import type { AppSettings } from "@/lib/settings-constants";

const SETTING_KEYS: Record<keyof AppSettings, string> = {
  currency: "currency",
  dateFormat: "dateFormat",
  firstDayOfWeek: "firstDayOfWeek",
};

export async function saveSettings(settings: Partial<AppSettings>) {
  const updates = Object.entries(settings).filter(
    ([, v]) => v !== undefined && v !== null
  ) as [keyof AppSettings, string][];
  await Promise.all(
    updates.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key: SETTING_KEYS[key] },
        create: { key: SETTING_KEYS[key], value },
        update: { value },
      })
    )
  );
}
