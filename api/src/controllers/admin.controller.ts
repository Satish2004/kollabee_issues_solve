import type { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const adminController = {
  // Block communication between two users
  blockCommunication: async (req: any, res: Response) => {
    try {
      const { initiatorId, targetId, reason } = req.body
      const { userId } = req.user;
      // Verify the current user is an admin
      const admin = await prisma.user.findFirst({
        where: {
          id: userId,
          role: "ADMIN",
        },
      })

      if (!admin) {
        return res.status(403).json({ error: "Only admins can block communications" })
      }

      // Verify both users exist
      const [initiator, target] = await Promise.all([
        prisma.user.findUnique({ where: { id: initiatorId } }),
        prisma.user.findUnique({ where: { id: targetId } }),
      ])

      if (!initiator || !target) {
        return res.status(404).json({ error: "One or both users not found" })
      }

      // Check if communication is already blocked
      const existingBlock = await prisma.blockedCommunication.findUnique({
        where: {
          initiatorId_targetId: {
            initiatorId,
            targetId,
          },
        },
      })

      if (existingBlock) {
        return res.status(400).json({ error: "Communication already blocked" })
      }

      // Create blocked communication
      const blockedCommunication = await prisma.blockedCommunication.create({
        data: {
          initiatorId,
          targetId,
          reason,
          blockedBy: userId,
        },
      })

      res.status(201).json({ blockedCommunication })
    } catch (error) {
      console.error("Error blocking communication:", error)
      res.status(500).json({ error: "Failed to block communication" })
    }
  },

  // Unblock communication between two users
  unblockCommunication: async (req: any, res: Response) => {
    try {
      const { initiatorId, targetId } = req.body
      const { userId } = req.user;

      // Verify the current user is an admin
      const admin = await prisma.user.findFirst({
        where: {
          id: userId,
          role: "ADMIN",
        },
      })

      if (!admin) {
        return res.status(403).json({ error: "Only admins can unblock communications" })
      }

      // Delete blocked communication
      await prisma.blockedCommunication.deleteMany({
        where: {
          initiatorId,
          targetId,
        },
      })

      res.status(200).json({ message: "Communication unblocked successfully" })
    } catch (error) {
      console.error("Error unblocking communication:", error)
      res.status(500).json({ error: "Failed to unblock communication" })
    }
  },

  // Get all blocked communications
  getBlockedCommunications: async (req: any, res: Response) => {
    try {
      const { userId } = req.user;

      // Verify the current user is an admin
      const admin = await prisma.user.findFirst({
        where: {
          id: userId,
          role: "ADMIN",
        },
      })

      if (!admin) {
        return res.status(403).json({ error: "Only admins can view blocked communications" })
      }

      // Get all blocked communications with user details
      const blockedCommunications = await prisma.blockedCommunication.findMany({
        include: {
          initiator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              imageUrl: true,
            },
          },
          target: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      res.status(200).json({ blockedCommunications })
    } catch (error) {
      console.error("Error fetching blocked communications:", error)
      res.status(500).json({ error: "Failed to fetch blocked communications" })
    }
  },

  //Dashboard related functions
  getBuyerMetrics: async (req: any, res: Response) => {
  
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const calculatePercentage = (current: number, past: number): string => {
    if (past === 0) return current === 0 ? '0%' : '100%';
    const change = ((current - past) / past) * 100;
    return `${Math.round(change)}%`;
  };

  // 1. New joined buyers this month vs last month
  const newBuyersCurrent = await prisma.buyer.count({
    where: {
      user: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd
        }
      }
    }
  });

  const newBuyersPast = await prisma.buyer.count({
    where: {
      user: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      }
    }
  });

  // 2. Buyers who placed successful orders this month vs last month
  const buyersWithOrdersCurrent = await prisma.buyer.count({
    where: {
      Order: {
        some: {
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd
          },
          status: 'DELIVERED'
        }
      }
    }
  });

  const buyersWithOrdersPast = await prisma.buyer.count({
    where: {
      Order: {
        some: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          },
          status: 'DELIVERED'
        }
      }
    }
  });

  // 3. Total buyers count (current vs previous month end)
  const totalBuyersCurrent = await prisma.buyer.count();

  // Get total buyers at the end of last month
  const totalBuyersPast = await prisma.buyer.count({
    where: {
      user: {
        createdAt: {
          lte: lastMonthEnd
        }
      }
    }
  });

  // 4. Inactive buyers (never placed any order this month)
  const inactiveBuyersCurrent = await prisma.buyer.count({
    where: {
      Order: {
        none: {
          createdAt: {
            gte: currentMonthStart,
            lte: currentMonthEnd
          }
        }
      }
    }
  });

  const inactiveBuyersPast = await prisma.buyer.count({
    where: {
      Order: {
        none: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd
          }
        }
      }
    }
  });

  const metricResponse = {
    NEW_JOINED_BUYERS: {
      current: newBuyersCurrent,
      past: newBuyersPast,
      percentage: calculatePercentage(newBuyersCurrent, newBuyersPast)
    },
    BUYERS_BOUGHT: {
      current: buyersWithOrdersCurrent,
      past: buyersWithOrdersPast,
      percentage: calculatePercentage(buyersWithOrdersCurrent, buyersWithOrdersPast)
    },
    TOTAL_BUYERS: {
      current: totalBuyersCurrent,
      past: totalBuyersPast,
      percentage: calculatePercentage(totalBuyersCurrent, totalBuyersPast)
    },
    INACTIVE_BUYERS: {
      current: inactiveBuyersCurrent,
      past: inactiveBuyersPast,
      percentage: calculatePercentage(inactiveBuyersCurrent, inactiveBuyersPast)
    }
  };

  res.status(200).json({ metricResponse })
  },

  getTimePeriodMetrics: async (req: Request, res: Response) => {
    try {
      const { period } = req.params; // 'today', 'week', 'month', or 'year'
  
      if (!['today', 'week', 'month', 'year'].includes(period)) {
        return res.status(400).json({ error: "Invalid time period specified" });
      }
  
      // Calculate date ranges
      const now = new Date();
      let currentStart: Date;
      let pastStart: Date;
      let pastEnd: Date;
  
      switch (period) {
        case 'today':
          currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          pastStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          pastEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
          case 'week':
            currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            pastStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); 
            pastEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); 
            pastStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); 
            pastEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); 
            break;
        case 'year':
          currentStart = new Date(now.getFullYear(), 0, 1);
          pastStart = new Date(now.getFullYear() - 1, 0, 1);
          pastEnd = new Date(now.getFullYear() - 1, 11, 31);
          break;
        default:
          currentStart = new Date();
          pastStart = new Date();
          pastEnd = new Date();
      }
  
      // Helper function to calculate percentage change
      const calculatePercentage = (current: number, past: number): string => {
        if (past === 0) return current === 0 ? '0%' : '100%';
        const change = ((current - past) / past) * 100;
        return `${Math.round(change)}%`;
      };
  
      // Fetch all metrics in parallel for better performance
      const [
        currentRequests,
        pastRequests,
        currentMessages,
        currentOrders,
        pastOrders,
        currentCertificates,
      ] = await Promise.all([
        // Current period requests
        prisma.request.count({
          where: {
            createdAt: { gte: currentStart, lte: now }
          }
        }),
        // Past period requests
        prisma.request.count({
          where: {
            createdAt: { gte: pastStart, lte: pastEnd }
          }
        }),
        // Current period messages
        prisma.message.count({
          where: {
            createdAt: { gte: currentStart, lte: now }
          }
        }),
        // Current period orders
        prisma.order.count({
          where: {
            createdAt: { gte: currentStart, lte: now }
          }
        }),
        // Past period orders
        prisma.order.count({
          where: {
            createdAt: { gte: pastStart, lte: pastEnd }
          }
        }),
        // Current period certificates
        prisma.certification.count({
          where: {
            createdAt: { gte: currentStart, lte: now }
          }
        }),
      ]);
  
      const metrics: TimePeriodMetrics = {
        requests: {
          current: currentRequests,
          percentageChange: calculatePercentage(currentRequests, pastRequests)
        },
        messages: {
          current: currentMessages
        },
        orders: {
          current: currentOrders,
          percentageChange: calculatePercentage(currentOrders, pastOrders)
        },
        certificatesUploaded: {
          current: currentCertificates
        }
      };
  
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching time period metrics:", error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  },

  getMonthlyOnboarding: async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); 
      
      // Generate the last 12 months including current month
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, currentMonth - i, 1);
        return {
          name: date.toLocaleString('default', { month: 'short' }),
          year: date.getFullYear(),
          month: date.getMonth(),
          start: new Date(date.getFullYear(), date.getMonth(), 1),
          end: new Date(date.getFullYear(), date.getMonth() + 1, 0)
        };
      }).reverse();
  
      const onboardingData = await Promise.all(
        months.map(async ({ name, start, end }) => {
          const [buyers, suppliers] = await Promise.all([
            prisma.buyer.count({
              where: {
                user: {
                  createdAt: {
                    gte: start,
                    lte: end
                  }
                }
              }
            }),
            prisma.seller.count({
              where: {
                user: {
                  createdAt: {
                    gte: start,
                    lte: end
                  }
                }
              }
            })
          ]);
  
          return { name, buyers, suppliers };
        })
      );
  
      res.json(onboardingData);
    } catch (error) {
      console.error("Error fetching monthly onboarding data:", error);
      res.status(500).json({ error: "Failed to fetch onboarding data" });
    }
  },

  getProductPerformance: async (req: Request, res: Response) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      // Helper function to generate random colors
      const getRandomColor = () => {
        const colors = ['#8884d8', '#82ca9d', '#8dd1e1', '#a4de6c', '#ffc658'];
        return colors[Math.floor(Math.random() * colors.length)];
      };
  
      // Fetch top 5 selling products with their order items
      const topSellingProducts = await prisma.product.findMany({
        where: {
          orderItems: {
            some: {
              order: {
                status: 'DELIVERED',
                createdAt: { gte: thirtyDaysAgo }
              }
            }
          }
        },
        include: {
          orderItems: {
            where: {
              order: {
                status: 'DELIVERED',
                createdAt: { gte: thirtyDaysAgo }
              }
            },
            select: {
              quantity: true,
              price: true
            }
          }
        },
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        },
        take: 5
      });
  
      // Format top selling products with proper typing
      const formattedTopSellers: TopSellingProduct[] = topSellingProducts.map(product => {
        const totalQuantity = product.orderItems.reduce(
          (sum: number, item: { quantity: number; price: number }) => sum + item.quantity,
          0
        );
        const totalAmount = product.orderItems.reduce(
          (sum: number, item: { quantity: number; price: number }) => sum + (item.price * item.quantity),
          0
        );
        
        return {
          name: product.name,
          price: product.price,
          quantity: totalQuantity,
          amount: parseFloat(totalAmount.toFixed(2))
        };
      });
  
      // Fetch low selling products (sold at least twice but among the least sold)
      const lowSellingProducts = await prisma.product.findMany({
        where: {
          orderItems: {
            some: {
              order: {
                status: 'DELIVERED',
                createdAt: { gte: thirtyDaysAgo }
              }
            }
          },
          NOT: {
            orderItems: {
              none: {},
              every: {
                quantity: { lte: 1 }
              }
            }
          }
        },
        include: {
          orderItems: {
            where: {
              order: {
                status: 'DELIVERED',
                createdAt: { gte: thirtyDaysAgo }
              }
            },
            select: {
              quantity: true,
              price: true
            }
          }
        },
        orderBy: {
          orderItems: {
            _count: 'asc'
          }
        },
        take: 5
      });
  
      // Format low selling products with proper typing
      const formattedLowSellers: LowSellingProduct[] = lowSellingProducts
        .map(product => {
          const totalQuantity = product.orderItems.reduce(
            (sum: number, item: { quantity: number; price: number }) => sum + item.quantity,
            0
          );
          const totalAmount = product.orderItems.reduce(
            (sum: number, item: { quantity: number; price: number }) => sum + (item.price * item.quantity),
            0
          );
          
          return {
            name: product.name,
            value: totalQuantity,
            color: getRandomColor(),
            amount: parseFloat(totalAmount.toFixed(2))
          };
        })
        .filter(product => product.value > 1); // Ensure at least 2 sales
  
      const response: ProductMetrics = {
        topSellingProducts: formattedTopSellers,
        lowSellingProducts: formattedLowSellers
      };
  
      res.json(response);
    } catch (error) {
      console.error("Error fetching product performance metrics:", error);
      res.status(500).json({ error: "Failed to fetch product metrics" });
    }
  },

  getTrendingProducts: async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const currentPeriodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const pastPeriodStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const pastPeriodEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
      // Helper to calculate engagement score with weights
      const calculateScore = (orders: number, wishlists: number, carts: number) => {
        return (orders * 3) + (wishlists * 2) + (carts * 1);
      };
  
      // Fetch current period data
      const [currentOrders, currentWishlists, currentCarts] = await Promise.all([
        prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            order: {
              status: 'DELIVERED',
              createdAt: { gte: currentPeriodStart }
            }
          },
          _count: { productId: true }
        }),
        prisma.wishlistItem.groupBy({
          by: ['productId'],
          where: { createdAt: { gte: currentPeriodStart } },
          _count: { productId: true }
        }),
        prisma.cartItem.groupBy({
          by: ['productId'],
          where: { createdAt: { gte: currentPeriodStart } },
          _count: { productId: true }
        })
      ]);
  
      // Fetch past period data
      const [pastOrders, pastWishlists, pastCarts] = await Promise.all([
        prisma.orderItem.groupBy({
          by: ['productId'],
          where: {
            order: {
              status: 'DELIVERED',
              createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
            }
          },
          _count: { productId: true }
        }),
        prisma.wishlistItem.groupBy({
          by: ['productId'],
          where: { createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd } },
          _count: { productId: true }
        }),
        prisma.cartItem.groupBy({
          by: ['productId'],
          where: { createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd } },
          _count: { productId: true }
        })
      ]);
  
      // Create maps for efficient lookup
      const createCountMap = (groups: any[]) => new Map(
        groups.map(g => [g.productId, g._count.productId])
      );
  
      const currentOrderMap = createCountMap(currentOrders);
      const currentWishlistMap = createCountMap(currentWishlists);
      const currentCartMap = createCountMap(currentCarts);
      
      const pastOrderMap = createCountMap(pastOrders);
      const pastWishlistMap = createCountMap(pastWishlists);
      const pastCartMap = createCountMap(pastCarts);
  
      // Get all unique product IDs from current period
      const allProductIds = [
        ...new Set([
          ...currentOrders.map(o => o.productId),
          ...currentWishlists.map(w => w.productId),
          ...currentCarts.map(c => c.productId)
        ])
      ];
  
      // Get product details for all involved products
      const products = await prisma.product.findMany({
        where: { id: { in: allProductIds } },
        select: { id: true, name: true, price: true, thumbnail: true }
      });
  
      // Calculate scores for each product
      const productsWithScores = products.map(product => {
        const currentOrders = currentOrderMap.get(product.id) || 0;
        const currentWishlists = currentWishlistMap.get(product.id) || 0;
        const currentCarts = currentCartMap.get(product.id) || 0;
        
        const pastOrders = pastOrderMap.get(product.id) || 0;
        const pastWishlists = pastWishlistMap.get(product.id) || 0;
        const pastCarts = pastCartMap.get(product.id) || 0;
  
        const currentScore = calculateScore(currentOrders, currentWishlists, currentCarts);
        const pastScore = calculateScore(pastOrders, pastWishlists, pastCarts);
  
        let percentageChange = 0;
        if (pastScore > 0) {
          percentageChange = ((currentScore - pastScore) / pastScore) * 100;
        } else if (currentScore > 0) {
          percentageChange = 100; // New trending
        }
  
        return {
          ...product,
          trendingScore: currentScore,
          percentageChange: `${Math.round(percentageChange)}%`,
          orders: currentOrders,
          wishlists: currentWishlists,
          carts: currentCarts
        };
      });
  
      // Sort by trending score and get top 5
      const trendingProducts = productsWithScores
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, 5)
        .map(p => ({
          name: p.name,
          image: p.thumbnail[0] || '', // Take first thumbnail image
          price: p.price,
          trendingScore: p.trendingScore,
          percentageChange: p.percentageChange,
          orders: p.orders,
          wishlists: p.wishlists,
          carts: p.carts
        }));
  
      res.json(trendingProducts);
    } catch (error) {
      console.error("Error fetching trending products:", error);
      res.status(500).json({ error: "Failed to fetch trending products" });
    }
  },

  getTopBuyers: async (req: Request, res: Response) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      // Fetch all buyers with their orders and order items in the last 30 days
      const buyers = await prisma.buyer.findMany({
        where: {
          Order: {
            some: {
              createdAt: { gte: thirtyDaysAgo }
            }
          }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              addresses: {
                where: { type: 'BILLING' },
                take: 1
              }
            }
          },
          Order: {
            where: {
              createdAt: { gte: thirtyDaysAgo }
            },
            include: {
              items: {
                include: {
                  product: {
                    select: {
                      name: true,
                      price: true
                    }
                  }
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });
  
      // Process each buyer to calculate metrics
      const processedBuyers = buyers.map(buyer => {
        const allOrderItems = buyer.Order.flatMap(order => order.items);
        
        // Calculate total spent and aggregate products without duplicates
        const productMap = new Map<string, ProductInfo>();
        let totalSpent = 0;
  
        allOrderItems.forEach(item => {
          totalSpent += item.price * item.quantity;
          
          const existingProduct = productMap.get(item.product.name);
          if (existingProduct) {
            existingProduct.totalQuantity += item.quantity;
          } else {
            productMap.set(item.product.name, {
              name: item.product.name,
              price: item.price,
              totalQuantity: item.quantity
            });
          }
        });
  
        // Convert product map to array
        const products = Array.from(productMap.values());
  
        // Check if buyer has any pending orders
        const hasPendingOrders = buyer.Order.some(
          order => order.status !== 'DELIVERED' && order.status !== 'CANCELLED'
        );
  
        // Get most recent address
        const address = buyer.user.addresses[0] || {
          address: 'N/A',
          city: 'N/A',
          state: 'N/A',
          country: 'N/A',
          zipCode: 'N/A'
        };
  
        return {
          buyerName: buyer.user.name || 'Unknown',
          email: buyer.user.email,
          totalSpent,
          orderCount: buyer.Order.length,
          products,
          latestOrderDate: buyer.Order[0]?.createdAt || new Date(),
          status: hasPendingOrders ? 'Active' : 'Inactive',
          address: {
            street: address.address,
            city: address.city,
            state: address.state,
            country: address.country,
            zipCode: address.zipCode
          }
        };
      });
  
      // Sort by total spent descending, then by order count
      const sortedBuyers = processedBuyers.sort((a, b) => {
        if (b.totalSpent !== a.totalSpent) {
          return b.totalSpent - a.totalSpent;
        }
        return b.orderCount - a.orderCount;
      });
  
      // Get top 10 buyers
      const topBuyers = sortedBuyers.slice(0, 10);
  
      res.json(topBuyers);
    } catch (error) {
      console.error("Error fetching top buyers:", error);
      res.status(500).json({ error: "Failed to fetch top buyers" });
    }
  },

  getSupplierMetrics: async (req: Request, res: Response) => {
    try {
      // Get current and previous 30-day periods
      const now = new Date();
      const currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const pastPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const pastPeriodEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
      // Helper function to calculate percentage change
      const calculatePercentage = (current: number, past: number): string => {
        if (past === 0) return current === 0 ? '0%' : '100%';
        const change = ((current - past) / past) * 100;
        return `${Math.round(change)}%`;
      };
  
      // Fetch all metrics in parallel for better performance
      const [
        newSuppliersCurrent,
        newSuppliersPast,
        soldWorthCurrent,
        soldWorthPast,
        productsSoldCurrent,
        productsSoldPast,
        inactiveSuppliersCurrent,
        inactiveSuppliersPast,
      ] = await Promise.all([
        // New joined suppliers (current period)
        prisma.seller.count({
          where: {
            user: {
              createdAt: { gte: currentPeriodStart, lte: now }
            }
          }
        }),
        // New joined suppliers (past period)
        prisma.seller.count({
          where: {
            user: {
              createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
            }
          }
        }),
        // Total worth sold by suppliers (current period)
        prisma.orderItem.aggregate({
          _sum: { price: true },
          where: {
            order: {
              createdAt: { gte: currentPeriodStart, lte: now }
            }
          }
        }),
        // Total worth sold by suppliers (past period)
        prisma.orderItem.aggregate({
          _sum: { price: true },
          where: {
            order: {
              createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
            }
          }
        }),
        // Total products sold (current period)
        prisma.orderItem.count({
          where: {
            order: {
              createdAt: { gte: currentPeriodStart, lte: now }
            }
          }
        }),
        // Total products sold (past period)
        prisma.orderItem.count({
          where: {
            order: {
              createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
            }
          }
        }),
        // Inactive suppliers (current period - no published products)
        prisma.seller.count({
          where: {
            products: {
              none: {
                isDraft: false
              }
            },
            user: {
              createdAt: { lte: now }
            }
          }
        }),
        // Inactive suppliers (past period - no published products)
        prisma.seller.count({
          where: {
            products: {
              none: {
                isDraft: false
              }
            },
            user: {
              createdAt: { lte: pastPeriodEnd }
            }
          }
        }),
      ]);
  
      const metrics: SupplierMetrics = {
        NEW_JOINED_SUPPLIERS: {
          current: newSuppliersCurrent,
          past: newSuppliersPast,
          percentage: calculatePercentage(newSuppliersCurrent, newSuppliersPast)
        },
        SUPPLIERS_SOLD_WORTH: {
          current: soldWorthCurrent._sum.price || 0,
          past: soldWorthPast._sum.price || 0,
          percentage: calculatePercentage(soldWorthCurrent._sum.price || 0, soldWorthPast._sum.price || 0)
        },
        TOTAL_PRODUCTS_SOLD: {
          current: productsSoldCurrent,
          past: productsSoldPast,
          percentage: calculatePercentage(productsSoldCurrent, productsSoldPast)
        },
        INACTIVE_SUPPLIERS: {
          current: inactiveSuppliersCurrent,
          past: inactiveSuppliersPast,
          percentage: calculatePercentage(inactiveSuppliersCurrent, inactiveSuppliersPast)
        }
      };
  
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching supplier metrics:", error);
      res.status(500).json({ error: "Failed to fetch supplier metrics" });
    }
  },

  getTopCountries: async (req: Request, res: Response) => {
    try {
      // Fetch top 5 countries for sellers
      const sellerCountries = await prisma.user.groupBy({
        by: ['country'],
        where: {
          role: 'SELLER',
          country: { not: null }
        },
        _count: { country: true },
        orderBy: {
          _count: {
            country: 'desc'
          }
        },
        take: 5
      });
  
      // Fetch top 5 countries for buyers
      const buyerCountries = await prisma.user.groupBy({
        by: ['country'],
        where: {
          role: 'BUYER',
          country: { not: null }
        },
        _count: { country: true },
        orderBy: {
          _count: {
            country: 'desc'
          }
        },
        take: 5
      });
  
      // Format seller data with header
      const formattedSellerData: (string | number)[][] = [
        ['Country', 'Popularity'],
        ...sellerCountries.map(country => [
          country.country || 'Unknown',
          country._count.country
        ])
      ];
  
      // Format buyer data with header
      const formattedBuyerData: (string | number)[][] = [
        ['Country', 'Popularity'],
        ...buyerCountries.map(country => [
          country.country || 'Unknown',
          country._count.country
        ])
      ];
  
      const response: CountryData = {
        sellerData: formattedSellerData,
        buyerData: formattedBuyerData
      };
  
      res.json(response);
    } catch (error) {
      console.error("Error fetching top countries:", error);
      res.status(500).json({ error: "Failed to fetch country data" });
    }
  },

  getTopSuppliers: async (req: Request, res: Response) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      // Fetch all order items in the last 30 days with seller and product info
      const orderItems = await prisma.orderItem.findMany({
        where: {
          order: {
            createdAt: { gte: thirtyDaysAgo },
            status: 'DELIVERED'
          },
          sellerId: { not: null } // Ensure sellerId exists
        },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
  
      // Create a map to aggregate data by seller
      const sellerMap = new Map<string, {
        name: string;
        id: string;
        totalProductsSold: number;
        totalRevenueGenerated: number;
      }>();
  
      // Process all order items and aggregate by seller
      orderItems.forEach(item => {
        // Skip if seller or sellerId is null
        if (!item.sellerId || !item.seller) return;
  
        const sellerId = item.sellerId;
        const sellerName = item.seller.user?.name || 'Unknown';
        
        const currentData = sellerMap.get(sellerId) || {
          name: sellerName,
          id: sellerId,
          totalProductsSold: 0,
          totalRevenueGenerated: 0
        };
  
        sellerMap.set(sellerId, {
          ...currentData,
          totalProductsSold: currentData.totalProductsSold + item.quantity,
          totalRevenueGenerated: currentData.totalRevenueGenerated + (item.price * item.quantity)
        });
      });
  
      // Convert map to array
      const allSuppliers = Array.from(sellerMap.values());
  
      // Sort by total products sold (quantity)
      const sortedByProducts = [...allSuppliers].sort((a, b) => 
        b.totalProductsSold - a.totalProductsSold
      );
  
      // Sort by total revenue generated
      const sortedByRevenue = [...allSuppliers].sort((a, b) => 
        b.totalRevenueGenerated - a.totalRevenueGenerated
      );
  
      // Get top 5 for each category
      const response: TopSuppliersResponse = {
        topSuppliersOnProducts: sortedByProducts.slice(0, 5),
        topSuppliersOnRevenue: sortedByRevenue.slice(0, 5)
      };
  
      res.json(response);
    } catch (error) {
      console.error("Error fetching top suppliers:", error);
      res.status(500).json({ error: "Failed to fetch top suppliers data" });
    }
  },

  getSupplierAnalytics: async (req: Request, res: Response) => {
    try {
      const { supplierId } = req.params;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
      // Get supplier basic info
      const supplier = await prisma.seller.findUnique({
        where: { id: supplierId },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      });
  
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
  
      // Get all order items for this supplier in last 30 days
      const orderItems = await prisma.orderItem.findMany({
        where: {
          sellerId: supplierId, // Fixed: Use the supplierId from params
          order: {
            createdAt: { gte: thirtyDaysAgo }
          }
        },
        include: {
          product: {
            select: {
              name: true
            }
          },
          order: {
            select: {
              createdAt: true
            }
          }
        }
      });
  
      // Calculate top selling product
      const productMap = new Map<string, number>();
      orderItems.forEach(item => {
        const productName = item.product?.name || 'Unknown Product';
        const currentQuantity = productMap.get(productName) || 0;
        productMap.set(productName, currentQuantity + item.quantity);
      });
  
      let topProduct = { name: 'No products sold', quantitySold: 0 };
      if (productMap.size > 0) {
        const [name, quantitySold] = [...productMap.entries()].reduce((a, b) => 
          a[1] > b[1] ? a : b
        );
        topProduct = { name, quantitySold };
      }
  
      // Calculate daily metrics for top product
      const dailyMetricsMap = new Map<string, number>();
      orderItems
        .filter(item => item.product?.name === topProduct.name)
        .forEach(item => {
          const dateStr = item.order.createdAt.toISOString().split('T')[0];
          const currentQuantity = dailyMetricsMap.get(dateStr) || 0;
          dailyMetricsMap.set(dateStr, currentQuantity + item.quantity);
        });
  
      // Fill in all dates for the past 30 days
      const topSellingProductDailyChart: DailyMetric[] = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split('T')[0];
        const formattedDate = dateStr.split('-').reverse().join('/').slice(0, 8);
        topSellingProductDailyChart.push({
          date: formattedDate,
          quantity: dailyMetricsMap.get(dateStr) || 0
        });
      }
  
      // Calculate weekly metrics (revenue and quantity)
      const weeklyMetricsMap = new Map<string, { quantity: number; revenue: number }>();
      orderItems.forEach(item => {
        const orderDate = item.order.createdAt;
        const sunday = new Date(orderDate);
        sunday.setDate(orderDate.getDate() - orderDate.getDay()); // Get start of week (Sunday)
        const weekStr = sunday.toISOString().split('T')[0];
        
        const currentWeek = weeklyMetricsMap.get(weekStr) || { quantity: 0, revenue: 0 };
        weeklyMetricsMap.set(weekStr, {
          quantity: currentWeek.quantity + item.quantity,
          revenue: currentWeek.revenue + (item.price * item.quantity)
        });
      });
  
      // Format weekly data for response
      const totalRevenueAndQuantityChartData: WeeklyMetric[] = [];
      const sunday = new Date();
      sunday.setDate(sunday.getDate() - sunday.getDay()); // Current Sunday
      
      for (let i = 4; i >= 0; i--) {
        const weekDate = new Date(sunday);
        weekDate.setDate(sunday.getDate() - (i * 7));
        const weekStr = weekDate.toISOString().split('T')[0];
        const formattedDate = weekStr.split('-').reverse().join('/').slice(0, 8);
        
        const weekData = weeklyMetricsMap.get(weekStr) || { quantity: 0, revenue: 0 };
        totalRevenueAndQuantityChartData.push({
          date: formattedDate,
          quantity: weekData.quantity,
          revenue: parseFloat(weekData.revenue.toFixed(2))
        });
      }
  
      // Calculate total quantity sold
      const totalQuantitySold = orderItems.reduce(
        (sum, item) => sum + item.quantity, 
        0
      );
  
      const response: SupplierAnalytics = {
        name: supplier.user?.name || 'Unknown Supplier',
        topSellingProduct: topProduct,
        topSellingProductDailyChart,
        totalQuantitySold,
        totalRevenueAndQuantityChartData
      };
  
      res.json(response);
    } catch (error) {
      console.error("Error fetching supplier analytics:", error);
      res.status(500).json({ error: "Failed to fetch supplier analytics" });
    }
  },

  getPlatformMetrics: async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const pastPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const pastPeriodEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
      // Helper function to calculate percentage change
      const calculatePercentage = (current: number, past: number): string => {
        if (past === 0) return current === 0 ? '0%' : '100%';
        const change = ((current - past) / past) * 100;
        return `${change.toFixed(2)}%`;
      };
  
      // Fetch all metrics in parallel
      const [
        requestsCurrent,
        requestsPast,
        messagesCurrent,
        ordersCurrent,
        ordersPast,
        certificatesCurrent,
      ] = await Promise.all([
        // Requests (current period)
        prisma.request.count({
          where: {
            createdAt: { gte: currentPeriodStart, lte: now }
          }
        }),
        // Requests (past period)
        prisma.request.count({
          where: {
            createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
          }
        }),
        // Messages (current period)
        prisma.message.count({
          where: {
            createdAt: { gte: currentPeriodStart, lte: now }
          }
        }),
        // Orders (current period)
        prisma.order.count({
          where: {
            createdAt: { gte: currentPeriodStart, lte: now }
          }
        }),
        // Orders (past period)
        prisma.order.count({
          where: {
            createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
          }
        }),
        // Certificates (current period)
        prisma.certification.count({
          where: {
            createdAt: { gte: currentPeriodStart, lte: now }
          }
        }),
      ]);
  
      const metrics: PlatformMetrics = {
        requests: {
          current: requestsCurrent,
          percentageChange: calculatePercentage(requestsCurrent, requestsPast)
        },
        messages: {
          current: messagesCurrent
        },
        orders: {
          current: ordersCurrent,
          percentageChange: calculatePercentage(ordersCurrent, ordersPast)
        },
        certificatesUploaded: {
          current: certificatesCurrent
        }
      };
  
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching platform metrics:", error);
      res.status(500).json({ error: "Failed to fetch platform metrics" });
    }
  },

  getOrderMetrics: async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const currentPeriodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const pastPeriodStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      const pastPeriodEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
      // Helper function to calculate percentage change
      const calculatePercentage = (current: number, past: number): string => {
        if (past === 0) return current === 0 ? '0%' : '100%';
        const change = ((current - past) / past) * 100;
        return `${Math.round(change)}%`;
      };
  
      // Fetch all order metrics in parallel
      const [
        totalOrdersCurrent,
        totalOrdersPast,
        ordersWorthCurrent,
        ordersWorthPast,
        packedOrdersCurrent,
        packedOrdersPast
      ] = await Promise.all([
        // Total orders (current period)
        prisma.order.count({
          where: {
            createdAt: { gte: currentPeriodStart, lte: now }
          }
        }),
        // Total orders (past period)
        prisma.order.count({
          where: {
            createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
          }
        }),
        // Orders worth (current period)
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            createdAt: { gte: currentPeriodStart, lte: now }
          }
        }),
        // Orders worth (past period)
        prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: {
            createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
          }
        }),
        // Packed orders (current period)
        prisma.order.count({
          where: {
            status: 'PACKED',
            createdAt: { gte: currentPeriodStart, lte: now }
          }
        }),
        // Packed orders (past period)
        prisma.order.count({
          where: {
            status: 'PACKED',
            createdAt: { gte: pastPeriodStart, lte: pastPeriodEnd }
          }
        })
      ]);
  
      const metrics: OrderMetrics = {
        totalOrders: {
          current: totalOrdersCurrent,
          past: totalOrdersPast,
          percentageChange: calculatePercentage(totalOrdersCurrent, totalOrdersPast)
        },
        ordersWorth: {
          current: ordersWorthCurrent._sum.totalAmount || 0,
          past: ordersWorthPast._sum.totalAmount || 0,
          percentageChange: calculatePercentage(
            ordersWorthCurrent._sum.totalAmount || 0,
            ordersWorthPast._sum.totalAmount || 0
          )
        },
        ordersPacked: {
          current: packedOrdersCurrent,
          past: packedOrdersPast,
          percentageChange: calculatePercentage(packedOrdersCurrent, packedOrdersPast)
        }
      };
  
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching order metrics:", error);
      res.status(500).json({ error: "Failed to fetch order metrics" });
    }
  }
}

interface OrderMetrics {
  totalOrders: {
    current: number;
    past: number;
    percentageChange: string;
  };
  ordersWorth: {
    current: number;
    past: number;
    percentageChange: string;
  };
  ordersPacked: {
    current: number;
    past: number;
    percentageChange: string;
  };
}

interface MetricValue {
  current: number;
  percentageChange?: string;
}

interface PlatformMetrics {
  requests: MetricValue;
  messages: MetricValue;
  orders: MetricValue;
  certificatesUploaded: MetricValue;
}

interface DailyMetric {
  date: string;
  quantity: number;
}

interface WeeklyMetric {
  date: string;
  quantity: number;
  revenue: number;
}

interface SupplierAnalytics {
  name: string;
  topSellingProduct: {
    name: string;
    quantitySold: number;
  };
  topSellingProductDailyChart: DailyMetric[];
  totalQuantitySold: number;
  totalRevenueAndQuantityChartData: WeeklyMetric[];
}

interface MetricResult {
  current: number;
  past: number;
  percentage: string;
}

interface SupplierMetrics {
  NEW_JOINED_SUPPLIERS: MetricResult;
  SUPPLIERS_SOLD_WORTH: MetricResult;
  TOTAL_PRODUCTS_SOLD: MetricResult;
  INACTIVE_SUPPLIERS: MetricResult;
}

interface TimePeriodMetrics {
  requests: { current: number; percentageChange: string };
  messages: { current: number };
  orders: { current: number; percentageChange: string };
  certificatesUploaded: { current: number };
}

interface TopSellingProduct {
  name: string;
  price: number;
  quantity: number;
  amount: number;
}

interface LowSellingProduct {
  name: string;
  value: number;
  color: string;
  amount?: number;
}

interface ProductMetrics {
  topSellingProducts: TopSellingProduct[];
  lowSellingProducts: LowSellingProduct[];
}

interface TopBuyer {
  buyerName: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  products: {
    name: string;
    price: number;
    quantity: number;
  }[];
  latestOrderDate: Date;
  status: 'Active' | 'Inactive';
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

interface ProductInfo {
  name: string;
  price: number;
  totalQuantity: number;
}

interface CountryData {
  sellerData: (string | number)[][];
  buyerData: (string | number)[][];
}

interface SupplierPerformance {
  name: string;
  id: string;
  totalProductsSold: number;
  totalRevenueGenerated: number;
}

interface TopSuppliersResponse {
  topSuppliersOnProducts: SupplierPerformance[];
  topSuppliersOnRevenue: SupplierPerformance[];
}