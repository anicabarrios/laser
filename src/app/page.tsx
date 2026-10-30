import { ArrowRightIcon, ClockIcon, EyeIcon, LockIcon } from "@/components/icons";
import { Footer } from "@/components/Footer";
import { HomeHeader } from "@/components/Header";
import { MaterialTile } from "@/components/MaterialTile";
import { Container, PrimaryLink } from "@/components/ui";
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

      <Container wide>
        {/* Phone: the work carousel comes first, then the hero. Tablet and desktop: hero first, carousel below. */}
        <section className="flex flex-col">
          <div className="flex flex-col gap-3.5 pt-4 pb-2 md:items-center md:gap-5 md:pt-14 md:pb-10 md:text-center">
            <h1 className="font-display text-[34px] leading-[1.08] font-bold tracking-tight md:max-w-3xl md:text-5xl md:leading-[1.05] lg:text-6xl lg:leading-[1.04]">
              Your design, engraved on wood, metal and glass.
            </h1>
            <p className="text-base leading-normal text-muted md:max-w-xl md:text-lg">
              Choose a material, upload your file and see an exact preview before we start engraving.
            </p>
            <PrimaryLink href="/order/material" className="flex-none md:mt-2">
              Start your order
              <ArrowRightIcon size={20} />
            </PrimaryLink>
          </div>
          <div className="order-first md:order-none">
            <WorkCarousel />
          </div>
        </section>

        <section className="pt-6 md:pt-12">
          <h2 className="mb-3 font-display text-xl font-bold md:mb-5 md:text-3xl">Choose a material</h2>
          <div className="grid grid-cols-3 gap-2.5 md:gap-5">
            {MATERIALS.map((m) => (
              <MaterialTile key={m.id} material={m} />
            ))}
          </div>
        </section>

        <section className="mt-7 mb-8 rounded-2xl border border-line bg-surface px-4 py-1.5 md:mt-12 md:mb-14 md:px-8 md:py-3">
          <ul className="md:grid md:grid-cols-3 md:gap-8">
            {TRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 border-b border-soft py-3.5 last:border-b-0 md:border-b-0 md:py-5">
                <span className="flex size-10 flex-none items-center justify-center rounded-full bg-tint text-copper">
                  <Icon size={22} />
                </span>
                <span className="text-[15px] leading-snug font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <Footer />
    </>
  );
}
