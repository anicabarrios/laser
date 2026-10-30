import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="mt-auto flex-none bg-footer text-[#e9e4dd]">
      <Container wide className="flex flex-col gap-1 pt-6 pb-7 md:flex-row md:items-center md:justify-between md:gap-8 md:py-8">
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
      </Container>
    </footer>
  );
}
