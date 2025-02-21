import { Request, Response } from 'express';
import prisma from '../db';

export const getProductReviews = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        buyer: {
          include: {
            user: {
              select: {
                name: true,
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
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const addReview = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Only buyers can add reviews' });
    }

    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Check if user has purchased the product
    const order = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          buyerId: req.user.buyerId,
          status: 'DELIVERED'
        }
      }
    });

    if (!order) {
      return res.status(403).json({ error: 'You can only review products you have purchased' });
    }

    // Check if user has already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        buyerId: req.user.buyerId
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        buyerId: req.user.buyerId
      },
      include: {
        buyer: {
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
    });

    // Update product average rating
    const productReviews = await prisma.review.findMany({
      where: { productId }
    });

    const avgRating = productReviews.reduce((acc: number, review: { rating: number }) => 
      acc + review.rating, 0) / productReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: { 
        rating: avgRating as number,
        reviewCount: {
          increment: 1
        }
      }
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};

export const updateReview = async (req: any, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        buyerId: req.user.buyerId
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
      include: {
        buyer: {
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
    });

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

export const deleteReview = async (req: any, res: Response) => {
  try {
    const { reviewId } = req.params;

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        buyerId: req.user.buyerId
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.review.delete({
      where: { id: reviewId }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
}; 