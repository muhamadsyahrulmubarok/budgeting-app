import {
  getCategorySpending,
  getMonthlyIncomeVsExpenses,
  getTotals,
} from "@/lib/budget";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

type ReportsPageProps = {
  searchParams: Promise<{ month?: string }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const requestedMonth = params.month;
  const selectedMonth =
    requestedMonth && /^\d{4}-\d{2}$/.test(requestedMonth) ? requestedMonth : "all";

  const [totals, monthly] = await Promise.all([getTotals(), getMonthlyIncomeVsExpenses()]);
  const spendingByCategory = await getCategorySpending(
    selectedMonth === "all" ? undefined : selectedMonth,
  );
  const selectedMonthSummary =
    selectedMonth === "all" ? null : monthly.find((entry) => entry.month === selectedMonth);

  const monthOptions = [...monthly].reverse();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500">
          Review spending by category and compare monthly income vs expenses.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <form method="GET" className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <label htmlFor="month" className="mb-1 block text-sm text-slate-600">
              Month filter
            </label>
            <select
              id="month"
              name="month"
              defaultValue={selectedMonth}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">All months</option>
              {monthOptions.map((item) => (
                <option key={item.month} value={item.month}>
                  {item.month}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Apply
          </button>
        </form>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Current Remaining Balance</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {formatCurrency(totals.currentBalance)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Earnings</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">
            {formatCurrency(totals.totalEarnings)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="mt-1 text-2xl font-semibold text-rose-600">
            {formatCurrency(totals.totalExpenses)}
          </p>
        </div>
      </section>

      {selectedMonthSummary ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Summary for {selectedMonthSummary.month}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Income: {formatCurrency(selectedMonthSummary.income)} | Expenses:{" "}
            {formatCurrency(selectedMonthSummary.expenses)} | Balance:{" "}
            {formatCurrency(selectedMonthSummary.balance)}
          </p>
        </section>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Total Spending per Category
          </h3>
          <div className="space-y-3">
            {spendingByCategory.length === 0 ? (
              <p className="text-sm text-slate-500">No expenses to report.</p>
            ) : (
              spendingByCategory.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{item.category}</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(item.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Monthly Income vs Expenses
          </h3>
          <div className="space-y-2 text-sm">
            {monthly.length === 0 ? (
              <p className="text-slate-500">No monthly data yet.</p>
            ) : (
              [...monthly].reverse().map((item) => (
                <div
                  key={item.month}
                  className="grid grid-cols-[90px_1fr_1fr] gap-2 rounded-md border border-slate-200 p-2"
                >
                  <span className="font-medium text-slate-700">{item.month}</span>
                  <span className="text-emerald-600">{formatCurrency(item.income)}</span>
                  <span className="text-rose-600">{formatCurrency(item.expenses)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
