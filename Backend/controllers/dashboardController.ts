import { Request, Response } from "express";
import { prisma } from "../config/db";

// GET /api/dashboard
export const getStats = async (_req: Request, res: Response): Promise<void> => {
  const [users, orders, products, revenue] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.product.count({ where: { status: "active" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
  ]);

  res.json({
    users,
    orders,
    products,
    revenue: Number(revenue._sum.totalAmount ?? 0),
  });
};
