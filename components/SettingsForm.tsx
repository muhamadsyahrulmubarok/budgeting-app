"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { saveSettings } from "@/lib/settings-actions";
import type { AppSettings } from "@/lib/settings-constants";
import {
  CURRENCIES,
  DATE_FORMATS,
  FIRST_DAY_OPTIONS,
} from "@/lib/settings-constants";

type SettingsFormProps = {
  initial: AppSettings;
};

export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter();
  const [currency, setCurrency] = useState(initial.currency);
  const [dateFormat, setDateFormat] = useState(initial.dateFormat);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(initial.firstDayOfWeek);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await saveSettings({ currency, dateFormat, firstDayOfWeek });
      setMessage({ type: "success", text: "Settings saved." });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-rose-50 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">General</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="currency" className="mb-1 block text-sm font-medium text-slate-700">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Used for all amounts across the app.
            </p>
          </div>

          <div>
            <label htmlFor="dateFormat" className="mb-1 block text-sm font-medium text-slate-700">
              Date format
            </label>
            <select
              id="dateFormat"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value as AppSettings["dateFormat"])}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {DATE_FORMATS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="firstDayOfWeek" className="mb-1 block text-sm font-medium text-slate-700">
              First day of week
            </label>
            <select
              id="firstDayOfWeek"
              value={firstDayOfWeek}
              onChange={(e) => setFirstDayOfWeek(e.target.value as AppSettings["firstDayOfWeek"])}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {FIRST_DAY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Affects week-based views and reports.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
