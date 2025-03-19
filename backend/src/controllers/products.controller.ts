import { Request, Response } from 'express';
import prisma from '../db';

enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

// Create Product
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
      categoryId, // Changed from categoryName
      images,
      pickupAddress,
      isDraft
    } = req.body;

    // Create pickup address if provided
    let addressId = null;
    if (pickupAddress) {
      const address = await prisma.pickupAddress.create({
        data: pickupAddress
      });
      addressId = address.id;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        wholesalePrice: Number(wholesalePrice),
        minOrderQuantity: Number(minOrderQuantity),
        availableQuantity: Number(availableQuantity),
        images,
        sellerId: req.user.sellerId,
        pickupAddressId: addressId,
        categoryId,
        isDraft: isDraft
      },
      include: {
        seller: true,
        pickupAddress: true
      }
    });

    res.status(201).json({ data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
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
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    

    const filters: any = {
      ...(req.user?.sellerId && { sellerId: req.user.sellerId })
    };

    // Remove status filter since it's not in schema
    // Add isDraft filter instead
    // filters.isDraft = status === 'DRAFT';

    if (search) {
      filters.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (status) {
      filters.isDraft = status === 'DRAFT';
    }

    if(minOrderQuantity) {
      filters.minOrderQuantity = {
        gte: Number(minOrderQuantity)
      }
    }

    if (categoryId) filters.categoryId = categoryId;
    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) })
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        orderBy: { [(sortBy as string) || 'createdAt']: sortOrder },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          seller: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }),
      prisma.product.count({ where: filters })
    ]);
console.log(products,"products");
    res.json({
      data: products,
      timestamp: Date.now(),
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Update Product
export const updateProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user?.sellerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await prisma.product.findFirst({
      where: { 
        id,
        sellerId: req.user.sellerId
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        wholesalePrice: Number(req.body.wholesalePrice),
        minOrderQuantity: Number(req.body.minOrderQuantity),
        availableQuantity: Number(req.body.availableQuantity),
        images: req.body.images,
        categoryId: req.body.categoryId,
      },
      include: {
        seller: true,
        pickupAddress: true
      }
    });

    res.json({ data: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Update Product Status
// export const updateProductStatus = async (req: any, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body as any;

//     const product = await prisma.product.findFirst({
//       where: {
//         id,
//         sellerId: req.user.sellerId
//       }
//     });

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     if (status === ProductStatus.ACTIVE) {
//       const requiredFields = [
//         'name', 
//         'description', 
//         'price', 
//         'wholesalePrice',
//         'minOrderQuantity',
//         'availableQuantity',
//         'categoryId'
//       ];

//       const missingFields = requiredFields.filter(
//         field => !product[field as keyof typeof product]
//       );
      
//       if (missingFields.length > 0) {
//         return res.status(400).json({
//           message: 'Cannot publish product with missing required fields',
//           missingFields
//         });
//       }
//     }

//     const updatedProduct = await prisma.product.update({
//       where: { id },
//       data: {
//         isDraft: status === 'DRAFT',
//          status
//       },
//       include: {
//         seller: true,
//         pickupAddress: true
//       }
//     });

//     res.json({ data: updatedProduct });
//   } catch (error) {
//     console.error('Error updating product status:', error);
//     res.status(500).json({ message: 'Failed to update product status' });
//   }
// };

// Delete Product
export const deleteProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user?.sellerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const product = await prisma.product.findFirst({
      where: { 
        id,
        sellerId: req.user.sellerId
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Get Search Suggestions
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.json({ data: [] });
    }

    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ],
        // status: "ACTIVE"
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true
      },
      take: 5
    });

    res.json({ data: suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
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

// Add other product-related controllers 