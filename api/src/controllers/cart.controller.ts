import type { Request, Response } from 'express';
import prisma from '../db';

export const getCart = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const buyer = await prisma.buyer.findUnique({
      where: { userId },
      include: {
        Cart: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    seller: {
                      select: {
                        businessName: true,
                        rating: true
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

    if (!buyer?.Cart) {
      // Create cart if it doesn't exist
      const cart = await prisma.cart.create({
        data: {
          buyer: { connect: { userId } }
        },
        include: {
          items: true
        }
      });
      return res.json(cart);
    }

    res.json({
      ...buyer.Cart,
      timestamp: Date.now(), // Add a timestamp to ensure the response is unique
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { productId, quantity } = req.body;

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: {
        buyer: { userId }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          buyer: { connect: { userId } }
        }
      });
    }

    // Check if product already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (existingItem) {
      // Update quantity if item exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: productId } },
          quantity
        }
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(updatedCart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Verify cart ownership
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          buyer: { userId }
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

export const removeFromCart = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { itemId } = req.params;

    // Verify cart ownership
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          buyer: { userId }
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

export const clearCart = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          buyerId: req.user.buyerId
        }
      }
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

// Add other cart-related controllers 
// Add other cart-related controllers