import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/defaultCategories";
import { monthKey } from "@/lib/format";

type MonthSummary = {
  month: string;
  income: number;
  expenses: number;
  balance: number;
};

export async function ensureDefaultCategories() {
  await Promise.all(
    DEFAULT_CATEGORIES.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
}

export async function getIncomeEntries() {
  return prisma.income.findMany({
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });
}

export async function getExpenseEntries() {
  return prisma.expense.findMany({
    include: { category: true },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });
}

export async function getCategoriesWithCounts() {
  await ensureDefaultCategories();

  return prisma.category.findMany({
    include: {
      _count: {
        select: { expenses: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getTotals() {
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.income.aggregate({
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
    }),
  ]);

  const totalEarnings = incomeAgg._sum.amount ?? 0;
  const totalExpenses = expenseAgg._sum.amount ?? 0;

  return {
    totalEarnings,
    totalExpenses,
    currentBalance: totalEarnings - totalExpenses,
  };
}

export async function getCategorySpending(month?: string) {
  const expenses = await prisma.expense.findMany({
    include: { category: true },
  });

  const totals = expenses.reduce<Record<string, number>>((acc, expense) => {
    if (month && monthKey(expense.date) !== month) {
      return acc;
    }

    const label = expense.category?.name ?? "Uncategorized";
    acc[label] = (acc[label] ?? 0) + expense.amount;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export async function getMonthlyIncomeVsExpenses() {
  const [incomes, expenses] = await Promise.all([
    prisma.income.findMany({ select: { amount: true, date: true } }),
    prisma.expense.findMany({ select: { amount: true, date: true } }),
  ]);

  const byMonth = new Map<string, { income: number; expenses: number }>();

  for (const entry of incomes) {
    const key = monthKey(entry.date);
    const existing = byMonth.get(key) ?? { income: 0, expenses: 0 };
    existing.income += entry.amount;
    byMonth.set(key, existing);
  }

  for (const entry of expenses) {
    const key = monthKey(entry.date);
    const existing = byMonth.get(key) ?? { income: 0, expenses: 0 };
    existing.expenses += entry.amount;
    byMonth.set(key, existing);
  }

  const monthly = [...byMonth.entries()]
    .map(([month, values]) => ({
      month,
      income: values.income,
      expenses: values.expenses,
      balance: values.income - values.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return monthly;
}

export async function getDashboardData() {
  await ensureDefaultCategories();

  const [totals, categorySpending, monthly] = await Promise.all([
    getTotals(),
    getCategorySpending(),
    getMonthlyIncomeVsExpenses(),
  ]);

  const recentMonths: MonthSummary[] = monthly.slice(-6).reverse();
  const thisMonth = monthKey(new Date());
  const currentMonth =
    monthly.find((entry) => entry.month === thisMonth) ?? {
      month: thisMonth,
      income: 0,
      expenses: 0,
      balance: 0,
    };

  return {
    ...totals,
    categorySpending,
    recentMonths,
    currentMonth,
  };
}
