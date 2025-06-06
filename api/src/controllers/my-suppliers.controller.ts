import prisma from "../db";
import type { Request, Response } from "express";

// Example query using your existing schema
async function getInteractedSuppliers(buyerId: string) {
    // Get suppliers from conversations
    const conversationSuppliers = await prisma.conversationParticipant.findMany({
        where: {
            userId: buyerId,
            conversation: {
                participants: {
                    some: {
                        user: {
                            role: 'SELLER'
                        }
                    }
                }
            }
        },
        include: {
            conversation: {
                include: {
                    participants: {
                        include: {
                            user: {
                                include: {
                                    seller: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Get suppliers from orders
    const orderSuppliers = await prisma.order.findMany({
        where: {
            buyerId: buyerId,
            sellerId: { not: null }
        },
        include: {
            seller: {
                include: {
                    user: true
                }
            }
        }
    });

    // Get suppliers from inquiries
    const inquirySuppliers = await prisma.inquiry.findMany({
        where: {
            buyerId: buyerId
        },
        include: {
            supplier: {
                include: {
                    user: true
                }
            }
        }
    });

    // Get suppliers from requests
    const requestSuppliers = await prisma.request.findMany({
        where: {
            buyerId: buyerId
        },
        include: {
            seller: {
                include: {
                    user: true
                }
            }
        }
    });

    const wishlistSuppliers = prisma.wishlist.findUnique({
        where: { buyerId },
        include: {
            items: {
                include: {
                    product: {
                        include: {
                            seller: {
                                include: { user: true }
                            },
                            // thumbnail: true
                        }
                    }
                }
            }
        }
    })


    // Combine and deduplicate results
    const allSuppliers = [
        ...conversationSuppliers.flatMap(c =>
            c.conversation.participants
                .filter(p => p.user.role === 'SELLER')
                .map(p => p.user.seller)
        ),
        ...orderSuppliers.map(o => o.seller),
        ...inquirySuppliers.map(i => i.supplier),
        ...requestSuppliers.map(r => r.seller)
    ];



    return allSuppliers;
}



export const getMySuppliers = async (req: any, res: Response) => {
    try {
        const { userId } = req.user;

        // Fetch interacted suppliers for the buyer
        const suppliers = await getInteractedSuppliers(userId);

        // if (!suppliers || suppliers.length === 0) {
        //     return res.status(404).json({ message: "No suppliers found", suppliers });
        // }

        res.json(suppliers.length);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}