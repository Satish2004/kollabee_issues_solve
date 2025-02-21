import { Request, Response } from 'express';
import prisma from '../db';

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        phoneNumber: true,
        country: true,
        state: true,
        address: true,
        imageUrl: true,
        companyWebsite: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        state: req.body.state,
        address: req.body.address,
        companyName: req.body.companyName,
        companyWebsite: req.body.companyWebsite
      }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}; 