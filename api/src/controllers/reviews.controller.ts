import type { Request, Response } from "express";
import prisma from "../db";

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
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
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Add a review
export const addReview = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const { buyerId } = req.user;

    // Check if the buyer has purchased the product (any order status)
    const order = await prisma.order.findFirst({
      where: {
        buyerId,
        items: {
          some: {
            productId,
          },
        },
      },
    });

    if (!order) {
      return res.status(403).json({
        error: "You can only review products you have purchased",
      });
    }

    // Check if the buyer has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        buyerId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        error: "You have already reviewed this product",
      });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        buyerId,
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
    });

    // Update product rating and review count
    const productReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating =
      productReviews.reduce((sum, review) => sum + review.rating, 0) /
      productReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewCount: productReviews.length,
      },
    });

    res.json(review);
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

// Update a review
export const updateReview = async (req: any, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const { buyerId } = req.user;

    // Check if the review exists and belongs to the buyer
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        buyerId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Update the review
    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
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
    });

    // Update product rating
    const productReviews = await prisma.review.findMany({
      where: { productId: existingReview.productId },
      select: { rating: true },
    });

    const avgRating =
      productReviews.reduce((sum, review) => sum + review.rating, 0) /
      productReviews.length;

    await prisma.product.update({
      where: { id: existingReview.productId },
      data: {
        rating: avgRating,
      },
    });

    res.json(review);
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

// Delete a review
export const deleteReview = async (req: any, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { buyerId } = req.user;

    // Check if the review exists and belongs to the buyer
    const existingReview = await prisma.review.findFirst({
      where: {
        id: reviewId,
        buyerId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update product rating and review count
    const productReviews = await prisma.review.findMany({
      where: { productId: existingReview.productId },
      select: { rating: true },
    });

    const avgRating =
      productReviews.length > 0
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
          productReviews.length
        : 0;

    await prisma.product.update({
      where: { id: existingReview.productId },
      data: {
        rating: avgRating,
        reviewCount: productReviews.length,
      },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
}; 