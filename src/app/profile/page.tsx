"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight, faUser } from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Decodifica o token para extrair o ID do usuário logado
  useEffect(() => {
    const tok = getToken();
    const id = decodeUserIdFromToken(tok || "");
    setUserId(Number.isFinite(id as number) ? (id as number) : null);
  }, []);

  const fetchData = async () => {
    if (userId == null) return;
    setLoading(true);
    setError(null);
    try {
      const res = await Api.getUsuario(userId);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId != null) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Protected>
      <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>
        {(data?.nome ?? data?.name ?? data?.Nome) || "Perfil"}
      </h1>

      <section
        className={[
          "group relative rounded-2xl border p-5 transition-all",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] hover:shadow-xl",
          "backdrop-blur-sm",
        ].join(" ")}
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.0))",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(600px 200px at 0% 0%, rgba(139,92,246,0.08), transparent 60%)",
          }}
        />
        <div className="relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
              Detalhes do usuário
            </h2>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Voltar"
                title="Voltar"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <button
                onClick={fetchData}
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Atualizar"
                title="Atualizar"
                disabled={loading || userId == null}
              >
                <FontAwesomeIcon icon={faRotateRight} spin={loading} />
              </button>
            </div>
          </div>

          {userId == null ? (
            <div
              className="rounded-2xl border p-6 text-sm"
              style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--muted)" }}
            >
              Não foi possível identificar o usuário logado a partir do token.
            </div>
          ) : (
            <>
              {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
              <ReadOnlyProfile user={data} />
            </>
          )}
        </div>
      </section>
    </Protected>
  );
}

function ReadOnlyField({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </label>
      <div
        className="rounded border px-3 py-2 text-sm"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        {value ?? <span className="opacity-60">-</span>}
      </div>
    </div>
  );
}

function ReadOnlyProfile({ user }: { user: any }) {
  const pick = (obj: any, keys: string[]): any =>
    keys.find((k) => obj && obj[k] !== undefined)
      ? obj[keys.find((k) => obj && obj[k] !== undefined)!]
      : undefined;

  const nomeVal = useMemo(() => pick(user || {}, ["nome", "name", "Nome", "fullName"]), [user]);
  const emailVal = useMemo(() => pick(user || {}, ["email", "Email"]), [user]);
  const roleVal = useMemo(() => pick(user || {}, ["role", "papel", "perfil", "tipo"]), [user]);
  const statusVal = useMemo(() => pick(user || {}, ["status", "ativo", "situacao"]), [user]);
  const criadoEmVal = useMemo(
    () => pick(user || {}, ["criadoEm", "dataCriacao", "createdAt"]),
    [user]
  );

  const fmtDate = (d?: string | Date) => {
    const date = typeof d === "string" ? new Date(d) : d;
    return date instanceof Date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date)
      : "-";
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <div className="grid gap-6">
      {/* Cabeçalho com avatar */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className={[
              "inline-flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg",
              "bg-gradient-to-br from-rose-500 to-pink-600",
            ].join(" ")}
            aria-hidden
          >
            <span className="text-lg font-semibold">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                getInitials(nomeVal)
              )}
            </span>
          </span>
          <div>
            <div className="text-xl font-semibold" style={{ color: "var(--fg)" }}>
              {nomeVal || "—"}
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              {emailVal || "—"}
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              ID #{user?.id ?? "—"}
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span
            className="rounded border px-2 py-1 text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            <FontAwesomeIcon icon={faUser} className="mr-1" />
            {roleVal ?? "Usuário"}
          </span>
        </div>
      </div>

      {/* Estatísticas / informações principais */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          className={[
            "rounded-2xl border p-4",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
            "backdrop-blur-sm",
          ].join(" ")}
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
            Status
          </div>
          <div className="mt-1 text-lg font-semibold" style={{ color: "var(--fg)" }}>
            {String(statusVal ?? "-")}
          </div>
        </div>
        <div
          className={[
            "rounded-2xl border p-4",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
            "backdrop-blur-sm",
          ].join(" ")}
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
            Membro desde
          </div>
          <div className="mt-1 text-lg font-semibold" style={{ color: "var(--fg)" }}>
            {fmtDate(criadoEmVal)}
          </div>
        </div>
      </div>

      {/* Campos somente leitura */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="Nome" value={nomeVal} />
        <ReadOnlyField label="E-mail" value={emailVal} />
        <ReadOnlyField label="Perfil" value={roleVal} />
        <ReadOnlyField label="Status" value={String(statusVal ?? "-")} />
      </div>
    </div>
  );
}

/**
 * Decodifica o JWT e tenta extrair o ID do usuário.
 * Considera chaves comuns: id, userId, user_id, sub.
 */
function decodeUserIdFromToken(token: string): number | null {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const candidate =
      payload?.id ?? payload?.userId ?? payload?.user_id ?? payload?.sub ?? null;
    if (candidate == null) return null;
    const n = typeof candidate === "number" ? candidate : parseInt(String(candidate), 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function base64UrlDecode(str: string): string {
  // Converte base64url para base64 e decodifica
  const pad = str.length % 4 === 2 ? "==" : str.length % 4 === 3 ? "=" : "";
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  if (typeof window !== "undefined") {
    return decodeURIComponent(
      Array.prototype.map
        .call(window.atob(normalized), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  }
  return Buffer.from(normalized, "base64").toString("utf-8");
}

