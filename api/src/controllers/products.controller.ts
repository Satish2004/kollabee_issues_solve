import type { Request, Response } from "express";
import prisma from "../db";
import { Resend } from "resend";
import { ProductProvider } from "../providers/product.provider";
import { CATEGORY_OPTIONS } from "../config/data";
import { CategoryEnum } from "@prisma/client";


const admin = ["pandeyyysuraj@gmail.com", "saibunty1@gmail.com","tejasgk.collab@gmail.com"];
const resend = new Resend(process.env.RESEND_API_KEY);

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
      documents,
      deliveryCost,
      wholesalePrice,
      minOrderQuantity,
      availableQuantity,
      description,
      categoryId,
      images,
      thumbnail,
      pickupAddress,
      categoryIds,
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
        productCategories: categoryIds || [],
        categoryId,
        isDraft: true, //coz all products will be draft until approved by admin
        attributes: attributes, // Store attributes directly as JSON
        thumbnail: thumbnail,
        documents: documents,
      },
      include: {
        seller: {
          include: {
            user: true, // Correctly include the user relation
          },
        },
        pickupAddress: true,
      },
    });

    // Send the approval request email to all admins
    await Promise.all(
      admin.map(async (adminEmail) => {
        const approvalLink = `${process.env.FRONTEND_URL}/admin/approve/${product.id
          }?email=${encodeURIComponent(adminEmail)}`;
        await resend.emails.send({
          from: "hello@tejasgk.com",
          to: adminEmail,
          subject: "New Product Approval Request",
          html: `
            <p>A new product has been created and requires your approval.</p>
            <p><strong>Product Name:</strong> ${product.name}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Discount:</strong> ${product.discount}%</p>
            <p><strong>Delivery Cost:</strong> $${product.deliveryCost}</p>
            <p><strong>Wholesale Price:</strong> $${product.wholesalePrice}</p>
            <p><strong>Minimum Order Quantity:</strong> ${product.minOrderQuantity
            }</p>
            <p><strong>Available Quantity:</strong> ${product.availableQuantity
            }</p>
            <p><strong>Category ID:</strong> ${product.categoryId}</p>
            <p><strong>Pickup Address ID:</strong> ${product.pickupAddressId || "N/A"
            }</p>
            <p><strong>Attributes:</strong> ${JSON.stringify(
              product.attributes,
              null,
              2
            )}</p>
            <p><strong>Seller:</strong> ${product.seller.user.name} (${product.seller.user.email
            })</p>
            <p><a href="${approvalLink}">Click here to approve or reject the product</a></p>
          `,
        });
      })
    );

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
      minOrderQuantity,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
      tag,
      category
    } = req.query;


    const filters: any = {
      ...(req.user?.sellerId
        ? { sellerId: req.user.sellerId }
        : { isDraft: false }),
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

    if (minOrderQuantity) {
      filters.minOrderQuantity = {
        gte: Number(minOrderQuantity),
      };
    }

    // if (categoryId) filters.categoryId = categoryId;
    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      };
    }

    if (category) {
      filters.productCategories = {
        has: category,
      };
    }

    // Only include products from active suppliers
    const supplierFilter = {
      seller: {
        user: {
          isActive: true,
        },
      },
    };

    if (tag && tag !== "all") {
      const limitNum = Number(limit) || 10;
      const days = req.query.days ? Number(req.query.days) : undefined;
      console.log("Tag filter applied:", tag, "with limit:", limitNum, "and days:", days);
      switch (tag.toLowerCase()) {
        case 'trending':
          const trendingProducts = await ProductProvider.getTrendingProducts(limitNum, days);
          return res.json({
            data: ProductProvider.enhanceProducts(trendingProducts),
            meta: {
              total: trendingProducts.length,
              page: 1,
              limit: limitNum,
              totalPages: 1,
            }
          });
        case 'most-popular':
          const popularProducts = await ProductProvider.getPopularProducts(limitNum);
          return res.json({
            data: ProductProvider.enhanceProducts(popularProducts),
            meta: {
              total: popularProducts.length,
              page: 1,
              limit: limitNum,
              totalPages: 1,
            }
          });
        case 'hot-selling':
          const hotProducts = await ProductProvider.getHotSellingProducts(limitNum, days);
          return res.json({
            data: ProductProvider.enhanceProducts(hotProducts),
            meta: {
              total: hotProducts.length,
              page: 1,
              limit: limitNum,
              totalPages: 1,
            }
          });

        default:
          break;
      }
      console.log("Tag filter applied:", tag);
    }


    console.log("filters", filters);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          ...filters,
          ...(filters.sellerId ? {} : supplierFilter),
        },
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
      prisma.product.count({
        where: {
          ...filters,
          ...supplierFilter,
        },
      }),
    ]);

    res.json({
      data: products,
      timestamp: Date.now(),
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
      attributes = {},
      thumbnail,
      documents,
      discount,
      deliveryCost,
      categoryIds, // Use categoryIds instead of categoryId
    } = req.body;

    // Check if images, documents, or categories are being updated
    const isApprovalRequired =
      (images?.length &&
        images.some((img: string) => !product.images.includes(img))) ||
      (documents?.length &&
        documents.some((doc: string) => !product.documents.includes(doc))) ||
      (categoryIds?.length &&
        JSON.stringify(categoryIds) !== JSON.stringify(product.productCategories));

    console.log("isApprovalRequired", isApprovalRequired);

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
        attributes: attributes, // Update attributes directly as JSON
        thumbnail,
        productCategories: categoryIds || [], // Use productCategories field
        documents,
        discount: parseFloat(discount),
        deliveryCost: parseFloat(deliveryCost),
        // ...(isApprovalRequired && { isDraft: true }),
      },
      include: {
        seller: {
          include: {
            user: true,
          },
        },
        pickupAddress: true,
      },
    });

    if (isApprovalRequired) {
      await Promise.all(
        admin.map(async (adminEmail) => {
          const approvalLink = `${process.env.FRONTEND_URL}/admin/approve/${updatedProduct.id}?email=${encodeURIComponent(adminEmail)}`;

          // Get category names for display
          const categoryNames = (categoryIds || product.productCategories)
            .map((id: string) => {
              const category = CATEGORY_OPTIONS.find(c => c.value === id);
              return category ? category.label : id;
            })
            .join(", ");

          await resend.emails.send({
            from: "hello@tejasgk.com",
            to: adminEmail,
            subject: "Product Update Approval Request",
            html: `
              <p>A product has been updated and requires your approval.</p>
              <p><strong>Product Name:</strong> ${updatedProduct.name}</p>
              <p><strong>Description:</strong> ${updatedProduct.description}</p>
              <p><strong>Price:</strong> $${updatedProduct.price}</p>
              <p><strong>Discount:</strong> ${updatedProduct.discount}%</p>
              <p><strong>Delivery Cost:</strong> $${updatedProduct.deliveryCost}</p>
              <p><strong>Wholesale Price:</strong> $${updatedProduct.wholesalePrice}</p>
              <p><strong>Minimum Order Quantity:</strong> ${updatedProduct.minOrderQuantity}</p>
              <p><strong>Available Quantity:</strong> ${updatedProduct.availableQuantity}</p>
              <p><strong>Categories:</strong> ${categoryNames}</p>
              <p><strong>Pickup Address ID:</strong> ${updatedProduct.pickupAddressId || "N/A"}</p>
              <p><strong>Attributes:</strong> ${JSON.stringify(updatedProduct.attributes, null, 2)}</p>
              <p><strong>Seller:</strong> ${updatedProduct.seller.user.name} (${updatedProduct.seller.user.email})</p>
              <p><a href="${approvalLink}">Click here to approve or reject the product</a></p>
            `,
          });
        })
      );
    }

    res.json({ data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

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

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

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

export const approveOrRejectProduct = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    const { action } = req.body; // "approve" or "reject"

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (action === "approve") {
      await prisma.product.update({
        where: { id: productId },
        data: { isDraft: false },
      });
      return res.json({ message: "Product approved successfully" });
    } else if (action === "reject") {
      await prisma.product.update({
        where: { id: productId },
        data: { isDraft: true },
      });
      return res.json({ message: "Product rejected and deleted successfully" });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Error approving/rejecting product:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};


export const getRecommendedProducts = async (req: Request, res: Response) => {
  try {
    const userId = "13f8a2d5-8360-4cff-80be-cf641688bda1"
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50); // Add max limit

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Step 1: Get user's purchase history
    const userOrders = await prisma.order.findMany({
      where: {
        buyerId: userId,
        status: 'DELIVERED',
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: {
                  include: {
                    user: {
                      select: {
                        isActive: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // If no purchase history, fall back to popular products
    if (userOrders.length === 0) {
      const popularProducts = await getPopularProducts(limit);
      return res.json({
        data: popularProducts,
        message: 'Popular products recommended'
      });
    }

    // Step 2: Extract purchased product categories and IDs
    const purchasedCategories: CategoryEnum[] = [];
    const purchasedProductIds: string[] = [];

    userOrders.forEach(order => {
      order.items.forEach(item => {
        purchasedProductIds.push(item.productId);
        if (item.product.productCategories) {
          purchasedCategories.push(...item.product.productCategories);
        }
      });
    });

    // Get unique categories
    const uniqueCategories = [...new Set(purchasedCategories)];

    // Step 3: Get similar products
    const similarProducts = await prisma.product.findMany({
      where: {
        productCategories: {
          hasSome: uniqueCategories,
        },
        id: {
          notIn: purchasedProductIds,
        },
        isDraft: false,
        seller: {
          user: {
            isActive: true,
          },
        },
      },
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
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: [
        {
          rating: 'desc'
        }
      ],
      take: limit,
    });

    // If not enough similar products, supplement with popular products
    if (similarProducts.length < limit) {
      const remaining = limit - similarProducts.length;
      const popularProducts = await getPopularProducts(remaining);
      similarProducts.push(...popularProducts);
    }

    res.json({
      data: similarProducts.map(product => ({
        ...product,
        averageRating: product.reviews.length > 0 ?
          product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length : 0
      })),
      message: 'Recommended products based on your purchases'
    });

  } catch (error) {
    console.error('Error fetching recommended products:', error);
    res.status(500).json({
      message: 'Failed to fetch recommendations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

async function getPopularProducts(limit: number) {
  return await prisma.product.findMany({
    where: {
      isDraft: false,
      seller: {
        user: {
          isActive: true,
        },
      },
    },
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
      reviews: {
        select: {
          rating: true
        }
      }
    },
    orderBy: [
      {
        createdAt: 'desc'
      },
      {
        rating: 'desc'
      }
    ],
    take: limit,
  });
}

export const getRecommendedSuppliers = async (req: Request, res: Response) => {
  // console.log("Fetching recommended suppliers...", req.user);
  try {
    const userId = "13f8a2d5-8360-4cff-80be-cf641688bda1"

    const limit = Math.min(parseInt(req.query.limit as string) || 5, 20); // Add max limit

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const purchasedSuppliers = await prisma.order.findMany({
      where: {
        buyerId: userId,
        status: { in: ['DELIVERED'] },
      },
      distinct: ['sellerId'],
      select: {
        seller: {
          select: {
            id: true,
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
    });

    const supplierIds = purchasedSuppliers
      .filter(order => order.seller !== null)
      .map(order => order.seller ? order.seller.id : null)
      .filter((id): id is string => id !== null);

    // If no purchase history, get top-rated suppliers
    if (supplierIds.length === 0) {
      const topSuppliers = await prisma.seller.findMany({
        where: {
          user: {
            isActive: true,
          },
        },
        orderBy: {
          rating: 'desc',
        },
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          products: {
            take: 3,
            where: {
              isDraft: false,
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
        },
      });

      return res.json({
        data: topSuppliers,
        message: 'Top-rated suppliers recommended'
      });
    }

    // Get supplier details
    const recommendedSuppliers = await prisma.seller.findMany({
      where: {
        id: {
          in: supplierIds,
        },
        user: {
          isActive: true,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        products: {
          take: 3,
          where: {
            isDraft: false,
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });

    // Sort by rating (descending)
    recommendedSuppliers.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    res.json({
      data: recommendedSuppliers,
      message: 'Suppliers you purchased from before'
    });

  } catch (error) {
    console.error('Error fetching recommended suppliers:', error);
    res.status(500).json({
      message: 'Failed to fetch supplier recommendations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};