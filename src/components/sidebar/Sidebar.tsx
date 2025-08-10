"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faHouse,
  faUsers,
  faLayerGroup,
  faWallet,
  faUser,
  faRightFromBracket,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import { Api } from "@/lib/api";
import { clearToken } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";

type Item = {
  icon: any;
  label: string;
  href: string;
};

const COLLAPSED_W = "4rem";
const EXPANDED_W = "14rem";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { toggle, theme } = useTheme();

  // Atualiza variáveis CSS para o layout reservar espaço para a sidebar
  useEffect(() => {
    const root = document.documentElement;
    const w = open ? EXPANDED_W : COLLAPSED_W;
    root.style.setProperty("--sidebar-w", w);
    root.style.setProperty("--sidebar-offset", `calc(${w} + 1rem)`);
    return () => {
      // mantemos os valores atuais ao desmontar
    };
  }, [open]);

  // Define valores iniciais ao montar
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sidebar-w", COLLAPSED_W);
    root.style.setProperty("--sidebar-offset", `calc(${COLLAPSED_W} + 1rem)`);
  }, []);

  const topItems: Item[] = [
    { icon: faHouse, label: "Início", href: "/dashboard" },
    { icon: faUsers, label: "Assinantes", href: "/assinantes" },
    { icon: faLayerGroup, label: "Plataformas", href: "/plataformas" },
    // { icon: faWallet, label: "Pagamentos", href: "/pagamentos" },
  ];

  const bottomItems: Item[] = [
    { icon: faUser, label: "Perfil", href: "/profile" },
    { icon: faRightFromBracket, label: "Sair", href: "/logout" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const onItemClick = async (href: string) => {
    if (href === "/logout") {
      try {
        await Api.logout();
      } catch {}
      clearToken();
      router.replace("/login");
      return;
    }
    router.push(href);
  };

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r p-3",
        "transition-[width] duration-300 ease-in-out",
        open ? "w-56" : "w-16",
      ].join(" ")}
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* Cabeçalho do menu */}
      <div className="flex items-center">
        <button
          className={[
            "flex items-center rounded-xl border transition-colors",
            open ? "h-10 px-3" : "h-10 w-10 justify-center px-0",
          ].join(" ")}
          style={{ background: "var(--bg)", borderColor: "var(--border)" }}
          aria-label="Alternar menu"
          aria-expanded={open}
          title="Menu"
          type="button"
          onClick={() => setOpen((v) => !v)}
        >
          <FontAwesomeIcon icon={faBars} style={{ color: "var(--fg)" }} />
          {open && (
            <span className="ml-2 text-xs font-medium" style={{ color: "var(--muted)" }}>
              <img src="/logo.svg" alt="Logo" className="h-6"/>
            </span>
          )}
        </button>
      </div>

      {/* Itens superiores */}
      <nav className="mt-4 flex flex-1 flex-col gap-2">
        {topItems.map((it) => {
          const active = isActive(it.href);
          return (
            <button
              key={it.label}
              onClick={() => onItemClick(it.href)}
              className={[
                "group relative flex items-center rounded-xl border transition-all",
                open ? "h-10 px-3 justify-start gap-3" : "h-10 w-10 justify-center",
                active
                  ? "border-transparent bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-violet-700/30"
                  : "",
              ].join(" ")}
              style={{
                background: active ? undefined : "var(--bg)",
                borderColor: active ? undefined : "var(--border)",
              }}
              title={it.label}
              aria-label={it.label}
              type="button"
            >
              <FontAwesomeIcon
                icon={it.icon}
                className={active ? "text-white" : ""}
                style={{ color: active ? undefined : "var(--fg)" }}
              />
              {open && (
                <span
                  className="whitespace-nowrap text-sm"
                  style={{ color: active ? "white" : "var(--fg)" }}
                >
                  {it.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Ações inferiores */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={toggle}
          className={[
            "group relative flex items-center rounded-xl border transition-all",
            open ? "h-10 px-3 justify-start gap-3" : "h-10 w-10 justify-center",
          ].join(" ")}
          style={{
            background: "var(--bg)",
            borderColor: "var(--border)",
          }}
          title={theme === "dark" ? "Alternar para claro" : "Alternar para escuro"}
          aria-label="Alternar tema"
          type="button"
        >
          <FontAwesomeIcon
            icon={faCircleHalfStroke}
            style={{ color: "var(--fg)" }}
          />
          {open && (
            <span className="whitespace-nowrap text-sm" style={{ color: "var(--fg)" }}>
              Tema
            </span>
          )}
        </button>
        {bottomItems.map((it) => {
          const active = isActive(it.href);
          return (
            <button
              key={it.label}
              onClick={() => onItemClick(it.href)}
              className={[
                "group relative flex items-center rounded-xl border transition-all",
                open ? "h-10 px-3 justify-start gap-3" : "h-10 w-10 justify-center",
              ].join(" ")}
              style={{
                background: "var(--bg)",
                borderColor: "var(--border)",
              }}
              title={it.label}
              aria-label={it.label}
              type="button"
            >
              <FontAwesomeIcon
                icon={it.icon}
                className={active ? "text-white" : ""}
                style={{ color: active ? undefined : "var(--fg)" }}
              />
              {open && (
                <span className="whitespace-nowrap text-sm" style={{ color: "var(--fg)" }}>
                  {it.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
