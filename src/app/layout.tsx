import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} · Custom laser engraving`,
    template: `%s · ${site.name}`,
  },
  description: "Custom laser engraving on wood, metal and glass. Upload your design, preview it and order online.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121416",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-ground sm:border-x sm:border-line">
          {children}
        </div>
      </body>
    </html>
  );
}
