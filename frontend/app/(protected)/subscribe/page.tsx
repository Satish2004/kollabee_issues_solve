import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PricingCard } from "@/components/subscription/pricing-card";
import { subscriptionTiers } from "@/constants/subscription";
import SubscriptionHistory from "./component/SubscriptionHistory";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default async function SubscribePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userData = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!userData) {
    redirect("/login");
  }

  const txn = await prisma.subscriptionTransaction.findMany({
    where: {
      userId: userData.id,
      isCompleted: true,
    },
  });

  const activeSubscription = txn.find(
    (transaction) =>
      transaction.subscriptionExpiry &&
      new Date(transaction.subscriptionExpiry) > new Date()
  );

  const tier = subscriptionTiers.find(
    (tier) => tier.name === activeSubscription?.type
  );

  return (
    <div className="flex flex-col items-center py-10 px-4 md:px-6">
      {activeSubscription ? (
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tighter">
            Congratulations, you&apos;re subscribed!
          </h1>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            You have an active {activeSubscription.type} subscription.
          </p>

          <Card
            className={cn(
              "flex flex-col",
              tier?.id === "pro" && "border-primary shadow-lg scale-20"
            )}
          >
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {tier?.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 mt-4">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <SubscriptionHistory transactions={txn} />
        </div>
      ) : (
        <>
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold tracking-tighter">
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Select the perfect plan for your needs. Upgrade or downgrade at
              any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full">
            {subscriptionTiers.map((tier) => (
              <PricingCard key={tier.id} tier={tier} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
