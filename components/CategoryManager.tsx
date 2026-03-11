"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryItem = {
  id: number;
  name: string;
  expenseCount: number;
};

type CategoryManagerProps = {
  categories: CategoryItem[];
};

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json();
      window.alert(payload.error ?? "Failed to add category.");
      return;
    }

    setName("");
    router.refresh();
  }

  async function onDelete(id: number) {
    const shouldDelete = window.confirm(
      "Delete this category? Existing expenses will become Uncategorized.",
    );
    if (!shouldDelete) {
      return;
    }

    const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = await response.json();
      window.alert(payload.error ?? "Failed to delete category.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
      >
        <input
          required
          value={name}
          placeholder="Category name"
          onChange={(event) => setName(event.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-200">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-slate-900">{category.name}</p>
                <p className="text-xs text-slate-500">
                  Used in {category.expenseCount} expense
                  {category.expenseCount === 1 ? "" : "s"}
                </p>
              </div>
              <button
                onClick={() => onDelete(category.id)}
                className="rounded-md bg-rose-100 px-3 py-1 text-xs text-rose-700 hover:bg-rose-200"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
