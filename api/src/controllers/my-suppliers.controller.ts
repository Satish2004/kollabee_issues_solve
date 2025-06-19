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
  types: ('CART' | 'ORDER' | 'PROJECT' | 'CONVERSATION')[];
  primaryType: 'CART' | 'ORDER' | 'PROJECT' | 'CONVERSATION';
  lastInteraction?: Date;
  interactionCount: number;
}

/**
 * Get my suppliers API endpoint
 * 
 * This endpoint retrieves all suppliers associated with a buyer based on their interactions:
 * - CART: Suppliers whose products are in the buyer's cart
 * - ORDER: Suppliers whose products have been ordered by the buyer
 * - PROJECT: Suppliers who are part of the buyer's projects
 * - CONVERSATION: Suppliers with whom the buyer has had conversations
 * 
 * Features:
 * - Filtering by type (CART, ORDER, PROJECT, CONVERSATION, ALL)
 * - Search functionality across business name, user name, email, and description
 * - Pagination with customizable page size
 * - Sorting by business name, rating, interaction count, or last interaction
 * - Multiple types per supplier (a supplier can be in cart and have orders)
 * - Primary type based on priority: PROJECT > ORDER > CART > CONVERSATION
 * 
 * @param req - Express request object with query parameters:
 *   - type: Filter by supplier type ('ALL', 'CART', 'ORDER', 'PROJECT', 'CONVERSATION')
 *   - page: Page number for pagination (default: 1)
 *   - limit: Number of items per page (default: 10)
 *   - search: Search term for filtering suppliers
 *   - sortBy: Sort field ('businessName', 'rating', 'interactionCount', 'lastInteraction')
 *   - sortOrder: Sort direction ('asc' or 'desc', default: 'desc')
 * @param res - Express response object
 * 
 * @returns JSON response with:
 *   - suppliers: Array of supplier objects with interaction details
 *   - pagination: Pagination metadata
 *   - filters: Applied filter information
 */
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
    if (!type || type === 'ALL' || type === 'CART') {
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
            types: ['CART'],
            primaryType: 'CART',
            lastInteraction: item.createdAt,
            interactionCount: 1
          });
        } else {
          const existing = suppliersMap.get(key)!;
          if (!existing.types.includes('CART')) {
            existing.types.push('CART');
          }
          existing.interactionCount++;
          if (item.createdAt > existing.lastInteraction!) {
            existing.lastInteraction = item.createdAt;
          }
        }
      });
    }

    // 2. Get suppliers from orders and projects
    if (!type || type === 'ALL' || type === 'ORDER' || type === 'PROJECT') {
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
              types: ['ORDER'],
              primaryType: 'ORDER',
              lastInteraction: order.createdAt,
              interactionCount: 1
            });
          } else {
            const existing = suppliersMap.get(key)!;
            if (!existing.types.includes('ORDER')) {
              existing.types.push('ORDER');
            }
            existing.interactionCount++;
            if (order.createdAt > existing.lastInteraction!) {
              existing.lastInteraction = order.createdAt;
            }
            // Update primary type if ORDER has higher priority
            if (existing.primaryType === 'CART' || existing.primaryType === 'CONVERSATION') {
              existing.primaryType = 'ORDER';
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
              types: ['PROJECT'],
              primaryType: 'PROJECT',
              lastInteraction: project.createdAt,
              interactionCount: 1
            });
          } else {
            const existing = suppliersMap.get(key)!;
            if (!existing.types.includes('PROJECT')) {
              existing.types.push('PROJECT');
            }
            existing.interactionCount++;
            if (project.createdAt > existing.lastInteraction!) {
              existing.lastInteraction = project.createdAt;
            }
            // PROJECT is always the primary type as it has highest priority
            existing.primaryType = 'PROJECT';
          }
        });
      });
    }

    // 3. Get suppliers from conversations
    if (!type || type === 'ALL' || type === 'CONVERSATION') {
      const conversationParticipants = await prisma.conversationParticipant.findMany({
        where: {
          userId: userId,
          conversation: {
            participants: {
              some: {
                user: {
                  seller: {
                    isNot: null
                  }
                }
              }
            }
          }
        },
        include: {
          conversation: {
            include: {
              messages: {
                orderBy: {
                  createdAt: 'desc'
                },
                take: 1
              },
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
                },
                where: {
                  user: {
                    seller: {
                      isNot: null
                    }
                  }
                }
              }
            }
          }
        }
      });

      conversationParticipants.forEach(participant => {
        const sellerParticipant = participant.conversation.participants.find(p => 
          p.user.seller !== null
        );
        
        if (sellerParticipant?.user.seller) {
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
              types: ['CONVERSATION'],
              primaryType: 'CONVERSATION',
              lastInteraction: lastMessage?.createdAt || participant.conversation.updatedAt,
              interactionCount: 1
            });
          } else {
            const existing = suppliersMap.get(key)!;
            if (!existing.types.includes('CONVERSATION')) {
              existing.types.push('CONVERSATION');
            }
            existing.interactionCount++;
            const messageDate = lastMessage?.createdAt || participant.conversation.updatedAt;
            if (messageDate > existing.lastInteraction!) {
              existing.lastInteraction = messageDate;
            }
          }
        }
      });
    }

    // Convert map to array and apply search filter if needed
    let suppliers = Array.from(suppliersMap.values());

    // Filter by type if specified (except for 'ALL')
    if (type && type !== 'ALL') {
      suppliers = suppliers.filter(supplier => supplier.types.includes(type as any));
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      suppliers = suppliers.filter(supplier => 
        supplier.businessName.toLowerCase().includes(searchLower) ||
        supplier.businessDescription?.toLowerCase().includes(searchLower) ||
        supplier.user.name.toLowerCase().includes(searchLower) ||
        supplier.user.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort suppliers
    suppliers.sort((a, b) => {
      switch(sortBy) {
        case 'businessName':
          return sortOrder === 'asc' 
            ? a.businessName.localeCompare(b.businessName)
            : b.businessName.localeCompare(a.businessName);
        case 'rating':
          return sortOrder === 'asc' 
            ? a.rating - b.rating
            : b.rating - a.rating;
        case 'interactionCount':
          return sortOrder === 'asc'
            ? a.interactionCount - b.interactionCount
            : b.interactionCount - a.interactionCount;
        case 'lastInteraction':
          return sortOrder === 'asc'
            ? (a.lastInteraction?.getTime() || 0) - (b.lastInteraction?.getTime() || 0)
            : (b.lastInteraction?.getTime() || 0) - (a.lastInteraction?.getTime() || 0);
        default:
          return 0;
      }
    });

    // Apply pagination
    const total = suppliers.length;
    const paginatedSuppliers = suppliers.slice(skip, skip + pageSize);

    return res.json({
      suppliers: paginatedSuppliers,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(total / pageSize),
        totalItems: total,
        itemsPerPage: pageSize,
        hasNextPage: skip + pageSize < total,
        hasPrevPage: skip > 0
      },
      filters: {
        type,
        search: search || '',
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Error in getMySuppliers:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get supplier statistics API endpoint
 * 
 * This endpoint provides count statistics for each type of supplier interaction:
 * - Cart suppliers count
 * - Order suppliers count  
 * - Project suppliers count
 * - Conversation suppliers count
 * - Total unique suppliers count
 * 
 * @param req - Express request object
 * @param res - Express response object
 * 
 * @returns JSON response with statistics object containing counts for each type
 */
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