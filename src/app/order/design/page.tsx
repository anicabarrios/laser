import type { Metadata } from "next";
import { DesignStep } from "@/components/steps/DesignStep";

export const metadata: Metadata = { title: "Step 3 · Design" };

export default function Page() {
  return <DesignStep />;
}
