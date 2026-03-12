import { ExpenseManager } from "@/components/ExpenseManager";
import { ensureDefaultCategories, getCategoriesWithCounts, getExpenseEntries } from "@/lib/budget";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  await ensureDefaultCategories();
  const [expenseEntries, categories] = await Promise.all([
    getExpenseEntries(),
    getCategoriesWithCounts(),
  ]);

  const expenses = expenseEntries.map((entry) => ({
    id: entry.id,
    amount: entry.amount,
    description: entry.description,
    date: entry.date.toISOString(),
    categoryId: entry.categoryId,
    categoryName: entry.category?.name ?? null,
  }));

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Expenses</h2>
        <p className="text-sm text-slate-500">
          Add daily spending and assign it to a category.
        </p>
      </section>

      <ExpenseManager expenses={expenses} categories={categoryOptions} />
    </div>
  );
}
