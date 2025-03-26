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


export const getSellers = async (req: any, res: Response) => {
  try {
    const sellers = await prisma.seller.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            country: true,
            state: true,
            address: true,
            companyWebsite: true,
          },
        },
      },
    });

    res.json(sellers);
  } catch (error) {
    console.error("Get sellers error:", error);
    res.status(500).json({ error: "Failed to get sellers" });
  }
};

export const getSeller = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            country: true,
            state: true,
            address: true,
            companyWebsite: true,
          },
        },
        products: {
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
            updatedAt: "desc",
            price: "asc",
          },
        },
      },
    });   
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller);
  } catch (error) {
    console.error("Get seller error:", error);
    res.status(500).json({ error: "Failed to get seller" });
  }
};

export const getSellerProfileCategories = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.businessCategories);
  } catch (error) {
    console.error("Get seller profile categories error:", error);
    res.status(500).json({ error: "Failed to get seller profile categories" });
  }
};

export const updateSellerProfileCategories = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { categories } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        businessCategories: categories,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update seller profile categories error:", error);
    res.status(500).json({ error: "Failed to update seller profile categories" });
  }
};

export const getSellerProfileProductionServices = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.productionServices);
  } catch (error) {
    console.error("Get seller profile production services error:", error);
    res.status(500).json({ error: "Failed to get seller profile production services" });
  }
};

export const updateSellerProfileProductionServices = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { productionServices } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        productionServices: productionServices,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update seller profile production services error:", error);
    res.status(500).json({ error: "Failed to update seller profile production services" });
  }
};

export const getSellerProfileProductionManagement = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.productionManaged);
  } catch (error) {
    console.error("Get seller profile production management error:", error);
    res.status(500).json({ error: "Failed to get seller profile production management" });
  }
};

export const updateSellerProfileProductionManagement = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { productionManaged } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        productionManaged: productionManaged,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update seller profile production management error:", error);
    res.status(500).json({ error: "Failed to update seller profile production management" });
  }
};

export const getSellerProfileManufacturingLocations = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.manufacturingLocations);
  } catch (error) {
    console.error("Get seller profile manufacturing locations error:", error);
    res.status(500).json({ error: "Failed to get seller profile manufacturing locations" });
  }
};

export const updateSellerProfileManufacturingLocations = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { manufacturingLocations } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        manufacturingLocations: manufacturingLocations,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update manufacturing locations error:", error);
    res.status(500).json({ error: "Failed to update manufacturing locations" });
  }
};

export const getSellerProfileCapabilities = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.challenges);
  } catch (error) {
    console.error("Get capabilities error:", error);
    res.status(500).json({ error: "Failed to get capabilities" });
  }
};

export const updateSellerProfileCapabilities = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { businessCapabilities } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        challenges: businessCapabilities,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update capabilities error:", error);
    res.status(500).json({ error: "Failed to update capabilities" });
  }
};

export const getSellerProfileTargetAudience = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.targetAudience);
  } catch (error) {
    console.error("Get target audience error:", error);
    res.status(500).json({ error: "Failed to get target audience" });
  }
};

export const updateSellerProfileTargetAudience = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { targetAudience } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        targetAudience: targetAudience,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update target audience error:", error);
    res.status(500).json({ error: "Failed to update target audience" });
  }
};

export const getSellerProfileTeamSize = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.teamSize);
  } catch (error) {
    console.error("Get team size error:", error);
    res.status(500).json({ error: "Failed to get team size" });
  }
};

export const updateSellerProfileTeamSize = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { teamSize } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        teamSize: teamSize,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update team size error:", error);
    res.status(500).json({ error: "Failed to update team size" });
  }
};

export const getSellerProfileAnnualRevenue = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.annualRevenue);
  } catch (error) {
    console.error("Get annual revenue error:", error);
    res.status(500).json({ error: "Failed to get annual revenue" });
  }
};

export const updateSellerProfileAnnualRevenue = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { annualRevenue } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        annualRevenue: annualRevenue,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update annual revenue error:", error);
    res.status(500).json({ error: "Failed to update annual revenue" });
  } 
};

export const getSellerProfileMinimumOrder = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.minimumOrderQuantity);
  } catch (error) {
    console.error("Get minimum order error:", error);
    res.status(500).json({ error: "Failed to get minimum order" });
  }
};

export const updateSellerProfileMinimumOrder = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { minimumOrderQuantity } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        minimumOrderQuantity: minimumOrderQuantity,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update minimum order error:", error);
    res.status(500).json({ error: "Failed to update minimum order" });
  }
};

export const getSellerProfileComments = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     res.json(seller.comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ error: "Failed to get comments" });
  }
};

export const updateSellerProfileComments = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { comments } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });
    
   if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
  }
  
     await prisma.seller.update({
      where: { userId },
      data: {
        comments: comments,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update comments error:", error);
    res.status(500).json({ error: "Failed to update comments" });
  }
};