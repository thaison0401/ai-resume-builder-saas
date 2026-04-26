import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Thiết kế CV của bạn",
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;

  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: { id: resumeId },
        include: resumeDataInclude,
      })
    : null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeEditor resumeToEdit={resumeToEdit} />
    </Suspense>
  );
}
