import "./globals.css";
import "@/lib/fa";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/header/Header";

export const metadata = {
  title: "Vulpes",
  description: "Vulpes Web UI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--fg)] theme-transition">
        <ThemeProvider>
          <Header />
          <div className="mx-auto max-w-5xl p-6">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
