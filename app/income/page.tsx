import { IncomeManager } from "@/components/IncomeManager";
import { getIncomeEntries } from "@/lib/budget";

export const dynamic = "force-dynamic";

export default async function IncomePage() {
  const entries = await getIncomeEntries();
  const income = entries.map((entry) => ({
    id: entry.id,
    amount: entry.amount,
    source: entry.source,
    description: entry.description,
    date: entry.date.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Income</h2>
        <p className="text-sm text-slate-500">
          Track salary, freelance work, bonuses, and other earnings.
        </p>
      </section>

      <IncomeManager income={income} />
    </div>
  );
}
