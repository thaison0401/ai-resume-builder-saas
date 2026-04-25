import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import GetSubscriptionButton from "./GetSubscriptionButton";
import { formatDate } from "date-fns";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let subscription = null;
  let priceInfo = null;
  let stripeFetchFailed = false;

  // 1. Lấy thông tin gói cước từ DB
  try {
    subscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.error("Error retrieving subscription from DB:", error);
  }

  // 2. Nếu có gói cước, lấy thông tin giá từ Stripe
  if (subscription) {
    try {
      priceInfo = await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      });
    } catch (error) {
      console.error("Error retrieving price info from Stripe:", error);
      stripeFetchFailed = true; // Đánh dấu lỗi Stripe
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p>
        Your current plan:{" "}
        <span className="font-bold">
          {/* Cập nhật logic hiển thị an toàn */}
          {stripeFetchFailed
            ? "Unknown (Error loading from Stripe)"
            : priceInfo &&
                typeof priceInfo.product !== "string" &&
                !("deleted" in priceInfo.product && priceInfo.product.deleted)
              ? priceInfo.product.name
              : "Free"}
        </span>
      </p>
      {subscription ? (
        <>
          {subscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              Your subscription will be canceled on{" "}
              {formatDate(subscription.stripeCurrentPeriodEnd, "MMM dd, yyyy")}
            </p>
          )}
          <ManageSubscriptionButton />
        </>
      ) : (
        <GetSubscriptionButton />
      )}
    </main>
  );
}
