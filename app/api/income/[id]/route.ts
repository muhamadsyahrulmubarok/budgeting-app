import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseAmount,
  parseDate,
  parseId,
  parseOptionalText,
  parseRequiredText,
} from "@/lib/api";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: Context) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);
    const body = await request.json();

    const income = await prisma.income.update({
      where: { id },
      data: {
        amount: parseAmount(body.amount),
        source: parseRequiredText(body.source, "Source"),
        description: parseOptionalText(body.description),
        date: parseDate(body.date),
      },
    });

    return NextResponse.json(income);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update income." },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, context: Context) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    await prisma.income.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete income." },
      { status: 400 },
    );
  }
}
