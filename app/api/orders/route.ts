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

function isValidItemPayload(value: unknown): value is {
  itemId: string;
  quantity: number;
  specialInstruction?: string;
} {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.itemId === "string" &&
    candidate.itemId.trim().length > 0 &&
    typeof candidate.quantity === "number" &&
    Number.isInteger(candidate.quantity) &&
    candidate.quantity > 0 &&
    (candidate.specialInstruction === undefined ||
      typeof candidate.specialInstruction === "string")
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause = status
      ? { status: status as any }
      : {};

    const orders = await prisma.orders.findMany({
      where: whereClause,
      orderBy: { placed_at: "desc" },
      select: {
        id: true,
        display_number: true,
        status: true,
        placed_at: true,
        estimated_minutes: true,
        restaurant_tables: {
          select: {
            table_number: true,
            qr_token: true,
          },
        },
        order_items: {
          select: {
            quantity: true,
            price_at_order: true,
            special_instruction: true,
            menu_items: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      orders.map((order) => ({
        id: order.id,
        displayNumber: order.display_number,
        status: order.status,
        placedAt: order.placed_at,
        estimatedMinutes: order.estimated_minutes,
        tableNumber: order.restaurant_tables.table_number,
        tableQrToken: order.restaurant_tables.qr_token,
        items: order.order_items.map((item) => ({
          name: item.menu_items.name,
          quantity: item.quantity,
          priceAtOrder: Number(item.price_at_order),
          specialInstruction: item.special_instruction,
        })),
      }))
    );
  } catch (error) {
    console.error("Failed to fetch orders", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      typeof body?.qrToken !== "string" ||
      body.qrToken.trim().length === 0 ||
      !Array.isArray(body?.items) ||
      body.items.length === 0 ||
      body.items.some((item: unknown) => !isValidItemPayload(item))
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const qrToken = body.qrToken.trim();
    const items = body.items as Array<{
      itemId: string;
      quantity: number;
      specialInstruction?: string;
    }>;

    const table = await prisma.restaurant_tables.findUnique({
      where: { qr_token: qrToken },
      select: { id: true },
    });

    if (!table) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      );
    }

    const order = await prisma.$transaction(async (tx) => {
      const menuItems = await tx.menu_items.findMany({
        where: {
          id: { in: items.map((item) => item.itemId) },
          is_available: true,
        },
        select: {
          id: true,
          price: true,
        },
      });

      const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

      for (const item of items) {
        const menuItem = menuItemMap.get(item.itemId);
        if (!menuItem) {
          throw new Error(`Menu item not available: ${item.itemId}`);
        }
      }

      const createdOrder = await tx.orders.create({
        data: {
          table_id: table.id,
          status: "placed",
        },
        select: {
          id: true,
          display_number: true,
        },
      });

      await tx.order_items.createMany({
        data: items.map((item) => ({
          order_id: createdOrder.id,
          item_id: item.itemId,
          quantity: item.quantity,
          price_at_order: menuItemMap.get(item.itemId)!.price.toString(),
          special_instruction: item.specialInstruction ?? null,
        })),
      });

      await tx.order_status_history.create({
        data: {
          order_id: createdOrder.id,
          status: "placed",
        },
      });

      return createdOrder;
    });

    return NextResponse.json({
      order_id: order.id,
      display_number: order.display_number,
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Menu item not available")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error("Order creation failed", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}