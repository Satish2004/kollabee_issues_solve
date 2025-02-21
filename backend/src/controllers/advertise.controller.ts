import { Request, Response } from 'express';
import prisma from '../db';

export const createAdvertisement = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const {
      productId,
      budget,
      startDate,
      endDate,
      targetAudience,
      adType,
      description,
      status = 'PENDING'
    } = req.body;

    const advertisement = await prisma.advertisement.create({
      data: {
        seller: { connect: { id: sellerId } },
        product: { connect: { id: productId } },
        budget: parseFloat(budget),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetAudience,
        adType,
        description,
        status
      },
      include: {
        product: {
          select: {
            name: true,
            images: true,
            price: true
          }
        }
      }
    });

    res.json(advertisement);
  } catch (error) {
    console.error('Create advertisement error:', error);
    res.status(500).json({ error: 'Failed to create advertisement' });
  }
};

export const getAdvertisements = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const advertisements = await prisma.advertisement.findMany({
      where: {
        sellerId,
        ...(status && { status })
      },
      include: {
        product: {
          select: {
            name: true,
            images: true,
            price: true,
            availableQuantity: true
          }
        },
        metrics: true
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    });

    res.json(advertisements);
  } catch (error) {
    console.error('Get advertisements error:', error);
    res.status(500).json({ error: 'Failed to get advertisements' });
  }
};

export const updateAdvertisement = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const { id } = req.params;
    const {
      budget,
      startDate,
      endDate,
      targetAudience,
      adType,
      description,
      status
    } = req.body;

    // Verify ownership
    const existingAd = await prisma.advertisement.findFirst({
      where: {
        id,
        sellerId
      }
    });

    if (!existingAd) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    const advertisement = await prisma.advertisement.update({
      where: { id },
      data: {
        ...(budget && { budget: parseFloat(budget) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(targetAudience && { targetAudience }),
        ...(adType && { adType }),
        ...(description && { description }),
        ...(status && { status })
      },
      include: {
        product: {
          select: {
            name: true,
            images: true,
            price: true
          }
        },
        metrics: true
      }
    });

    res.json(advertisement);
  } catch (error) {
    console.error('Update advertisement error:', error);
    res.status(500).json({ error: 'Failed to update advertisement' });
  }
};

export const getAdvertisementMetrics = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const { id } = req.params;

    const metrics = await prisma.advertisementMetrics.findMany({
      where: {
        advertisement: {
          id,
          sellerId
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(metrics);
  } catch (error) {
    console.error('Get advertisement metrics error:', error);
    res.status(500).json({ error: 'Failed to get advertisement metrics' });
  }
}; 