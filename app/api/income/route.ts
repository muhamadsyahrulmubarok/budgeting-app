import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseAmount, parseDate, parseOptionalText, parseRequiredText } from "@/lib/api";

export async function GET() {
  const income = await prisma.income.findMany({
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });

  return NextResponse.json(income);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const income = await prisma.income.create({
      data: {
        amount: parseAmount(body.amount),
        source: parseRequiredText(body.source, "Source"),
        description: parseOptionalText(body.description),
        date: parseDate(body.date),
      },
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create income." },
      { status: 400 },
    );
  }
}
