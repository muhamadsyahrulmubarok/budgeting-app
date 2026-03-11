import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseId } from "@/lib/api";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, context: Context) {
  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    await prisma.category.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete category." },
      { status: 400 },
    );
  }
}
