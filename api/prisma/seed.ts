import prisma from "../src/db"
import { hash } from 'bcryptjs';
import { CategoryEnum,  OrderStatus, RequestStatus, RequestType, StockStatus } from '@prisma/client';


async function main() {
  try {
    // Clean existing data
    await cleanDatabase();

    // Create users with different roles
    const adminUser = await createAdminUser();
    const seller = await createSeller();
    const buyer = await createBuyer();

    // Create categories
    const categories = await createCategories();

    // Create products for seller
    const products = await createProducts(seller.id, categories);

    // Create orders
    const orders = await createOrders(buyer.id, seller.id, products);
    if (orders && orders.length > 0) {
      await createShippingAddresses(orders[0].id);
    }
    await createOrderReviews(buyer.id, products[0].id);

    // Create buyer-specific data
    await createWishlist(buyer.id, products);
    await createCart(buyer.id, products);
    await createInquiries(buyer.id, seller.id);

    // Create seller-specific data
    await createBankDetails(seller.userId);
    await createAdvertisements(seller.id, products[0].id);
    await createPickupAddresses(seller.id);
    await createRequests(buyer.id, seller.id);
    await createCertifications(seller.id, products[0].id);

    // Create notifications
    await createNotifications(buyer.userId);
    await createNotifications(seller.userId);

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

async function cleanDatabase() {
  // Delete in reverse order of dependencies
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.bankDetail.deleteMany({});
  await prisma.request.deleteMany({});
  await prisma.buyer.deleteMany({});
  await prisma.seller.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
}

async function createAdminUser() {
  const hashedPassword = await hash('admin123', 10);
  return prisma.user.create({
    data: {
      email: 'admin@kollabee.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      admin: {
        create: {}
      }
    }
  });
}

async function createSeller() {
  const hashedPassword = await hash('seller123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'seller@test.com',
      name: 'Test Seller',
      password: hashedPassword,
      role: 'SELLER',
      companyName: 'Test Company',
      companyWebsite: 'https://testcompany.com',
      phoneNumber: '+919876543210',
      country: 'India',
      state: 'Maharashtra'
    }
  });

  return prisma.seller.create({
    data: {
      userId: user.id,
      businessName: 'Test Business',
      businessAddress: 'Test Address',
      websiteLink: 'https://testbusiness.com',
      businessCategories: ['FASHION_APPAREL_ACCESSORIES'],
      businessTypes: ['MANUFACTURER'],
      yearEstablished: 2020,
      employeeCount: 50,
      rating: 4.5,
      country: 'India',
      state: 'Maharashtra'
    }
  });
}

async function createBuyer() {
  const hashedPassword = await hash('buyer123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'buyer@test.com',
      name: 'Test Buyer',
      password: hashedPassword,
      role: 'BUYER',
      companyName: 'Buyer Company',
      phoneNumber: '+919876543211',
      country: 'India'
    }
  });

  return prisma.buyer.create({
    data: {
      userId: user.id,
      preferences: {
        categories: ['FASHION_APPAREL_ACCESSORIES'],
        priceRange: { min: 100, max: 1000 }
      }
    }
  });
}

async function createCategories() {
  return Promise.all([
    prisma.category.create({
      data: { categoryName: "BEAUTY_COSMETICS" }
    }),

  ]);
}

async function createProducts(sellerId: string, categories: any[]) {
  return Promise.all([
    prisma.product.create({
      data: {
        name: 'Cotton T-Shirt',
        description: 'High quality cotton t-shirt',
        price: 500,
        wholesalePrice: 400,
        minOrderQuantity: 100,
        availableQuantity: 1000,
        images: ['https://example.com/tshirt.jpg'],
        sellerId,
        categoryId: categories[0].id,
        stockStatus: 'IN_STOCK'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Denim Jeans',
        description: 'Premium denim jeans',
        price: 1200,
        wholesalePrice: 900,
        minOrderQuantity: 50,
        availableQuantity: 500,
        images: ['https://example.com/jeans.jpg'],
        sellerId,
        categoryId: categories[0].id,
        stockStatus: 'IN_STOCK'
      }
    })
  ]);
}

async function createOrders(buyerId: string, sellerId: string, products: any[]) {
  const order = await prisma.order.create({
    data: {
      buyerId,
      sellerId,
      status: 'PENDING',
      totalAmount: 5000,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 10,
            price: products[0].price
          }
        ]
      }
    }
  });
  return [order]; // Return as array
}

async function createBankDetails(userId: string) {
  return prisma.bankDetail.create({
    data: {
      userId,
      holderName: 'Test Account',
      fullName: 'Test User Full Name',
      accountNumber: '1234567890',
      bankName: 'Test Bank',
      bankType: 'SAVINGS',
      cvCode: 'TEST0001234',
      zipCode: '400001'
    }
  });
}

async function createRequests(buyerId: string, sellerId: string) {
  return prisma.request.create({
    data: {
      buyerId,
      sellerId,
      productName: 'Custom T-Shirt',
      category: 'FASHION_APPAREL_ACCESSORIES',
      quantity: 1000,
      targetPrice: 400,
      country: 'India',
      status: 'PENDING',
      requestType: 'PRODUCT'
    }
  });
}



async function createWishlist(buyerId: string, products: any[]) {
  return prisma.wishlist.create({
    data: {
      buyerId,
      items: {
        create: products.map(product => ({
          productId: product.id
        }))
      }
    }
  });
}

async function createCart(buyerId: string, products: any[]) {
  return prisma.cart.create({
    data: {
      buyerId,
      items: {
        create: products.map(product => ({
          productId: product.id,
          quantity: 1
        }))
      }
    }
  });
}

async function createInquiries(buyerId: string, sellerId: string) {
  return prisma.inquiry.create({
    data: {
      buyerId,
      supplierId: sellerId,
      message: "Interested in bulk order",
      status: "PENDING"
    }
  });
}

async function createAdvertisements(sellerId: string, productId: string) {
  return prisma.advertisement.create({
    data: {
      sellerId,
      productId,
      budget: 5000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      targetAudience: ["FASHION_RETAILERS"],
      adType: "PRODUCT_PROMOTION",
      status: "ACTIVE",
      metrics: {
        create: {
          date: new Date(),
          impressions: 100,
          clicks: 10,
          conversions: 2,
          spend: 1000
        }
      }
    }
  });
}

async function createPickupAddresses(sellerId: string) {
  return prisma.pickupAddress.create({
    data: {
      fullName: "John Doe",
      businessName: "Test Business",
      street: "123 Warehouse Street",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      postalCode: "400001",
      phone: "+919876543210",
      email: "john@example.com"
    }
  });
}

async function createShippingAddresses(orderId: string) {
  return prisma.shippingAddress.create({
    data: {
      orderId,
      fullName: "John Doe",
      address: "123 Main St",
      email: "john@example.com",
      phoneNumber: "+919876543210",
      country: "India",
      state: "Maharashtra",
      zipCode: "400001"
    }
  });
}

async function createOrderReviews(buyerId: string, productId: string) {
  return prisma.review.create({
    data: {
      buyerId,
      productId,
      rating: 5,
      comment: "Excellent product quality!"
    }
  });
}

async function createCertifications(sellerId: string, productId: string) {
  return prisma.certification.create({
    data: {
      name: "ISO 9001",
      description: "ISO 9001 is a standard for quality management systems",
      image: "https://example.com/iso9001.jpg",
      issueDate: new Date(),
      productId,
      suppliers: {
        connect: { id: sellerId }
      }
    }
  });
}

async function createNotifications(userId: string) {
  return prisma.notification.create({
    data: {
      userId,
      message: "Thank you for joining our platform!",
      read: false,
      type: "WELCOME"
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 