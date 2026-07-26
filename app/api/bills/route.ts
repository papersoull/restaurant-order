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
  try {
    const bills = await prisma.bills.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        order_id: true,
        subtotal: true,
        tax_amount: true,
        total: true,
        is_printed: true,
        created_at: true,
        orders: {
          select: {
            display_number: true,
            status: true,
            restaurant_tables: {
              select: {
                table_number: true,
              },
            },
            order_items: {
              select: {
                quantity: true,
                price_at_order: true,
                menu_items: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      bills.map((bill) => ({
        id: bill.id,
        orderId: bill.order_id,
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
      }))
    );
  } catch (error) {
    console.error("Failed to fetch bills", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body?.orderId !== "string" || body.orderId.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid request body. orderId is required." },
        { status: 400 }
      );
    }

    const orderId = body.orderId.trim();
    const generatedBy = body.generatedBy || null;

    const existingBill = await prisma.bills.findUnique({
      where: { order_id: orderId },
    });

    if (existingBill) {
      return NextResponse.json(
        { error: "Bill already exists for this order" },
        { status: 409 }
      );
    }

    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        order_items: {
          select: {
            quantity: true,
            price_at_order: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status === "billed") {
      return NextResponse.json(
        { error: "Order is already billed" },
        { status: 409 }
      );
    }

    const subtotal = order.order_items.reduce(
      (sum, item) => sum + Number(item.price_at_order) * item.quantity,
      0
    );

    const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + taxAmount;

    const bill = await prisma.$transaction(async (tx) => {
      const createdBill = await tx.bills.create({
        data: {
          order_id: orderId,
          subtotal: subtotal.toString(),
          tax_amount: taxAmount.toString(),
          total: total.toString(),
          generated_by: generatedBy,
        },
        select: {
          id: true,
          subtotal: true,
          tax_amount: true,
          total: true,
          is_printed: true,
          created_at: true,
        },
      });

      await tx.orders.update({
        where: { id: orderId },
        data: { status: "billed" },
      });

      await tx.order_status_history.create({
        data: {
          order_id: orderId,
          status: "billed",
        },
      });

      return createdBill;
    });

    return NextResponse.json({
      id: bill.id,
      subtotal: Number(bill.subtotal),
      taxAmount: Number(bill.tax_amount),
      total: Number(bill.total),
      isPrinted: bill.is_printed,
      createdAt: bill.created_at,
    });
  } catch (error) {
    console.error("Failed to generate bill", error);
    return NextResponse.json(
      { error: "Failed to generate bill" },
      { status: 500 }
    );
  }
}