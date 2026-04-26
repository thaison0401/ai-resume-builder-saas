import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import GetSubscriptionButton from "./GetSubscriptionButton";
import { formatDate } from "date-fns";
import ManageSubscriptionButton from "./ManageSubscriptionButton";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Crown,
  AlertTriangle,
  ShieldOff,
  CalendarClock,
  RefreshCcw,
  Zap,
  Lock,
  WifiOff,
  ArrowLeft,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thanh toán",
};

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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

  // Resolve plan name safely
  const planName =
    priceInfo &&
    typeof priceInfo.product !== "string" &&
    !("deleted" in priceInfo.product && priceInfo.product.deleted)
      ? priceInfo.product.name
      : "Gói cao cấp";

  return (
    <main className="dark:bg-background min-h-screen bg-[#f3fcef] px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* ── Nút quay lại ── */}
        <div>
          <Link
            href="/resumes"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={20} className="mt-0.5" />
            Quay lại
          </Link>
        </div>

        {/* ── Page header ── */}
        <div className="space-y-1 pb-2">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Thanh toán &amp; Gói dịch vụ
          </h1>
          <p className="text-muted-foreground">
            Quản lý gói đăng ký và phương thức thanh toán của bạn
          </p>
        </div>

        {/* ── CASE 1: DB fetch failed — can't determine anything ── */}
        {dbFetchFailed ? (
          <div className="flex flex-col items-center space-y-4 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center dark:border-amber-800 dark:bg-amber-950/30">
            <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/40">
              <WifiOff
                className="text-amber-500 dark:text-amber-400"
                size={28}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                Không thể kết nối hệ thống
              </h3>
              <p className="mx-auto max-w-md text-sm text-amber-700 dark:text-amber-300">
                Không thể tải thông tin gói đăng ký lúc này. Vui lòng làm mới
                trang hoặc thử lại sau vài phút.
              </p>
            </div>
            <a
              href="/billing"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
            >
              <RefreshCcw size={15} />
              Tải lại trang
            </a>
          </div>
        ) : (
          /* ── Main card (subscription OR free) ── */
          <div className="border-border bg-card space-y-6 rounded-2xl border px-6 py-8 shadow-sm">
            {subscription !== null ? (
              /* ── CASE 2: Active paid subscription ── */
              <div className="space-y-6">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    {/* Crown icon */}
                    <div className="w-fit rounded-xl border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950/30">
                      <Crown
                        className="text-yellow-500 dark:text-yellow-400"
                        size={28}
                      />
                    </div>

                    {/* Plan name + status badge */}
                    <div>
                      {/* Stripe price fetch failed: show plan name with fallback */}
                      {stripeFetchFailed ? (
                        <div className="flex items-center gap-2">
                          <h2 className="text-foreground text-xl font-bold">
                            Gói cao cấp
                          </h2>
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                            <AlertTriangle size={10} />
                            Không tải được chi tiết
                          </span>
                        </div>
                      ) : (
                        <h2 className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-2xl font-bold text-transparent dark:from-green-400 dark:to-green-300">
                          {planName}
                        </h2>
                      )}
                      <span className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>

                  {/* Renewal / cancellation date pill */}
                  {subscription.stripeCancelAtPeriodEnd ? (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/30">
                      <ShieldOff
                        className="mt-0.5 shrink-0 text-red-500 dark:text-red-400"
                        size={16}
                      />
                      <div>
                        <p className="text-xs font-bold text-red-800 dark:text-red-300">
                          Gói sẽ bị hủy vào
                        </p>
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                          {formatDate(
                            subscription.stripeCurrentPeriodEnd,
                            "dd/MM/yyyy",
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-border bg-muted flex items-center gap-2 rounded-lg border px-3 py-1.5">
                      <CalendarClock
                        size={14}
                        className="text-muted-foreground"
                      />
                      <span className="text-muted-foreground text-xs font-medium">
                        Gia hạn:{" "}
                        {formatDate(
                          subscription.stripeCurrentPeriodEnd,
                          "dd/MM/yyyy",
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stripe error notice (soft — subscription exists but price detail failed) */}
                {stripeFetchFailed && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
                    <AlertTriangle
                      size={16}
                      className="mt-0.5 shrink-0 text-amber-500 dark:text-amber-400"
                    />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Không thể tải chi tiết gói từ Stripe. Gói đăng ký của bạn
                      vẫn đang hoạt động bình thường.
                    </p>
                  </div>
                )}

                <hr className="border-border" />

                {/* Description + action */}
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Bạn đang sử dụng đầy đủ các tính năng cao cấp. Nhấn nút bên
                    dưới để quản lý phương thức thanh toán, xem hóa đơn hoặc hủy
                    gói trên Stripe.
                  </p>
                  <ManageSubscriptionButton />
                </div>
              </div>
            ) : (
              /* ── CASE 3: Free plan ── */
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="border-border bg-muted w-fit rounded-xl border p-3">
                      <Zap className="text-muted-foreground" size={26} />
                    </div>
                    <div>
                      <h2 className="text-foreground text-xl font-bold">
                        Gói Miễn phí
                      </h2>
                      <span className="bg-muted text-muted-foreground mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
                        Đang dùng
                      </span>
                    </div>
                  </div>
                </div>

                {/* Limitations */}
                <div className="border-border bg-muted/50 rounded-xl border p-5">
                  <h4 className="text-muted-foreground mb-4 text-xs font-bold tracking-wider uppercase">
                    Giới hạn hiện tại
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Chỉ tạo được tối đa 1 CV",
                      "Chưa mở khóa công cụ AI (Tạo tóm tắt & Điền thông minh)",
                      "Chưa có tùy chỉnh màu sắc và kiểu viền",
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground flex items-center gap-3 text-sm"
                      >
                        <Lock
                          size={13}
                          className="text-muted-foreground/60 shrink-0"
                        />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                <hr className="border-border" />

                {/* Upgrade CTA */}
                <div className="flex flex-col items-center gap-3">
                  <p className="text-muted-foreground text-center text-sm">
                    Nâng cấp để mở khóa toàn bộ tính năng AI và tạo CV không
                    giới hạn.
                  </p>
                  <div className="w-full">
                    <GetSubscriptionButton />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
