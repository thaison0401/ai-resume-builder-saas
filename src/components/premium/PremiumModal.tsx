"use client";

import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Import thêm cái này
} from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useState } from "react";
import { toast } from "sonner";
import { createCheckoutSession } from "./actions";
import { env } from "@/env";

const premiumFeatures = ["Công cụ AI", "Tối đa 3 CV"];
const premiumPlusFeatures = ["CV không giới hạn", "Tùy chỉnh giao diện"];

export default function PremiumModal() {
  const { open, setOpen } = usePremiumModal();

  const [loading, setLoading] = useState(false);

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true);
      const redirectUrl = await createCheckoutSession(priceId);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Tạo CV Premium</DialogTitle>
          {/* Khắc phục cảnh báo vàng: Thêm dòng Description ẩn này */}
          <DialogDescription className="sr-only">
            Nâng cấp lên Premium hoặc Premium Plus để mở khóa công cụ AI và các
            tính năng nâng cao.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <p>Đăng ký gói cao cấp để mở khóa thêm nhiều tính năng.</p>

          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex w-full flex-col space-y-5 sm:w-1/2">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <ul className="list-inside space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Đăng ký Premium
              </Button>
            </div>

            <div className="hidden border-l sm:block" />
            <hr className="block border-t sm:hidden" />

            <div className="flex w-full flex-col space-y-5 sm:w-1/2">
              <h3 className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-center text-lg font-bold text-transparent">
                Premium Plus
              </h3>
              <ul className="list-inside space-y-2">
                {premiumPlusFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant="premium"
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
                  )
                }
                disabled={loading}
              >
                Đăng kí Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
