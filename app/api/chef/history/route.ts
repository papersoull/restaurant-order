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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const tableNumber = searchParams.get("table") || "";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    // Filter by statuses relevant to chef (ready, served, billed are completed kitchen orders)
    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = { in: ["ready", "served", "billed"] };
    }

    if (tableNumber) {
      whereClause.restaurant_tables = {
        table_number: parseInt(tableNumber),
      };
    }

    if (dateFrom) {
      whereClause.placed_at = { ...whereClause.placed_at, gte: new Date(dateFrom) };
    }

    if (dateTo) {
      whereClause.placed_at = { ...whereClause.placed_at, lte: new Date(dateTo) };
    }

    if (search) {
      const searchNum = parseInt(search);
      if (!isNaN(searchNum)) {
        whereClause.display_number = searchNum;
      }
    }

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where: whereClause,
        orderBy: { placed_at: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          display_number: true,
          status: true,
          placed_at: true,
          accepted_at: true,
          ready_at: true,
          estimated_minutes: true,
          restaurant_tables: {
            select: { table_number: true },
          },
          order_items: {
            select: {
              quantity: true,
              price_at_order: true,
              menu_items: { select: { name: true } },
            },
          },
          order_status_history: {
            where: {
              status: { in: ["accepted", "ready"] },
            },
            orderBy: { changed_at: "desc" },
            select: {
              status: true,
              changed_at: true,
              users: { select: { name: true } },
            },
          },
        },
      }),
      prisma.orders.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      orders: orders.map((order) => {
        const acceptedHistory = order.order_status_history.find((h) => h.status === "accepted");
        const readyHistory = order.order_status_history.find((h) => h.status === "ready");

        const prepTime =
          order.accepted_at && order.ready_at
            ? Math.round(
                (new Date(order.ready_at).getTime() - new Date(order.accepted_at).getTime()) / 60000
              )
            : null;

        return {
          id: order.id,
          displayNumber: order.display_number,
          status: order.status,
          tableNumber: order.restaurant_tables.table_number,
          placedAt: order.placed_at,
          acceptedAt: order.accepted_at,
          readyAt: order.ready_at,
          estimatedMinutes: order.estimated_minutes,
          prepTime,
          chefName: acceptedHistory?.users?.name || null,
          completionTime: readyHistory?.changed_at || order.ready_at,
          items: order.order_items.map((item) => ({
            name: item.menu_items.name,
            quantity: item.quantity,
            priceAtOrder: Number(item.price_at_order),
          })),
        };
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch chef history", error);
    return NextResponse.json(
      { error: "Failed to fetch chef history" },
      { status: 500 }
    );
  }
}