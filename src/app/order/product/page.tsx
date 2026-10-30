import type { Metadata } from "next";
import { ProductStep } from "@/components/steps/ProductStep";

export const metadata: Metadata = { title: "Step 2 · Product and size" };

export default function Page() {
  return <ProductStep />;
}
