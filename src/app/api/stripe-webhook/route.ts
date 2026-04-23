import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );

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
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response("Event received", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error("User ID is missing in session metadata");
  }

  (await clerkClient()).users.updateUserMetadata(userId, {
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
    const currentItem = subscription.items.data[0];

    // Cast qua unknown trước để tránh dùng any
    const itemWithPeriod = currentItem as unknown as {
      current_period_end?: number;
    };
    const subscriptionWithPeriod = subscription as unknown as {
      current_period_end?: number;
    };

    const currentPeriodEnd =
      itemWithPeriod.current_period_end ??
      subscriptionWithPeriod.current_period_end;

    const cancelAtPeriodEnd = subscription.cancel_at_period_end;

    if (!currentPeriodEnd) {
      throw new Error("Cannot determine subscription period end date");
    }

    await prisma.userSubscription.upsert({
      where: { userId: subscription.metadata.userId },
      create: {
        userId: subscription.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: currentItem.price.id,
        stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
        stripeCancelAtPeriodEnd: cancelAtPeriodEnd,
      },
      update: {
        stripePriceId: currentItem.price.id,
        stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
        stripeCancelAtPeriodEnd: cancelAtPeriodEnd,
      },
    });
  } else {
    await prisma.userSubscription.deleteMany({
      where: { stripeCustomerId: subscription.customer as string },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.userSubscription.deleteMany({
    where: {
      stripeCustomerId: subscription.customer as string,
    },
  });
}
