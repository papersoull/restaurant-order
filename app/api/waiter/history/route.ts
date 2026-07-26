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
    const waiterName = searchParams.get("waiter") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const skip = (page - 1) * limit;

    const whereClause: any = {
      status: { in: ["served", "billed"] },
    };

    if (tableNumber) {
      whereClause.restaurant_tables = {
        table_number: parseInt(tableNumber),
      };
    }

    if (dateFrom) {
      whereClause.served_at = { ...whereClause.served_at, gte: new Date(dateFrom) };
    }

    if (dateTo) {
      whereClause.served_at = { ...whereClause.served_at, lte: new Date(dateTo) };
    }

    if (search) {
      const searchNum = parseInt(search);
      if (!isNaN(searchNum)) {
        whereClause.display_number = searchNum;
      }
    }

    if (waiterName) {
      whereClause.order_status_history = {
        some: {
          status: "served",
          users: { name: { contains: waiterName, mode: "insensitive" } },
        },
      };
    }

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where: whereClause,
        orderBy: { served_at: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          display_number: true,
          status: true,
          placed_at: true,
          served_at: true,
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
              status: { in: ["ready", "served"] },
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
        const readyHistory = order.order_status_history.find((h) => h.status === "ready");
        const servedHistory = order.order_status_history.find((h) => h.status === "served");

        const deliveryTime =
          order.served_at && readyHistory?.changed_at
            ? Math.round(
                (new Date(order.served_at).getTime() - new Date(readyHistory.changed_at).getTime()) / 60000
              )
            : null;

        return {
          id: order.id,
          displayNumber: order.display_number,
          status: order.status,
          tableNumber: order.restaurant_tables.table_number,
          placedAt: order.placed_at,
          servedAt: order.served_at,
          deliveryTime,
          waiterName: servedHistory?.users?.name || null,
          readyAt: readyHistory?.changed_at || null,
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
    console.error("Failed to fetch waiter history", error);
    return NextResponse.json(
      { error: "Failed to fetch waiter history" },
      { status: 500 }
    );
  }
}