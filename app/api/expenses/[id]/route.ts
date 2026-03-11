import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAmount, parseDate, parseId, parseOptionalText } from "@/lib/api";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: Context) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);
    const body = await request.json();
    const categoryId = body.categoryId ? parseId(String(body.categoryId)) : null;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        amount: parseAmount(body.amount),
        description: parseOptionalText(body.description),
        date: parseDate(body.date),
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update expense." },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    await prisma.expense.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete expense." },
      { status: 400 },
    );
  }
}
