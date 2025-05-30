"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../src/db"));
const bcryptjs_1 = require("bcryptjs");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Clean existing data
            yield cleanDatabase();
            // Create users with different roles
            const adminUser = yield createAdminUser();
            const seller = yield createSeller();
            const buyer = yield createBuyer();
            // Create categories
            const categories = yield createCategories();
            // Create products for seller
            const products = yield createProducts(seller.id, categories);
            // Create orders
            const orders = yield createOrders(buyer.id, seller.id, products);
            if (orders && orders.length > 0) {
                yield createShippingAddresses(orders[0].id);
            }
            yield createOrderReviews(buyer.id, products[0].id);
            // Create buyer-specific data
            yield createWishlist(buyer.id, products);
            yield createCart(buyer.id, products);
            yield createInquiries(buyer.id, seller.id);
            // Create seller-specific data
            yield createBankDetails(seller.userId);
            yield createAdvertisements(seller.id, products[0].id);
            yield createPickupAddresses(seller.id);
            yield createRequests(buyer.id, seller.id);
            yield createCertifications(seller.id, products[0].id);
            // Create notifications
            yield createNotifications(buyer.userId);
            yield createNotifications(seller.userId);
            console.log('Seed data created successfully');
        }
        catch (error) {
            console.error('Error seeding data:', error);
            throw error;
        }
    });
}
function cleanDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // Delete in reverse order of dependencies
        yield db_1.default.orderItem.deleteMany({});
        yield db_1.default.order.deleteMany({});
        yield db_1.default.product.deleteMany({});
        yield db_1.default.bankDetail.deleteMany({});
        yield db_1.default.request.deleteMany({});
        yield db_1.default.buyer.deleteMany({});
        yield db_1.default.seller.deleteMany({});
        yield db_1.default.user.deleteMany({});
        yield db_1.default.category.deleteMany({});
    });
}
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield (0, bcryptjs_1.hash)('admin123', 10);
        return db_1.default.user.create({
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
    });
}
function createSeller() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield (0, bcryptjs_1.hash)('seller123', 10);
        const user = yield db_1.default.user.create({
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
        return db_1.default.seller.create({
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
    });
}
function createBuyer() {
    return __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = yield (0, bcryptjs_1.hash)('buyer123', 10);
        const user = yield db_1.default.user.create({
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
        return db_1.default.buyer.create({
            data: {
                userId: user.id,
                preferences: {
                    categories: ['FASHION_APPAREL_ACCESSORIES'],
                    priceRange: { min: 100, max: 1000 }
                }
            }
        });
    });
}
function createCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all([
            db_1.default.category.create({
                data: { categoryName: "BEAUTY_COSMETICS" }
            }),
        ]);
    });
}
function createProducts(sellerId, categories) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all([
            db_1.default.product.create({
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
            db_1.default.product.create({
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
    });
}
function createOrders(buyerId, sellerId, products) {
    return __awaiter(this, void 0, void 0, function* () {
        const order = yield db_1.default.order.create({
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
    });
}
function createBankDetails(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.bankDetail.create({
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
    });
}
function createRequests(buyerId, sellerId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.request.create({
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
    });
}
function createWishlist(buyerId, products) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.wishlist.create({
            data: {
                buyerId,
                items: {
                    create: products.map(product => ({
                        productId: product.id
                    }))
                }
            }
        });
    });
}
function createCart(buyerId, products) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.cart.create({
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
    });
}
function createInquiries(buyerId, sellerId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.inquiry.create({
            data: {
                buyerId,
                supplierId: sellerId,
                message: "Interested in bulk order",
                status: "PENDING"
            }
        });
    });
}
function createAdvertisements(sellerId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.advertisement.create({
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
    });
}
function createPickupAddresses(sellerId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.pickupAddress.create({
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
    });
}
function createShippingAddresses(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.shippingAddress.create({
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
    });
}
function createOrderReviews(buyerId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.review.create({
            data: {
                buyerId,
                productId,
                rating: 5,
                comment: "Excellent product quality!"
            }
        });
    });
}
function createCertifications(sellerId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.certification.create({
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
    });
}
function createNotifications(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.notification.create({
            data: {
                userId,
                message: "Thank you for joining our platform!",
                read: false,
                type: "WELCOME"
            }
        });
    });
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.$disconnect();
}));
