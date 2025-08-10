import { API_BASE } from "@/lib/config";
import { getToken, clearToken, UNAUTHORIZED_EVENT } from "@/lib/auth";

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? getToken() : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (res.status === 401) {
    // Unauthorized: clear token so UI can redirect to login
    clearToken();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
  }

  if (!res.ok) {
    const text = await res.text();
    try {
      return Promise.reject(JSON.parse(text));
    } catch {
      return Promise.reject({ message: text || res.statusText, status: res.status });
    }
  }

  // Handle empty body
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // Some endpoints return empty object or other types; attempt json, fallback to {} as any
    try {
      return (await res.json()) as T;
    } catch {
      return {} as T;
    }
  }

  return (await res.json()) as T;
}

export const Api = {
  // Auth
  login: (body: { email: string; senha: string }) =>
    apiFetch<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  logout: () => apiFetch<{}>("/auth/logout", { method: "POST" }),

  // Plataformas
  listarPlataformas: (params?: { nome?: string; pagina?: number; quantidade?: number }) => {
    const usp = new URLSearchParams();
    if (params?.nome) usp.set("nome", params.nome);
    if (params?.pagina != null) usp.set("pagina", String(params.pagina));
    if (params?.quantidade != null) usp.set("quantidade", String(params.quantidade));
    const qs = usp.toString();
    return apiFetch<any>(`/plataformas${qs ? `?${qs}` : ""}`);
  },
  cadastrarPlataforma: (body: any) =>
    apiFetch<any>(`/plataformas`, { method: "POST", body: JSON.stringify(body) }),

  // Assinantes
  listarAssinantes: (params?: { nome?: string; pagina?: number; quantidade?: number }) => {
    const usp = new URLSearchParams();
    if (params?.nome) usp.set("nome", params.nome);
    if (params?.pagina != null) usp.set("pagina", String(params.pagina));
    if (params?.quantidade != null) usp.set("quantidade", String(params.quantidade));
    const qs = usp.toString();
    return apiFetch<any>(`/assinantes${qs ? `?${qs}` : ""}`);
  },
  cadastrarAssinante: (body: any) =>
    apiFetch<any>(`/assinantes`, { method: "POST", body: JSON.stringify(body) }),
  getAssinante: (id: number) => apiFetch<any>(`/assinantes/${id}`),
  atualizarAssinante: (id: number, body: any) =>
    apiFetch<any>(`/assinantes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteAssinante: (id: number) => apiFetch<any>(`/assinantes/${id}`, { method: "DELETE" }),
  associarPlataformas: (id: number, body: { plataformaIds: number[] }) =>
    apiFetch<any>(`/assinantes/${id}/associar-plataformas`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  desassociarPlataforma: (assinanteId: number, plataformaId: number) =>
    apiFetch<any>(`/assinantes/${assinanteId}/desassociar-plataforma/${plataformaId}`, {
      method: "DELETE",
    }),

  // Pagamentos
  listarPagamentos: (params?: { nomeAssinante?: string; pagina?: number; quantidade?: number }) => {
    const usp = new URLSearchParams();
    if (params?.nomeAssinante) usp.set("nomeAssinante", params.nomeAssinante);
    if (params?.pagina != null) usp.set("pagina", String(params.pagina));
    if (params?.quantidade != null) usp.set("quantidade", String(params.quantidade));
    const qs = usp.toString();
    return apiFetch<any>(`/pagamentos${qs ? `?${qs}` : ""}`);
  },
  registrarPagamento: (body: any) =>
    apiFetch<any>(`/pagamentos`, { method: "POST", body: JSON.stringify(body) }),
  listarPagamentosAssinante: (id: number, params?: { pagina?: number; quantidade?: number }) => {
    const usp = new URLSearchParams();
    if (params?.pagina != null) usp.set("pagina", String(params.pagina));
    if (params?.quantidade != null) usp.set("quantidade", String(params.quantidade));
    const qs = usp.toString();
    return apiFetch<any>(`/pagamentos/assinante/${id}${qs ? `?${qs}` : ""}`);
  },

  // Plataformas by id and delete
  getPlataforma: (id: number) => apiFetch<any>(`/plataformas/${id}`),
  atualizarPlataforma: (id: number, body: any) =>
    apiFetch<any>(`/plataformas/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePlataforma: (id: number) => apiFetch<any>(`/plataformas/${id}`, { method: "DELETE" }),
};
