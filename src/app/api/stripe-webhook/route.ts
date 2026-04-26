import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Invalid signature", { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object.id);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in session metadata");
  }

  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  });
}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  if (
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "past_due"
  ) {
    let userId = subscription.metadata.userId;
    // Khai báo biến ở ngoài cùng để tái sử dụng, tránh gọi DB 2 lần
    let existingSubscription = null;

    // Fallback: tìm userId qua customerId nếu metadata thiếu (DÙNG findUnique)
    if (!userId) {
      existingSubscription = await prisma.userSubscription.findUnique({
        where: { stripeCustomerId: subscription.customer as string },
      });
      if (existingSubscription) userId = existingSubscription.userId;
    }

    if (!userId) {
      console.error("CRITICAL ERROR: Cannot find userId for subscription", {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
      });
      return;
    }

    let currentPeriodEnd = subscription.items.data[0]?.current_period_end;
    let isFallbackUsed = false;

    if (!currentPeriodEnd) {
      // Dùng ??= để chỉ gọi DB nếu biến existingSubscription đang rỗng
      existingSubscription ??= await prisma.userSubscription.findUnique({
        where: { userId },
      });
      if (existingSubscription) {
        currentPeriodEnd = Math.floor(
          existingSubscription.stripeCurrentPeriodEnd.getTime() / 1000,
        );
        isFallbackUsed = true;
      }
    }

    if (!currentPeriodEnd) {
      console.error("Cannot determine period end, skipping update", {
        subscriptionId: subscription.id,
      });
      return;
    }

    const cancelAtPeriodEnd = subscription.cancel_at_period_end;

    const updateData = {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCancelAtPeriodEnd: cancelAtPeriodEnd,
      ...(!isFallbackUsed && {
        stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
      }),
    };

    await prisma.userSubscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
        stripeCancelAtPeriodEnd: cancelAtPeriodEnd,
      },
      update: updateData,
    });

    revalidatePath("/billing");
  } else {
    await prisma.userSubscription.deleteMany({
      where: { stripeCustomerId: subscription.customer as string },
    });

    revalidatePath("/billing");
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
  });

  revalidatePath("/billing");
}
