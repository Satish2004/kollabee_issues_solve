import prisma from "../db";
import type { Request, Response } from "express";

interface SupplierWithType {
  id: string;
  businessName: string;
  businessDescription?: string;
  rating: number;
  location?: string;
  user: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
  type: 'CART' | 'ORDER' | 'PROJECT' | 'CONVERSATION';
  lastInteraction?: Date;
  interactionCount: number;
}

export const getMySuppliers = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { 
      type, 
      page = 1, 
      limit = 10, 
      search,
      sortBy = 'lastInteraction',
      sortOrder = 'desc'
    } = req.query;

    const pageSize = parseInt(limit as string);
    const skip = (parseInt(page as string) - 1) * pageSize;

    // Get buyer ID from user ID
    const buyer = await prisma.buyer.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    const buyerId = buyer.id;
    const suppliersMap = new Map<string, SupplierWithType>();

    // 1. Get suppliers from cart items
    if (!type || type === 'CART') {
      const cartSuppliers = await prisma.cartItem.findMany({
        where: {
          cart: {
            buyerId: buyerId
          }
        },
        include: {
          product: {
            include: {
              seller: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      imageUrl: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      cartSuppliers.forEach(item => {
        const seller = item.product.seller;
        const key = seller.id;
        
        if (!suppliersMap.has(key)) {
          suppliersMap.set(key, {
            id: seller.id,
            businessName: seller.businessName || 'Unknown Business',
            businessDescription: seller.businessDescription || '',
            rating: seller.rating || 0,
    
            location: seller.location || '',
            user: {
              id: seller.user.id,
              name: seller.user.name || '',
              email: seller.user.email,
              imageUrl: seller.user.imageUrl || ''
            },
            type: 'CART',
            lastInteraction: item.createdAt,
            interactionCount: 1
          });
        } else {
          const existing = suppliersMap.get(key)!;
          existing.interactionCount++;
          if (item.createdAt > existing.lastInteraction!) {
            existing.lastInteraction = item.createdAt;
          }
        }
      });
    }

    // 2. Get suppliers from orders and projects
    if (!type || type === 'ORDER' || type === 'PROJECT') {
      // Orders
      const orderSuppliers = await prisma.order.findMany({
        where: {
          buyerId: buyerId,
          sellerId: { not: null }
        },
        include: {
          seller: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  imageUrl: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      orderSuppliers.forEach(order => {
        if (order.seller) {
          const key = order.seller.id;
          
          if (!suppliersMap.has(key)) {
            suppliersMap.set(key, {
              id: order.seller.id,
              businessName: order.seller.businessName || 'Unknown Business',
              businessDescription: order.seller.businessDescription || '',
              rating: order.seller.rating || 0,
              location: order.seller.location || '',
              user: {
                id: order.seller.user.id,
                name: order.seller.user.name || '',
                email: order.seller.user.email,
                imageUrl: order.seller.user.imageUrl || ''
              },
              type: 'ORDER',
              lastInteraction: order.createdAt,
              interactionCount: 1
            });
          } else {
            const existing = suppliersMap.get(key)!;
            existing.interactionCount++;
            if (order.createdAt > existing.lastInteraction!) {
              existing.lastInteraction = order.createdAt;
            }
            // Update type if it was CART, now it's ORDER
            if (existing.type === 'CART') {
              existing.type = 'ORDER';
            }
          }
        }
      });

      // Projects
      const projectSuppliers = await prisma.project.findMany({
        where: {
          ownerId: buyerId
        },
        include: {
          sellers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  imageUrl: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      projectSuppliers.forEach(project => {
        project.sellers.forEach(seller => {
          const key = seller.id;
          
          if (!suppliersMap.has(key)) {
            suppliersMap.set(key, {
              id: seller.id,
              businessName: seller.businessName || 'Unknown Business',
              businessDescription: seller.businessDescription || '',
              rating: seller.rating || 0,
              location: seller.location || '',
              user: {
                id: seller.user.id,
                name: seller.user.name || '',
                email: seller.user.email,
                imageUrl: seller.user.imageUrl || ''
              },
              type: 'PROJECT',
              lastInteraction: project.createdAt,
              interactionCount: 1
            });
          } else {
            const existing = suppliersMap.get(key)!;
            existing.interactionCount++;
            if (project.createdAt > existing.lastInteraction!) {
              existing.lastInteraction = project.createdAt;
            }
            // Update type to highest priority: PROJECT > ORDER > CART
            if (existing.type === 'CART' || existing.type === 'ORDER') {
              existing.type = 'PROJECT';
            }
          }
        });
      });
    }

    // 3. Get suppliers from conversations
    if (!type || type === 'CONVERSATION') {
      const conversationSuppliers = await prisma.conversationParticipant.findMany({
        where: {
          userId: userId,
          conversation: {
            participants: {
              some: {
                user: {
                  role: 'SELLER'
                }
              }
            }
          }
        },
        include: {
          conversation: {
            include: {
              participants: {
                include: {
                  user: {
                    include: {
                      seller: {
                        include: {
                          user: {
                            select: {
                              id: true,
                              name: true,
                              email: true,
                              imageUrl: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              messages: {
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              }
            }
          }
        },
        orderBy: {
          conversation: {
            updatedAt: 'desc'
          }
        }
      });

      conversationSuppliers.forEach(participant => {
        const sellerParticipant = participant.conversation.participants.find(p => 
          p.user.role === 'SELLER' && p.userId !== userId
        );
        
        if (sellerParticipant && sellerParticipant.user.seller) {
          const seller = sellerParticipant.user.seller;
          const key = seller.id;
          const lastMessage = participant.conversation.messages[0];
          
          if (!suppliersMap.has(key)) {
            suppliersMap.set(key, {
              id: seller.id,
              businessName: seller.businessName || 'Unknown Business',
              businessDescription: seller.businessDescription || '',
              rating: seller.rating || 0,
              location: seller.location || '',
              user: {
                id: seller.user.id,
                name: seller.user.name || '',
                email: seller.user.email,
                imageUrl: seller.user.imageUrl || ''
              },
              type: 'CONVERSATION',
              lastInteraction: lastMessage?.createdAt || participant.conversation.updatedAt,
              interactionCount: 1
            });
          } else {
            const existing = suppliersMap.get(key)!;
            existing.interactionCount++;
            const interactionDate = lastMessage?.createdAt || participant.conversation.updatedAt;
            if (interactionDate > existing.lastInteraction!) {
              existing.lastInteraction = interactionDate;
            }
          }
        }
      });
    }

    // Convert map to array and apply filters
    let suppliers = Array.from(suppliersMap.values());

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      suppliers = suppliers.filter(supplier => 
        supplier.businessName.toLowerCase().includes(searchLower) ||
        supplier.user.name.toLowerCase().includes(searchLower) ||
        supplier.user.email.toLowerCase().includes(searchLower) ||
        (supplier.businessDescription && supplier.businessDescription.toLowerCase().includes(searchLower))
      );
    }

    // Apply type filter
    if (type && type !== 'ALL') {
      suppliers = suppliers.filter(supplier => supplier.type === type);
    }

    // Apply sorting
    suppliers.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'businessName':
          aValue = a.businessName.toLowerCase();
          bValue = b.businessName.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break
        case 'interactionCount':
          aValue = a.interactionCount;
          bValue = b.interactionCount;
          break;
        case 'lastInteraction':
        default:
          aValue = a.lastInteraction;
          bValue = b.lastInteraction;
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const total = suppliers.length;
    const paginatedSuppliers = suppliers.slice(skip, skip + pageSize);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      suppliers: paginatedSuppliers,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages,
        totalItems: total,
        itemsPerPage: pageSize,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        type: type || 'ALL',
        search: search || '',
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get supplier statistics
export const getSupplierStats = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;

    const buyer = await prisma.buyer.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    const buyerId = buyer.id;

    // Get counts for each type
    const [cartCount, orderCount, projectCount, conversationCount] = await Promise.all([
      // Cart suppliers count
      prisma.cartItem.groupBy({
        by: ['productId'],
        where: {
          cart: { buyerId }
        },
        _count: true
      }).then(items => {
        const productIds = items.map(item => item.productId);
        return prisma.product.groupBy({
          by: ['sellerId'],
          where: { id: { in: productIds } }
        }).then(sellers => sellers.length);
      }),

      // Order suppliers count
      prisma.order.groupBy({
        by: ['sellerId'],
        where: {
          buyerId,
          sellerId: { not: null }
        }
      }).then(orders => orders.length),

      // Project suppliers count
      prisma.project.findMany({
        where: { ownerId: buyerId },
        include: {
          sellers: { select: { id: true } }
        }
      }).then(projects => {
        const sellerIds = new Set();
        projects.forEach(project => {
          project.sellers.forEach(seller => sellerIds.add(seller.id));
        });
        return sellerIds.size;
      }),

      // Conversation suppliers count
      prisma.conversationParticipant.findMany({
        where: {
          userId,
          conversation: {
            participants: {
              some: {
                user: { role: 'SELLER' }
              }
            }
          }
        },
        include: {
          conversation: {
            include: {
              participants: {
                include: {
                  user: { select: { role: true } }
                }
              }
            }
          }
        }
      }).then(participants => {
        const sellerIds = new Set();
        participants.forEach(participant => {
          participant.conversation.participants.forEach(p => {
            if (p.user.role === 'SELLER' && p.userId !== userId) {
              sellerIds.add(p.userId);
            }
          });
        });
        return sellerIds.size;
      })
    ]);

    res.json({
      stats: {
        cart: cartCount,
        order: orderCount,
        project: projectCount,
        conversation: conversationCount,
        total: cartCount + orderCount + projectCount + conversationCount
      }
    });

  } catch (error) {
    console.error("Error fetching supplier stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};