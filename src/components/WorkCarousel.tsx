"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getMaterial } from "@/lib/catalog";
import { WORK } from "@/lib/work";
import { BackIcon, NextIcon } from "./icons";

/** Swipeable showcase of previous work (native scroll-snap, plus arrows and dots). */
export function WorkCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = WORK.length;

  function goTo(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const next = (i + count) % count;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  function onScroll() {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Examples of our work" className="mt-4 flex-none md:mt-0">
      <div className="relative h-[340px] overflow-hidden rounded-2xl md:h-[440px] lg:h-[500px]">
        <div ref={trackRef} onScroll={onScroll} className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto">
          {WORK.map((work, i) => {
            const material = getMaterial(work.material);
            return (
              <div
                key={work.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                className={`swatch-${work.material} relative flex h-full w-full flex-none snap-center items-center justify-center`}
              >
                {work.image ? (
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 480px) 100vw, 440px"
                    className="object-cover"
                    priority={i === 0}
                  />
                ) : (
                  <svg
                    className="size-44 md:size-64"
                    viewBox="0 0 160 160"
                    fill="none"
                    stroke={material.engraveColor}
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="80" cy="80" r="70" />
                    <circle cx="80" cy="80" r="58" strokeDasharray="3 5" />
                    <text
                      x="80"
                      y="85"
                      textAnchor="middle"
                      fontSize="16"
                      fontFamily="var(--font-display)"
                      fill={material.engraveColor}
                      stroke="none"
                    >
                      [Work photo]
                    </text>
                  </svg>
                )}
                <span className="absolute bottom-3 left-3 rounded-full bg-ground px-3 py-1.5 text-[13px] font-medium md:bottom-4 md:left-4 md:px-4 md:py-2 md:text-sm">
                  {work.title}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Previous work"
          onClick={() => goTo(index - 1)}
          className="absolute top-1/2 left-2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ground/70"
        >
          <BackIcon size={22} strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Next work"
          onClick={() => goTo(index + 1)}
          className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ground/70"
        >
          <NextIcon size={22} strokeWidth={2} />
        </button>
      </div>

      <div className="flex h-11 items-center justify-center">
        {WORK.map((work, i) => (
          <button
            key={work.id}
            type="button"
            aria-label={`Show work ${i + 1}`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className="flex h-11 w-6 cursor-pointer items-center justify-center"
          >
            <span className={`block h-2 rounded-full transition-all ${i === index ? "w-5 bg-copper" : "w-2 bg-edge"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
