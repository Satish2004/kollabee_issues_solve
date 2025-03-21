import type { Request, Response } from "express";
import prisma from "../db";

enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

// Create Product
export const createProduct = async (req: any, res: Response) => {
  try {
    if (!req.user?.sellerId) {
      return res.status(401).json({ error: "Only sellers can list items" });
    }

    const {
      name,
      price,
      discount,
      deliveryCost,
      wholesalePrice,
      minOrderQuantity,
      availableQuantity,
      description,
      categoryId,
      images,
      pickupAddress,
      isDraft,
      attributes = {},
    } = req.body;

    // Create pickup address if provided
    let addressId = null;
    if (pickupAddress) {
      const address = await prisma.pickupAddress.create({
        data: pickupAddress,
      });
      addressId = address.id;
    }

    // Create the product with attributes as JSON
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        discount: parseFloat(discount),
        deliveryCost: parseFloat(deliveryCost),
        wholesalePrice: Number(wholesalePrice),
        minOrderQuantity: Number(minOrderQuantity),
        availableQuantity: Number(availableQuantity),
        images,
        sellerId: req.user.sellerId,
        pickupAddressId: addressId,
        categoryId,
        isDraft: isDraft,
        attributes: attributes, // Store attributes directly as JSON
      },
      include: {
        seller: true,
        pickupAddress: true,
      },
    });

    res.status(201).json({ data: product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// Get Products
export const getProducts = async (req: any, res: Response) => {
  try {
    const {
      status,
      search,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const filters: any = {
      ...(req.user?.sellerId && { sellerId: req.user.sellerId }),
    };

    if (search) {
      filters.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (status) {
      filters.isDraft = status === "DRAFT";
    }

    if (categoryId) filters.categoryId = categoryId;
    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        orderBy: { [(sortBy as string) || "createdAt"]: sortOrder },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          seller: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where: filters }),
    ]);

    // No need to transform attributes as they're already in JSON format
    res.json({
      data: products,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Update Product
export const updateProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user?.sellerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        sellerId: req.user.sellerId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const {
      name,
      description,
      price,
      wholesalePrice,
      minOrderQuantity,
      availableQuantity,
      images,
      categoryId,
      attributes = {},
    } = req.body;

    // Update product with attributes as JSON
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        wholesalePrice: Number(wholesalePrice),
        minOrderQuantity: Number(minOrderQuantity),
        availableQuantity: Number(availableQuantity),
        images,
        categoryId,
        attributes: attributes, // Update attributes directly as JSON
      },
      include: {
        seller: true,
        pickupAddress: true,
      },
    });

    res.json({ data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// Delete Product
export const deleteProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user?.sellerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        sellerId: req.user.sellerId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete the product (no need to delete attributes separately)
    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// Get Product By ID
export const getProductById = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get more products by same seller
    const productsBySeller = await prisma.product.findMany({
      where: {
        sellerId: product.sellerId,
        id: { not: productId },
      },
      include: {
        seller: true,
      },
      take: 4,
    });

    res.json({
      product,
      relatedProducts: productsBySeller,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// Get Search Suggestions
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.json({ data: [] });
    }

    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
        // status: "ACTIVE"
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
      take: 5,
    });

    res.json({ data: suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
};

export const buyProduct = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId } = req.params;

    // Update product and create order in a transaction
    await prisma.$transaction(async (tx: any) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { seller: true },
      });

      if (!product || product.availableQuantity <= 0) {
        throw new Error("Product is not available");
      }

      await tx.product.update({
        where: { id: productId },
        data: { availableQuantity: product.availableQuantity - 1 },
      });

      await tx.order.create({
        data: {
          buyerId: req.user.buyerId,
          sellerIds: [product.sellerId],
          status: "PENDING",
          total: product.price,
          items: {
            create: {
              productId: product.id,
              quantity: 1,
              price: product.price,
            },
          },
        },
      });
    });

    res.json({ success: true, message: "Product purchased successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to purchase product" });
  }
};

// export const getProductById = async (req: any, res: Response) => {
//   try {
//     const { productId } = req.params;
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//       include: {
//         seller: {
//           include: {
//             user: true,
//           },
//         },
//       },
//     });

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Get more products by same seller
//     const productsBySeller = await prisma.product.findMany({
//       where: {
//         sellerId: product.sellerId,
//         id: { not: productId },
//       },
//       include: {
//         seller: true,
//       },
//       take: 4,
//     });

//     res.json({ product, relatedProducts: productsBySeller });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch product" });
//   }
// };

// Add other product-related controllers
