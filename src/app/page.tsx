import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import resumePreview from "@/assets/resume-preview.jpg";

export default function Home() {
  return (
    // Đã xóa bg-gray-100, text-gray-900 và các class dark:
    // Tự động ăn theo Theme toàn cục của App
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 py-12 text-center md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Tạo{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            CV hoàn hảo
          </span>{" "}
          trong vòng vài phút
        </h1>
        {/* Dùng text-muted-foreground chuẩn của Shadcn thay vì gray-500 */}
        <p className="text-muted-foreground text-lg">
          Công cụ{" "}
          <span className="text-foreground font-bold">AI resume builder</span>{" "}
          giúp bạn thiết kế CV chuyên nghiệp, dù bạn không phải chuyên gia thiết
          kế.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Bắt đầu ngay</Link>
        </Button>
      </div>
      <div>
        <Image
          src={resumePreview}
          alt="Xem trước CV"
          width={600}
          className="shadow-md lg:rotate-[1.5deg]"
        />
      </div>
    </main>
  );
}
