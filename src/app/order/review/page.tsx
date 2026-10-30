import type { Metadata } from "next";
import { ReviewStep } from "@/components/steps/ReviewStep";

export const metadata: Metadata = { title: "Step 5 · Review" };

export default function Page() {
  return <ReviewStep />;
}
