"use client";

import Link from "next/link";
import { ThemeToggleButton } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Api } from "@/lib/api";
import { clearToken } from "@/lib/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCloud, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const logout = async () => {
    try { await Api.logout(); } catch {}
    clearToken();
    setOpen(false);
    router.replace("/login");
  };

  return (
    <header className="theme-transition sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-sm" style={{ background: "var(--primary)" }} />
          <span className="text-base font-semibold" style={{ color: "var(--primary)" }}>Vulpes</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/assinantes"
            aria-label="Assinantes"
            className="theme-transition rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 text-sm hover:opacity-90"
            title="Assinantes"
          >
            <FontAwesomeIcon icon={faUsers} style={{ color: "var(--fg)" }} />
          </Link>
          <Link
            href="/plataformas"
            aria-label="Plataformas"
            className="theme-transition rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 text-sm hover:opacity-90"
            title="Plataformas"
          >
            <FontAwesomeIcon icon={faCloud} style={{ color: "var(--fg)" }} />
          </Link>
          <ThemeToggleButton />
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="theme-transition rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 text-sm hover:opacity-90"
              aria-label="Perfil"
              title="Perfil"
            >
              <FontAwesomeIcon icon={faUser} style={{ color: "var(--fg)" }} />
            </button>
            {open && (
              <div className="theme-transition absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)] shadow">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm hover:bg-[var(--bg)]"
                >
                  Perfil
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="block w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-[var(--bg)]"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
