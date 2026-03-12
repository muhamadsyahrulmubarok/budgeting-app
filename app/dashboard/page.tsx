import { StatCard } from "@/components/StatCard";
import { getDashboardData } from "@/lib/budget";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Quick overview of your income, expenses, and current balance.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Current Balance"
          value={formatCurrency(data.currentBalance)}
          tone={data.currentBalance >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Total Earnings"
          value={formatCurrency(data.totalEarnings)}
          tone="positive"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(data.totalExpenses)}
          tone="negative"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Expense Breakdown by Category
          </h3>
          <div className="space-y-3">
            {data.categorySpending.length === 0 ? (
              <p className="text-sm text-slate-500">No expense data yet.</p>
            ) : (
              data.categorySpending.map((item) => (
                <div key={item.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-700">{item.category}</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-slate-900"
                      style={{
                        width: `${
                          data.totalExpenses === 0
                            ? 0
                            : (item.total / data.totalExpenses) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Monthly Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="rounded-md bg-slate-100 p-3">
              <p className="font-medium text-slate-700">Current month ({data.currentMonth.month})</p>
              <p className="mt-1 text-slate-600">
                Income: <span className="font-medium">{formatCurrency(data.currentMonth.income)}</span>
              </p>
              <p className="text-slate-600">
                Expenses:{" "}
                <span className="font-medium">{formatCurrency(data.currentMonth.expenses)}</span>
              </p>
              <p className="text-slate-600">
                Balance: <span className="font-medium">{formatCurrency(data.currentMonth.balance)}</span>
              </p>
            </div>

            {data.recentMonths.length === 0 ? (
              <p className="text-slate-500">No monthly activity yet.</p>
            ) : (
              data.recentMonths.map((item) => (
                <div
                  key={item.month}
                  className="flex items-center justify-between rounded-md border border-slate-200 p-3"
                >
                  <span className="font-medium text-slate-700">{item.month}</span>
                  <span className="text-slate-600">
                    {formatCurrency(item.income)} / {formatCurrency(item.expenses)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
