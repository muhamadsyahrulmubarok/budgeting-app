"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/format";

type ExpenseItem = {
  id: number;
  amount: number;
  description: string | null;
  date: string;
  categoryId: number | null;
  categoryName: string | null;
};

type CategoryOption = {
  id: number;
  name: string;
};

type ExpenseManagerProps = {
  expenses: ExpenseItem[];
  categories: CategoryOption[];
};

const today = new Date().toISOString().slice(0, 10);

export function ExpenseManager({ expenses, categories }: ExpenseManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const endpoint = editingId ? `/api/expenses/${editingId}` : "/api/expenses";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        categoryId: categoryId ? Number(categoryId) : null,
        description,
        date,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json();
      window.alert(payload.error ?? "Failed to save expense.");
      return;
    }

    setEditingId(null);
    setAmount("");
    setCategoryId("");
    setDescription("");
    setDate(today);
    router.refresh();
  }

  function onEdit(item: ExpenseItem) {
    setEditingId(item.id);
    setAmount(String(item.amount));
    setCategoryId(item.categoryId ? String(item.categoryId) : "");
    setDescription(item.description ?? "");
    setDate(item.date.slice(0, 10));
  }

  async function onDelete(id: number) {
    const shouldDelete = window.confirm("Delete this expense entry?");
    if (!shouldDelete) {
      return;
    }

    const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = await response.json();
      window.alert(payload.error ?? "Failed to delete expense.");
      return;
    }

    if (editingId === id) {
      setEditingId(null);
      setAmount("");
      setCategoryId("");
      setDescription("");
      setDate(today);
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5"
      >
        <input
          required
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Uncategorized</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setAmount("");
                setCategoryId("");
                setDescription("");
                setDate(today);
              }}
              className="rounded-md bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                  No expense entries yet.
                </td>
              </tr>
            ) : (
              expenses.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{formatDate(item.date)}</td>
                  <td className="px-4 py-3">{item.categoryName ?? "Uncategorized"}</td>
                  <td className="px-4 py-3">{item.description ?? "-"}</td>
                  <td className="px-4 py-3 font-medium text-rose-600">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-md bg-slate-200 px-3 py-1 text-xs text-slate-700 hover:bg-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="rounded-md bg-rose-100 px-3 py-1 text-xs text-rose-700 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
