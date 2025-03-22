import type { Request, Response } from "express";
import prisma from "../db";

export const createRequest = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: "Unauthorized" });
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
      leadSize,
    } = req.body;
    console.log(req.body);
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
        status: "PENDING",
        requestType: "PRODUCT",
      },
    });

    res.json(request);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create request" });
  }
};

export const getAllRequests = async (req: any, res: Response) => {
  try {
    const requests = await prisma.request.findMany();
    res.json(requests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get requests" });
  }
};

export const getRequestById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const request = await prisma.request.findUnique({
      where: { id },
    });
    res.json(request);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get request" });
  }
};

export const updateRequest = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await prisma.request.update({
      where: { id },
      data: { status },
    });
    res.json(request);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update request" });
  }
};

export const deleteRequest = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.request.delete({ where: { id } });
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete request" });
  }
};
