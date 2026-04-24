import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import GetSubscriptionButton from "./GetSubscriptionButton";
import { formatDate } from "date-fns";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import { redirect } from "next/navigation"; // Thêm import này

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function Page() {
  const { userId } = await auth();

  // 1. Sửa lỗi render trang trắng
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Wrap try/catch xung quanh Prisma và Stripe calls
  let subscription = null;
  let priceInfo = null;

  try {
    subscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (subscription) {
      priceInfo = await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      });
    }
  } catch (error) {
    console.error("Error retrieving billing info:", error);
    // Vẫn để trang tiếp tục render, nhưng coi như không có gói cước
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p>
        Your current plan:{" "}
        <span className="font-bold">
          {/* 3. Xử lý an toàn loại bỏ ép kiểu và kiểm tra product bị xoá */}
          {priceInfo &&
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
