import type { Request, Response } from "express";
import prisma from "../db";
import { Role } from "@prisma/client";

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
        country: true,
        state: true,
        address: true,
        imageUrl: true,
        companyWebsite: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name: req.body.firstName + " " + req.body.lastName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        state: req.body.state,
        address: req.body.address,
        companyName: req.body.companyName,
        companyWebsite: req.body.companyWebsite,
        zipCode: req.body.zipCode,
        imageUrl: req.body.imageUrl,
        isActive: req.body.isActive ?? true, // Default to true if not provided
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// api for admin, related to user

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const userId = req?.user?.userId ?? "234";

    const { pageNo, pageSize, search, sortBy, sortOrder, filter } = req.query;

    const page = parseInt(pageNo as string) || 1;
    const size = parseInt(pageSize as string) || 10;
    const skip = (page - 1) * size;
    const take = size;
    const searchTerm = search ? search?.toString() : "";
    const sortByField = sortBy ? sortBy?.toString() : "createdAt";
    const sortOrderField = sortOrder ? sortOrder?.toString() : "desc";

    // Parse filters from query
    const filterFieldArray = filter?.toString().split(",").filter(Boolean);
    console.log("filterFieldArray : ", filterFieldArray);
    const filterConditions = filterFieldArray?.map((item: string) => {
      const [key, value] = item.split(":");
      switch (key) {
        case "role":
          return { role: { equals: value } };
        case "country":
          return { country: { contains: value, mode: "insensitive" } };
        case "state":
          return { state: { contains: value, mode: "insensitive" } };
        default:
          return {};
      }
    });

    console.log("filterFieldArrayObject : ", filterConditions);

    console.log("filterConditions : ", filterConditions);

    // use transaction to get all the users and total users
    const [allUsers, totalUsersCount] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          NOT: {
            id: userId,
          },
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              phoneNumber: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
          AND: filterConditions,
        },
        skip: skip,
        take: take,
        orderBy: {
          [sortByField]: sortOrderField,
        },
        include: {
          seller: {
            include: {
              Approved: true,
            },
          },
          buyer: true,
          approvals: true,
          addresses: true,
          analytics: true,
          subscription: {
            include: {
              plan: true,
            },
          },
          blockedAsInitiator: {
            include: {
              target: true,
            },
          },
          blockedAsTarget: {
            include: {
              initiator: true,
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          NOT: {
            id: userId,
          },
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              phoneNumber: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
          AND: filterConditions,
        },
      }),
    ]);

    return res.status(200).json({
      users: allUsers,
      page: page,
      size: size,
      total: totalUsersCount,
      totalPages: Math.ceil(totalUsersCount / size),
    });
  } catch (error) {
    console.log("error : ", error);
    res
      .status(500)
      .json({ error: "Failed to fetch users", message: error as any });
  }
};

export const getUserDetailsForAdmin = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        seller: {
          include: {
            Approved: true,
            projects: true,
            inquiries: true,
            trustBadges: true,
            certifications: true,
          },
        },
        buyer: {
          include: {
            inquiries: true,
            Wishlist: {
              include: {
                items: {
                  include: {
                    product: true,
                  },
                },
              },
            },
            projects: true,
            savedSearches: true,
          },
        },
        approvals: true,
        addresses: true,
        analytics: true,
        subscription: {
          include: {
            plan: true,
          },
        },
        blockedAsInitiator: {
          include: {
            target: true,
          },
        },
        blockedAsTarget: {
          include: {
            initiator: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details for admin:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch user details", message: error as any });
  }
};

export const getUsers = async (req: any, res: Response) => {
  try {
    const { role } = req.query;

    const users = await prisma.user.findMany({
      where: {
        role: role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyName: true,
        displayName: true,
        country: true,
        state: true,
        address: true,
        imageUrl: true,
        companyWebsite: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        seller: {
          include: {
            Approved: true,
          },
        },
        buyer: true,
        approvals: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch users", message: error as any });
  }
};
