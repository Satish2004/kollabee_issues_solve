import { Request, Response } from 'express';
import prisma from '../db';

export const getProducts = async (req: any, res: Response) => {
  try {
    const { 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      priceRange,
      category,
      search,
      minQuantity,
      maxQuantity,
      sellerId,
      page = 1,
      limit = 10
    } = req.query;

    const whereConditions: any = {
      availableQuantity: { gt: 0 }
    };

    // Search by name or description
    if (search) {
      whereConditions.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = (priceRange as string).split(',').map(Number);
      whereConditions.price = { 
        gte: min || undefined,
        lte: max || undefined
      };
    }

    // Category filter
    if (category && category !== 'ALL') {
      whereConditions.categoryId = category;
    }

    // Quantity range filter
    if (minQuantity || maxQuantity) {
      whereConditions.availableQuantity = {
        gte: Number(minQuantity) || undefined,
        lte: Number(maxQuantity) || undefined
      };
    }

    // Filter by seller
    if (sellerId) {
      whereConditions.sellerId = sellerId;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where: whereConditions });

    // Get products with filters and pagination
    const products = await prisma.product.findMany({
      where: whereConditions,
      include: {
        seller: {
          include: {
            user: {
              select: {
                name: true,
                companyName: true,
                imageUrl: true
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: Number(limit)
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product:any) => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / product.reviews.length
        : null
    }));

    res.json({
      products: productsWithRating,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit)),
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req: any, res: Response) => {
  try {
    if (!req.user?.sellerId) {
      return res.status(401).json({ error: 'Only sellers can list items' });
    }

    const {
      name,
      price,
      wholesalePrice,
      minOrderQuantity,
      availableQuantity,
      description,
      categoryName,
      images,
      pickupAddress
    } = req.body;

    const category = await prisma.category.create({
      data: {
        categoryName: categoryName as any
      }
    });

    // Create pickup address
    const address = await prisma.pickupAddress.create({
      data: {
        ...pickupAddress
      }
    });

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        wholesalePrice,
        minOrderQuantity,
        availableQuantity,
        images,
        sellerId: req.user.sellerId,
        pickupAddressId: address.id,
        categoryId: category.id
      },
    });

    res.json(product);
  } catch (error) {
    console.log(error,"error");
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;

    if (!req.user?.sellerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.sellerId !== req.user.sellerId) {
      return res.status(403).json({ error: 'Not authorized to delete this product' });
    }

    await prisma.product.delete({
      where: { id: productId }
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const buyProduct = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { productId } = req.params;

    // Update product and create order in a transaction
    await prisma.$transaction(async (tx: any) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { seller: true }
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
              price: product.price
            }
          }
        },
      });
    });

    res.json({ success: true, message: 'Product purchased successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to purchase product' });
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
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get more products by same seller
    const productsBySeller = await prisma.product.findMany({
      where: { 
        sellerId: product.sellerId,
        id: { not: productId }
      },
      include: {
        seller: true,
      },
      take: 4
    });

    res.json({ product, relatedProducts: productsBySeller });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const { productId } = req.params;
    if (!req.user?.sellerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.sellerId !== req.user.sellerId) {
      return res.status(403).json({ error: 'Not authorized to update this product' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        wholesalePrice: req.body.wholesalePrice,
        minOrderQuantity: req.body.minOrderQuantity,
        availableQuantity: req.body.availableQuantity,
        images: req.body.images,
        categoryId: req.body.categoryId
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.json([]);
    }

    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        name: true,
        id: true
      },
      take: 5
    });

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
};




// Add other product-related controllers 