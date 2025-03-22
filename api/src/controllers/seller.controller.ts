import type { Request, Response } from "express";
import prisma from "../db";

export const getSellerProducts = async (req: any, res: Response) => {
  try {
    const {
      sortBy = "updatedAt",
      sortOrder = "desc",
      availability,
      search,
      isDraft,
    } = req.query;

    if (!req.user?.sellerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const where = {
      sellerId: req.user.sellerId,
      isDraft: isDraft === "true",
      ...(availability &&
        availability !== "all" && {
          stockStatus: availability,
        }),
      ...(search && {
        OR: [
          { name: { contains: search as string, mode: "insensitive" } },
          { description: { contains: search as string, mode: "insensitive" } },
        ],
      }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        pickupAddress: true,
        productCertificates: true,
        reviews: {
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
        },
      },
      orderBy: {
        [sortBy as string]: sortOrder === "asc" ? "asc" : "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getSellerOrders = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const { status, page = 1, limit = 10 } = req.query;

    const where = {
      items: {
        some: {
          sellerId: sellerId,
        },
      },
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          buyer: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          },
          items: {
            where: {
              sellerId: sellerId,
            },
            include: {
              product: true,
            },
          },
          shippingAddress: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Get seller orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const updateBusinessInfo = async (req: any, res: Response) => {
  try {
    if (!req.user?.sellerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      businessName,
      businessAddress,
      websiteLink,
      businessTypes,
      businessCategories,
    } = req.body;

    const seller = await prisma.seller.update({
      where: { id: req.user.sellerId },
      data: {
        businessName,
        businessAddress,
        websiteLink,
        businessTypes,
        businessCategories,
      },
    });

    res.json(seller);
  } catch (error) {
    res.status(500).json({ error: "Failed to update business info" });
  }
};

export const getBusinessInfo = async (req: any, res: Response) => {
  try {
    if (!req.user?.sellerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const businessInfo = await prisma.seller.findUnique({
      where: { id: req.user.sellerId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            companyName: true,
            phoneNumber: true,
            country: true,
            state: true,
            address: true,
            companyWebsite: true,
          },
        },
      },
    });

    if (!businessInfo) {
      return res.status(404).json({ error: "Business info not found" });
    }

    res.json(businessInfo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch business info" });
  }
};

export const getProducts = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { search, sortBy, availability, isDraft } = req.query;

    const products = await prisma.product.findMany({
      where: {
        seller: { userId },
        isDraft: isDraft === "true",
        // Add other filters
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const getProductMetrics = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;

    const [totalProducts, topSelling, lowStocks] = await Promise.all([
      prisma.product.count({
        where: { seller: { userId } },
      }),
      prisma.product.findFirst({
        where: { seller: { userId } },
      }),
      prisma.product.count({
        where: {
          seller: { userId },
          availableQuantity: { lt: 20000, gt: 0 },
        },
      }),
    ]);

    const categories = await prisma.category.count();

    res.json({
      categories,
      totalProducts,
      topSelling: topSelling?.name || "No top selling product",
      lowStocks,
    });
  } catch (error) {
    console.error("Get metrics error:", error);
    res.status(500).json({ error: "Failed to get metrics" });
  }
};

export const getDraftProducts = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { search, sortBy, availability } = req.query;

    const products = await prisma.product.findMany({
      where: {
        seller: { userId },
        isDraft: true,
        ...(search && {
          OR: [
            { name: { contains: search as string, mode: "insensitive" } },
            {
              description: { contains: search as string, mode: "insensitive" },
            },
          ],
        }),
        ...(availability && { availability: availability as string }),
      },

      orderBy: {
        [(sortBy as string) || "updatedAt"]: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Get draft products error:", error);
    res.status(500).json({ error: "Failed to get draft products" });
  }
};

export const createProduct = async (req: any, res: Response) => {
  try {
    const { sellerId } = req.user;
    const {
      name,
      description,
      price,
      wholesalePrice,
      minOrderQuantity,
      availableQuantity,
      images,
      dimensions,
      material,
      artistName,
      certifications,
      rarity,
      label,
      techniques,
      color,
      fabricType,
      fabricWeight,
      fitType,
      discount,
      deliveryCost,
      pickupAddress,
      productAttributes,
      isDraft = false,
    } = req.body;

    // Create pickup address if provided
    let pickupAddressId = null;
    if (pickupAddress) {
      const createdAddress = await prisma.pickupAddress.create({
        data: pickupAddress,
      });
      pickupAddressId = createdAddress.id;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        wholesalePrice: parseFloat(wholesalePrice),
        minOrderQuantity: parseInt(minOrderQuantity),
        availableQuantity: parseInt(availableQuantity),
        images,
        dimensions,
        material,
        artistName,
        certifications,
        rarity,
        label,
        techniques,
        color,
        fabricType,
        fabricWeight,
        fitType,
        discount: discount ? parseFloat(discount) : null,
        deliveryCost: deliveryCost ? parseFloat(deliveryCost) : null,
        isDraft,
        seller: { connect: { id: sellerId } },
        ...(pickupAddressId && {
          pickupAddress: { connect: { id: pickupAddressId } },
        }),
      },
      include: {
        pickupAddress: true,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const data = req.body;
    const files = req.files as any;

    // Verify product ownership
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        seller: { userId },
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(files?.length && {
          images: {
            deleteMany: {},
            create: files.map((file: any) => ({
              url: file.path,
              alt: data.name,
            })),
          },
        }),
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};
