import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { UnsupportedViewport } from "@/components/unsupported-viewport";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecisionDesk — Risk Review Console",
  description:
    "Fictional risk review workspace for operational decision workflows. Demo data only.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <div className="min-[768px]:hidden">
          <UnsupportedViewport />
        </div>
        <div className="hidden min-h-dvh min-[768px]:flex min-[768px]:flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-white focus:px-3 focus:py-2 focus:shadow-sm"
          >
            Skip to main content
          </a>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </div>
      </body>
    </html>
  );
}
