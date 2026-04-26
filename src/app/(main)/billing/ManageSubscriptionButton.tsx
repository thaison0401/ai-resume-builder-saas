"use client";

import LoadingButton from "@/components/LoadingButton";
import { useState } from "react";
import { toast } from "sonner";
import { createCustomerPortalSession } from "./actions";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const redirectUrl = await createCustomerPortalSession();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton onClick={handleClick} loading={loading}>
      Quản lý gói đăng ký
    </LoadingButton>
  );
}
