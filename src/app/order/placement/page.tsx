import type { Metadata } from "next";
import { PlacementStep } from "@/components/steps/PlacementStep";

export const metadata: Metadata = { title: "Step 4 · Placement" };

export default function Page() {
  return <PlacementStep />;
}
