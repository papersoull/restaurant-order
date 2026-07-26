import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ qr_token: string }> }
) {
  const { qr_token } = await params;

  const table = await prisma.restaurant_tables.findUnique({
    where: { qr_token },
    select: {
      id: true,
      table_number: true,
    },
  });

  if (!table) {
    return NextResponse.json(
      { error: "Table not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    tableId: table.id,
    tableNumber: table.table_number,
  });
}
