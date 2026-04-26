import { cache } from "react";
import prisma from "./prisma";
import { env } from "@/env";

export type SubscriptionLevel = "free" | "pro" | "pro_plus";

// Hàm helper dùng chung để ánh xạ PriceId thành tên gói
export function getPlanTypeFromPriceId(priceId: string): SubscriptionLevel {
  if (priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY) {
    return "pro_plus";
  }
  if (priceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY) {
    return "pro";
  }
  return "free";
}

export const getUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel> => {
    const subscription = await prisma.userSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
      return "free";
    }

    // Sử dụng hàm helper dùng chung
    const plan = getPlanTypeFromPriceId(subscription.stripePriceId);

    if (plan === "free") {
      console.error("Unknown Stripe price id in user subscription");
    }

    return plan;
  },
);
