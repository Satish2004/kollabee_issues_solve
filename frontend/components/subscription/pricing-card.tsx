"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PricingTier {
  name: string;
  id: string;
  price: string;
  description: string;
  features: string[];
}

interface PricingCardProps {
  tier: PricingTier;
}

export function PricingCard({ tier }: PricingCardProps) {
  const handlePayment = async () => {
    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(tier.price),
          type: tier.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      const { orderId } = data;
      const options = {
        key_id: process.env.NEXT_PUBLIC_NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: tier.price,
        currency: "USD",
        name: "Subscription Payment",
        description: `Payment for ${tier.name} services`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/subscription/callback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ response }),
            });
            const result = await verifyRes.json();

            if (verifyRes.ok) {
              toast.success("Payment Successful!");
              console.log("Payment Successful:", result);
            } else {
              toast.error("Payment Verification Failed");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Verification Failed");
          }
        },
        prefill: {
          name: "Suraj Kumar Pandey",
          email: "example@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // const rzp = new window.Razorpay(options);
      // rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Something went wrong during payment.");
    }
  };

  return (
    <Card
      className={cn(
        "flex flex-col",
        tier.id === "pro" && "border-primary shadow-lg scale-105"
      )}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">${tier.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={tier.id === "pro" ? "default" : "outline"}
          onClick={handlePayment}
        >
          Subscribe Now
        </Button>
      </CardFooter>
    </Card>
  );
}
