import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAmount, parseDate, parseId, parseOptionalText } from "@/lib/api";

export async function GET() {
  const expenses = await prisma.expense.findMany({
    include: { category: true },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });

  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoryId = body.categoryId ? parseId(String(body.categoryId)) : null;

    const expense = await prisma.expense.create({
      data: {
        amount: parseAmount(body.amount),
        description: parseOptionalText(body.description),
        date: parseDate(body.date),
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create expense." },
      { status: 400 },
    );
  }
}
