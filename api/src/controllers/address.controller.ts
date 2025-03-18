import type { Request, Response } from "express";
import prisma from "../db";

export const getAddresses = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { type } = req.query;

    const addresses = await prisma.address.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(addresses);
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

export const createAddress = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const {
      firstName,
      lastName,
      companyName,
      address,
      country,
      state,
      city,
      zipCode,
      email,
      phoneNumber,
      type,
    } = req.body;

    // Check if address type already exists for user
    const existingAddress = await prisma.address.findFirst({
      where: {
        userId,
        type,
      },
    });

    if (existingAddress) {
      return res.status(400).json({
        error: `${type} address already exists for this user`,
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        firstName,
        lastName,
        companyName,
        address,
        country,
        state,
        city,
        zipCode,
        email,
        phoneNumber,
        type,
        user: { connect: { id: userId } },
      },
    });

    res.json(newAddress);
  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({ error: "Failed to create address" });
  }
};

export const updateAddress = async (req: any, res: Response) => {
  try {
    const { addressId: id } = req.params;
    const { userId } = req.user;
    const addressData = req.body;
    console.log(id, userId, addressData, req.params, "req.params");
    // First verify the address belongs to the user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    // If type is being changed, check if new type already exists
    if (addressData.type && addressData.type !== existingAddress.type) {
      const typeExists = await prisma.address.findFirst({
        where: {
          userId,
          type: addressData.type,
          NOT: {
            id,
          },
        },
      });

      if (typeExists) {
        return res.status(400).json({
          error: `${addressData.type} address already exists for this user`,
        });
      }
    }

    // Update the address using schema fields
    const updatedAddress = await prisma.address.update({
      where: {
        id,
      },
      data: {
        firstName: addressData.firstName,
        lastName: addressData.lastName,
        companyName: addressData.companyName,
        address: addressData.address,
        country: addressData.country,
        state: addressData.state,
        city: addressData.city,
        zipCode: addressData.zipCode,
        email: addressData.email,
        phoneNumber: addressData.phoneNumber,
        type: addressData.type,
      },
    });

    res.json(updatedAddress);
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ error: "Failed to update address" });
  }
};

export const deleteAddress = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { addressId: id } = req.params;

    // Verify ownership
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    await prisma.address.delete({
      where: { id },
    });

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ error: "Failed to delete address" });
  }
};
