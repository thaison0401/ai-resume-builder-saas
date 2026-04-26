"use server";

import { currentUser } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import { env } from "@/env";
import { getPlanTypeFromPriceId } from "@/lib/subscription"; // Import helper

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as
    | string
    | undefined;

  const allowedPriceIds = [
    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
  ];

  if (!allowedPriceIds.includes(priceId)) {
    throw new Error("Invalid price ID");
  }

  // Xác định gói cước người dùng vừa chọn bằng hàm dùng chung (Đã refactor)
  const planType = getPlanTypeFromPriceId(priceId);

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    locale: "vi", // Ép Stripe hiển thị tiếng Việt
    // Cập nhật success_url: Gắn thêm query parameter plan tương ứng
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success?plan=${planType}`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId
      ? undefined
      : (user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress),
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
