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
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const bill = await prisma.bills.findUnique({
      where: { order_id: orderId },
      select: {
        id: true,
        subtotal: true,
        tax_amount: true,
        total: true,
        is_printed: true,
        created_at: true,
        orders: {
          select: {
            display_number: true,
            restaurant_tables: {
              select: { table_number: true },
            },
            order_items: {
              select: {
                quantity: true,
                price_at_order: true,
                menu_items: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: bill.id,
      displayNumber: bill.orders.display_number,
      tableNumber: bill.orders.restaurant_tables.table_number,
      subtotal: Number(bill.subtotal),
      taxAmount: Number(bill.tax_amount),
      total: Number(bill.total),
      isPrinted: bill.is_printed,
      createdAt: bill.created_at,
      items: bill.orders.order_items.map((item) => ({
        name: item.menu_items.name,
        quantity: item.quantity,
        priceAtOrder: Number(item.price_at_order),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch bill", error);
    return NextResponse.json(
      { error: "Failed to fetch bill" },
      { status: 500 }
    );
  }
}