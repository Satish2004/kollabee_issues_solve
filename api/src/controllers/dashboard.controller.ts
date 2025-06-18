import { Request, Response } from "express";
import prisma from "../db";
import { OrderStatus } from "@prisma/client";
import { Order, Request as PrismaRequest, Message, projectReq, Prisma } from "@prisma/client";

interface User {
  name: string | null;
  imageUrl: string | null;
}

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
    buyer: {
      include: {
        user: {
          select: {
            name: true;
            imageUrl: true;
          };
        };
      };
    };
  };
}>;

type RequestWithRelations = Prisma.RequestGetPayload<{
  include: {
    buyer: {
      include: {
        user: {
          select: {
            name: true;
            imageUrl: true;
          };
        };
      };
    };
  };
}>;

type MessageWithRelations = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        name: true;
        imageUrl: true;
      };
    };
  };
}>;

type ProjectRequestWithRelations = Prisma.projectReqGetPayload<{
  include: {
    seller: {
      include: {
        user: {
          select: {
            name: true;
            imageUrl: true;
          };
        };
      };
    };
    project: true;
  };
}>;

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
    const { userId, role } = req.user;
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

    // Helper function to calculate percentage change
    const calculatePercentageChange = (current: number, past: number): string => {
      if (past === 0) return current === 0 ? '0%' : '100%';
      const change = ((current - past) / past) * 100;
      return `${Math.round(change)}%`;
    };

    // Helper function to format duration
    const formatDuration = (minutes: number): string => {
      if (!minutes) return '0m';
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return h ? `${h}h ${m}m` : `${m}m`;
    };

    // Get all requests (including regular requests, project requests, and orders)
    const [currentRequests, pastRequests] = await Promise.all([
      getRequestCount(seller.id),
      getRequestCount(seller.id, lastMonthStart, lastMonthEnd)
    ]);

    // Get received orders (orders with status DELIVERED)
    const [currentReceived, pastReceived] = await Promise.all([
      // Current period total received requests
      prisma.$transaction([
        // Regular requests
        prisma.request.count({
        where: {
              sellerId: seller.id,
            status: { not: "REJECTED" }
          }
      }),
        // Manufacturing requests (project requests)
        prisma.projectReq.count({
        where: {
          sellerId: seller.id,
            status: { not: "REJECTED" }
          }
        })
      ]).then(([regularRequests, manufacturingRequests]) => regularRequests + manufacturingRequests),
      // Past period total received requests
      prisma.$transaction([
        // Regular requests
        prisma.request.count({
        where: {
          sellerId: seller.id,
            status: { not: "REJECTED" },
          createdAt: {
              gte: lastMonthStart,
              lte: lastMonthEnd
            }
          }
        }),
        // Manufacturing requests (project requests)
        prisma.projectReq.count({
        where: {
          sellerId: seller.id,
            status: { not: "REJECTED" },
            createdAt: {
              gte: lastMonthStart,
              lte: lastMonthEnd
            }
          }
        })
      ]).then(([regularRequests, manufacturingRequests]) => regularRequests + manufacturingRequests)
    ]);

    // Get returned orders
    const [currentReturned, pastReturned] = await Promise.all([
      prisma.order.count({
        where: {
          items: { some: { sellerId: seller.id } },
          status: "RETURNED"
        }
      }),
      prisma.order.count({
        where: {
          items: { some: { sellerId: seller.id } },
          status: "RETURNED",
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      })
    ]);

    // Get orders on the way to ship (orders with status SHIPPED)
    const [currentShipping, pastShipping] = await Promise.all([
      prisma.order.count({
        where: {
          items: { some: { sellerId: seller.id } },
          status: "SHIPPED"
        }
      }),
      prisma.order.count({
        where: {
          items: { some: { sellerId: seller.id } },
          status: "SHIPPED",
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      })
    ]);

    // Calculate average sales
    const [currentSales, pastSales] = await Promise.all([
      prisma.order.findMany({
        where: {
          items: {
            some: {
              sellerId: seller.id
            }
          },
          status: {
            notIn: ["CANCELLED", "RETURNED"]
          }
        },
        select: {
          totalAmount: true
        }
      }),
      prisma.order.findMany({
        where: {
          items: {
            some: {
              sellerId: seller.id
            }
          },
          status: {
            notIn: ["CANCELLED", "RETURNED"]
          },
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        },
        select: {
          totalAmount: true
        }
      })
    ]);

    // Calculate average order value
    const currentAvgOrderValue = currentSales.length > 0 
      ? currentSales.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / currentSales.length
      : 0;
    
    const pastAvgOrderValue = pastSales.length > 0
      ? pastSales.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / pastSales.length
      : 0;

    // Calculate average response time
    const [currentResponseTime, pastResponseTime] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
            },
          },
          messages: {
            some: {
              senderId: { not: userId } // Only conversations where someone else sent a message
            }
          },
          // Current month: conversations that were active in current month
          updatedAt: {
            gte: currentMonthStart
          }
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      }),
      prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: userId,
          },
        },
          messages: {
            some: {
              senderId: { not: userId } // Only conversations where someone else sent a message
            }
          },
          // Previous month: conversations that were active in previous month
          updatedAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      })
    ]);

    console.log(`Current month conversations: ${currentResponseTime.length}`);
    console.log(`Previous month conversations: ${pastResponseTime.length}`);

    // Calculate average response time in minutes
    const calculateAverageResponseTime = (conversations: any[], period: string): number => {
      const responseTimes: number[] = [];
      
      console.log(`Processing ${conversations.length} conversations for ${period} response time calculation`);
      
      for (const conversation of conversations) {
        if (conversation.messages.length < 2) continue;
        
        const messages = conversation.messages;
        let buyerFirstMessage: any = null;
        let sellerResponse: any = null;
        
        // Find the first message from buyer
        for (const message of messages) {
          if (message.senderId !== userId) {
            buyerFirstMessage = message;
            break;
          }
        }
        
        // Find the first response from seller after buyer's message
        if (buyerFirstMessage) {
          for (const message of messages) {
            if (message.senderId === userId && message.createdAt > buyerFirstMessage.createdAt) {
              sellerResponse = message;
              break;
            }
          }
        }
        
        // Calculate response time if we found both messages
        if (buyerFirstMessage && sellerResponse) {
          const responseTimeMinutes = Math.abs(
            sellerResponse.createdAt.getTime() - buyerFirstMessage.createdAt.getTime()
          ) / (1000 * 60);
          
          console.log(`${period} - Response time: ${responseTimeMinutes} minutes (${(responseTimeMinutes/60).toFixed(2)} hours)`);
          
          // Only include reasonable response times (less than 24 hours)
          if (responseTimeMinutes < 24 * 60) {
            responseTimes.push(responseTimeMinutes);
          } else {
            console.log(`${period} - Skipping response time ${responseTimeMinutes} minutes as it's too high`);
          }
        }
      }

      const averageTime = responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 0;
        
      console.log(`${period} - Average response time: ${averageTime} minutes (${(averageTime/60).toFixed(2)} hours)`);
      console.log(`${period} - Total valid response times: ${responseTimes.length}`);

      return averageTime;
    };

    const currentAvgResponseTime = calculateAverageResponseTime(currentResponseTime, "CURRENT");
    const pastAvgResponseTime = calculateAverageResponseTime(pastResponseTime, "PAST");

    // If we don't have enough data, use a fallback calculation
    if (currentAvgResponseTime === 0 && pastAvgResponseTime === 0) {
      console.log("No conversation data found, using fallback calculation...");
      
      const [currentMessages, pastMessages] = await Promise.all([
        prisma.message.findMany({
        where: {
            senderId: userId,
          createdAt: {
              gte: currentMonthStart
            }
        },
          orderBy: {
            createdAt: 'asc'
          }
      }),
        prisma.message.findMany({
        where: {
            senderId: userId,
          createdAt: {
            gte: lastMonthStart,
              lte: lastMonthEnd
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        })
      ]);

      console.log(`Current month seller messages: ${currentMessages.length}`);
      console.log(`Previous month seller messages: ${pastMessages.length}`);

      // For fallback, use a reasonable default based on message frequency
      const currentFallback = currentMessages.length > 0 ? 30 : 0; // 30 minutes default
      const pastFallback = pastMessages.length > 0 ? 45 : 0; // 45 minutes default

      console.log(`Using fallback times - Current: ${currentFallback}min, Past: ${pastFallback}min`);
      
      const metrics = {
        totalOrders: {
          current: currentRequests,
          past: pastRequests,
          percentageChange: calculatePercentageChange(currentRequests, pastRequests)
        },
        totalReceived: {
          current: currentReceived,
          past: pastReceived,
          percentageChange: calculatePercentageChange(currentReceived, pastReceived)
        },
        returnedOrders: {
          current: currentReturned,
          past: pastReturned,
          percentageChange: calculatePercentageChange(currentReturned, pastReturned)
        },
        onWayToShip: {
          current: currentShipping,
          past: pastShipping,
          percentageChange: calculatePercentageChange(currentShipping, pastShipping)
        },
        averageSales: {
          current: Math.round(currentAvgOrderValue),
          past: Math.round(pastAvgOrderValue),
          percentageChange: calculatePercentageChange(
            Math.round(currentAvgOrderValue),
            Math.round(pastAvgOrderValue)
          )
        },
        averageResponseTime: {
          current: formatDuration(currentFallback),
          past: formatDuration(pastFallback),
          percentageChange: calculatePercentageChange(currentFallback, pastFallback)
        }
      };

      res.json(metrics);
      return;
    }

    const metrics = {
      totalOrders: {
        current: currentRequests,
        past: pastRequests,
        percentageChange: calculatePercentageChange(currentRequests, pastRequests)
      },
      totalReceived: {
        current: currentReceived,
        past: pastReceived,
        percentageChange: calculatePercentageChange(currentReceived, pastReceived)
      },
      returnedOrders: {
        current: currentReturned,
        past: pastReturned,
        percentageChange: calculatePercentageChange(currentReturned, pastReturned)
      },
      onWayToShip: {
        current: currentShipping,
        past: pastShipping,
        percentageChange: calculatePercentageChange(currentShipping, pastShipping)
      },
      averageSales: {
        current: Math.round(currentAvgOrderValue),
        past: Math.round(pastAvgOrderValue),
        percentageChange: calculatePercentageChange(
          Math.round(currentAvgOrderValue),
          Math.round(pastAvgOrderValue)
        )
      },
      averageResponseTime: {
        current: formatDuration(currentAvgResponseTime),
        past: formatDuration(pastAvgResponseTime),
        percentageChange: calculatePercentageChange(currentAvgResponseTime, pastAvgResponseTime)
      }
    };

    res.json(metrics);
  } catch (error) {
    console.error("Get metrics error:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};

export const getOrderAnalytics = async (req: any, res: Response) => {
  console.log("Get order analytics called");
  try {
    const { userId, role } = req.user;
    const { period = "month" } = req.query; // Default to 'month' if not specified
    console.log("User ID:", userId, "Period:", period);
    
    // Validate seller exists
    const seller = await prisma.seller.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    console.log("Seller ID:", seller.id);

    // Calculate date ranges based on period
    const { currentPeriodStart, previousPeriodStart, previousPeriodEnd } =
      getDateRanges(period);

    console.log("=== ORDER ANALYTICS DATE RANGES ===");
    console.log("Current Period Start:", currentPeriodStart.toISOString());
    console.log("Current Period End:", new Date().toISOString());
    console.log("Previous Period Start:", previousPeriodStart.toISOString());
    console.log("Previous Period End:", previousPeriodEnd.toISOString());

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
      getMessageCount(userId, currentPeriodStart, role),
      getActiveProductCount(seller.id, currentPeriodStart),
      generateOrderAnalyticsChartData(period, seller.id),
      getTopProductss(seller.id),
      getLowSellingProducts(seller.id),
      getResponseMetrics(seller.id, currentPeriodStart),
    ]);

    console.log("=== ORDER ANALYTICS CHART DATA ===");
    console.log("Chart Data:", chartData);
    console.log("Current Requests:", currentRequests);
    console.log("Previous Requests:", previousRequests);

    // Calculate percentage changes
    const requestPercentageChange = calculatePercentageChange(
      currentRequests,
      previousRequests
    );

    // Add after generateChartData
    async function generateOrderSummaryData(period: string, sellerId: string) {
      const summaryData: Array<{ name: string; repeated: number; new: number }> = [];
      const now = new Date();

      // Helper to get new/repeated customers in a date range
      async function getBuyerTypeCounts(start: Date, end: Date) {
        console.log(`=== GET BUYER TYPE COUNTS DEBUG (${start.toISOString()} to ${end.toISOString()}) ===`);
        
        // Get orders only
        const orders = await prisma.order.findMany({
          where: {
            items: {
              some: {
                sellerId: sellerId,
              },
            },
            status: {
              notIn: ["CANCELLED", "RETURNED"],
            },
            createdAt: { gte: start, lte: end },
          },
          include: {
            buyer: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        console.log('Orders found:', orders.length);

        // Convert orders to transactions format
        const transactions = orders.map(order => ({
          buyerId: order.buyerId,
          createdAt: order.createdAt,
          type: 'ORDER'
        }));

        console.log('Transactions:', transactions.length);

        const buyerFirstTransactionDates: Record<string, Date> = {};
        let newBuyers = 0;
        let repeatedBuyers = 0;

        // First pass: collect all historical orders to determine first transaction dates
        const allHistoricalOrders = await prisma.order.findMany({
          where: {
            items: {
              some: {
                sellerId: sellerId,
              },
            },
            status: {
              notIn: ["CANCELLED", "RETURNED"],
            },
            createdAt: { lt: end },
          },
          select: {
            buyerId: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        console.log('Historical orders:', allHistoricalOrders.length);

        // Build first transaction dates map (considering orders only)
        allHistoricalOrders.forEach((transaction) => {
          if (transaction.buyerId && !buyerFirstTransactionDates[transaction.buyerId]) {
            buyerFirstTransactionDates[transaction.buyerId] = transaction.createdAt;
          }
        });

        console.log('Buyer first transaction dates:', Object.fromEntries(
          Object.entries(buyerFirstTransactionDates).map(([buyerId, date]) => [
            buyerId, 
            { date: date.toISOString(), isNew: date >= start }
          ])
        ));

        // Analyze current period transactions
        const periodBuyerFirstTransaction: Record<string, Date> = {};
        
        // Track first transaction in current period for each buyer
        transactions.forEach((transaction) => {
          if (transaction.buyerId) {
            if (!periodBuyerFirstTransaction[transaction.buyerId]) {
              periodBuyerFirstTransaction[transaction.buyerId] = transaction.createdAt;
            }
          }
        });

        transactions.forEach((transaction) => {
          if (transaction.buyerId) {
            const firstTransactionDate = buyerFirstTransactionDates[transaction.buyerId];
            const isFirstInPeriod = periodBuyerFirstTransaction[transaction.buyerId]?.getTime() === transaction.createdAt.getTime();
            
            // Check if this buyer's first transaction ever was in the current period
            const isNewCustomer = firstTransactionDate >= start;
            
            // Only count as NEW if it's their first transaction in this period AND they're a new customer
            if (isFirstInPeriod && isNewCustomer) {
              newBuyers++;
              console.log(`NEW BUYER: ${transaction.buyerId} (${transaction.type}) - First transaction: ${firstTransactionDate.toISOString()}`);
            } else {
              repeatedBuyers++;
              console.log(`REPEATED BUYER: ${transaction.buyerId} (${transaction.type}) - First transaction: ${firstTransactionDate.toISOString()}`);
            }
          }
        });

        console.log(`Final counts - New: ${newBuyers}, Repeated: ${repeatedBuyers}`);
        console.log('=== END GET BUYER TYPE COUNTS DEBUG ===');

        return { new: newBuyers, repeated: repeatedBuyers };
      }

      if (period === "today") {
        for (let i = 0; i < 24; i++) {
          const hourStart = new Date(now);
          hourStart.setHours(i, 0, 0, 0);
          const hourEnd = new Date(hourStart);
          hourEnd.setHours(i, 59, 59, 999);
          const { new: newBuyers, repeated } = await getBuyerTypeCounts(hourStart, hourEnd);
          summaryData.push({ name: `${i}:00`, repeated, new: newBuyers });
        }
      } else if (period === "week") {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date();
          dayStart.setDate(dayStart.getDate() - dayStart.getDay() + i);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);
          const { new: newBuyers, repeated } = await getBuyerTypeCounts(dayStart, dayEnd);
          summaryData.push({ name: days[i], repeated, new: newBuyers });
        }
      } else if (period === "month") {
        const weeksInMonth = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7);
        for (let i = 0; i < weeksInMonth; i++) {
          const weekStart = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);
          const { new: newBuyers, repeated } = await getBuyerTypeCounts(weekStart, weekEnd);
          summaryData.push({ name: `Week ${i + 1}`, repeated, new: newBuyers });
        }
      } else if (period === "year") {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        console.log('=== YEAR CHART DATA ===');
        console.log('Current Year:', now.getFullYear());
        for (let i = 0; i < 12; i++) {
          const monthStart = new Date(now.getFullYear(), i, 1);
          const monthEnd = new Date(now.getFullYear(), i + 1, 0);
          monthEnd.setHours(23, 59, 59, 999);
          console.log(`${months[i]}: ${monthStart.toISOString()} to ${monthEnd.toISOString()}`);
          const { new: newBuyers, repeated } = await getBuyerTypeCounts(monthStart, monthEnd);
          summaryData.push({ name: months[i], repeated, new: newBuyers });
        }
        console.log('=== END YEAR CHART DATA ===');
      }
      return summaryData;
    }

    const orderSummaryData = await generateOrderSummaryData(period, seller.id);

    res.json({
      data: {
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
        orderSummaryData,
      }
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
      // For year, we want to show all data from the start of the current year
      currentPeriodStart = new Date(currentDate.getFullYear(), 0, 1);
      currentPeriodStart.setHours(0, 0, 0, 0);

      // Previous period is the entire previous year
      previousPeriodStart = new Date(currentDate.getFullYear() - 1, 0, 1);
      previousPeriodStart.setHours(0, 0, 0, 0);
      previousPeriodEnd = new Date(currentDate.getFullYear() - 1, 11, 31);
      previousPeriodEnd.setHours(23, 59, 59, 999);
      break;

    default:
      throw new Error("Invalid period parameter");
  }

  console.log('Date Range Details:', {
    period,
    currentDate,
    currentPeriodStart,
    previousPeriodStart,
    previousPeriodEnd,
    currentPeriodStartISO: currentPeriodStart.toISOString(),
    previousPeriodStartISO: previousPeriodStart.toISOString(),
    previousPeriodEndISO: previousPeriodEnd.toISOString()
  });

  return { currentPeriodStart, previousPeriodStart, previousPeriodEnd };
}

async function generateOrderAnalyticsChartData(period: string, sellerId: string) {
  const chartData: Array<{ name: string; bulk: number; single: number }> = [];
  const now = new Date();

  // Helper to count bulk and single orders in a date range
  async function getBulkSingleCounts(start: Date, end: Date) {
    // Use the same query structure as /api/orders/seller
    const ordersWhere: any = {
      items: {
        some: {
          sellerId: sellerId,
        },
      },
      status: { 
        notIn: ["CANCELLED", "RETURNED"] 
      },
      createdAt: { gte: start, lte: end }
    };

    // Get all orders for this seller in the date range
    const orders = await prisma.order.findMany({
      where: ordersWhere,
      include: {
        items: {
      where: {
            sellerId: sellerId,
          },
          select: {
            id: true,
            quantity: true,
          }
        }
      }
    });

    // Categorize based on number of items
    let bulk = 0;
    let single = 0;

    orders.forEach(order => {
      // Count total items for this seller in this order
      const totalItems = order.items.length;
      
      if (totalItems === 1) {
        single++;
      } else if (totalItems > 1) {
        bulk++;
      }
    });

    // Debug logging for chart data
    console.log('=== ORDER ANALYTICS CHART DATA DEBUG ===');
    console.log('Period:', start.toISOString(), 'to', end.toISOString());
    console.log('Total Orders Found:', orders.length);
    console.log('Bulk (items > 1):', bulk);
    console.log('Single (items = 1):', single);
    console.log('Orders Where:', ordersWhere);
    console.log('Sample Orders:', orders.slice(0, 3).map(order => ({
      id: order.id,
      itemCount: order.items.length,
      status: order.status
    })));

    return { bulk, single };
  }

  if (period === "today") {
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(now);
      hourStart.setHours(i, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(i, 59, 59, 999);
      const { bulk, single } = await getBulkSingleCounts(hourStart, hourEnd);
      chartData.push({ name: `${i}:00`, bulk, single });
    }
  } else if (period === "week") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - dayStart.getDay() + i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const { bulk, single } = await getBulkSingleCounts(dayStart, dayEnd);
      chartData.push({ name: days[i], bulk, single });
    }
  } else if (period === "month") {
    const weeksInMonth = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7);
    for (let i = 0; i < weeksInMonth; i++) {
      const weekStart = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const { bulk, single } = await getBulkSingleCounts(weekStart, weekEnd);
      chartData.push({ name: `Week ${i + 1}`, bulk, single });
    }
  } else if (period === "year") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    console.log('=== YEAR ORDER ANALYTICS CHART DATA ===');
    console.log('Current Year:', now.getFullYear());
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(now.getFullYear(), i, 1);
      const monthEnd = new Date(now.getFullYear(), i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      console.log(`${months[i]}: ${monthStart.toISOString()} to ${monthEnd.toISOString()}`);
      const { bulk, single } = await getBulkSingleCounts(monthStart, monthEnd);
      chartData.push({ name: months[i], bulk, single });
    }
    console.log('=== END YEAR ORDER ANALYTICS CHART DATA ===');
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
  // Get regular product/service requests
  const regularRequestsWhere: any = { 
    sellerId,
    status: { not: "REJECTED" }  // Only count non-rejected requests
  };
  if (startDate) regularRequestsWhere.createdAt = { gte: startDate };
  if (endDate) regularRequestsWhere.createdAt = { ...regularRequestsWhere.createdAt, lte: endDate };

  // Get project requests
  const projectRequestsWhere: any = { 
    sellerId,
    status: { not: "REJECTED" }  // Only count non-rejected requests
  };
  if (startDate) projectRequestsWhere.createdAt = { gte: startDate };
  if (endDate) projectRequestsWhere.createdAt = { ...projectRequestsWhere.createdAt, lte: endDate };

  // Get orders (these are also requests from buyers) - exclude cancelled/returned orders
  const ordersWhere: any = {
    items: {
      some: {
        sellerId: sellerId
      }
    },
    status: { 
      notIn: ["CANCELLED", "RETURNED"] 
    }  // Only count non-cancelled/non-returned orders
  };
  if (startDate) ordersWhere.createdAt = { gte: startDate };
  if (endDate) ordersWhere.createdAt = { ...ordersWhere.createdAt, lte: endDate };

  const [regularRequests, projectRequests, orders] = await Promise.all([
    prisma.request.count({ where: regularRequestsWhere }),
    prisma.projectReq.count({ where: projectRequestsWhere }),
    prisma.order.count({ where: ordersWhere })
  ]);

  const totalRequests = regularRequests + projectRequests + orders;

  console.log('=== REQUEST COUNT DETAILS ===');
  console.log('Seller ID:', sellerId);
  console.log('Date Range:', { 
    startDate: startDate?.toISOString(), 
    endDate: endDate?.toISOString() 
  });
  console.log('Regular Requests (prisma.request):', regularRequests);
  console.log('Project Requests (prisma.projectReq):', projectRequests);
  console.log('Orders (prisma.order):', orders);
  console.log('Total Requests:', totalRequests);
  console.log('Where Clauses:', {
    regularRequests: regularRequestsWhere,
    projectRequests: projectRequestsWhere,
    orders: ordersWhere
  });
  console.log('=============================');

  // Debug: Get actual data to see what's being counted
  if (totalRequests > 0) {
    console.log('=== DEBUG: ACTUAL DATA ===');
    
    // Get sample orders to see their status
    const sampleOrders = await prisma.order.findMany({
      where: ordersWhere,
      select: {
        id: true,
        status: true,
        createdAt: true,
        totalAmount: true
      },
      take: 5
    });
    console.log('Sample Orders:', sampleOrders);

    // Get sample project requests
    const sampleProjectRequests = await prisma.projectReq.findMany({
      where: projectRequestsWhere,
      select: {
        id: true,
        status: true,
        createdAt: true
      },
      take: 5
    });
    console.log('Sample Project Requests:', sampleProjectRequests);

    // Get sample regular requests
    const sampleRegularRequests = await prisma.request.findMany({
      where: regularRequestsWhere,
      select: {
        id: true,
        status: true,
        createdAt: true
      },
      take: 5
    });
    console.log('Sample Regular Requests:', sampleRegularRequests);
    console.log('=== END DEBUG ===');
  }

  // Additional debug: Get all data for current year to see distribution
  const currentYearStart = new Date(new Date().getFullYear(), 0, 1);
  const currentYearEnd = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999);
  
  const allProjectRequests = await prisma.projectReq.findMany({
    where: {
      sellerId,
      status: { not: "REJECTED" },
      createdAt: { gte: currentYearStart, lte: currentYearEnd }
    },
    select: {
      id: true,
      status: true,
      createdAt: true
    }
  });
  
  const allOrders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          sellerId: sellerId
        }
      },
      status: { notIn: ["CANCELLED", "RETURNED"] },
      createdAt: { gte: currentYearStart, lte: currentYearEnd }
    },
    select: {
      id: true,
      status: true,
      createdAt: true
    }
  });
  
  console.log('=== YEARLY DATA DISTRIBUTION ===');
  console.log('All Project Requests in 2025:', allProjectRequests.length);
  console.log('All Orders in 2025:', allOrders.length);
  console.log('Project Requests by month:', allProjectRequests.map(r => ({ 
    month: r.createdAt.getMonth() + 1, 
    date: r.createdAt.toISOString() 
  })));
  console.log('Orders by month:', allOrders.map(o => ({ 
    month: o.createdAt.getMonth() + 1, 
    date: o.createdAt.toISOString() 
  })));
  console.log('=== END YEARLY DATA ===');

  return totalRequests;
}

async function getMessageCount(userId: string, sinceDate?: Date, role?: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
      OR: [{ status: "ACCEPTED" }, { initiatedBy: { not: userId } }],
      ...(sinceDate ? { updatedAt: { gte: sinceDate } } : {}),
    },
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  // Filter conversations based on having a valid other participant
  const validConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(
      (p: any) => p.userId !== userId && p.user.role !== "ADMIN"
    );
    return otherParticipant !== undefined;
  });

  return validConversations.length;
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
    const { userId, role } = req.user;
    const { period = "month" } = req.query;
    console.log('=== DASHBOARD REQUEST ===');
    console.log('User ID:', userId, 'Role:', role, 'Period:', period);

    const seller = await prisma.seller.findFirst({ where: { userId } });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    const sellerId = seller.id;
    console.log('Seller ID:', sellerId);

    // For year period, we want to show all data from the start of the current year
      const currentDate = new Date();
    let currentPeriodStart, previousPeriodStart, previousPeriodEnd;

    if (period === "year") {
          currentPeriodStart = new Date(currentDate.getFullYear(), 0, 1);
      currentPeriodStart.setHours(0, 0, 0, 0);
          previousPeriodStart = new Date(currentDate.getFullYear() - 1, 0, 1);
      previousPeriodStart.setHours(0, 0, 0, 0);
          previousPeriodEnd = new Date(currentDate.getFullYear() - 1, 11, 31);
          previousPeriodEnd.setHours(23, 59, 59, 999);
    } else {
      const ranges = getDateRanges(period);
      currentPeriodStart = ranges.currentPeriodStart;
      previousPeriodStart = ranges.previousPeriodStart;
      previousPeriodEnd = ranges.previousPeriodEnd;
    }

    console.log('=== DATE RANGES ===');
    console.log('Current Date:', currentDate.toISOString());
    console.log('Current Period Start:', currentPeriodStart.toISOString());
    console.log('Previous Period Start:', previousPeriodStart.toISOString());
    console.log('Previous Period End:', previousPeriodEnd.toISOString());

    // Metrics
    const [currentRequests, previousRequests, messages, activeProducts] = await Promise.all([
      getRequestCount(sellerId, currentPeriodStart, currentDate),
      getRequestCount(sellerId, previousPeriodStart, previousPeriodEnd),
      getMessageCount(userId, currentPeriodStart, role),
      prisma.product.count({ where: { sellerId, isDraft: false, stockStatus: "IN_STOCK" } }),
    ]);

    const requestDifference = currentRequests - previousRequests;
    const requestPercentageChange = previousRequests === 0 ? (currentRequests === 0 ? 0 : 100) : Math.round(((currentRequests - previousRequests) / previousRequests) * 100);

    console.log('=== FINAL METRICS ===');
    console.log('Current Requests:', currentRequests);
    console.log('Previous Requests:', previousRequests);
    console.log('Request Difference:', requestDifference);
    console.log('Request Percentage Change:', requestPercentageChange);
    console.log('Messages:', messages);
    console.log('Active Products:', activeProducts);
    console.log('========================');

    // Chart Data (orders/requests per period bucket)
    const chartData = await generateChartData(period, sellerId);

    // Top Products
    const topProducts = await prisma.product.findMany({
      where: { sellerId, isDraft: false, stockStatus: "IN_STOCK" },
      include: {
        orderItems: {
          where: {
            order: {
              createdAt: { gte: currentPeriodStart, lte: currentDate }
            }
          }
        }
      },
      take: 5,
    });
    const topProductsFormatted = topProducts
      .map((product) => {
        const quantity = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const amount = product.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          amount,
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Low Selling Products
    const lowSellingProducts = await prisma.product.findMany({
      where: { sellerId, isDraft: false, stockStatus: "IN_STOCK" },
      include: {
        orderItems: {
          where: {
            order: {
              createdAt: { gte: currentPeriodStart, lte: currentDate }
            }
          }
        }
      },
    });
    const lowSellingProductsFormatted = lowSellingProducts
      .map((product) => {
        const quantity = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const amount = product.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          amount,
        };
      })
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);

    res.json({
      metrics: {
        requests: {
          current: currentRequests,
          previous: previousRequests,
          difference: requestDifference,
          percentageChange: requestPercentageChange,
        },
        messages,
        activeProducts,
      },
      chartData,
      topProducts: topProductsFormatted,
      lowSellingProducts: lowSellingProductsFormatted,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const getNotifications = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10, type = 'all' } = req.query;
    const pageSize = parseInt(limit as string);
    const pageNo = parseInt(page as string);
    const skip = (pageNo - 1) * pageSize;

    // For type-specific queries, use direct pagination
    if (type !== 'all') {
      let data: any[] = [];
      let total = 0;

      switch (type) {
        case 'ORDER':
          [data, total] = await Promise.all([
            prisma.order.findMany({
              where: {
                items: {
                  some: {
                    seller: {
                      userId: userId,
                    },
                  },
                },
              },
              include: {
                items: {
                  include: {
                    product: true,
                  },
                },
                buyer: {
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
              orderBy: {
                createdAt: "desc",
              },
              take: pageSize,
              skip,
            }),
            prisma.order.count({
              where: {
                items: {
                  some: {
                    seller: {
                      userId: userId,
                    },
                  },
                },
              },
            }),
          ]);
          break;

        case 'REQUEST':
          [data, total] = await Promise.all([
            prisma.request.findMany({
              where: {
                seller: {
                  userId: userId,
                },
              },
              include: {
                buyer: {
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
              orderBy: {
                createdAt: "desc",
              },
              take: pageSize,
              skip,
            }),
            prisma.request.count({
              where: {
                seller: {
                  userId: userId,
                },
              },
            }),
          ]);
          break;

        case 'MESSAGE':
          [data, total] = await Promise.all([
            prisma.message.findMany({
              where: {
                conversation: {
                  participants: {
                    some: {
                      userId: userId,
                    },
                  },
                },
              },
              include: {
                sender: {
                  select: {
                    name: true,
                    imageUrl: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: pageSize,
              skip,
            }),
            prisma.message.count({
              where: {
                conversation: {
                  participants: {
                    some: {
                      userId: userId,
                    },
                  },
                },
              },
            }),
          ]);
          break;

        case 'PROJECT_REQUEST':
          [data, total] = await Promise.all([
            prisma.projectReq.findMany({
              where: {
                seller: {
                  userId: userId,
                },
              },
              include: {
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
                project: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: pageSize,
              skip,
            }),
            prisma.projectReq.count({
              where: {
                seller: {
                  userId: userId,
                },
              },
            }),
          ]);
          break;
      }

      const notifications = data.map((item) => {
        switch (type) {
          case 'ORDER':
            return {
              id: item.id,
              type: 'ORDER',
              title: `New order from ${item.buyer?.user?.name || 'Unknown'}`,
              createdAt: item.createdAt,
              data: item,
            };
          case 'REQUEST':
            return {
              id: item.id,
              type: 'REQUEST',
              title: `New request from ${item.buyer?.user?.name || 'Unknown'}`,
              createdAt: item.createdAt,
              data: item,
            };
          case 'MESSAGE':
            return {
              id: item.id,
              type: 'MESSAGE',
              title: `New message from ${item.sender?.name || 'Unknown'}`,
              createdAt: item.createdAt,
              data: item,
            };
          case 'PROJECT_REQUEST':
            return {
              id: item.id,
              type: 'PROJECT_REQUEST',
              title: `New project request from ${item.seller?.user?.name || 'Unknown'}`,
              createdAt: item.createdAt,
              data: item,
            };
          default:
            return null;
        }
      }).filter(Boolean);

      return res.json({
        notifications,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: pageNo,
      });
    }

    // For 'all' type, we need to fetch all data, combine, sort, and then paginate
    // This is more complex but necessary for proper mixed-type pagination
    const [orders, requests, messages, projectRequests] = await Promise.all([
      prisma.order.findMany({
        where: {
          items: {
            some: {
              seller: {
                userId: userId,
              },
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          buyer: {
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
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.request.findMany({
        where: {
          seller: {
            userId: userId,
          },
        },
        include: {
          buyer: {
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
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.message.findMany({
        where: {
          conversation: {
            participants: {
              some: {
                userId: userId,
              },
            },
          },
        },
        include: {
          sender: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.projectReq.findMany({
        where: {
          seller: {
            userId: userId,
          },
        },
        include: {
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
          project: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Transform and combine all notifications
    const allNotifications = [
      ...orders.map((order) => ({
        id: order.id,
        type: 'ORDER',
        title: `New order from ${order.buyer?.user?.name || 'Unknown'}`,
        createdAt: order.createdAt,
        data: order,
      })),
      ...requests.map((request) => ({
        id: request.id,
        type: 'REQUEST',
        title: `New request from ${request.buyer?.user?.name || 'Unknown'}`,
        createdAt: request.createdAt,
        data: request,
      })),
      ...messages.map((message) => ({
        id: message.id,
        type: 'MESSAGE',
        title: `New message from ${message.sender?.name || 'Unknown'}`,
        createdAt: message.createdAt,
        data: message,
      })),
      ...projectRequests.map((projectRequest) => ({
        id: projectRequest.id,
        type: 'PROJECT_REQUEST',
        title: `New project request from ${projectRequest.seller?.user?.name || 'Unknown'}`,
        createdAt: projectRequest.createdAt,
        data: projectRequest,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination to the combined and sorted results
    const total = allNotifications.length;
    const paginatedNotifications = allNotifications.slice(skip, skip + pageSize);

    return res.json({
      notifications: paginatedNotifications,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNo,
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBuyerNotifications = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10, type = 'all' } = req.query;
    const pageSize = parseInt(limit as string);
    const pageNo = parseInt(page as string);
    const skip = (pageNo - 1) * pageSize;

    // For type-specific queries, use direct pagination
    if (type !== 'all') {
      let data: any[] = [];
      let total = 0;

      switch (type) {
        case 'ORDER':
          [data, total] = await Promise.all([
            prisma.order.findMany({
              where: {
                buyerId: userId,
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
              take: pageSize,
              skip,
            }),
            prisma.order.count({
              where: {
                buyerId: userId,
              },
            }),
          ]);
          break;

        case 'MESSAGE':
          [data, total] = await Promise.all([
            prisma.message.findMany({
              where: {
                conversation: {
                  participants: {
                    some: {
                      userId: userId,
                    },
                  },
                },
              },
              include: {
                sender: {
                  select: {
                    name: true,
                    imageUrl: true,
                  },
                },
              },
              orderBy: {
                createdAt: "desc",
              },
              take: pageSize,
              skip,
            }),
            prisma.message.count({
              where: {
                conversation: {
                  participants: {
                    some: {
                      userId: userId,
                    },
                  },
                },
              },
            }),
          ]);
          break;

        case 'PROJECT_REQUEST':
          [data, total] = await Promise.all([
            prisma.projectReq.findMany({
              where: {
                buyer: {
                  userId: userId,
                },
              },
              include: {
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
                project: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: pageSize,
              skip,
            }),
            prisma.projectReq.count({
              where: {
                buyer: {
                  userId: userId,
                },
              },
            }),
          ]);
          break;
      }

      const notifications = data.map((item) => {
        switch (type) {
          case 'ORDER':
            return {
              id: item.id,
              type: 'ORDER',
              title: `Order #${item.id.slice(-6)} status: ${item.status}`,
              message: `Your order #${item.id.slice(-6)} has been ${item.status.toLowerCase()}`,
              read: false,
              createdAt: item.createdAt.toISOString(),
              metadata: {
                orderId: item.id,
              },
            };
          case 'MESSAGE':
            return {
              id: item.id,
              type: 'MESSAGE',
              title: `New message from ${item.sender?.name || 'Unknown'}`,
              message: `You received a new message from ${item.sender?.name || 'Unknown'}`,
              read: false,
              createdAt: item.createdAt.toISOString(),
              metadata: {
                messageId: item.id,
              },
            };
          case 'PROJECT_REQUEST':
            return {
              id: item.id,
              type: 'PROJECT_REQUEST',
              title: `${item.seller?.user?.name || 'Unknown'} responded to your project request`,
              message: `${item.seller?.user?.name || 'Unknown'} has responded to your project request`,
              read: false,
              createdAt: item.createdAt.toISOString(),
              metadata: {
                requestId: item.id,
                projectId: item.projectId,
              },
            };
          default:
            return null;
        }
      }).filter(Boolean);

      return res.json({
        notifications,
        total,
        totalPages: Math.ceil(total / pageSize),
        currentPage: pageNo,
      });
    }

    // For 'all' type, fetch all data, combine, sort, and then paginate
    const [orders, messages, projectRequests] = await Promise.all([
      prisma.order.findMany({
        where: {
          buyerId: userId,
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
      }),
      prisma.message.findMany({
        where: {
          conversation: {
            participants: {
              some: {
                userId: userId,
              },
            },
          },
        },
        include: {
          sender: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.projectReq.findMany({
        where: {
          buyer: {
            userId: userId,
          },
        },
        include: {
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
          project: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Transform and combine all notifications
    const allNotifications = [
      ...orders.map((order) => ({
        id: order.id,
        type: 'ORDER',
        title: `Order #${order.id.slice(-6)} status: ${order.status}`,
        message: `Your order #${order.id.slice(-6)} has been ${order.status.toLowerCase()}`,
        read: false,
        createdAt: order.createdAt.toISOString(),
        metadata: {
          orderId: order.id,
        },
      })),
      ...messages.map((message) => ({
        id: message.id,
        type: 'MESSAGE',
        title: `New message from ${message.sender?.name || 'Unknown'}`,
        message: `You received a new message from ${message.sender?.name || 'Unknown'}`,
        read: false,
        createdAt: message.createdAt.toISOString(),
        metadata: {
          messageId: message.id,
        },
      })),
      ...projectRequests.map((request) => ({
        id: request.id,
        type: 'PROJECT_REQUEST',
        title: `${request.seller?.user?.name || 'Unknown'} responded to your project request`,
        message: `${request.seller?.user?.name || 'Unknown'} has responded to your project request`,
        read: false,
        createdAt: request.createdAt.toISOString(),
        metadata: {
          requestId: request.id,
          projectId: request.projectId,
        },
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination to the combined and sorted results
    const total = allNotifications.length;
    const paginatedNotifications = allNotifications.slice(skip, skip + pageSize);

    return res.json({
      notifications: paginatedNotifications,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: pageNo,
    });
  } catch (error) {
    console.error("Get buyer notifications error:", error);
    return res.status(500).json({ error: "Failed to fetch buyer notifications" });
  }
};

export const getLatestOrders = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const pageSize = parseInt(limit as string);
    const pageNo = parseInt(page as string);
    const skip = (pageNo - 1) * pageSize;

    const seller = await prisma.seller.findFirst({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          items: {
            some: {
              sellerId: seller.id,
            },
          },
        },
        include: {
          items: {
            where: {
              sellerId: seller.id,
            },
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
          buyer: {
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
        orderBy: {
          createdAt: "desc",
        },
        take: pageSize,
        skip,
      }),
      prisma.order.count({
        where: {
          items: {
            some: {
              sellerId: seller.id,
            },
          },
        },
      }),
    ]);

    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.id.slice(-6).toUpperCase(),
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      buyer: {
        name: order.buyer?.user?.name || 'Unknown',
        imageUrl: order.buyer?.user?.imageUrl || null,
      },
      items: order.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    res.json({
      data: transformedOrders,
      pagination: {
        total: totalCount,
        pageSize,
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / pageSize),
        hasMore: pageNo * pageSize < totalCount,
      },
    });
  } catch (error) {
    console.error("Get latest orders error:", error);
    res.status(500).json({ error: "Failed to fetch latest orders" });
  }
};

export const getContacts = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const pageSize = parseInt(limit as string);
    const pageNo = parseInt(page as string);
    const skip = (pageNo - 1) * pageSize;

    // Get contacts from conversations
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: pageSize,
      skip,
    });

    // Transform conversations to contacts
    const contacts = conversations
      .map((conv) => {
        const otherParticipant = conv.participants.find(
          (p) => p.userId !== userId && p.user.role === "BUYER"
        );

        if (!otherParticipant) return null;

        const lastMessage = conv.messages[0];
        
        return {
          id: otherParticipant.userId,
          name: otherParticipant.user.name || otherParticipant.user.email || "Unknown",
          image: otherParticipant.user.imageUrl || null,
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage?.createdAt.toISOString() || null,
          unreadCount: 0, // You can implement unread count logic here
        };
      })
      .filter(Boolean);

    // Get total count
    const totalCount = await prisma.conversation.count({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
    });

    res.json({
      data: contacts,
      pagination: {
        total: totalCount,
        pageSize,
        currentPage: pageNo,
        totalPages: Math.ceil(totalCount / pageSize),
        hasMore: pageNo * pageSize < totalCount,
      },
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

export const markNotificationAsRead = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { notificationId } = req.params;

    // For now, we'll just return success since we're not storing read status in the current implementation
    // In a real implementation, you would update the notification's read status in the database
    
    res.json({ 
      success: true, 
      message: "Notification marked as read" 
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

export const markAllNotificationsAsRead = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;

    // For now, we'll just return success since we're not storing read status in the current implementation
    // In a real implementation, you would update all notifications' read status for this user
    
    res.json({ 
      success: true, 
      message: "All notifications marked as read" 
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};

export const getOrderSummary = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { period = "month" } = req.query;

    // Validate seller exists
    const seller = await prisma.seller.findFirst({
      where: { userId },
      select: { id: true },
    });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    // Calculate date ranges based on period
    const { currentPeriodStart, previousPeriodStart, previousPeriodEnd } =
      getDateRanges(period);

    // Get all orders for this seller (both current and previous periods for comparison)
    const allOrders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            sellerId: seller.id,
          },
        },
        status: {
          notIn: ["CANCELLED", "RETURNED"],
        },
      },
      include: {
        buyer: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
        items: {
          where: {
            sellerId: seller.id,
          },
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert orders to transactions format for consistency
    const allTransactions = allOrders.map(order => ({
      id: order.id,
      type: 'ORDER',
      buyerId: order.buyerId,
      buyer: order.buyer,
      createdAt: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items,
    }));

    // Separate transactions by period
    const currentPeriodTransactions = allTransactions.filter(
      (transaction) => transaction.createdAt >= currentPeriodStart
    );
    const previousPeriodTransactions = allTransactions.filter(
      (transaction) =>
        transaction.createdAt >= previousPeriodStart &&
        transaction.createdAt <= previousPeriodEnd
    );

    // Helper function to analyze buyer types
    function analyzeBuyerTypes(transactions: any[], allHistoricalTransactions: any[]) {
      const buyerTransactionCounts: Record<string, number> = {};
      const buyerFirstTransactionDates: Record<string, Date> = {};
      const periodBuyers = new Set<string>();
      const periodBuyerFirstTransaction: Record<string, Date> = {};

      console.log('=== ANALYZE BUYER TYPES DEBUG ===');
      console.log('Current Period Start:', currentPeriodStart.toISOString());
      console.log('Total Historical Transactions:', allHistoricalTransactions.length);
      console.log('Current Period Transactions:', transactions.length);

      // Count transactions per buyer and track first transaction dates (from all time)
      allHistoricalTransactions.forEach((transaction) => {
        if (transaction.buyerId) {
          buyerTransactionCounts[transaction.buyerId] =
            (buyerTransactionCounts[transaction.buyerId] || 0) + 1;
          if (!buyerFirstTransactionDates[transaction.buyerId]) {
            buyerFirstTransactionDates[transaction.buyerId] = transaction.createdAt;
          }
        }
      });

      // Track first transaction in current period for each buyer
      transactions.forEach((transaction) => {
        if (transaction.buyerId) {
          if (!periodBuyerFirstTransaction[transaction.buyerId]) {
            periodBuyerFirstTransaction[transaction.buyerId] = transaction.createdAt;
          }
        }
      });

      console.log('Buyer Transaction Counts:', buyerTransactionCounts);
      console.log('Buyer First Transaction Dates (All Time):', Object.fromEntries(
        Object.entries(buyerFirstTransactionDates).map(([buyerId, date]) => [
          buyerId, 
          { date: date.toISOString(), isNew: date >= currentPeriodStart }
        ])
      ));
      console.log('Buyer First Transaction Dates (Current Period):', Object.fromEntries(
        Object.entries(periodBuyerFirstTransaction).map(([buyerId, date]) => [
          buyerId, 
          { date: date.toISOString() }
        ])
      ));

      // Analyze current period transactions
      let newBuyers = 0;
      let repeatedBuyers = 0;
      const newBuyerDetails: any[] = [];
      const repeatedBuyerDetails: any[] = [];

      transactions.forEach((transaction) => {
        if (transaction.buyerId) {
          periodBuyers.add(transaction.buyerId);
          
          // Check if this is the buyer's first transaction in the current period
          const isFirstInPeriod = periodBuyerFirstTransaction[transaction.buyerId]?.getTime() === transaction.createdAt.getTime();
          
          // Check if this buyer's first transaction ever was in the current period
          const firstTransactionDate = buyerFirstTransactionDates[transaction.buyerId];
          const isNewCustomer = firstTransactionDate >= currentPeriodStart;
          
          console.log(`Transaction ${transaction.id} (${transaction.type}):`, {
            buyerId: transaction.buyerId,
            transactionDate: transaction.createdAt.toISOString(),
            firstTransactionDate: firstTransactionDate?.toISOString(),
            isFirstInPeriod,
            isNewCustomer,
            buyerName: transaction.buyer?.user?.name
          });
          
          if (isFirstInPeriod && isNewCustomer) {
            // This is their first transaction ever AND first in this period
            newBuyers++;
            newBuyerDetails.push({
              buyerId: transaction.buyerId,
              buyerName: transaction.buyer?.user?.name || "Unknown",
              buyerEmail: transaction.buyer?.user?.email || "",
              buyerImage: transaction.buyer?.user?.imageUrl || null,
              transactionId: transaction.id,
              transactionType: transaction.type,
              transactionAmount: transaction.totalAmount,
              transactionDate: transaction.createdAt,
              totalTransactions: buyerTransactionCounts[transaction.buyerId] || 1,
            });
          } else {
            // Either not their first in period OR not their first ever
            repeatedBuyers++;
            repeatedBuyerDetails.push({
              buyerId: transaction.buyerId,
              buyerName: transaction.buyer?.user?.name || "Unknown",
              buyerEmail: transaction.buyer?.user?.email || "",
              buyerImage: transaction.buyer?.user?.imageUrl || null,
              transactionId: transaction.id,
              transactionType: transaction.type,
              transactionAmount: transaction.totalAmount,
              transactionDate: transaction.createdAt,
              totalTransactions: buyerTransactionCounts[transaction.buyerId] || 1,
              firstTransactionDate: firstTransactionDate,
            });
          }
        }
      });

      console.log('Final Results:', {
        newBuyers,
        repeatedBuyers,
        totalBuyers: periodBuyers.size,
        newBuyerDetails: newBuyerDetails.map(d => ({ buyerId: d.buyerId, buyerName: d.buyerName, transactionType: d.transactionType })),
        repeatedBuyerDetails: repeatedBuyerDetails.map(d => ({ buyerId: d.buyerId, buyerName: d.buyerName, transactionType: d.transactionType }))
      });
      console.log('=== END ANALYZE BUYER TYPES DEBUG ===');

      return {
        newBuyers,
        repeatedBuyers,
        newBuyerDetails,
        repeatedBuyerDetails,
        totalBuyers: periodBuyers.size,
      };
    }

    // Analyze current and previous periods
    const currentPeriodAnalysis = analyzeBuyerTypes(
      currentPeriodTransactions,
      allTransactions
    );
    const previousPeriodAnalysis = analyzeBuyerTypes(
      previousPeriodTransactions,
      allTransactions.filter((transaction) => transaction.createdAt < currentPeriodStart)
    );

    // Calculate metrics
    const totalCurrentTransactions = currentPeriodTransactions.length;
    const totalPreviousTransactions = previousPeriodTransactions.length;
    const totalCurrentRevenue = currentPeriodTransactions.reduce(
      (sum, transaction) => sum + transaction.totalAmount,
      0
    );
    const totalPreviousRevenue = previousPeriodTransactions.reduce(
      (sum, transaction) => sum + transaction.totalAmount,
      0
    );

    // Calculate percentage changes
    const transactionPercentageChange = calculatePercentageChange(
      totalCurrentTransactions,
      totalPreviousTransactions
    );
    const revenuePercentageChange = calculatePercentageChange(
      totalCurrentRevenue,
      totalPreviousRevenue
    );
    const newBuyerPercentageChange = calculatePercentageChange(
      currentPeriodAnalysis.newBuyers,
      previousPeriodAnalysis.newBuyers
    );
    const repeatedBuyerPercentageChange = calculatePercentageChange(
      currentPeriodAnalysis.repeatedBuyers,
      previousPeriodAnalysis.repeatedBuyers
    );

    // Generate time-based summary data
    const summaryData = await generateTimeBasedOrderSummary(
      period,
      seller.id,
      currentPeriodStart,
      previousPeriodStart,
      previousPeriodEnd
    );

    res.json({
      data: {
        period,
        currentPeriod: {
          start: currentPeriodStart,
          end: new Date(),
        },
        previousPeriod: {
          start: previousPeriodStart,
          end: previousPeriodEnd,
        },
        metrics: {
          orders: {
            current: totalCurrentTransactions,
            previous: totalPreviousTransactions,
            difference: totalCurrentTransactions - totalPreviousTransactions,
            percentageChange: transactionPercentageChange,
          },
          revenue: {
            current: totalCurrentRevenue,
            previous: totalPreviousRevenue,
            difference: totalCurrentRevenue - totalPreviousRevenue,
            percentageChange: revenuePercentageChange,
          },
          buyers: {
            new: {
              current: currentPeriodAnalysis.newBuyers,
              previous: previousPeriodAnalysis.newBuyers,
              difference: currentPeriodAnalysis.newBuyers - previousPeriodAnalysis.newBuyers,
              percentageChange: newBuyerPercentageChange,
            },
            repeated: {
              current: currentPeriodAnalysis.repeatedBuyers,
              previous: previousPeriodAnalysis.repeatedBuyers,
              difference: currentPeriodAnalysis.repeatedBuyers - previousPeriodAnalysis.repeatedBuyers,
              percentageChange: repeatedBuyerPercentageChange,
            },
            total: currentPeriodAnalysis.totalBuyers,
          },
        },
        buyerDetails: {
          newBuyers: currentPeriodAnalysis.newBuyerDetails,
          repeatedBuyers: currentPeriodAnalysis.repeatedBuyerDetails,
        },
        summaryData,
      },
    });
  } catch (error) {
    console.error("Get order summary error:", error);
    res.status(500).json({ error: "Failed to get order summary" });
  }
};

// Helper function to generate time-based order summary data
async function generateTimeBasedOrderSummary(
  period: string,
  sellerId: string,
  currentPeriodStart: Date,
  previousPeriodStart: Date,
  previousPeriodEnd: Date
) {
  const summaryData: Array<{ name: string; new: number; repeated: number }> = [];
  const now = new Date();

  // Helper to get new/repeated customers in a date range
  async function getBuyerTypeCounts(start: Date, end: Date) {
    console.log(`=== GET BUYER TYPE COUNTS DEBUG (${start.toISOString()} to ${end.toISOString()}) ===`);
    
    // Get orders only
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            sellerId: sellerId,
          },
        },
        status: {
          notIn: ["CANCELLED", "RETURNED"],
        },
        createdAt: { gte: start, lte: end },
      },
      include: {
        buyer: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log('Orders found:', orders.length);

    // Convert orders to transactions format
    const transactions = orders.map(order => ({
      buyerId: order.buyerId,
      createdAt: order.createdAt,
      type: 'ORDER'
    }));

    console.log('Transactions:', transactions.length);

    const buyerFirstTransactionDates: Record<string, Date> = {};
    let newBuyers = 0;
    let repeatedBuyers = 0;

    // First pass: collect all historical orders to determine first transaction dates
    const allHistoricalOrders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            sellerId: sellerId,
          },
        },
        status: {
          notIn: ["CANCELLED", "RETURNED"],
        },
        createdAt: { lt: end },
      },
      select: {
        buyerId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log('Historical orders:', allHistoricalOrders.length);

    // Build first transaction dates map (considering orders only)
    allHistoricalOrders.forEach((transaction) => {
      if (transaction.buyerId && !buyerFirstTransactionDates[transaction.buyerId]) {
        buyerFirstTransactionDates[transaction.buyerId] = transaction.createdAt;
      }
    });

    console.log('Buyer first transaction dates:', Object.fromEntries(
      Object.entries(buyerFirstTransactionDates).map(([buyerId, date]) => [
        buyerId, 
        { date: date.toISOString(), isNew: date >= start }
      ])
    ));

    // Analyze current period transactions
    const periodBuyerFirstTransaction: Record<string, Date> = {};
    
    // Track first transaction in current period for each buyer
    transactions.forEach((transaction) => {
      if (transaction.buyerId) {
        if (!periodBuyerFirstTransaction[transaction.buyerId]) {
          periodBuyerFirstTransaction[transaction.buyerId] = transaction.createdAt;
        }
      }
    });

    transactions.forEach((transaction) => {
      if (transaction.buyerId) {
        const firstTransactionDate = buyerFirstTransactionDates[transaction.buyerId];
        const isFirstInPeriod = periodBuyerFirstTransaction[transaction.buyerId]?.getTime() === transaction.createdAt.getTime();
        
        // Check if this buyer's first transaction ever was in the current period
        const isNewCustomer = firstTransactionDate >= start;
        
        // Only count as NEW if it's their first transaction in this period AND they're a new customer
        if (isFirstInPeriod && isNewCustomer) {
          newBuyers++;
          console.log(`NEW BUYER: ${transaction.buyerId} (${transaction.type}) - First transaction: ${firstTransactionDate.toISOString()}`);
        } else {
          repeatedBuyers++;
          console.log(`REPEATED BUYER: ${transaction.buyerId} (${transaction.type}) - First transaction: ${firstTransactionDate.toISOString()}`);
        }
      }
    });

    console.log(`Final counts - New: ${newBuyers}, Repeated: ${repeatedBuyers}`);
    console.log('=== END GET BUYER TYPE COUNTS DEBUG ===');

    return { new: newBuyers, repeated: repeatedBuyers };
  }

  if (period === "today") {
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(now);
      hourStart.setHours(i, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(i, 59, 59, 999);
      const { new: newBuyers, repeated } = await getBuyerTypeCounts(hourStart, hourEnd);
      summaryData.push({ name: `${i}:00`, repeated, new: newBuyers });
    }
  } else if (period === "week") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - dayStart.getDay() + i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const { new: newBuyers, repeated } = await getBuyerTypeCounts(dayStart, dayEnd);
      summaryData.push({ name: days[i], repeated, new: newBuyers });
    }
  } else if (period === "month") {
    const weeksInMonth = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7);
    for (let i = 0; i < weeksInMonth; i++) {
      const weekStart = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const { new: newBuyers, repeated } = await getBuyerTypeCounts(weekStart, weekEnd);
      summaryData.push({ name: `Week ${i + 1}`, repeated, new: newBuyers });
    }
  } else if (period === "year") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(now.getFullYear(), i, 1);
      const monthEnd = new Date(now.getFullYear(), i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      const { new: newBuyers, repeated } = await getBuyerTypeCounts(monthStart, monthEnd);
      summaryData.push({ name: months[i], repeated, new: newBuyers });
    }
  }

  return summaryData;
}

async function generateChartData(period: string, sellerId: string) {
  const chartData: Array<{ name: string; orders: number; requests: number }> = [];
  const now = new Date();

  // Helper to count orders and manufacturing requests in a date range
  async function getOrdersAndRequestsCounts(start: Date, end: Date) {
    // Get orders
    const orders = await prisma.order.count({
      where: {
        items: {
          some: {
            sellerId: sellerId
          }
        },
        status: { 
          notIn: ["CANCELLED", "RETURNED"] 
        },
        createdAt: { gte: start, lte: end }
      }
    });

    // Get manufacturing requests
    const manufacturingRequests = await prisma.projectReq.count({
      where: {
        sellerId: sellerId,
        status: { not: "REJECTED" },
        createdAt: { gte: start, lte: end }
      }
    });

    // Debug logging for chart data
    console.log('=== CHART DATA DEBUG ===');
    console.log('Period:', start.toISOString(), 'to', end.toISOString());
    console.log('Orders:', orders);
    console.log('Manufacturing Requests:', manufacturingRequests);

    return { orders, requests: manufacturingRequests };
  }

  if (period === "today") {
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(now);
      hourStart.setHours(i, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(i, 59, 59, 999);
      const { orders, requests } = await getOrdersAndRequestsCounts(hourStart, hourEnd);
      chartData.push({ name: `${i}:00`, orders, requests });
    }
  } else if (period === "week") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - dayStart.getDay() + i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const { orders, requests } = await getOrdersAndRequestsCounts(dayStart, dayEnd);
      chartData.push({ name: days[i], orders, requests });
    }
  } else if (period === "month") {
    const weeksInMonth = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7);
    for (let i = 0; i < weeksInMonth; i++) {
      const weekStart = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      const { orders, requests } = await getOrdersAndRequestsCounts(weekStart, weekEnd);
      chartData.push({ name: `Week ${i + 1}`, orders, requests });
    }
  } else if (period === "year") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    console.log('=== YEAR CHART DATA ===');
    console.log('Current Year:', now.getFullYear());
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(now.getFullYear(), i, 1);
      const monthEnd = new Date(now.getFullYear(), i + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      console.log(`${months[i]}: ${monthStart.toISOString()} to ${monthEnd.toISOString()}`);
      const { orders, requests } = await getOrdersAndRequestsCounts(monthStart, monthEnd);
      chartData.push({ name: months[i], orders, requests });
    }
    console.log('=== END YEAR CHART DATA ===');
  }
  return chartData;
}
