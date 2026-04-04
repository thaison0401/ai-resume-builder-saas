import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Design your resume",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeEditor />
    </Suspense>
  );
}
