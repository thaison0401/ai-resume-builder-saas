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
  title: "Thanh toán",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let subscription = null;
  let priceInfo = null;
  let stripeFetchFailed = false;
  let dbFetchFailed = false;

  try {
    subscription = await prisma.userSubscription.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.error("Error retrieving subscription from DB:", error);
    dbFetchFailed = true;
  }

  if (subscription) {
    try {
      priceInfo = await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      });
    } catch (error) {
      console.error("Error retrieving price info from Stripe:", error);
      stripeFetchFailed = true;
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Thanh toán</h1>
      <p>
        Gói hiện tại của bạn:{" "}
        <span className="font-bold">
          {dbFetchFailed || stripeFetchFailed
            ? "Không thể tải gói — vui lòng làm mới trang"
            : priceInfo &&
                typeof priceInfo.product !== "string" &&
                !("deleted" in priceInfo.product && priceInfo.product.deleted)
              ? priceInfo.product.name
              : "Miễn phí"}
        </span>
      </p>
      {dbFetchFailed ? (
        <p className="text-muted-foreground">
          Hiện không thể tải thông tin gói đăng ký của bạn. Vui lòng thử lại
          sau.
        </p>
      ) : subscription ? (
        <>
          {subscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              Gói đăng ký của bạn sẽ bị hủy vào ngày{" "}
              {formatDate(subscription.stripeCurrentPeriodEnd, "dd/MM/yyyy")}
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
