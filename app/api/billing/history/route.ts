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
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (tableNumber) {
      whereClause.orders = {
        restaurant_tables: {
          table_number: parseInt(tableNumber),
        },
      };
    }

    if (dateFrom) {
      whereClause.created_at = { ...whereClause.created_at, gte: new Date(dateFrom) };
    }

    if (dateTo) {
      whereClause.created_at = { ...whereClause.created_at, lte: new Date(dateTo) };
    }

    if (search) {
      const searchNum = parseInt(search);
      if (!isNaN(searchNum)) {
        whereClause.orders = {
          ...whereClause.orders,
          display_number: searchNum,
        };
      }
    }

    const [bills, total] = await Promise.all([
      prisma.bills.findMany({
        where: whereClause,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
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
              status: true,
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
          },
        },
      }),
      prisma.bills.count({ where: whereClause }),
    ]);

    const totalRevenue = bills.reduce((sum, b) => sum + Number(b.total), 0);

    return NextResponse.json({
      bills: bills.map((bill) => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalRevenue,
        totalBills: total,
      },
    });
  } catch (error) {
    console.error("Failed to fetch billing history", error);
    return NextResponse.json(
      { error: "Failed to fetch billing history" },
      { status: 500 }
    );
  }
}