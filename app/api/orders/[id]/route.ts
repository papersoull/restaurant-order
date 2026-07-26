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

const validStatuses = ["placed", "accepted", "ready", "served", "billed"] as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.orders.findUnique({
      where: { id },
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

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Failed to fetch order details", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (typeof body?.status !== "string" || !validStatuses.includes(body.status as any)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: placed, accepted, ready, served, billed" },
        { status: 400 }
      );
    }

    const newStatus = body.status as typeof validStatuses[number];
    const estimatedMinutes = body.estimatedMinutes
      ? (typeof body.estimatedMinutes === "number" ? body.estimatedMinutes : parseInt(body.estimatedMinutes, 10))
      : undefined;

    if (estimatedMinutes !== undefined && (isNaN(estimatedMinutes) || estimatedMinutes < 1)) {
      return NextResponse.json(
        { error: "Estimated minutes must be a positive number" },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.orders.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updateData: Record<string, any> = { status: newStatus };

      if (estimatedMinutes !== undefined) {
        updateData.estimated_minutes = estimatedMinutes;
      }

      if (newStatus === "accepted") {
        updateData.accepted_at = new Date();
      } else if (newStatus === "ready") {
        updateData.ready_at = new Date();
      } else if (newStatus === "served") {
        updateData.served_at = new Date();
      }

      const order = await tx.orders.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          display_number: true,
          status: true,
          estimated_minutes: true,
        },
      });

      await tx.order_status_history.create({
        data: {
          order_id: id,
          status: newStatus,
        },
      });

      return order;
    });

    return NextResponse.json({
      id: updatedOrder.id,
      displayNumber: updatedOrder.display_number,
      status: updatedOrder.status,
      estimatedMinutes: updatedOrder.estimated_minutes,
    });
  } catch (error) {
    console.error("Failed to update order status", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
