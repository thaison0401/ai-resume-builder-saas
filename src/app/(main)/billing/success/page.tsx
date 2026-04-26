"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, Rocket, Sparkles, Palette, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";

  const planConfig = {
    pro: {
      name: "Pro",
      title: "Thanh toán thành công!",
      description:
        "Chào mừng bạn đến với Pro! Tài khoản bạn được nâng cấp và bạn đã sẵn sàng xây dựng CV định hình sự nghiệp của mình.",
      features: [
        { icon: <Rocket className="h-5 w-5" />, label: "CV không giới hạn" },
        { icon: <Zap className="h-5 w-5" />, label: "Công cụ AI nâng cao" },
        { icon: <Palette className="h-5 w-5" />, label: "Tùy chỉnh cao cấp" },
        { icon: <Check className="h-5 w-5" />, label: "Hỗ trợ ưu tiên" },
      ],
      color: "from-green-600 to-emerald-500",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    pro_plus: {
      name: "Pro Plus",
      title: "Chào mừng đến với đẳng cấp Elite!",
      description:
        "Chào mừng bạn đến với Pro Plus! Bạn đã mở khóa toàn bộ công cụ AI nâng cao và tối ưu ATS chuyên sâu.",
      features: [
        { icon: <Rocket className="h-5 w-5" />, label: "CV không giới hạn" },
        { icon: <Crown className="h-5 w-5" />, label: "Tư vấn nghề nghiệp" },
        { icon: <Zap className="h-5 w-5" />, label: "Tạo AI không giới hạn" },
        { icon: <Sparkles className="h-5 w-5" />, label: "Tối ưu ATS Pro" },
      ],
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  };

  const currentPlan =
    planConfig[plan as keyof typeof planConfig] || planConfig.pro;

  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-xl"
      >
        <Card className="border-none bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-slate-900/80">
          <CardHeader className="pb-2 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-inner ${currentPlan.iconBg}`}
            >
              <Check
                className={`h-10 w-10 ${currentPlan.iconColor}`}
                strokeWidth={3}
              />
            </motion.div>
            <CardTitle className="mb-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white">
              {currentPlan.title}
            </CardTitle>
            <CardDescription className="mx-auto max-w-md text-lg text-slate-600 dark:text-slate-400">
              {currentPlan.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  <Sparkles className="h-4 w-4" /> Tính năng {currentPlan.name}{" "}
                  đã mở khóa
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {currentPlan.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className={currentPlan.iconColor}>
                        {feature.icon}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {feature.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col gap-3"
              >
                <Button
                  asChild
                  size="lg"
                  className={`w-full rounded-xl bg-linear-to-r ${currentPlan.color} py-6 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]`}
                >
                  <Link href="/resumes">Đến trang CV của tôi</Link>
                </Button>
                <p className="text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                  Cần hỗ trợ? Liên hệ đội ngũ của chúng tôi bất cứ lúc nào.
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default function BillingSuccessPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[slate-50] p-4 dark:bg-slate-950">
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full opacity-20 dark:opacity-10">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-green-400 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-400 blur-[120px]" />
      </div>

      <Suspense
        fallback={
          <div className="z-10 h-[400px] w-full max-w-xl animate-pulse rounded-xl bg-white/50 dark:bg-slate-800/50" />
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
