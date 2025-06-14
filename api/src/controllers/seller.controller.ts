import type { Request, Response } from "express";
import prisma from "../db";
import { audience } from "@prisma/client";
import { upload, uploadToCloudinary } from "../utils/multer";

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
      roleInCompany,
    } = req.body;

    const seller = await prisma.seller.update({
      where: { id: req.user.sellerId },
      data: {
        businessName,
        businessAddress,
        websiteLink,
        businessTypes,
        businessCategories,
        roleInCompany,
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

    const roleInCompany = await prisma.seller.findUnique({
      where: { id: req.user.sellerId },
      select: { roleInCompany: true },
    });

    const businessInfo = await prisma.seller.findUnique({
      where: { id: req.user.sellerId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            companyName: true,
            role: true,
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

    const newBusinessInfo = {
      ...businessInfo,
      roleInCompany: roleInCompany?.roleInCompany || "",
    };

    res.json(newBusinessInfo);
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

export const getSellerBusinessInfo = async (req: any, res: Response) => {
  try {
    const session = req.user;

    if (!session?.userId || !session.sellerId) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.userId },
      select: {
        businessName: true,
        businessDescription: true,
        businessAddress: true,
        websiteLink: true,
        businessTypes: true,
        businessCategories: true,
        roleInCompany: true,
      },
    });

    if (!seller) {
      return res.status(400).json({ error: "Seller not found" });
    }

    const companyRoles = [
      "Founder/CEO",
      "Executive/Leadership",
      "Manager",
      "Team Member",
      "Intern",
      "Other",
    ];
    const roleValue =
      typeof seller?.roleInCompany === "string" ? seller.roleInCompany : "";

    const isStandardRole =
      typeof roleValue === "string" && companyRoles.includes(roleValue);

    console.log(isStandardRole, roleValue);

    const newBusinessInfo = {
      ...seller,
      roleInCompany: isStandardRole ? roleValue : "Other",
      ...(roleValue && !isStandardRole ? { otherRole: roleValue } : {}),
    };

    return res.status(200).json(newBusinessInfo);
  } catch (error) {
    console.error("Error fetching business info:", error);
    return res.status(500).json({ error: "Failed to fetch business info" });
  }
};

export const updateSellerBussinessInfo = async function (
  req: any,
  res: Response
) {
  try {
    const user = req.user;

    const {
      businessName,
      businessDescription,
      businessAddress,
      websiteLink,
      businessTypes,
      businessCategories,
      roleInCompany,
      otherRole,
    } = req.body;

    const seller = await prisma.seller.findUnique({
      where: { userId: user.userId },
      select: { id: true, profileCompletion: true },
    });

    if (!seller) {
      return res.status(400).json({ error: "Seller not found" });
    }

    // Check if we have valid data to mark this step as complete
    const hasData =
      businessName &&
      businessDescription &&
      businessAddress &&
      websiteLink &&
      roleInCompany === "Other"
        ? otherRole
        : roleInCompany &&
          businessTypes?.length > 0 &&
          businessCategories?.length > 0;

    const currentCompletion = seller.profileCompletion || [];
    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 1])]
      : currentCompletion.filter((step) => step !== 1);

    const updatedSeller = await prisma.seller.update({
      where: { userId: user.userId },
      data: {
        businessName,
        businessDescription,
        businessAddress,
        websiteLink,
        businessTypes,
        businessCategories,
        profileCompletion: newCompletion,
        roleInCompany: roleInCompany === "Other" ? otherRole : roleInCompany,
      },
    });

    return res.status(200).json(updatedSeller);
  } catch (error) {
    console.error("Error updating business info:", error);
    return res.status(4500).json({ error: "Failed to update business info" });
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

    const categoryData = {
      selectedCategories: seller.businessCategories,
      subcategories: seller.subCategories,
    };

    console.log(categoryData);

    res.json(categoryData);
  } catch (error) {
    console.error("Get seller profile categories error:", error);
    res.status(500).json({ error: "Failed to get seller profile categories" });
  }
};

export const updateSellerProfileCategories = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { selectedCategories, subcategories } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasCategories = selectedCategories.length > 0;

    const newCompletion = hasCategories
      ? [...new Set([...currentCompletion, 3])]
      : currentCompletion.filter((step) => step !== 3);

    await prisma.seller.update({
      where: { userId },
      data: {
        businessCategories: selectedCategories,
        subCategories: subcategories,
        profileCompletion: newCompletion,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update seller profile categories error:", error);
    res
      .status(500)
      .json({ error: "Failed to update seller profile categories" });
  }
};

export const getSellerProfileProductionServices = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const prodServices = { services: seller.productionServices };
    res.json(prodServices);
  } catch (error) {
    console.error("Get seller profile production services error:", error);
    res
      .status(500)
      .json({ error: "Failed to get seller profile production services" });
  }
};

export const updateSellerProfileProductionServices = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { services } = req.body;

    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData = services.length > 0;

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 4])]
      : currentCompletion.filter((step) => step !== 4);

    await prisma.seller.update({
      where: { userId },
      data: {
        productionServices: services,
        profileCompletion: newCompletion,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update seller profile production services error:", error);
    res
      .status(500)
      .json({ error: "Failed to update seller profile production services" });
  }
};

export const getSellerProfileProductionManagement = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    const prodManagement = { managementType: seller.productionManagementType };
    res.json(prodManagement);
  } catch (error) {
    console.error("Get seller profile production management error:", error);
    res
      .status(500)
      .json({ error: "Failed to get seller profile production management" });
  }
};

export const updateSellerProfileProductionManagement = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { managementType } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData = managementType.length > 0;

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 5])]
      : currentCompletion.filter((step) => step !== 5);

    await prisma.seller.update({
      where: { userId },
      data: {
        productionManagementType: managementType,
        profileCompletion: newCompletion,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update seller profile production management error:", error);
    res
      .status(500)
      .json({ error: "Failed to update seller profile production management" });
  }
};

export const getSellerProfileManufacturingLocations = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    const locations = { locations: seller.manufacturingLocations };

    res.json(locations);
  } catch (error) {
    console.error("Get seller profile manufacturing locations error:", error);
    res
      .status(500)
      .json({ error: "Failed to get seller profile manufacturing locations" });
  }
};

export const updateSellerProfileManufacturingLocations = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { locations } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData = locations.length > 0;

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 6])]
      : currentCompletion.filter((step) => step !== 6);

    await prisma.seller.update({
      where: { userId },
      data: {
        manufacturingLocations: locations,
        profileCompletion: newCompletion,
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
    const capabilities = { capabilities: seller.challenges };
    res.json(capabilities);
  } catch (error) {
    console.error("Get capabilities error:", error);
    res.status(500).json({ error: "Failed to get capabilities" });
  }
};

export const updateSellerProfileCapabilities = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { capabilities } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData = capabilities.length > 0;

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 7])]
      : currentCompletion.filter((step) => step !== 7);

    await prisma.seller.update({
      where: { userId },
      data: {
        challenges: capabilities,
        profileCompletion: newCompletion,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update capabilities error:", error);
    res.status(500).json({ error: "Failed to update capabilities" });
  }
};

export const getSellerProfileTargetAudience = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    const audiences = { audiences: seller.targetAudience };
    res.json(audiences);
  } catch (error) {
    console.error("Get target audience error:", error);
    res.status(500).json({ error: "Failed to get target audience" });
  }
};

export const updateSellerProfileTargetAudience = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { audiences } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData =
      audiences !== undefined && audiences.length !== null && audiences !== "";

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 8])]
      : currentCompletion.filter((step) => step !== 8);

    await prisma.seller.update({
      where: { userId },
      data: {
        targetAudience: audiences,
        profileCompletion: newCompletion,
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
    const size = { size: seller.teamSize };
    res.json(size);
  } catch (error) {
    console.error("Get team size error:", error);
    res.status(500).json({ error: "Failed to get team size" });
  }
};

export const updateSellerProfileTeamSize = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { size } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData = size !== undefined && size.length !== null && size !== "";

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 9])]
      : currentCompletion.filter((step) => step !== 9);

    await prisma.seller.update({
      where: { userId },
      data: {
        teamSize: size,
        profileCompletion: newCompletion,
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

    const revenue = { revenue: seller.annualRevenue };

    res.json(revenue);
  } catch (error) {
    console.error("Get annual revenue error:", error);
    res.status(500).json({ error: "Failed to get annual revenue" });
  }
};

export const updateSellerProfileAnnualRevenue = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { revenue } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData =
      revenue !== undefined && revenue.length !== null && revenue !== "";

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 10])]
      : currentCompletion.filter((step) => step !== 10);

    await prisma.seller.update({
      where: { userId },
      data: {
        annualRevenue: revenue,
        profileCompletion: newCompletion,
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
    const minimumOrderQuantity = {
      minimumOrderQuantity: seller.minimumOrderQuantity,
    };
    res.json(minimumOrderQuantity);
  } catch (error) {
    console.error("Get minimum order error:", error);
    res.status(500).json({ error: "Failed to get minimum order" });
  }
};

export const updateSellerProfileMinimumOrder = async (
  req: any,
  res: Response
) => {
  try {
    const { userId } = req.user;
    const { minimumOrderQuantity } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData =
      minimumOrderQuantity !== undefined &&
      minimumOrderQuantity.length !== null &&
      minimumOrderQuantity !== "";

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 11])]
      : currentCompletion.filter((step) => step !== 11);

    await prisma.seller.update({
      where: { userId },
      data: {
        minimumOrderQuantity: minimumOrderQuantity,
        profileCompletion: newCompletion,
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

    const notes = { notes: seller.comments };

    res.json(notes);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ error: "Failed to get comments" });
  }
};

export const updateSellerProfileComments = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { notes } = req.body;
    const seller = await prisma.seller.findUnique({
      where: { userId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const currentCompletion = seller.profileCompletion || [];
    const hasData =
      notes !== undefined && notes.length !== null && notes !== "";

    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 12])]
      : currentCompletion.filter((step) => step !== 12);

    await prisma.seller.update({
      where: { userId },
      data: {
        comments: notes,
        profileCompletion: newCompletion,
      },
    });

    res.json(seller);
  } catch (error) {
    console.error("Update comments error:", error);
    res.status(500).json({ error: "Failed to update comments" });
  }
};

export const uploadProfileCertificate = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { userId } = req.user;
    const { title, issuer, expiryDate } = req.body;

    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: { id: true, profileCompletion: true },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller profile not found" });
    }

    const cloudinaryResult: any = await uploadToCloudinary(
      req.file.buffer,
      "seller-certificates"
    );

    const certificate = await prisma.certification.create({
      data: {
        name: title,
        image: cloudinaryResult.secure_url,
        issuerName: issuer,
        suppliers: {
          connect: { id: seller.id },
        },
      },
      include: {
        suppliers: true,
      },
    });

    const currentCompletion = seller.profileCompletion || [];
    const newCompletion = [...new Set([...currentCompletion, 11])];

    await prisma.seller.update({
      where: { userId },
      data: {
        profileCompletion: newCompletion,
      },
    });

    res.json({
      id: certificate.id,
      name: certificate.name,
      image: certificate.image,
      issuerName: certificate.issuerName,
      issueDate: certificate.issueDate,
      createdAt: certificate.createdAt,
      approved: false,
    });
  } catch (error) {
    console.error("Upload certificate error:", error);
    res.status(500).json({ error: "Failed to upload certificate" });
  }
};

export const getSellerGoalsMetric = async (req: any, res: Response) => {
  try {
    const session = await req.user;

    if (!session?.userId || !session.sellerId) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.userId },
      select: {
        objectives: true,
        challenges: true,
        metrics: true,
        agrrement1: true,
        agrrement2: true,
      },
    });

    if (!seller) {
      return res.status(400).json({ error: "Seller not found" });
    }

    return res.status(200).json({
      selectedObjectives: seller.objectives || [],
      selectedChallenges: seller.challenges || [],
      selectedMetrics: seller.metrics || [],
      agreement1: seller.agrrement1 || false,
      agreement2: seller.agrrement2 || false, // Default to true if they've already set this up
    });
  } catch (error) {
    console.error("Error fetching goals and metrics:", error);
    return res.status(400).json({ error: "Failed to fetch goals and metrics" });
  }
};

export const updateSellerGoalsMetric = async (req: any, res: Response) => {
  try {
    const session = await req.user;

    if (!session?.userId || !session.sellerId) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    const {
      selectedObjectives,
      selectedChallenges,
      selectedMetrics,
      agreement1,
      agreement2,
    } = req.body;

    // if (!agreement1 || !agreement2) {
    //   return res.status(400).json({ error: "You must agree to the terms" });
    // }

    const seller = await prisma.seller.findUnique({
      where: { userId: session.userId },
      select: { id: true, profileCompletion: true },
    });

    if (!seller) {
      return res.status(400).json({ error: "Seller not found" });
    }

    // Check if we have valid data to mark this step as complete
    const hasData =
      selectedObjectives?.length > 0 &&
      selectedChallenges?.length > 0 &&
      selectedMetrics?.length > 0 &&
      agreement1 &&
      agreement2;

    const currentCompletion = seller.profileCompletion || [];
    const newCompletion = hasData
      ? [...new Set([...currentCompletion, 2])]
      : currentCompletion.filter((step) => step !== 2);

    const updatedSeller = await prisma.seller.update({
      where: { userId: session.userId },
      data: {
        objectives: selectedObjectives,
        challenges: selectedChallenges,
        metrics: selectedMetrics,
        profileCompletion: newCompletion,
        agrrement1: agreement1,
        agrrement2: agreement2,
      },
    });

    return res.status(200).json(updatedSeller);
  } catch (error) {
    console.error("Error updating goals and metrics:", error);
    return res
      .status(400)
      .json({ error: "Failed to update goals and metrics" });
  }
};

export const getAllProfileCertificates = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      include: {
        certifications: true,
      },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller profile not found" });
    }

    const certificates = { certificates: seller.certifications };

    res.json(certificates);
  } catch (error) {
    console.error("Get all profile certificates error:", error);
    res.status(500).json({ error: "Failed to get all profile certificates" });
  }
};

export const deleteProfileCertificate = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const seller = await prisma.seller.findUnique({
      where: { userId },
      include: { certifications: true },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller profile not found" });
    }

    const certificateToDelete = seller.certifications.find((c) => c.id === id);
    if (!certificateToDelete) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const isLastCertificate = seller.certifications.length === 1;

    const currentCompletion = seller.profileCompletion || [];
    const newCompletion = isLastCertificate
      ? currentCompletion.filter((step) => step !== 13)
      : currentCompletion;

    const [_, updatedSeller] = await prisma.$transaction([
      prisma.certification.delete({ where: { id } }),
      prisma.seller.update({
        where: { userId },
        data: { profileCompletion: newCompletion },
      }),
    ]);

    const remainingCertificates = seller.certifications.filter(
      (c) => c.id !== id
    );
    res.json({ certificates: remainingCertificates });
  } catch (error) {
    console.error("Delete profile certificate error:", error);
    res.status(500).json({ error: "Failed to delete profile certificate" });
  }
};

export const getProfileCompletion = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: {
        profileCompletion: true,
        updatedAt: true,
      },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const completion = seller.profileCompletion || [];

    res.json(completion);
  } catch (error) {
    console.error("Get profile completion error:", error);
    res.status(500).json({ error: "Failed to get profile completion" });
  }
};

// api for the admin

export const approveOrRejectSeller = async (req: any, res: Response) => {
  try {
    const { sellerId, status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const updatedSeller = await prisma.seller.update({
      where: { id: sellerId },
      data: {
        approved: status,
        Approved: status
          ? {
              create: {
                approvedById: req.user.userId,
                status: true,
                approvedAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
              },
            }
          : undefined,
        updatedAt: new Date(Date.now()),
        lock: false,
      },
    });

    res.json({
      message: `Seller has been ${status ? "approved" : "rejected"}`,
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("Approve/Reject seller error:", error);
    res.status(500).json({ error: "Failed to update seller status" });
  }
};

export const getAllSellers = async (req: any, res: Response) => {
  try {
    const { pageNo, pageSize, search, sortBy, sortOrder, filter } = req.query;

    const page = parseInt(pageNo as string) || 1;
    const size = parseInt(pageSize as string) || 10;
    const skip = (page - 1) * size;
    const take = size;
    const searchTerm = search ? search.toString() : "";
    const sortByField = sortBy ? sortBy.toString() : "createdAt";
    const sortOrderField = sortOrder ? sortOrder.toString() : "desc";

    // Parse filters from query
    const filterFieldArray =
      filter?.toString().split(",").filter(Boolean) || [];
    const filterConditions = filterFieldArray.map((item: string) => {
      const [key, value] = item.split(":");
      switch (key) {
        case "country":
          return { country: { contains: value, mode: "insensitive" } };
        case "state":
          return { state: { contains: value, mode: "insensitive" } };
        case "approved":
          return { approved: value === "true" };
        default:
          return {};
      }
    });

    const [sellers, totalSellersCount] = await prisma.$transaction([
      prisma.seller.findMany({
        where: {
          OR: [
            {
              businessName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              websiteLink: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
          AND: filterConditions,
        },
        skip,
        take,
        orderBy: {
          [sortByField]: sortOrderField,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      }),
      prisma.seller.count({
        where: {
          OR: [
            {
              businessName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              websiteLink: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
          AND: filterConditions,
        },
      }),
    ]);

    res.json({
      sellers,
      page,
      size,
      total: totalSellersCount,
      totalPages: Math.ceil(totalSellersCount / size),
    });
  } catch (error) {
    console.error("Get all sellers error:", error);
    res.status(500).json({ error: "Failed to fetch sellers" });
  }
};

export const updateSellerStatus = async (req: any, res: Response) => {
  try {
    const { sellerId, status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!seller || !seller.ApprovedId) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const [updatedSeller, updatedTable] = await prisma.$transaction([
      prisma.seller.update({
        where: { id: sellerId },
        data: {
          approved: status,
        },
      }),

      prisma.approved.update({
        where: {
          id: seller.ApprovedId!,
        },
        data: {
          status: status, // Example field
          updatedAt: new Date(Date.now()),
        },
      }),
    ]);

    res.json({
      message: `Seller status has been updated to ${
        status ? "approved" : "rejected"
      }`,
      seller: updatedSeller,
    });
  } catch (error) {
    console.error("Update seller status error:", error);
    res.status(500).json({ error: "Failed to update seller status" });
  }
};

export const getAllBuyers = async (req: any, res: Response) => {
  try {
    const { pageNo, pageSize, search, sortBy, sortOrder, filter } = req.query;

    const page = parseInt(pageNo as string) || 1;
    const size = parseInt(pageSize as string) || 10;
    const skip = (page - 1) * size;
    const take = size;
    const searchTerm = search ? search.toString() : "";
    const sortByField = sortBy ? sortBy.toString() : "createdAt";
    const sortOrderField = sortOrder ? sortOrder.toString() : "desc";

    // Parse filters from query
    const filterFieldArray =
      filter?.toString().split(",").filter(Boolean) || [];
    const filterConditions = filterFieldArray.map((item: string) => {
      const [key, value] = item.split(":");
      switch (key) {
        case "country":
          return { country: { contains: value, mode: "insensitive" } };
        case "state":
          return { state: { contains: value, mode: "insensitive" } };
        default:
          return {};
      }
    });

    const [buyers, totalBuyersCount] = await prisma.$transaction([
      prisma.buyer.findMany({
        where: {
          OR: [
            {
              user: {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                email: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
          ],
          AND: filterConditions,
        },
        skip,
        take,
        orderBy: {
          [sortByField]: sortOrderField,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
              country: true,
              state: true,
              address: true,
            },
          },
        },
      }),
      prisma.buyer.count({
        where: {
          OR: [
            {
              user: {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                email: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
          ],
          AND: filterConditions,
        },
      }),
    ]);

    res.json({
      buyers,
      page,
      size,
      total: totalBuyersCount,
      totalPages: Math.ceil(totalBuyersCount / size),
    });
  } catch (error) {
    console.error("Get all buyers error:", error);
    res.status(500).json({ error: "Failed to fetch buyers" });
  }
};

export const getApproval = async (req: any, res: Response) => {
  try {
    const sellerId = req.user.sellerId; // Assuming sellerId is sent in the request body

    const seller = await prisma.seller.findFirst({
      where: { id: sellerId },
      include: {
        Approved: true,
      },
    });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const lockInfo = {
      isLocked: seller.lock,
      lockedAt: seller.lockedAt,
    };

    seller.profileCompletion = seller.profileCompletion || [];

    if (
      ![1, 2, 3, 4, 5, 6, 7].every((num) =>
        seller.profileCompletion.includes(num)
      )
    ) {
      return res.status(400).json({
        message: "Profile is not complete. Please complete all required steps.",
        profileCompletion: seller.profileCompletion,
      });
    }

    if (seller.approvalRequested) {
      if (seller.ApprovedId) {
        const approvalStatus = await prisma.approved.findUnique({
          where: {
            id: seller.ApprovedId,
          },
        });

        if (approvalStatus) {
          return res.status(200).json({
            message:
              approvalStatus.status === true
                ? "Approved"
                : "Approval request is rejected, Please change the details and request again",
            approvalStatus: approvalStatus.status,
            lastUpdatedAt: approvalStatus.updatedAt,
            approvalRequested: seller.approvalRequested,
            approvalRequestedAt: seller.approvalReqestAt,
            isApproved: approvalStatus.status || false,
          });
        } else {
          return res.status(404).json({
            message: "Approval status not found",
            approvalRequested: seller.approvalRequested,
            approvalRequestedAt: seller.approvalReqestAt,
            isApproved: false,
          });
        }
      }

      return res.status(200).json({
        message: "Approval requested, waiting for admin approval",
        approvalRequested: seller.approvalRequested,
        approvalRequestedAt: seller.approvalReqestAt,
        isApproved: false,
        lockInfo,
      });
    }
    if (seller.approvalRequested === false) {
      // Seller is not approved yet
      if (seller.profileCompletion.includes(7)) {
        return res.status(200).json({
          message: "Seller is not approved yet, but profile is complete",
          approvalStatus: false,
          approvalRequestedAt: seller.approvalReqestAt,
          isApproved: false,
        });
      }
    }

    return res.status(200).json({
      message: "Seller is not approved yet",
      approvalStatus: false,
      approvalRequested: seller.approvalRequested,
      approvalRequestedAt: seller.approvalReqestAt,
      isApproved: false,
    });
  } catch (error) {
    console.error("Get approval error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const requestApproval = async (req: any, res: Response) => {
  try {
    const sellerId = req.user.sellerId; // Assuming sellerId is sent in the request body
    const seller = await prisma.seller.findFirst({
      where: { id: sellerId },
      include: {
        Approved: true,
      },
    });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.Approved) {
      return res
        .status(400)
        .json({ message: "Already requested for approval" });
    }

    const currentCompletion = seller.profileCompletion || [];
    if (!currentCompletion.find((step) => step === 7)) {
      currentCompletion.push(7);
    }
    // Create a new approval request

    const reqApproval = await prisma.seller.update({
      where: {
        id: sellerId,
      },
      data: {
        approvalRequested: true,
        approvalReqestAt: new Date(Date.now()),
        profileCompletion: currentCompletion,
        lock: true, // Lock the profile to prevent further edits
        lockedAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      },
      select: {
        id: true,
        approvalRequested: true,
        approvalReqestAt: true,
        profileCompletion: true,
      },
    });

    // Check if we have valid data to mark this step as complete

    return res.status(200).json({
      message: "Approval request submitted successfully",
      approval: reqApproval,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBusinessOverview = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: {
        businessName: true,
        businessDescription: true,
        businessAddress: true,
        websiteLink: true,
        businessTypes: true,
        businessCategories: true,
        businessLogo: true,
        yearFounded: true,
        teamSize: true,
        annualRevenue: true,
        languagesSpoken: true,
        businessAttributes: true,
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json(seller);
  } catch (error) {
    console.error("Get business overview error:", error);
    res.status(500).json({ error: "Failed to get business overview" });
  }
};

export const updateBusinessOverview = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const {
      businessName,
      businessDescription,
      businessAddress,
      websiteLink,
      businessTypes,
      businessCategories,
      yearFounded,
      teamSize,
      annualRevenue,
      languagesSpoken,
      businessAttributes,
      role,
    } = req.body;

    // Handle logo upload if present
    let businessLogo = undefined;
    if (req.file) {
      const cloudinaryResult: any = await uploadToCloudinary(
        req.file.buffer,
        "business-logos"
      );
      businessLogo = cloudinaryResult.secure_url;
    }

    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: { id: true, profileCompletion: true },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Check if we have valid data to mark this step as complete
    const hasRequiredData =
      businessName &&
      businessDescription &&
      businessAddress &&
      websiteLink &&
      businessTypes?.length > 0 &&
      businessCategories?.length > 0 &&
      yearFounded &&
      teamSize &&
      annualRevenue;

    const currentCompletion = seller.profileCompletion || [];
    const newCompletion = hasRequiredData
      ? [...new Set([...currentCompletion, 4])]
      : currentCompletion.filter((step) => step !== 4);

    // Update user role if provided
    if (role) {
      await prisma.user.update({
        where: { id: userId },
        data: { role },
      });
    }

    const updatedSeller = await prisma.seller.update({
      where: { userId },
      data: {
        businessName,
        businessDescription,
        businessAddress,
        websiteLink,
        businessTypes,
        businessCategories,
        ...(businessLogo && { businessLogo }),
        yearFounded,
        teamSize,
        annualRevenue,
        languagesSpoken,
        businessAttributes,
        profileCompletion: newCompletion,
      },
    });

    res.json(updatedSeller);
  } catch (error) {
    console.error("Update business overview error:", error);
    res.status(500).json({ error: "Failed to update business overview" });
  }
};

// Capabilities & Operations - Step 5
export const getCapabilitiesOperations = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: {
        servicesProvided: true,
        minimumOrderQuantity: true,
        lowMoqFlexibility: true,
        productionModel: true,
        productionCountries: true,
        providesSamples: true,
        sampleDispatchTime: true,
        productionTimeline: true,
        factoryImages: true,
      },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json(seller);
  } catch (error) {
    console.error("Get capabilities & operations error:", error);
    res.status(500).json({ error: "Failed to get capabilities & operations" });
  }
};

export const updateCapabilitiesOperations = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const {
      servicesProvided,
      minimumOrderQuantity,
      lowMoqFlexibility,
      productionModel,
      productionCountries,
      providesSamples,
      sampleDispatchTime,
      productionTimeline,
    } = req.body;

    // Handle factory images upload if present
    let factoryImages = undefined;
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file: any) =>
        uploadToCloudinary(file.buffer, "factory-images")
      );
      const uploadResults = await Promise.all(uploadPromises);
      factoryImages = uploadResults.map((result: any) => result.secure_url);
    }

    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: { id: true, profileCompletion: true, factoryImages: true },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Check if we have valid data to mark this step as complete
    const hasRequiredData =
      servicesProvided?.length > 0 && minimumOrderQuantity && productionModel;

    const currentCompletion = seller.profileCompletion || [];
    const newCompletion = hasRequiredData
      ? [...new Set([...currentCompletion, 4])]
      : currentCompletion.filter((step) => step !== 4);

    // Merge existing factory images with new ones if any
    const updatedFactoryImages = factoryImages
      ? [...(seller.factoryImages || []), ...factoryImages].slice(0, 5) // Limit to 5 images
      : seller.factoryImages;

    const updatedSeller = await prisma.seller.update({
      where: { userId },
      data: {
        servicesProvided,
        minimumOrderQuantity,
        lowMoqFlexibility,
        productionModel,
        productionCountries,
        providesSamples,
        sampleDispatchTime,
        productionTimeline,
        ...(factoryImages && { factoryImages: updatedFactoryImages }),
        profileCompletion: newCompletion,
      },
    });

    res.json(updatedSeller);
  } catch (error) {
    console.error("Update capabilities & operations error:", error);
    res
      .status(500)
      .json({ error: "Failed to update capabilities & operations" });
  }
};

// Compliance & Credentials - Step 6
export const getComplianceCredentials = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: {
        businessRegistration: true,
        certificates: true,
        certificationTypes: true,
        notableClients: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
          },
        },
      },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const data = {
      businessRegistration: seller.businessRegistration || [],
      certifications: seller.certificates || [],
      certificationTypes: seller.certificationTypes || [],
      notableClients: seller.notableClients || [],
    };

    res.json(data);
  } catch (error) {
    console.error("Get compliance & credentials error:", error);
    res.status(500).json({ error: "Failed to get compliance & credentials" });
  }
};

export const updateComplianceCredentials = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const {
      businessRegistration,
      certifications,
      clientLogos,
      otherCertSelected,
      certificationTypes,
      notableClients,
      otherCertifications,
    } = req.body;

    // Handle file uploads
    const uploads: Record<string, string> = {};

    const seller = await prisma.seller.findUnique({
      where: { userId },
      include: {
        notableClients: true,
      },
    });

    // {
    //   "businessRegistration": null,
    //     "certifications": [],
    //     "certificationTypes": [],
    //     "notableClients": "sdfs",
    //     "clientLogos": [],
    //     "otherCertSelected": false,
    //       "otherCertifications": ""
    // }

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const newSeller = {
      id: seller?.id,
      businessRegistration: businessRegistration || [],
      certifications: certifications || [],
      certificationTypes: certificationTypes || [],
      notableClients: notableClients || [],
      clientLogos: clientLogos || [],
    };

    // Check if we have valid data to mark this step as complete
    const hasRequiredData =
      businessRegistration.length > 0 ||
      (seller.bussinessRegistration ?? []).length > 0;

    const currentCompletion = seller.profileCompletion || [];
    const newCompletion = hasRequiredData
      ? [...new Set([...currentCompletion, 5])]
      : currentCompletion.filter((step) => step !== 5);

    // Merge existing certifications and logos with new ones if any
    // Merge existing certifications and new ones, removing duplicates
    const updatedCertifications = certifications
      ? Array.from(new Set([...(seller.certificates || []), ...certifications]))
      : seller.certificates;

    // Separate notableClients into new (no id) and existing (with id)
    const newClients = notableClients.filter((client: any) => !client.id);
    const existingClients = notableClients.filter((client: any) => client.id);
    const deletedClients = seller.notableClients.filter(
      (client: any) => !notableClients.some((c: any) => c.id === client.id)
    );

    console.log("New Clients:", newClients);
    console.log("Existing Clients:", existingClients);
    console.log("Deleted Clients:", deletedClients);

    // Delete notable clients that are no longer present
    if (deletedClients.length > 0) {
      await prisma.client.deleteMany({
        where: {
          id: {
            in: deletedClients.map((client: any) => client.id),
          },
        },
      });
    }

    // Update existing notable clients if changed
    for (const client of existingClients) {
      const dbClient = seller.notableClients.find(
        (c: any) => c.id === client.id
      );
      if (
        dbClient &&
        (dbClient.name !== client.name ||
          dbClient.logo !== client.logo ||
          dbClient.description !== client.description)
      ) {
        await prisma.client.update({
          where: { id: client.id },
          data: {
            name: client.name,
            logo: client.logo,
            description: client.description,
          },
        });
      }
    }

    const updatedSeller = await prisma.seller.update({
      where: { userId },
      data: {
        businessRegistration: businessRegistration,
        certificates: updatedCertifications.filter(
          (cert) => typeof cert === "string"
        ),
        certificationTypes,
        profileCompletion: newCompletion,
        // Only create new notable clients
        notableClients: {
          create: newClients.map((client: any) => ({
            name: client.name,
            logo: client.logo,
            description: client.description,
          })),
        },
      },
      select: {
        businessRegistration: true,
        certificates: true,
        certificationTypes: true,
        notableClients: true,
      },
    });

    res.json(updatedSeller);
  } catch (error) {
    console.error("Update compliance & credentials error:", error);
    res
      .status(500)
      .json({ error: "Failed to update compliance & credentials" });
  }
};

// Brand Presence - Step 7
export const getBrandPresence = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: {
        projectImages: true,
        brandVideo: true,
        socialMediaLinks: true,
        additionalNotes: true,
      },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json(seller);
  } catch (error) {
    console.error("Get brand presence error:", error);
    res.status(500).json({ error: "Failed to get brand presence" });
  }
};

export const updateBrandPresence = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { socialMediaLinks, additionalNotes, projectImages, brandVideo } =
      req.body;

    // Handle file uploads
    const uploads: Record<string, any> = {};

    // {
    //   {
    //     "projectImages": ["https://res.cloudinary.com/dtggaphek/image/upload/v1748689128/product-images/q6yg9nzs5mjugocrvmc1.jpg"],
    //       "brandVideo": null,
    //         "socialMediaLinks": "{\"instagram\":\"\",\"linkedin\":\"\",\"website\":\"\"}",
    //       "additionalNotes": null
    //   }
    // }

    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: {
        id: true,
        profileCompletion: true,
        projectImages: true,
      },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Check if we have valid data to mark this step as complete
    const existingImages = seller.projectImages || [];
    const newImages = projectImages || [];
    const hasRequiredData = existingImages.length + newImages.length >= 2;

    const currentCompletion = seller.profileCompletion || [];
    const newCompletion = hasRequiredData
      ? [...new Set([...currentCompletion, 6])]
      : currentCompletion.filter((step) => step !== 6);

    const updatedSeller = await prisma.seller.update({
      where: { userId },
      data: {
        projectImages: projectImages,
        brandVideo: brandVideo,
        socialMediaLinks,
        additionalNotes,
        profileCompletion: newCompletion,
      },
      select: {
        projectImages: true,
        brandVideo: true,
        socialMediaLinks: true,
        additionalNotes: true,
      },
    });

    res.json(updatedSeller);
  } catch (error) {
    console.error("Update brand presence error:", error);
    res.status(500).json({ error: "Failed to update brand presence" });
  }
};

// Final Review & Submit - Step 8
export const getProfileSummary = async (req: any, res: Response) => {
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
      },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const data = {
      ...seller,
      certifications: seller.certificates || [],
    };

    res.json(data);
  } catch (error) {
    console.error("Get profile summary error:", error);
    res.status(500).json({ error: "Failed to get profile summary" });
  }
};

// Delete factory image
export const deleteFactoryImage = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: { factoryImages: true },
    });

    if (!seller || !seller.factoryImages) {
      return res.status(404).json({ error: "Seller or images not found" });
    }

    const updatedImages = seller.factoryImages.filter(
      (url) => url !== imageUrl
    );

    await prisma.seller.update({
      where: { userId },
      data: { factoryImages: updatedImages },
    });

    res.json({ success: true, factoryImages: updatedImages });
  } catch (error) {
    console.error("Delete factory image error:", error);
    res.status(500).json({ error: "Failed to delete factory image" });
  }
};

// Delete project image
export const deleteProjectImage = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: { projectImages: true, profileCompletion: true },
    });

    if (!seller || !seller.projectImages) {
      return res.status(404).json({ error: "Seller or images not found" });
    }

    const updatedImages = seller.projectImages.filter(
      (url) => url !== imageUrl
    );

    // Check if we still meet the minimum requirement of 2 images
    const currentCompletion = seller.profileCompletion || [];
    const newCompletion =
      updatedImages.length >= 2
        ? currentCompletion
        : currentCompletion.filter((step) => step !== 7);

    await prisma.seller.update({
      where: { userId },
      data: {
        projectImages: updatedImages,
        profileCompletion: newCompletion,
      },
    });

    res.json({ success: true, projectImages: updatedImages });
  } catch (error) {
    console.error("Delete project image error:", error);
    res.status(500).json({ error: "Failed to delete project image" });
  }
};

// Get step name by number
export const getStepName = (stepNumber: number): string => {
  switch (stepNumber) {
    case 4:
      return "Business Overview";
    case 5:
      return "Capabilities & Operations";
    case 6:
      return "Compliance & Credentials";
    case 7:
      return "Brand Presence";
    case 8:
      return "Final Review & Submit";
    default:
      return `Step ${stepNumber}`;
  }
};

// Helper function to get pending step names
export const getPendingStepNames = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: { profileCompletion: true },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Calculate which steps are remaining
    const allSteps = [4, 5, 6, 7, 8]; // New step numbers
    const completedSteps = seller.profileCompletion || [];
    const remainingSteps = allSteps.filter(
      (step) => !completedSteps.includes(step)
    );

    // Map step numbers to names
    const pendingStepNames = remainingSteps.map((step) => getStepName(step));

    res.json(pendingStepNames);
  } catch (error) {
    console.error("Get pending step names error:", error);
    res.status(500).json({ error: "Failed to get pending step names" });
  }
};

// --- Profile Strength API ---
export const getProfileStrength = async (req: any, res: Response) => {
  try {
    const { userId } = req.user;
    const seller = await prisma.seller.findUnique({
      where: { userId },
      select: { profileCompletion: true },
    });

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Step mapping (should match frontend)
    const stepMap = [
      { number: 1, name: "Company Details" },
      { number: 2, name: "Personal Information" },
      { number: 3, name: "Describe your brand" },
      { number: 4, name: "Certifications" },
      { number: 5, name: "Add details" },
    ];
    const totalSteps = stepMap.length;
    const completedSteps = seller.profileCompletion || [];
    const completedStepNames = stepMap
      .filter((step) => completedSteps.includes(step.number))
      .map((step) => step.name);
    const missingSteps = stepMap
      .filter((step) => !completedSteps.includes(step.number))
      .map((step) => step.number);
    const missingStepNames = stepMap
      .filter((step) => !completedSteps.includes(step.number))
      .map((step) => step.name);
    const percentage = Math.round((completedSteps.length / totalSteps) * 100);

    res.json({
      percentage,
      completedSteps,
      completedStepNames,
      missingSteps,
      missingStepNames,
      totalSteps,
      steps: stepMap,
    });
  } catch (error) {
    console.error("Get profile strength error:", error);
    res.status(500).json({ error: "Failed to get profile strength" });
  }
};
