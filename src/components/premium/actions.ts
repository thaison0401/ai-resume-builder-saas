"use server";

import { currentUser } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import { env } from "@/env";

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const allowedPriceIds = [
    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
  ];

  if (!allowedPriceIds.includes(priceId)) {
    throw new Error("Invalid price ID");
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/resumes`,
    customer_email:
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress,
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}
