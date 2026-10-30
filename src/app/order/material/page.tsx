import type { Metadata } from "next";
import { MaterialStep } from "@/components/steps/MaterialStep";

export const metadata: Metadata = { title: "Step 1 · Material" };

export default function Page() {
  return <MaterialStep />;
}
