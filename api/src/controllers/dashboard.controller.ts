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

    // Get current date and calculate previous month range
    const currentDate = new Date();
    const currentMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );

    console.log("seller Id : ", seller);

    const [
      // Current month metrics
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalProducts,
      totalMessages,
      totalRequests,
      totalRequestsRevenue,
      totalReturns,
      returnedProductsWorth,
      pendingOrdersWorth,

      // Last month metrics
      lastMonthTotalOrders,
      lastMonthTotalRevenue,
      lastMonthTotalRequests,
      lastMonthTotalRequestsRevenue,
      lastMonthTotalReturns,
    ] = await Promise.all([
      // Current month total orders
      prisma.order.count({
        where: {
          items: {
            some: {
              sellerId: seller.id,
            },
          },
        },
      }),

      // Current month total revenue
      prisma.order.aggregate({
        where: {
          sellerId: seller.id,
          status: "DELIVERED",
          createdAt: {
            gte: currentMonthStart,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Current month pending orders
      prisma.order.count({
        where: {
          sellerId: seller.id,
          status: "PENDING",
          createdAt: {
            gte: currentMonthStart,
          },
        },
      }),

      // Total products (all time)
      prisma.product.count({
        where: {
          sellerId: seller.id,
        },
      }),

      // Total messages (all time)
      prisma.conversationParticipant.count({
        where: {
          conversation: {
            participants: {
              some: {
                userId,
              },
            },
          },
        },
      }),

      // Current month total requests
      prisma.projectReq.count({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: currentMonthStart,
          },
        },
      }),

      // Current month total request revenue
      prisma.request.aggregate({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: currentMonthStart,
          },
        },
        _sum: {
          targetPrice: true,
        },
      }),

      // Current month total returns
      prisma.return.count({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: currentMonthStart,
          },
        },
      }),

      // Current month returned products worth
      prisma.return.aggregate({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: currentMonthStart,
          },
        },
        _sum: {
          refundAmount: true,
        },
      }),

      // Current month pending orders worth
      prisma.order.aggregate({
        where: {
          sellerId: seller.id,
          status: "PENDING",
          createdAt: {
            gte: currentMonthStart,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Last month total orders
      prisma.order.count({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // Last month total revenue
      prisma.order.aggregate({
        where: {
          sellerId: seller.id,
          status: "DELIVERED",
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Last month total requests
      prisma.request.count({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),

      // Last month total request revenue
      prisma.request.aggregate({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
        _sum: {
          targetPrice: true,
        },
      }),

      // Last month total returns
      prisma.return.count({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
    ]);

    console.log("totalOrders: ", totalOrders);
    console.log("totalRevenue: ", totalRevenue);
    console.log("pendingOrders: ", pendingOrders);
    console.log("totalProducts: ", totalProducts);
    console.log("totalMessages: ", totalMessages);
    console.log("totalRequests: ", totalRequests);
    console.log("totalRequestsRevenue: ", totalRequestsRevenue);
    console.log("totalReturns: ", totalReturns);
    console.log("returnedProductsWorth: ", returnedProductsWorth);

    // Calculate differences
    const revenueDifference =
      (totalRevenue._sum.totalAmount || 0) -
      (lastMonthTotalRevenue._sum.totalAmount || 0);
    const ordersDifference = totalOrders - lastMonthTotalOrders;
    const requestsDifference = totalRequests - lastMonthTotalRequests;
    const returnsDifference = totalReturns - lastMonthTotalReturns;
    const requestsRevenueDifference =
      (totalRequestsRevenue._sum.targetPrice || 0) -
      (lastMonthTotalRequestsRevenue._sum.targetPrice || 0);

    res.json({
      // Current month metrics
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      pendingOrdersWorth: pendingOrdersWorth._sum.totalAmount || 0,
      totalProducts,
      totalMessages,
      totalRequests,
      totalReturns,
      returnedProductsWorth: returnedProductsWorth._sum.refundAmount || 0,
      requestsRevenue: totalRequestsRevenue._sum.targetPrice || 0,
      requestsRevenueDifference,

      // Differences
      revenueDifference,
      ordersDifference,
      requestsDifference,
      returnsDifference,
    });
  } catch (error) {
    console.error("Get dashboard metrics error:", error);
    res.status(500).json({ error: "Failed to get dashboard metrics" });
  }
};

export const getOrderAnalytics = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { period } = req.query; // 'today', 'week', 'month', or 'year'

    const seller = await prisma.seller.findFirst({ where: { userId } });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    // Calculate date ranges based on period
    const currentDate = new Date();
    let currentPeriodStart: Date;
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;

    switch (period) {
      case "today":
        currentPeriodStart = new Date(currentDate);
        currentPeriodStart.setHours(0, 0, 0, 0);

        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
        previousPeriodEnd = new Date(previousPeriodStart);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;

      case "week":
        currentPeriodStart = new Date(currentDate);
        currentPeriodStart.setDate(
          currentDate.getDate() - currentDate.getDay()
        ); // Start of current week (Sunday)
        currentPeriodStart.setHours(0, 0, 0, 0);

        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        previousPeriodEnd = new Date(previousPeriodStart);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() + 6);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;

      case "month":
        currentPeriodStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );

        previousPeriodStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        previousPeriodEnd = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;

      case "year":
        currentPeriodStart = new Date(currentDate.getFullYear(), 0, 1);

        previousPeriodStart = new Date(currentDate.getFullYear() - 1, 0, 1);
        previousPeriodEnd = new Date(currentDate.getFullYear() - 1, 11, 31);
        previousPeriodEnd.setHours(23, 59, 59, 999);
        break;

      default:
        return res.status(400).json({ error: "Invalid period parameter" });
    }

    // Function to generate chart data based on period
    const generateChartData = async (periodType: string) => {
      let chartData: Array<{ name: string; orders: number; requests: number }> =
        [];
      const now = new Date();

      if (periodType === "today") {
        // Today by hours
        for (let i = 0; i < 24; i++) {
          const hourStart = new Date(now);
          hourStart.setHours(i, 0, 0, 0);
          const hourEnd = new Date(hourStart);
          hourEnd.setHours(i, 59, 59, 999);

          const [orders, requests] = await Promise.all([
            prisma.order.count({
              where: {
                sellerId: seller.id,
                createdAt: { gte: hourStart, lte: hourEnd },
              },
            }),
            prisma.request.count({
              where: {
                sellerId: seller.id,
                createdAt: { gte: hourStart, lte: hourEnd },
              },
            }),
          ]);

          chartData.push({
            name: `${i}:00`,
            orders,
            requests,
          });
        }
      } else if (periodType === "week") {
        // Week by days
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(currentPeriodStart);
          dayStart.setDate(dayStart.getDate() + i);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);

          const [orders, requests] = await Promise.all([
            prisma.order.count({
              where: {
                sellerId: seller.id,
                createdAt: { gte: dayStart, lte: dayEnd },
              },
            }),
            prisma.request.count({
              where: {
                sellerId: seller.id,
                createdAt: { gte: dayStart, lte: dayEnd },
              },
            }),
          ]);

          chartData.push({
            name: days[i],
            orders,
            requests,
          });
        }
      } else if (periodType === "month") {
        // Month by weeks
        const weeksInMonth = Math.ceil(
          (currentDate.getDate() +
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              1
            ).getDay()) /
            7
        );

        for (let i = 0; i < weeksInMonth; i++) {
          const weekStart = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            i * 7 + 1
          );
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);

          const [orders, requests] = await Promise.all([
            prisma.order.count({
              where: {
                sellerId: seller.id,
                createdAt: { gte: weekStart, lte: weekEnd },
              },
            }),
            prisma.request.count({
              where: {
                sellerId: seller.id,
                createdAt: { gte: weekStart, lte: weekEnd },
              },
            }),
          ]);

          chartData.push({
            name: `Week ${i + 1}`,
            orders,
            requests,
          });
        }
      } else if (periodType === "year") {
        // Year by months
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        for (let i = 0; i < 12; i++) {
          const monthStart = new Date(currentDate.getFullYear(), i, 1);
          const monthEnd = new Date(currentDate.getFullYear(), i + 1, 0);
          monthEnd.setHours(23, 59, 59, 999);

          const [orders, requests] = await Promise.all([
            prisma.order.count({
              where: {
                sellerId: seller.id,
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
            prisma.request.count({
              where: {
                sellerId: seller.id,
                createdAt: { gte: monthStart, lte: monthEnd },
              },
            }),
          ]);

          chartData.push({
            name: months[i],
            orders,
            requests,
          });
        }
      }

      return chartData;
    };

    // Get all metrics
    const [
      currentRequests,
      previousRequests,
      messages,
      activeProducts,
      chartData,
    ] = await Promise.all([
      // Current period requests
      prisma.request.count({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: currentPeriodStart,
          },
        },
      }),

      // Previous period requests
      prisma.request.count({
        where: {
          sellerId: seller.id,
          createdAt: {
            gte: previousPeriodStart,
            lte: previousPeriodEnd,
          },
        },
      }),

      // Messages
      prisma.conversationParticipant.count({
        where: {
          userId,
        },
      }),

      // Active products
      prisma.product.count({
        where: {
          sellerId: seller.id,
          isDraft: false,
          stockStatus: "IN_STOCK",
          createdAt: {
            gte: currentPeriodStart,
          },
        },
      }),

      // Generate chart data
      generateChartData(period),
    ]);

    res.json({
      period,
      metrics: {
        requests: {
          current: currentRequests,
          previous: previousRequests,
          difference: currentRequests - previousRequests,
          percentageChange:
            previousRequests === 0
              ? currentRequests > 0
                ? 100
                : 0
              : parseFloat(
                  (
                    ((currentRequests - previousRequests) / previousRequests) *
                    100
                  ).toFixed(2)
                ),
        },
        messages,
        activeProducts,
      },
      chartData,
      dateRanges: {
        current: {
          start: currentPeriodStart,
          end: currentDate,
        },
        previous: {
          start: previousPeriodStart,
          end: previousPeriodEnd,
        },
      },
    });
  } catch (error) {
    console.error("Get seller metrics error:", error);
    res.status(500).json({ error: "Failed to get seller metrics" });
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
