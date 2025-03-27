"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { OrderSummary } from "./order-summary";
import { Button } from "@/components/ui/button";
import { useCheckout } from "../../../../../../contexts/checkout-context";
import { toast } from "sonner";
import { paymentApi } from "@/lib/api/payment";
import { authApi } from "@/lib/api/auth";
import { cartApi } from "@/lib/api/cart";
import { useAuth } from "@/contexts/auth-context";

// Load Stripe.js asynchronously
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentProps {
  onNext: () => void;
}

// Stripe Payment Form Component
const StripePaymentForm = ({ onSubmit, isLoading }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not ready. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("Error creating payment method:", error);
      toast.error("Payment failed: " + error.message);
      return;
    }

    // Call the onSubmit prop to handle the payment
    onSubmit(paymentMethod.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Card Details</h3>
        <div className="space-y-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="p-3 border border-gray-300 rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-4 button-bg text-white hover:text-neutral-200 py-3 rounded-md flex items-center justify-center font-semibold"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export function Payment({ onNext }: PaymentProps) {
  const {
    products,
    setProducts,
    orderSummary,
    submitOrder,
    isLoading,
    orderId,
    setOrderId,
  } = useCheckout();
  const [orderComplete, setOrderComplete] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const response: any = await authApi.getCurrentUser();
      setUser(response);
    };
    fetchUser();
  }, []);

  const handlePayment = async (paymentMethodId: string) => {
    try {
      // Call your backend to create a checkout session
      const response = await paymentApi.createCheckoutSession({
        amount: orderSummary.subtotal, // Convert to cents
        products: products.map((p) => ({
          id: p.productId,
          sellerId: p.product.sellerId,
          quantity: p.quantity,
          price: p.product.price,
        })),
        currency: "usd",
        customerName: user?.name,
        customerAddress: {
          line1: "123 Main St",
          line2: "Apt 4B",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "IN",
        },
      });

      const { clientSecret, order } = await response;

      if (!clientSecret) {
        throw new Error("Failed to create checkout session");
      }

      // Confirm the payment on the client side
      const stripe = await stripePromise;
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethodId,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Handle payment confirmation
      await fetch("/api/handle-payment-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
        }),
      });

      onNext();
      setOrderId(order.id);
      cartApi.clearCart();
      setProducts([]);
      toast.success("Payment successful!");
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white px-6 pb-6 rounded-lg">
        <h2 className="text-2xl font-[900] mb-6">Payment</h2>
        <Elements stripe={stripePromise}>
          <StripePaymentForm onSubmit={handlePayment} isLoading={isLoading} />
        </Elements>
      </div>

      <div>
        <OrderSummary buttonText="Complete Order" />
      </div>
    </div>
  );
}
