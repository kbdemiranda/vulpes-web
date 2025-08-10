export const TOKEN_KEY = "vulpes_token";
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Decodifica o payload do JWT usando base64-url.
 * Não valida a assinatura; use apenas para leitura de campos como exp.
 */
export function decodeTokenPayload<T = any>(): T | null {
  const token = getToken();
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof atob !== "undefined" ? atob(base64) : Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Verifica se o token expirou com uma folga (leeway) opcional em segundos.
 * Se não houver campo exp, assume não expirado.
 */
export function isTokenExpired(leewaySeconds = 0): boolean {
  const payload = decodeTokenPayload<{ exp?: number }>();
  if (!payload?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp + leewaySeconds <= now;
}

