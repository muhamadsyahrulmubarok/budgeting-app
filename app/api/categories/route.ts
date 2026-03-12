import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDefaultCategories } from "@/lib/budget";
import { parseRequiredText } from "@/lib/api";

export async function GET() {
  await ensureDefaultCategories();

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { expenses: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = parseRequiredText(body.name, "Category name");

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unique")) {
      return NextResponse.json(
        { error: "Category already exists." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create category." },
      { status: 400 },
    );
  }
}
