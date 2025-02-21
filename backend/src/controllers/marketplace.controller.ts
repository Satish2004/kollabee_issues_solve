import { Request, Response } from 'express';
import prisma from '../db';

export const getProducts = async (req: any, res: Response) => {
  try {
    const { 
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const where = {
      isDraft: false,
      stockStatus: 'IN_STOCK',
      ...(search && {
        OR: [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ]
      }),
      ...(category && { categoryId: category }),
      ...(minPrice && { price: { gte: parseFloat(minPrice as string) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice as string) } })
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              businessName: true,
              rating: true,
              location: true
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
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / Number(limit)),
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          include: {
            user: {
              select: {
                name: true,
                imageUrl: true
              }
            },
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true
              },
              where: {
                isDraft: false,
                stockStatus: 'IN_STOCK'
              },
              take: 4
            }
          }
        },
        reviews: {
          include: {
            buyer: {
              include: {
                user: {
                  select: {
                    name: true,
                    imageUrl: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        productAttributes: true,
        productCertificates: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product details error:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
};

export const getSimilarProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { categoryId: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const similarProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        isDraft: false,
        stockStatus: 'IN_STOCK',
        NOT: { id }
      },
      include: {
        seller: {
          select: {
            businessName: true,
            rating: true
          }
        }
      },
      take: 8
    });

    res.json(similarProducts);
  } catch (error) {
    console.error('Get similar products error:', error);
    res.status(500).json({ error: 'Failed to fetch similar products' });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        categoryName: true,
        _count: {
          select: {
            buyers: true // or any other valid relationship defined in your schema
          }
        }
      }
    });

    // Get product count for each category separately
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category:any) => {
        const productCount = await prisma.product.count({
          where: {
            categoryId: category.id
          }
        });

        return {
          ...category,
          productCount
        };
      })
    );

    res.json(categoriesWithCounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true, sellerId: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        OR: [
          { categoryId: product.categoryId },
          { sellerId: product.sellerId }
        ],
        NOT: {
          id: productId
        }
      },
      include: {
        seller: {
          include: {
            user: {
              select: {
                name: true,
                companyName: true
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
      take: 4
    });

    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch related products' });
  }
}; 