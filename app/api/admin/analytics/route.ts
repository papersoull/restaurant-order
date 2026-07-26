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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      popularItems,
      orderStats,
      recentOrders,
    ] = await Promise.all([
      prisma.orders.count(),
      prisma.orders.count({
        where: { placed_at: { gte: today } },
      }),
      prisma.bills.aggregate({
        _sum: { total: true },
      }),
      prisma.bills.aggregate({
        _sum: { total: true },
        where: { created_at: { gte: today } },
      }),
      prisma.order_items.groupBy({
        by: ["item_id"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
      prisma.orders.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.orders.findMany({
        orderBy: { placed_at: "desc" },
        take: 10,
        select: {
          id: true,
          display_number: true,
          status: true,
          placed_at: true,
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
        },
      }),
    ]);

    const popularItemIds = popularItems.map((item) => item.item_id);
    const popularItemNames = popularItemIds.length > 0
      ? await prisma.menu_items.findMany({
          where: { id: { in: popularItemIds } },
          select: { id: true, name: true },
        })
      : [];

    const itemNameMap = new Map(popularItemNames.map((item) => [item.id, item.name]));

    return NextResponse.json({
      totalOrders,
      todayOrders,
      totalRevenue: Number(totalRevenue._sum.total || 0),
      todayRevenue: Number(todayRevenue._sum.total || 0),
      popularItems: popularItems.map((item) => ({
        name: itemNameMap.get(item.item_id) || "Unknown",
        totalQuantity: item._sum.quantity || 0,
      })),
      orderStats: orderStats.map((stat) => ({
        status: stat.status,
        count: stat._count.id,
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        displayNumber: order.display_number,
        status: order.status,
        tableNumber: order.restaurant_tables.table_number,
        placedAt: order.placed_at,
        itemCount: order.order_items.reduce((sum, item) => sum + item.quantity, 0),
        total: order.order_items.reduce(
          (sum, item) => sum + Number(item.price_at_order) * item.quantity,
          0
        ),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch analytics", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}