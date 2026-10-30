import { ArrowRightIcon, ClockIcon, EyeIcon, LockIcon } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { HomeHeader } from "@/components/Header";
import { MaterialTile } from "@/components/MaterialTile";
import { PrimaryLink } from "@/components/ui";
import { WorkCarousel } from "@/components/WorkCarousel";
import { MATERIALS } from "@/lib/catalog";
import { site } from "@/lib/site";

const TRUST = [
  { icon: EyeIcon, text: "Design preview before engraving" },
  { icon: LockIcon, text: "Secure card payment" },
  { icon: ClockIcon, text: `Made and shipped within ${site.shipDays} days` },
] as const;

export default function Home() {
  return (
    <>
      <HomeHeader />

      <WorkCarousel />

      <section className="flex flex-col gap-3.5 px-5 pt-4 pb-2">
        <h1 className="font-display text-[34px] leading-[1.08] font-bold tracking-tight">
          Your design, engraved on wood, metal and glass.
        </h1>
        <p className="text-base leading-normal text-muted">
          Choose a material, upload your file and see an exact preview before we start engraving.
        </p>
        <PrimaryLink href="/order/material" className="flex-none">
          Start your order
          <ArrowRightIcon size={20} />
        </PrimaryLink>
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-3 font-display text-xl font-bold">Choose a material</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {MATERIALS.map((m) => (
            <MaterialTile key={m.id} material={m} />
          ))}
        </div>
      </section>

      <section className="mx-5 mt-7 mb-8 rounded-2xl border border-line bg-surface px-4 py-1.5">
        <ul>
          {TRUST.map(({ icon: Icon, text }, i) => (
            <li key={text} className={`flex items-center gap-3 py-3.5 ${i < TRUST.length - 1 ? "border-b border-soft" : ""}`}>
              <span className="flex size-10 flex-none items-center justify-center rounded-full bg-tint text-copper">
                <Icon size={22} />
              </span>
              <span className="text-[15px] leading-snug font-medium">{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </>
  );
}
