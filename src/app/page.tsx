"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import {
  Sun,
  Sparkles,
  Brain,
  Palette,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Home() {
  // Sử dụng Hook useAuth thay vì component SignedIn/SignedOut để tránh lỗi TypeScript
  const { isLoaded, userId } = useAuth();

  return (
    // Ép cứng font và nền sáng, vô hiệu hóa Dark Mode ở màn hình này
    <div className="min-h-screen bg-[#f3fcef] font-sans text-[#161d16] antialiased selection:bg-[#22c55e] selection:text-[#004b1e]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 z-50 w-full border-b border-[#dce5d9] bg-[#ffffff]/90 shadow-sm backdrop-blur-sm transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              alt="AI Resume Builder Logo"
              className="h-9 w-9 object-contain"
              src={logo}
            />
            <span className="text-2xl font-black tracking-tight text-[#161d16]">
              AI Resume Builder
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Logic render thông minh dựa trên trạng thái auth */}
            {!isLoaded ? (
              // Loading skeleton khi đang kiểm tra trạng thái đăng nhập
              <div className="h-8 w-8 animate-pulse rounded-full bg-[#e8f0e4]"></div>
            ) : !userId ? (
              // Trạng thái CHƯA đăng nhập
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-[#3d4a3d] transition-all duration-200 hover:text-[#006e2f]"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-[#006e2f] px-4 py-2 text-sm font-semibold text-[#ffffff] transition-all duration-200 hover:bg-[#22c55e] hover:text-[#004b1e]"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              // Trạng thái ĐÃ đăng nhập
              <>
                <Link
                  href="/resumes"
                  className="text-sm font-semibold text-[#3d4a3d] transition-all duration-200 hover:text-[#006e2f]"
                >
                  CV của tôi
                </Link>
                {/* Đã bỏ prop cũ afterSignOutUrl để sửa lỗi đỏ */}
                <UserButton />
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="overflow-hidden pt-24 pb-12">
        {/* HERO SECTION */}
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 pt-12 pb-12 lg:flex-row">
          <div className="z-10 flex flex-1 flex-col items-start gap-6">
            <Image
              alt="AI Logo"
              className="h-[150px] w-[150px] rounded-2xl border-4 border-[#ffffff] bg-white object-contain p-2 shadow-lg"
              src={logo}
            />
            <h1 className="max-w-2xl text-4xl leading-tight font-extrabold tracking-tight text-[#161d16] md:text-5xl">
              Tạo{" "}
              {/* Sửa bg-gradient-to-r thành bg-linear-to-r chuẩn Tailwind v4 */}
              <span className="bg-linear-to-r from-[#16a34a] to-[#4ade80] bg-clip-text text-transparent">
                CV hoàn hảo
              </span>{" "}
              trong vòng vài phút
            </h1>
            <p className="max-w-xl text-lg text-[#3d4a3d]">
              Công cụ{" "}
              <strong className="font-semibold text-[#161d16]">
                AI resume builder
              </strong>{" "}
              giúp bạn thiết kế CV chuyên nghiệp, dù bạn không phải chuyên gia
              thiết kế.
            </p>
            <Link
              href="/resumes"
              className="mt-2 inline-block transform rounded-full bg-linear-to-r from-[#16a34a] to-[#4ade80] px-8 py-4 text-sm font-semibold text-[#ffffff] shadow-lg shadow-[#22c55e]/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#22c55e]/40"
            >
              Bắt đầu ngay
            </Link>
          </div>

          <div className="relative w-full max-w-md flex-1 lg:max-w-lg">
            {/* Decorative Blobs */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22c55e]/20 blur-[100px]"></div>

            {/* Resume Mockup */}
            <div className="relative z-10 rotate-[1.5deg] rounded-lg border border-[#dce5d9] bg-[#ffffff] p-6 shadow-2xl transition-transform duration-500 hover:rotate-0">
              <div className="mb-6 flex items-start gap-4 border-b border-[#dce5d9] pb-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8f0e4]">
                  <Image
                    alt="Profile"
                    className="h-full w-full object-cover p-2"
                    src={logo}
                  />
                </div>
                <div className="mt-2 flex w-full flex-col gap-2">
                  <div className="h-5 w-3/4 rounded bg-[#161d16]"></div>
                  <div className="h-3 w-1/2 rounded bg-[#dce5d9]"></div>
                  <div className="mt-1 flex gap-2">
                    <div className="h-2 w-1/4 rounded bg-[#dce5d9]"></div>
                    <div className="h-2 w-1/4 rounded bg-[#dce5d9]"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="mb-2 h-3 w-1/3 rounded bg-[#006e2f]/20"></div>
                  <div className="mb-1 h-2 w-full rounded bg-[#dce5d9]"></div>
                  <div className="mb-1 h-2 w-full rounded bg-[#dce5d9]"></div>
                  <div className="h-2 w-5/6 rounded bg-[#dce5d9]"></div>
                </div>
                <div>
                  <div className="mb-2 h-3 w-1/3 rounded bg-[#006e2f]/20"></div>
                  <div className="mb-1 h-2 w-full rounded bg-[#dce5d9]"></div>
                  <div className="mb-1 h-2 w-4/5 rounded bg-[#dce5d9]"></div>
                  <div className="mb-1 h-2 w-full rounded bg-[#dce5d9]"></div>
                  <div className="h-2 w-3/4 rounded bg-[#dce5d9]"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2 h-3 w-1/2 rounded bg-[#006e2f]/20"></div>
                    <div className="flex flex-wrap gap-1.5">
                      <div className="h-5 w-16 rounded-full bg-[#e8f0e4]"></div>
                      <div className="h-5 w-20 rounded-full bg-[#e8f0e4]"></div>
                      <div className="h-5 w-14 rounded-full bg-[#e8f0e4]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 h-3 w-1/2 rounded bg-[#006e2f]/20"></div>
                    <div className="mb-1 h-2 w-full rounded bg-[#dce5d9]"></div>
                    <div className="h-2 w-5/6 rounded bg-[#dce5d9]"></div>
                  </div>
                </div>
              </div>

              {/* Floating AI badge */}
              <div className="absolute top-1/4 -right-4 flex animate-bounce items-center justify-center rounded-full border border-[#dce5d9] bg-[#ffffff] p-1.5 shadow-lg">
                <div className="rounded-full bg-[#f0fdf4] p-2">
                  <Sparkles className="h-5 w-5 text-[#006e2f]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#161d16] md:text-4xl">
              Bạn có thể làm gì
            </h2>
            <p className="mt-3 text-base text-[#3d4a3d]">
              Các công cụ hỗ trợ AI mạnh mẽ giúp tạo CV dễ dàng hơn.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl border border-white/30 bg-white/70 p-8 text-center shadow-sm backdrop-blur-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-md">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f0e4] text-[#006e2f]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#161d16]">
                Tạo Tóm Tắt Bằng AI
              </h3>
              <p className="text-base text-[#3d4a3d]">
                Mô tả kinh nghiệm của bạn, AI sẽ tự động viết đoạn giới thiệu
                chuyên nghiệp, tối ưu ATS cho CV.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-white/30 bg-white/70 p-8 text-center shadow-sm backdrop-blur-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-md">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f0e4] text-[#006e2f]">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#161d16]">
                Điền Kinh Nghiệm Thông Minh
              </h3>
              <p className="text-base text-[#3d4a3d]">
                Nhập mô tả thô về công việc, AI sẽ định dạng lại thành các gạch
                đầu dòng súc tích với động từ hành động mạnh.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-white/30 bg-white/70 p-8 text-center shadow-sm backdrop-blur-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-md">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f0e4] text-[#006e2f]">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#161d16]">
                Tùy Chỉnh Giao Diện (Pro Plus)
              </h3>
              <p className="text-base text-[#3d4a3d]">
                Chọn màu nhấn và kiểu viền ảnh (vuông, tròn, squircle) để CV nổi
                bật và thể hiện cá tính của bạn.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="mx-auto my-12 max-w-7xl rounded-3xl border border-[#dce5d9]/50 bg-[#edf6ea] px-6 py-16 shadow-sm">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#161d16] md:text-4xl">
              Tạo CV trong 6 bước đơn giản
            </h2>
            <p className="mt-3 text-base text-[#3d4a3d]">
              Tiến trình của bạn được lưu tự động khi bạn nhập.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-[#dce5d9] bg-[#ffffff] px-4 py-2 shadow-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006e2f]/20 text-xs font-bold text-[#006e2f]">
                1
              </div>
              <span className="text-sm font-semibold text-[#161d16]">
                Thông tin chung
              </span>
            </div>
            <ChevronRight className="hidden h-5 w-5 text-[#bccbb9] md:block" />

            <div className="flex items-center gap-2 rounded-full border border-[#dce5d9] bg-[#ffffff] px-4 py-2 shadow-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006e2f]/20 text-xs font-bold text-[#006e2f]">
                2
              </div>
              <span className="text-sm font-semibold text-[#161d16]">
                Thông tin cá nhân
              </span>
            </div>
            <ChevronRight className="hidden h-5 w-5 text-[#bccbb9] md:block" />

            <div className="flex items-center gap-2 rounded-full border border-[#dce5d9] bg-[#ffffff] px-4 py-2 shadow-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006e2f]/20 text-xs font-bold text-[#006e2f]">
                3
              </div>
              <span className="text-sm font-semibold text-[#161d16]">
                Kinh nghiệm
              </span>
            </div>
            <ChevronRight className="hidden h-5 w-5 text-[#bccbb9] lg:block" />

            <div className="flex items-center gap-2 rounded-full border border-[#dce5d9] bg-[#ffffff] px-4 py-2 shadow-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006e2f]/20 text-xs font-bold text-[#006e2f]">
                4
              </div>
              <span className="text-sm font-semibold text-[#161d16]">
                Học vấn
              </span>
            </div>
            <ChevronRight className="hidden h-5 w-5 text-[#bccbb9] md:block" />

            <div className="flex items-center gap-2 rounded-full border border-[#dce5d9] bg-[#ffffff] px-4 py-2 shadow-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006e2f]/20 text-xs font-bold text-[#006e2f]">
                5
              </div>
              <span className="text-sm font-semibold text-[#161d16]">
                Kỹ năng
              </span>
            </div>
            <ChevronRight className="hidden h-5 w-5 text-[#bccbb9] md:block" />

            <div className="relative flex items-center gap-2 overflow-hidden rounded-full border-2 border-[#006e2f] bg-[#ffffff] px-4 py-2 shadow-sm">
              <div className="absolute inset-0 bg-[#006e2f]/10"></div>
              <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#006e2f] text-xs font-bold text-[#ffffff]">
                6
              </div>
              <span className="relative z-10 text-sm font-semibold text-[#161d16]">
                Tóm tắt
              </span>
            </div>
          </div>

          <div className="mx-auto mt-12 h-2 w-full max-w-3xl overflow-hidden rounded-full bg-[#e8f0e4]">
            <div className="h-full w-full rounded-full bg-[#006e2f]"></div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#161d16] md:text-4xl">
              Bảng Giá Đơn Giản, Minh Bạch
            </h2>
            <p className="mt-3 text-base text-[#3d4a3d]">
              Chọn gói phù hợp với nhu cầu phát triển sự nghiệp của bạn.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 items-end gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div className="flex h-full flex-col rounded-2xl border border-[#dce5d9] bg-[#ffffff] p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 text-2xl font-semibold text-[#161d16]">
                Miễn phí
              </h3>
              <div className="mb-6 flex items-baseline gap-1 border-b border-[#dce5d9] pb-6">
                <span className="text-4xl font-bold text-[#161d16]">0 ₫</span>
                <span className="text-base text-[#3d4a3d]">/tháng</span>
              </div>
              <ul className="mb-8 flex flex-1 flex-col gap-4">
                <li className="flex items-start gap-3 text-base text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  1 CV
                </li>
                <li className="flex items-start gap-3 text-base text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  Trình tạo CV cơ bản
                </li>
                <li className="flex items-start gap-3 text-base text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  In / Xuất PDF
                </li>
              </ul>
              <Link
                href="/resumes"
                className="block w-full rounded-lg border border-[#6d7b6c] py-3 text-center text-sm font-semibold text-[#161d16] transition-colors hover:bg-[#e8f0e4]"
              >
                Bắt đầu miễn phí
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="relative flex h-full transform flex-col rounded-2xl border-2 border-[#006e2f] bg-[#ffffff] p-8 shadow-xl transition-all hover:shadow-2xl md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#006e2f] px-4 py-1 text-xs font-semibold whitespace-nowrap text-[#ffffff] shadow-md">
                Phổ biến nhất
              </div>
              <h3 className="mb-2 pt-2 text-2xl font-semibold text-[#161d16]">
                Pro
              </h3>
              <div className="mb-6 flex items-baseline gap-1 border-b border-[#dce5d9] pb-6">
                <span className="text-4xl font-bold text-[#161d16]">
                  99.000 ₫
                </span>
                <span className="text-base text-[#3d4a3d]">/tháng</span>
              </div>
              <ul className="mb-8 flex flex-1 flex-col gap-4">
                <li className="flex items-start gap-3 text-base text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  Tối đa 3 CV
                </li>
                <li className="flex items-start gap-3 text-base font-semibold text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  Công cụ AI
                </li>
                <li className="flex items-start gap-3 text-base text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  In / Xuất PDF
                </li>
              </ul>
              <Link
                href="/billing"
                className="block w-full transform rounded-lg bg-linear-to-r from-[#16a34a] to-[#4ade80] py-3 text-center text-sm font-semibold text-[#ffffff] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Đăng ký Premium
              </Link>
            </div>

            {/* Pro Plus Plan */}
            <div className="flex h-full flex-col rounded-2xl border border-[#dce5d9] bg-[#ffffff] p-8 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-2 bg-linear-to-r from-[#16a34a] to-[#4ade80] bg-clip-text text-2xl font-semibold text-transparent">
                Pro Plus
              </h3>
              <div className="mb-6 flex items-baseline gap-1 border-b border-[#dce5d9] pb-6">
                <span className="text-4xl font-bold text-[#161d16]">
                  199.000 ₫
                </span>
                <span className="text-base text-[#3d4a3d]">/tháng</span>
              </div>
              <ul className="mb-8 flex flex-1 flex-col gap-4">
                <li className="flex items-start gap-3 text-base text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  CV không giới hạn
                </li>
                <li className="flex items-start gap-3 text-base font-semibold text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  Tất cả công cụ AI
                </li>
                <li className="flex items-start gap-3 text-base text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  Tùy chỉnh màu sắc & viền
                </li>
                <li className="flex items-start gap-3 text-base text-[#161d16]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#006e2f]" />
                  In / Xuất PDF
                </li>
              </ul>
              <Link
                href="/billing"
                className="block w-full transform rounded-lg bg-linear-to-r from-[#16a34a] to-[#4ade80] py-3 text-center text-sm font-semibold text-[#ffffff] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Đăng ký Premium Plus
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#dce5d9] bg-[#ffffff] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-2xl font-bold tracking-tight text-[#161d16]">
              AI Resume Builder
            </span>
            <span className="text-base text-[#3d4a3d]">
              © 2026 AI Resume Builder. Nền tảng tạo CV thông minh.
            </span>
          </div>
          <nav className="flex gap-4">
            <Link
              href="/tos"
              className="rounded text-base text-[#3d4a3d] transition-colors outline-none hover:text-[#161d16]"
            >
              Điều khoản dịch vụ
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
