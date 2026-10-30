import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { HomeHeader } from "@/components/Header";

export const metadata: Metadata = { title: "Terms & returns" };

export default function Page() {
  return (
    <>
      <HomeHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 px-5 py-6 md:px-8 md:py-12">
        <h1 className="font-display text-[26px] font-bold tracking-tight md:text-4xl">Terms &amp; returns</h1>
        <p className="text-[15px] leading-normal text-muted">
          [Write your terms here: made-to-order items, return and refund policy, who owns the design rights, how long
          production and shipping take.]
        </p>
      </main>
      <Footer />
    </>
  );
}
