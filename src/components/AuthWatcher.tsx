"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, isAuthenticated, isTokenExpired, UNAUTHORIZED_EVENT } from "@/lib/auth";

type Props = {
  checkIntervalMs?: number;
  loginPath?: string;
};

/**
 * Observa o estado de autenticação:
 * - Checa expiração do token ao montar e em intervalos.
 * - Redireciona para /login se expirar ou se receber 401 (evento global).
 * - Responde a alterações no localStorage (multi‑aba).
 */
export default function AuthWatcher({
  checkIntervalMs = 60_000,
  loginPath = "/login",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const redirectToLogin = () => {
      if (pathname && pathname.startsWith(loginPath)) return;
      router.replace(loginPath);
    };

    const onUnauthorized = () => {
      clearToken();
      redirectToLogin();
    };

    // 401 vindo da API
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized as EventListener);

    // Mudanças no storage (ex.: logout em outra aba)
    const onStorage = () => {
      if (!isAuthenticated()) {
        redirectToLogin();
      }
    };
    window.addEventListener("storage", onStorage);

    // Checagem imediata e periódica
    const runCheck = () => {
      if (!isAuthenticated()) {
        redirectToLogin();
        return;
      }
      if (isTokenExpired(5)) {
        clearToken();
        redirectToLogin();
      }
    };
    runCheck();
    const id = window.setInterval(runCheck, checkIntervalMs);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized as EventListener);
      window.removeEventListener("storage", onStorage);
      clearInterval(id);
    };
  }, [pathname, router, checkIntervalMs, loginPath]);

  return null;
}
