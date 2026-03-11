import { CategoryManager } from "@/components/CategoryManager";
import { getCategoriesWithCounts } from "@/lib/budget";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const entries = await getCategoriesWithCounts();
  const categories = entries.map((entry) => ({
    id: entry.id,
    name: entry.name,
    expenseCount: entry._count.expenses,
  }));

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Categories</h2>
        <p className="text-sm text-slate-500">
          Manage spending categories used by your expense entries.
        </p>
      </section>

      <CategoryManager categories={categories} />
    </div>
  );
}
