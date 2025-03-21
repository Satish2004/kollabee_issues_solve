import type { Request, Response } from "express";
import prisma from "../db";

export const getSellerDashboard = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const { period = "7d" } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (period === "30d" ? 30 : 7));

    // Get completed orders
    const completedOrders = await prisma.orderItem.findMany({
      where: {
        sellerId,
        order: {
          status: "DELIVERED",
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        order: true,
        product: true,
      },
    });

    // Calculate total revenue
    const totalRevenue = await prisma.orderItem.aggregate({
      where: {
        sellerId,
        order: {
          status: "DELIVERED",
        },
      },
      _sum: {
        price: true,
      },
    });

    // Get recent orders
    const recentOrders = await prisma.orderItem.findMany({
      where: {
        sellerId,
      },
      include: {
        order: {
          include: {
            buyer: {
              include: {
                user: true,
              },
            },
          },
        },
        product: true,
      },

      take: 5,
    });

    res.json({
      totalRevenue: totalRevenue._sum?.price || 0,
      completedOrders: completedOrders.length,
      recentOrders,
      periodStats: {
        startDate,
        endDate,
        orders: completedOrders,
      },
    });
  } catch (error) {
    console.error("Get seller dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const getBuyerDashboard = async (req: any, res: Response) => {
  try {
    const { buyerId } = req.user;

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: {
        buyerId,
        status: "DELIVERED",
      },
      include: {
        items: {
          include: {
            product: true,
            seller: {
              include: {
                user: {
                  select: {
                    name: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Get total spent
    const totalSpent = await prisma.order.aggregate({
      where: {
        buyerId,
        status: "DELIVERED",
      },
      _sum: {
        totalAmount: true,
      },
    });

    res.json({
      recentOrders,
      totalSpent: totalSpent._sum?.totalAmount || 0,
      totalOrders: recentOrders.length,
    });
  } catch (error) {
    console.error("Get buyer dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const getMetrics = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findFirst({ where: { userId } });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    const [totalOrders, totalRevenue, pendingOrders, totalProducts] =
      await Promise.all([
        // Total orders
        prisma.order.count({
          where: {
            sellerId: seller.id,
          },
        }),
        // Total revenue from completed orders
        prisma.order.aggregate({
          where: {
            sellerId: seller.id,
            status: "DELIVERED",
          },
          _sum: {
            totalAmount: true,
          },
        }),
        // Pending orders
        prisma.order.count({
          where: {
            sellerId: seller.id,
            status: "PENDING",
          },
        }),
        // Total products
        prisma.product.count({
          where: {
            sellerId: seller.id,
          },
        }),
      ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      totalProducts,
    });
  } catch (error) {
    console.error("Get dashboard metrics error:", error);
    res.status(500).json({ error: "Failed to get dashboard metrics" });
  }
};

export const getOrderAnalytics = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findFirst({ where: { userId } });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const orderAnalytics = await prisma.order.groupBy({
      by: ["createdAt", "status"],
      where: {
        sellerId: seller.id,
        createdAt: {
          gte: last30Days,
        },
      },
      _count: true,
      _sum: {
        totalAmount: true,
      },
    });

    res.json(orderAnalytics);
  } catch (error) {
    console.error("Get order analytics error:", error);
    res.status(500).json({ error: "Failed to get order analytics" });
  }
};

export const getTopProducts = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findFirst({ where: { userId } });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    const topProducts = await prisma.product.findMany({
      where: {
        sellerId: seller.id,
      },
      orderBy: {
        orderItems: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 5,
    });

    res.json(topProducts);
  } catch (error) {
    console.error("Get top products error:", error);
    res.status(500).json({ error: "Failed to get top products" });
  }
};

export const getTopBuyers = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findFirst({ where: { userId } });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    const topBuyers = await prisma.order.groupBy({
      by: ["buyerId"],
      where: {
        sellerId: seller.id,
        status: "DELIVERED",
      },
      _count: true,
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        _sum: {
          totalAmount: "desc",
        },
      },
      take: 5,
    });

    // Get buyer details
    const buyerDetails = await Promise.all(
      topBuyers.map(async (buyer: any) => {
        const details = await prisma.buyer.findUnique({
          where: { id: buyer.buyerId },
          include: {
            user: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        });
        return {
          ...buyer,
          details,
        };
      })
    );

    res.json(buyerDetails);
  } catch (error) {
    console.error("Get top buyers error:", error);
    res.status(500).json({ error: "Failed to get top buyers" });
  }
};
