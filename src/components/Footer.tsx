import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto flex flex-none flex-col gap-1 bg-footer px-5 pt-6 pb-7 text-[#e9e4dd]">
      <span className="font-display text-lg font-bold text-ink">{site.name}</span>
      <div className="flex gap-5 text-sm">
        <Link href="/terms" className="flex min-h-11 items-center">
          Terms &amp; returns
        </Link>
        <a href={`mailto:${site.contactEmail}`} className="flex min-h-11 items-center">
          Contact
        </a>
      </div>
      <span className="text-xs text-muted">
        © {site.year} {site.name}
      </span>
    </footer>
  );
}
