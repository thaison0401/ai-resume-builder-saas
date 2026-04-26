"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import Link from "next/link";

interface CreateResumeButtonProps {
  canCreate: boolean;
}

export default function CreateResumeButton({
  canCreate,
}: CreateResumeButtonProps) {
  // CẬP NHẬT: Dùng selector để chỉ lấy hàm setOpen, giúp tối ưu hiệu năng
  const setOpen = usePremiumModal((s) => s.setOpen);

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-5" />
          Tạo CV mới
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setOpen(true)} // Đổi từ PremiumModal.setOpen thành setOpen
      className="mx-auto flex w-fit gap-2"
    >
      <PlusSquare className="size-5" /> Tạo CV mới
    </Button>
  );
}
