import { Request, Response } from 'express';
import prisma from '../db';

interface TrackingUpdate {
  status: any;
  location?: string;
  description: string;
  timestamp: Date;
}

export const createOrder = async (req: any, res: Response) => {
  try {
    const { buyerId } = req.user;
    const { items, shippingAddress, totalAmount } = req.body;

    // Create order with items and shipping address
    const order = await prisma.order.create({
      data: {
        buyerId,
        totalAmount: parseFloat(totalAmount),
        status: 'PENDING',
        items: {
          createMany: {
            data: items.map((item: any) => ({
              productId: item.productId,
              sellerId: item.sellerId,
              quantity: parseInt(item.quantity),
              price: parseFloat(item.price)
            }))
          }
        },
        shippingAddress: {
          create: shippingAddress
        }
      },
      include: {
        items: {
          include: {
            product: true,
            seller: {
              select: {
                businessName: true
              }
            }
          }
        },
        shippingAddress: true
      }
    });

    // Clear cart after successful order
    // if (order) {
    //   await prisma.cart.update({
    //     where: { buyerId },
    //     data: {
    //       items: {
    //         deleteMany: {}
    //       }
    //     }
    //   });
    // }

    res.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getOrders = async (req: any, res: Response) => {
  try {
    const { buyerId } = req.user;
    const { status, page = 1, limit = 10 } = req.query;

    const where = {
      buyerId,
      ...(status && { status })
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
              seller: {
                include: {
                  user: {
                    select: {
                      name: true,
                      imageUrl: true
                    }
                  }
                }
              }
            }
          },
          shippingAddress: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderDetails = async (req: any, res: Response) => {
  try {
    const { buyerId } = req.user;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        buyerId
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
                    phoneNumber: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        shippingAddress: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

export const updateOrderStatus = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const { id } = req.params;
    const { status } = req.body;

    // Verify order belongs to seller
    const order = await prisma.order.findFirst({
      where: {
        id,
        items: {
          some: {
            sellerId
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const updateOrderTracking = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const { id } = req.params;
    const { 
      status, 
      location, 
      description,
      trackingNumber,
      carrier 
    } = req.body;

    // Verify order belongs to seller
    const order = await prisma.order.findFirst({
      where: {
        id,
        items: {
          some: {
            sellerId
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create tracking update
    const trackingUpdate: TrackingUpdate = {
      status,
      location,
      description,
      timestamp: new Date()
    };

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber,
        carrier,
        trackingHistory: {
          push: JSON.parse(JSON.stringify(trackingUpdate))
        }
      },
      include: {
        items: {
          include: {
            product: true,
            seller: {
              select: {
                businessName: true
              }
            }
          }
        }
      }
    });

    // Create notification with non-null userId
    if (order.buyerId) {
      await prisma.notification.create({
        data: {
          userId: order.buyerId,
          type: 'ORDER_UPDATE',
          message: `Order #${order.id} ${status}: ${description}`
        }
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order tracking error:', error);
    res.status(500).json({ error: 'Failed to update order tracking' });
  }
};

export const getOrderTracking = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { trackingNumber } = req.query;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          { trackingNumber: trackingNumber as string }
        ]
      },
      select: {
        id: true,
        status: true,
        trackingNumber: true,
        carrier: true,
        trackingHistory: true,
        createdAt: true,
        shippingAddress: {
          select: {
            fullName: true,
            address: true,
            state: true,
            country: true,
            zipCode: true,
            email: true,
            phoneNumber: true
          }
        },
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                images: true
              }
            },
            seller: {
              select: {
                businessName: true,
                location: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({ error: 'Failed to fetch order tracking' });
  }
}; 

export const acceptOrder = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
        const updatedOrder = await prisma.order.update({
          where: { id },
          data: {isAccepted:true}
        });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept order' });
  }
};

export const declineOrder = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { isAccepted: false }
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to decline order' });
  }
};