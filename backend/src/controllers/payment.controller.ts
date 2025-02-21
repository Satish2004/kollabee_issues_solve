import { Request, Response } from 'express';
import prisma from '../db';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!
});

export const createCheckoutSession = async (req: any, res: Response) => {
  try {
    if (!req.user?.buyerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { amount, products, currency, prices, sellerIds } = req.body;

    if (currency.length !== 3) {
      return res.status(400).json({ error: 'Invalid currency format' });
    }

    const rzpOrder = await razorpay.orders.create({
      currency: currency,
      amount: amount * 100, // Convert to paise
      receipt: `receipt_${Date.now()}`,
      notes: {
        productIds: products.map((product: any) => product.id).join(","),
      },
    });

    // Create order in database
    const order = await prisma.order.create({
      data: {
        buyerId: req.user.buyerId,
        status: 'PENDING',
        totalAmount: Number(amount),
        razorpayOrderId: rzpOrder.id,
        items: {
          createMany: {
            data: products.map((item: any) => ({
              productId: item.id,
              sellerId: item.sellerId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      }
    });

    res.json({ order: rzpOrder, dbOrder: order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const handlePaymentCallback = async (req: any, res: Response) => {
  try {
    const { 
      response: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      formData 
    } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const existingOrder = await prisma.order.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id
      }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { 
        id: existingOrder.id
      },
      data: {
        status: 'PROCESSING',
        razorpayPaymentId: razorpay_payment_id
      }
    });

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({ error: 'Failed to process payment callback' });
  }
};

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
      zipCode
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
        userId: req.user.userId
      },
    });

    res.json(bankDetail);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bank detail' });
  }
};

export const createPaymentOrder = async (req: any, res: Response) => {
  try {
    const { buyerId } = req.user;
    const { orderId, amount } = req.body;

    // Verify order belongs to buyer
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to smallest currency unit
      currency: 'INR',
      receipt: orderId,
      payment_capture: true
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayOrderId: razorpayOrder.id
      }
    });

    res.json({
      orderId: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { 
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature 
    } = req.body;

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET!)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // First find the order
    const existingOrder = await prisma.order.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id
      }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Then update using the order's id
    const order = await prisma.order.update({
      where: {
        id: existingOrder.id // Use the order's id instead of razorpayOrderId
      },
      data: {
        status: 'PROCESSING',
        razorpayPaymentId: razorpay_payment_id
      }
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const getPaymentDetails = async (req: any, res: Response) => {
  try {
    const { orderId } = req.params;
    const { buyerId } = req.user;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        createdAt: true
      }
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