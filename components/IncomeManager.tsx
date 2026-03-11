"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/format";

type IncomeItem = {
  id: number;
  amount: number;
  source: string;
  description: string | null;
  date: string;
};

type IncomeManagerProps = {
  income: IncomeItem[];
};

const today = new Date().toISOString().slice(0, 10);

export function IncomeManager({ income }: IncomeManagerProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const endpoint = editingId ? `/api/income/${editingId}` : "/api/income";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        source,
        description,
        date,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json();
      window.alert(payload.error ?? "Failed to save income.");
      return;
    }

    setEditingId(null);
    setAmount("");
    setSource("");
    setDescription("");
    setDate(today);
    router.refresh();
  }

  function onEdit(item: IncomeItem) {
    setEditingId(item.id);
    setAmount(String(item.amount));
    setSource(item.source);
    setDescription(item.description ?? "");
    setDate(item.date.slice(0, 10));
  }

  async function onDelete(id: number) {
    const shouldDelete = window.confirm("Delete this income entry?");
    if (!shouldDelete) {
      return;
    }

    const response = await fetch(`/api/income/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const payload = await response.json();
      window.alert(payload.error ?? "Failed to delete income.");
      return;
    }

    if (editingId === id) {
      setEditingId(null);
      setAmount("");
      setSource("");
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
        <input
          required
          placeholder="Source (Salary, Freelance...)"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Description (optional)"
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
                setSource("");
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
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {income.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                  No income entries yet.
                </td>
              </tr>
            ) : (
              income.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{formatDate(item.date)}</td>
                  <td className="px-4 py-3">{item.source}</td>
                  <td className="px-4 py-3">{item.description ?? "-"}</td>
                  <td className="px-4 py-3 font-medium text-emerald-600">
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
