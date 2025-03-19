import { Request, Response } from 'express';
import prisma from '../db';

export const getWishlist = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: { buyerId: req.user.buyerId },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        companyName: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json({
      items: wishlist?.items || [],
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

export const addToWishlist = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get or create wishlist
    const wishlist = await prisma.wishlist.upsert({
      where: { buyerId: req.user.buyerId },
      create: {
        buyerId: req.user.buyerId,
        items: {
          create: { productId }
        }
      },
      update: {
        items: {
          create: { productId }
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { itemId } = req.params;

    await prisma.wishlistItem.delete({
      where: {
        id: itemId,
        wishlist: {
          buyerId: req.user.buyerId
        }
      }
    });

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

export const clearWishlist = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        wishlist: {
          buyerId: req.user.buyerId
        }
      }
    });

    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear wishlist' });
  }
}; 