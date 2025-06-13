import type { Request, Response } from "express";
import prisma from "../db";
import { OrderStatus } from "@prisma/client";

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
      where: { sellerId },
      include: {
        order: { include: { buyer: { include: { user: true } } } },
        product: true,
      },
      orderBy: { order: { createdAt: "desc" } },
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
  console.log("Get order analytics called");
  try {
    const { userId } = req.user;
    const { period = "month" } = req.query; // Default to 'month' if not specified
    console.log("User ID:", userId);
    // Validate seller exists
    const seller = await prisma.seller.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    // Calculate date ranges based on period
    const { currentPeriodStart, previousPeriodStart, previousPeriodEnd } =
      getDateRanges(period);

    // Fetch all data in parallel for better performance
    const [
      currentRequests,
      previousRequests,
      messages,
      activeProducts,
      chartData,
      topProducts,
      lowSellingProducts,
      responseMetrics,
    ] = await Promise.all([
      getRequestCount(seller.id, currentPeriodStart),
      getRequestCount(seller.id, previousPeriodStart, previousPeriodEnd),
      getMessageCount(userId),
      getActiveProductCount(seller.id, currentPeriodStart),
      generateChartData(period, seller.id),
      getTopProductss(seller.id),
      getLowSellingProducts(seller.id),
      getResponseMetrics(seller.id, currentPeriodStart),
    ]);

    // Calculate percentage changes
    const requestPercentageChange = calculatePercentageChange(
      currentRequests,
      previousRequests
    );

    res.json({
      period,
      metrics: {
        requests: {
          current: currentRequests,
          previous: previousRequests,
          difference: currentRequests - previousRequests,
          percentageChange: requestPercentageChange,
        },
        messages,
        activeProducts,
        responseMetrics,
      },
      chartData,
      dateRanges: {
        current: { start: currentPeriodStart, end: new Date() },
        previous: { start: previousPeriodStart, end: previousPeriodEnd },
      },
      topProducts,
      lowSellingProducts,
    });
  } catch (error) {
    console.error("Get seller metrics error:", error);
    res.status(500).json({ error: "Failed to get seller metrics" });
  }
};

// Helper Functions

async function getOrdersByOrderType(userId: string) {
  const orders = await prisma.order.findMany({
    where: {
      sellerId: userId,
    },
    include: {
      items: true,
      buyer: {
        include: {
          user: true,
        },
      },
    },
  });

  const result = {
    singleProductOrders: orders.filter((order) => order.items.length === 1),
    multiProductOrders: orders.filter((order) => order.items.length > 1),
  };

  return result;
}

async function getOrderSummary(userId: string) {
  // Get all orders for this seller
  const orders = await prisma.order.findMany({
    where: {
      sellerId: userId,
    },
    include: {
      buyer: {
        include: {
          user: true,
        },
      },
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Analyze customer types
  const buyerOrderCounts: Record<string, number> = {};
  orders.forEach((order) => {
    if (order.buyerId) {
      buyerOrderCounts[order.buyerId] =
        (buyerOrderCounts[order.buyerId] || 0) + 1;
    }
  });

  const repeatedCustomers = Object.values(buyerOrderCounts).filter(
    (count) => count > 1
  ).length;
  const newCustomers = Object.keys(buyerOrderCounts).length - repeatedCustomers;

  // Analyze order types (single vs bulk)
  let singleOrders = 0;
  let bulkOrders = 0;

  orders.forEach((order) => {
    if (order.items.length === 1) {
      singleOrders++;
    } else {
      bulkOrders++;
    }
  });

  return {
    totalOrders: orders.length,
    repeatedCustomers,
    newCustomers,
    singleOrders,
    bulkOrders,
    orders, // optional: include the actual orders if needed
  };
}

function getDateRanges(period: string) {
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
      currentPeriodStart.setDate(currentDate.getDate() - currentDate.getDay());
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
      throw new Error("Invalid period parameter");
  }

  return { currentPeriodStart, previousPeriodStart, previousPeriodEnd };
}

async function generateChartData(period: string, sellerId: string) {
  const chartData: Array<{ name: string; orders: number; requests: number }> =
    [];
  const now = new Date();

  if (period === "today") {
    // Hourly data for today
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(now);
      hourStart.setHours(i, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(i, 59, 59, 999);

      const [orders, requests] = await Promise.all([
        getOrderCount(sellerId, hourStart, hourEnd),
        getRequestCount(sellerId, hourStart, hourEnd),
      ]);

      chartData.push({ name: `${i}:00`, orders, requests });
    }
  } else if (period === "week") {
    // Daily data for week
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - dayStart.getDay() + i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const [orders, requests] = await Promise.all([
        getOrderCount(sellerId, dayStart, dayEnd),
        getRequestCount(sellerId, dayStart, dayEnd),
      ]);

      chartData.push({ name: days[i], orders, requests });
    }
  } else if (period === "month") {
    // Weekly data for month
    const weeksInMonth = Math.ceil(
      (now.getDate() +
        new Date(now.getFullYear(), now.getMonth(), 1).getDay()) /
        7
    );

    for (let i = 0; i < weeksInMonth; i++) {
      const weekStart = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const [orders, requests] = await Promise.all([
        getOrderCount(sellerId, weekStart, weekEnd),
        getRequestCount(sellerId, weekStart, weekEnd),
      ]);

      chartData.push({ name: `Week ${i + 1}`, orders, requests });
    }
  } else if (period === "year") {
    // Monthly data for year
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
      const monthStart = new Date(now.getFullYear(), i, 1);
      const monthEnd = new Date(now.getFullYear(), i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const [orders, requests] = await Promise.all([
        getOrderCount(sellerId, monthStart, monthEnd),
        getRequestCount(sellerId, monthStart, monthEnd),
      ]);

      chartData.push({ name: months[i], orders, requests });
    }
  }

  return chartData;
}

// Data fetching functions
async function getOrderCount(
  sellerId: string,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = { sellerId };
  if (startDate) where.createdAt = { gte: startDate };
  if (endDate) where.createdAt = { ...where.createdAt, lte: endDate };

  return prisma.order.count({ where });
}

async function getRequestCount(
  sellerId: string,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = { sellerId };
  if (startDate) where.createdAt = { gte: startDate };
  if (endDate) where.createdAt = { ...where.createdAt, lte: endDate };

  return prisma.request.count({ where });
}

async function getMessageCount(userId: string) {
  return prisma.conversationParticipant.count({ where: { userId } });
}

async function getActiveProductCount(sellerId: string, sinceDate?: Date) {
  const where: any = {
    sellerId,
    isDraft: false,
    stockStatus: "IN_STOCK",
  };
  if (sinceDate) where.createdAt = { gte: sinceDate };

  return prisma.product.count({ where });
}

async function getTopProductss(sellerId: string, limit = 5) {
  return prisma.product.findMany({
    where: {
      sellerId,
      isDraft: false,
      stockStatus: "IN_STOCK",
    },
    orderBy: {
      orderItems: { _count: "desc" },
    },
    include: {
      _count: { select: { orderItems: true } },
      reviews: { select: { rating: true } },
    },
    take: limit,
  });
}

async function getLowSellingProducts(sellerId: string, limit = 5) {
  return prisma.product.findMany({
    where: {
      sellerId,
      isDraft: false,
      stockStatus: "IN_STOCK",
    },
    orderBy: [{ orderItems: { _count: "asc" } }, { availableQuantity: "asc" }],
    include: {
      _count: { select: { orderItems: true } },
      reviews: { select: { rating: true } },
    },
    take: limit,
  });
}

async function getResponseMetrics(sellerId: string, sinceDate: Date) {
  // Get all responded inquiries
  const inquiries = await prisma.inquiry.findMany({
    where: {
      supplierId: sellerId,
      status: { not: "PENDING" },
      createdAt: { gte: sinceDate },
    },
    select: {
      createdAt: true,
      updatedAt: true,
      status: true,
    },
  });

  // Calculate response times in hours
  const responseTimes = inquiries.map((inquiry) => {
    const responseTimeMs =
      inquiry.updatedAt.getTime() - inquiry.createdAt.getTime();
    return responseTimeMs / (1000 * 60 * 60); // Convert to hours
  });

  // Calculate metrics
  const averageResponseTime =
    responseTimes.length > 0
      ? parseFloat(
          (
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          ).toFixed(1)
        )
      : 0;

  const lateResponses = responseTimes.filter((time) => time > 72).length;
  const onTimeRate =
    responseTimes.length > 0
      ? parseFloat((1 - lateResponses / responseTimes.length).toFixed(2)) * 100
      : 100;

  // Response score (0-100)
  const responseScore = calculateResponseScore(responseTimes);

  return {
    averageResponseTime,
    lateResponses,
    onTimeRate,
    responseScore,
    totalInquiries: inquiries.length,
    respondedInquiries: inquiries.filter((i) => i.status !== "PENDING").length,
    responseTimes, // For charting
  };
}

function calculateResponseScore(responseTimes: number[]) {
  if (responseTimes.length === 0) return 100; // Perfect score if no inquiries

  // Calculate penalty based on response times
  const avgResponseTime =
    responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const lateResponses = responseTimes.filter((t) => t > 72).length;

  // Base score (100 - average hours, capped at 50% penalty)
  let score = 100 - Math.min(avgResponseTime, 50);

  // Additional penalty for late responses (up to 30% penalty)
  const latePenalty = (lateResponses / responseTimes.length) * 30;
  score -= latePenalty;

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
}

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
    // Extract query parameters with defaults
    const pageNo = parseInt(req.query.pageNo) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "totalAmount";
    const sortOrder = (req.query.sortOrder || "desc").toLowerCase();
    const filter = req.query.filter || "";

    // Calculate skip value for pagination
    const skip = (pageNo - 1) * pageSize;

    // Base where condition
    const whereCondition = {
      status: "DELIVERED",
    };

    // Get total count for pagination metadata
    const totalCount = await prisma.order.groupBy({
      by: ["buyerId"],
      where: { ...whereCondition, status: "DELIVERED" as const },
      _count: true,
    });

    // Get top buyers with pagination, sorting, and filtering
    const topBuyers = await prisma.order.groupBy({
      by: ["buyerId"],
      where: { ...whereCondition, status: "DELIVERED" as const },
      _count: true,
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        _sum: {
          [sortBy === "totalAmount" ? "totalAmount" : "totalAmount"]:
            sortOrder === "asc" ? "asc" : "desc",
        },
      },
      skip,
      take: pageSize,
    });

    // Get buyer details with search capability
    const buyerDetails = await Promise.all(
      topBuyers.map(async (buyer) => {
        const details = await prisma.buyer.findUnique({
          where: { id: buyer.buyerId! },
          include: {
            user: {
              select: {
                name: true,
                imageUrl: true,
                email: true,
                companyName: true,
                country: true,
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

    // Filter results based on search term if provided
    const filteredResults = search
      ? buyerDetails.filter(
          (buyer) =>
            buyer.details?.user?.name
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            buyer.details?.user?.email
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            buyer.details?.user?.companyName
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            buyer.details?.user?.country
              ?.toLowerCase()
              .includes(search.toLowerCase())
        )
      : buyerDetails;

    // Apply additional filtering if needed
    let finalResults = filteredResults;

    // Return paginated response with metadata
    res.json({
      data: finalResults,
      pagination: {
        total: totalCount.length,
        pageSize,
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount.length / pageSize),
        hasMore: pageNo * pageSize < totalCount.length,
      },
    });
  } catch (error) {
    console.error("Get top buyers error:", error);
    res.status(500).json({ error: "Failed to get top buyers" });
  }
};

// Example usage:
// GET /api/sellers/top-buyers?pageNo=1&pageSize=10&search=john&sortBy=totalAmount&sortOrder=desc&filter=US&type=country

export const getDashboard = async (req: any, res: Response) => {
  try {
    const { sellerId, userId } = req.user;
    const { period = "7d" } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (period === "30d" ? 30 : 7));

    // 1. Get regular orders for this seller (as per your latest logic)
    const orderWhere = {
      items: {
        some: {
          sellerId,
        },
      },
      status: OrderStatus.DELIVERED,
      createdAt: { gte: startDate, lte: endDate },
    };
    const orders = await prisma.order.findMany({
      where: orderWhere,
      include: {
        items: {
          where: { sellerId },
          include: {
            product: true,
            seller: {
              include: {
                user: { select: { name: true, imageUrl: true } },
              },
            },
          },
        },
        shippingAddress: true,
        buyer: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // 2. Get manufacturing/project requests for this seller
    const projectRequests = await prisma.projectReq.findMany({
      where: { sellerId },
      include: {
        project: { include: { milestones: true } },
        buyer: { include: { user: { select: { name: true, country: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // 3. Get regular requests (from Request table)
    const requests = await prisma.request.findMany({
      where: { sellerId, createdAt: { gte: startDate, lte: endDate } },
      include: {
        buyer: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // 4. Get contacts (buyers the seller has had conversations with)
    const contactsRaw = await prisma.conversation.findMany({
      where: { participants: { some: { userId: userId } } },
      include: { participants: { include: { user: true } } },
    });
    const contactsMap = new Map();
    contactsRaw.forEach((conv) => {
      conv.participants.forEach((part) => {
        if (part.userId !== sellerId && part.user.role === "BUYER") {
          contactsMap.set(part.userId, {
            id: part.userId,
            name: part.user.name || part.user.email || "Unknown",
            image: part.user.imageUrl || null,
          });
        }
      });
    });
    const contacts = Array.from(contactsMap.values());

    // 5. Aggregate for charts (orders, requests, manufacturing requests)
    // Example: group by week/month for charting
    // We'll use generateChartData for orders/requests, and add projectRequests aggregation
    const chartData = await generateChartData(period, sellerId);

    // 6. Other metrics (reuse your previous logic as needed)
    // Example: revenue, topBuyers, topProducts, lowSellingProducts
    const [totalRevenue, topBuyers, topProducts, lowSellingProducts] =
      await Promise.all([
        prisma.order.aggregate({
          where: {
            items: { some: { sellerId } },
            status: OrderStatus.DELIVERED,
          },
          _sum: { totalAmount: true },
        }),
        prisma.order.groupBy({
          by: ["buyerId"],
          where: {
            items: { some: { sellerId } },
            status: OrderStatus.DELIVERED,
          },
          _sum: { totalAmount: true },
          orderBy: { _sum: { totalAmount: "desc" } },
          take: 5,
        }),
        prisma.product.findMany({
          where: { sellerId, isDraft: false, stockStatus: "IN_STOCK" },
          orderBy: { orderItems: { _count: "desc" } },
          include: {
            _count: { select: { orderItems: true } },
            reviews: { select: { rating: true } },
          },
          take: 5,
        }),
        prisma.product.findMany({
          where: { sellerId, isDraft: false, stockStatus: "IN_STOCK" },
          orderBy: [
            { orderItems: { _count: "asc" } },
            { availableQuantity: "asc" },
          ],
          include: {
            _count: { select: { orderItems: true } },
            reviews: { select: { rating: true } },
          },
          take: 5,
        }),
      ]);

    res.json({
      orders, // regular orders
      requests, // regular requests
      projectRequests, // manufacturing/project requests
      contacts,
      chartData,
      totalRevenue: totalRevenue._sum?.totalAmount || 0,
      topBuyers,
      topProducts,
      lowSellingProducts,
      // ...add more metrics as needed
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
