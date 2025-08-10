import "./globals.css";
import "@/lib/fa";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "@/components/sidebar/Sidebar";
import AuthWatcher from "@/components/AuthWatcher";

export const metadata = {
  title: "Vulpes",
  description: "Vulpes Web UI",
  icons: { icon: "/fox.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--fg)] theme-transition">
        <ThemeProvider>
          <AuthWatcher />
          {/* Sidebar fixa encostada no canto */}
          <Sidebar />
          {/* Área de conteúdo com recuo dinâmico igual à largura atual da sidebar + gap */}
          <div
            className="px-4 md:px-6 transition-[padding] duration-300 ease-in-out"
            style={{ paddingLeft: "var(--sidebar-offset, 0)" }}
          >
            <div className="mx-auto max-w-7xl">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
