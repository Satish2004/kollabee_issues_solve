import { Request, Response } from 'express';
import prisma from '../db';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const createCheckoutSession = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, products, currency, customerAddress, customerName } = req.body;

    if (currency.length !== 3) {
      return res.status(400).json({ error: 'Invalid currency format' });
    }

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to smallest currency unit
      description: "Payment for products",
      shipping: {
        name: customerName,
        address: {
          line1: customerAddress.line1,
          line2: customerAddress.line2,
          city: customerAddress.city,
          state: customerAddress.state,
          postal_code: customerAddress.postalCode,
          country: customerAddress.country,
        },
      },
      currency: currency.toLowerCase(),
      metadata: {
        productIds: products.map((product: any) => product.id).join(','),
        buyerId: req.user.buyerId,
      },
    });

    // Create order in the database
    const order = await prisma.order.create({
      data: {
        buyerId: req.user.buyerId,
        status: 'PENDING',
        totalAmount: Number(amount),
        stripePaymentIntentId: paymentIntent.id,
        items: {
          createMany: {
            data: products.map((item: any) => ({
              productId: item.id,
              sellerId: item.sellerId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      },
    });


    res.json({ clientSecret: paymentIntent.client_secret, order });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// export const handlePaymentCallback = async (req: any, res: Response) => {
//   try {
//     const { 
//       response: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
//       formData 
//     } = req.body;

//     if (!razorpay_order_id) {
//       return res.status(400).json({ error: 'Invalid request' });
//     }

//     const existingOrder = await prisma.order.findFirst({
//       where: {
//         razorpayOrderId: razorpay_order_id
//       }
//     });

//     if (!existingOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // Update order status
//     const updatedOrder = await prisma.order.update({
//       where: { 
//         id: existingOrder.id
//       },
//       data: {
//         status: 'PROCESSING',
//         razorpayPaymentId: razorpay_payment_id
//       }
//     });

//     res.json({ success: true, order: updatedOrder });
//   } catch (error) {
//     console.error('Payment callback error:', error);
//     res.status(500).json({ error: 'Failed to process payment callback' });
//   }
// };

export const getBankDetails = async (req: any, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bankDetails = await prisma.bankDetail.findMany({
      where: { userId: req.user.userId },
    });

    res.json(bankDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bank details' });
  }
};

export const addBankDetail = async (req: any, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      fullName,
      accountHolder,
      bankName,
      bankType,
      accountNumber,
      cvCode,
      upiId,
      zipCode,
      country
    } = req.body;

    const bankDetail = await prisma.bankDetail.create({
      data: {
        fullName,
        holderName: accountHolder,
        bankName,
        bankType,
        accountNumber,
        cvCode,
        upiId: upiId || "",
        zipCode,
        userId: req.user.userId,
        country: country || "IN", // Default to India if not provided
      },
    });

    res.json(bankDetail);
  } catch (error) {
    console.error('Add bank detail error:', error);
    res.status(500).json({ error: 'Failed to add bank detail' });
  }
};

// export const createPaymentOrder = async (req: any, res: Response) => {
//   try {
//     const { buyerId } = req.user;
//     const { orderId, amount } = req.body;

//     // Verify order belongs to buyer
//     const order = await prisma.order.findFirst({
//       where: {
//         id: orderId,
//         buyerId
//       }
//     });

//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     const razorpayOrder = await razorpay.orders.create({
//       amount: amount * 100, // Convert to smallest currency unit
//       currency: 'INR',
//       receipt: orderId,
//       payment_capture: true
//     });

//     await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         razorpayOrderId: razorpayOrder.id
//       }
//     });

//     res.json({
//       orderId: razorpayOrder.id,
//       currency: razorpayOrder.currency,
//       amount: razorpayOrder.amount
//     });
//   } catch (error) {
//     console.error('Create payment order error:', error);
//     res.status(500).json({ error: 'Failed to create payment order' });
//   }
// };

export const handlePaymentConfirmation = async (req: any, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Retrieve the PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not succeeded' });
    }

    // Find the order in the database
    const existingOrder = await prisma.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntentId,
      },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: existingOrder.id,
      },
      data: {
        status: 'PROCESSING',
        stripePaymentId: paymentIntent.id,
      },
    });

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

export const getPaymentDetails = async (req: any, res: Response) => {
  try {
    const { orderId } = req.params;
    const { buyerId } = req.user;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId,
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        stripePaymentIntentId: true,
        stripePaymentId: true,
        createdAt: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ error: 'Failed to get payment details' });
  }
};

export const updateBankDetails = async (req: any, res: Response) => {
  try {
    const { bankId, ...bankDetails } = req.body;
    const updatedBank = await prisma.bankDetail.update({
      where: { id: bankId },
      data: bankDetails
    });

    res.json(updatedBank);
  } catch (error) {
    console.error('Update bank details error:', error);
    res.status(500).json({ error: 'Failed to update bank details' });
  }
}; 

export const createPaymentIntent = async (req: any, res: Response) => {
  const { amount, currency, paymentMethodId, productIds, userId } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        currency,
        status: "pending",
        userId,
        productIds,
      },
    })

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        transactionId: transaction.id,
        userId,
        productIds: JSON.stringify(productIds),
      },
    })

    res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret, orderId: transaction.id })
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};