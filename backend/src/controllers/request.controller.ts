import { Request, Response } from 'express';
import prisma from '../db';

export const createRequest = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      sellerId,
      productName,
      category,
      subCategory,
      quantity,
      targetPrice,
      orderFrequency,
      country,
      leadSize
    } = req.body;

    const request = await prisma.request.create({
      data: {
        buyerId: req.user.buyerId,
        sellerId,
        productName,
        category,
        subCategory,
        quantity,
        targetPrice,
        orderFrequency,
        country,
        leadSize,
        status: 'PENDING',
        requestType: 'PRODUCT'
      }
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
}; 