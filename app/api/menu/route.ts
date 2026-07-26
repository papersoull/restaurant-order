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

export async function GET() {
  const categories = await prisma.categories.findMany({
    orderBy: { display_order: "asc" },
    include: {
      menu_items: {
        where: { is_available: true },
        orderBy: { display_order: "asc" },
        select: {
          id: true,
          name: true,
          price: true,
          is_available: true,
          display_order: true,
        },
      },
    },
  });

  return NextResponse.json({
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      displayOrder: category.display_order,
      items: category.menu_items.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        isAvailable: item.is_available,
        displayOrder: item.display_order,
      })),
    })),
  });
}
