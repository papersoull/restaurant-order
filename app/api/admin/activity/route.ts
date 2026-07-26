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
    const type = searchParams.get("type") || ""; // order, staff, menu, billing, login
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const skip = (page - 1) * limit;

    // Build activities from multiple sources
    const whereClause: any = {};

    // Order status changes
    const orderHistoryWhere: any = {};

    if (dateFrom) {
      orderHistoryWhere.changed_at = { ...orderHistoryWhere.changed_at, gte: new Date(dateFrom) };
    }
    if (dateTo) {
      orderHistoryWhere.changed_at = { ...orderHistoryWhere.changed_at, lte: new Date(dateTo) };
    }

    // Get order status history
    const [statusHistory, statusHistoryTotal] = await Promise.all([
      prisma.order_status_history.findMany({
        where: orderHistoryWhere,
        orderBy: { changed_at: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          changed_at: true,
          users: { select: { name: true, role: true } },
          orders: {
            select: {
              display_number: true,
              restaurant_tables: { select: { table_number: true } },
            },
          },
        },
      }),
      prisma.order_status_history.count({ where: orderHistoryWhere }),
    ]);

    // Get bills for billing activity
    const billWhere: any = {};
    if (dateFrom) {
      billWhere.created_at = { ...billWhere.created_at, gte: new Date(dateFrom) };
    }
    if (dateTo) {
      billWhere.created_at = { ...billWhere.created_at, lte: new Date(dateTo) };
    }

    const [recentBills, billTotal] = await Promise.all([
      prisma.bills.findMany({
        where: billWhere,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          total: true,
          created_at: true,
          users: { select: { name: true } },
          orders: {
            select: {
              display_number: true,
              restaurant_tables: { select: { table_number: true } },
            },
          },
        },
      }),
      prisma.bills.count({ where: billWhere }),
    ]);

    // Combine and sort activities
    const activities: any[] = [];

    statusHistory.forEach((h) => {
      activities.push({
        id: `order-${h.id}`,
        type: "order",
        action: `Order #${h.orders.display_number} ${h.status}`,
        details: `Table ${h.orders.restaurant_tables.table_number} - Status changed to ${h.status}`,
        user: h.users?.name || "System",
        userRole: h.users?.role || null,
        timestamp: h.changed_at,
      });
    });

    recentBills.forEach((b) => {
      activities.push({
        id: `bill-${b.id}`,
        type: "billing",
        action: `Bill generated for Order #${b.orders.display_number}`,
        details: `Table ${b.orders.restaurant_tables.table_number} - ₹${Number(b.total).toFixed(0)}`,
        user: b.users?.name || "System",
        userRole: "billing",
        timestamp: b.created_at,
      });
    });

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply type filter
    const filteredActivities = type
      ? activities.filter((a) => a.type === type)
      : activities;

    // Apply search filter
    const searchedActivities = search
      ? filteredActivities.filter(
          (a) =>
            a.action.toLowerCase().includes(search.toLowerCase()) ||
            a.details.toLowerCase().includes(search.toLowerCase()) ||
            a.user.toLowerCase().includes(search.toLowerCase())
        )
      : filteredActivities;

    // Paginate
    const paginatedActivities = searchedActivities.slice(skip, skip + limit);
    const total = searchedActivities.length;

    return NextResponse.json({
      activities: paginatedActivities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin activity", error);
    return NextResponse.json(
      { error: "Failed to fetch admin activity" },
      { status: 500 }
    );
  }
}