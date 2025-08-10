"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowLeft, faPenToSquare, faRotateRight } from "@fortawesome/free-solid-svg-icons";

export default function AssinanteDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = React.use(params);
  const id = Number(idParam);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.getAssinante(id);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar assinante");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  return (
    <Protected>
      <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>{(data?.nome ?? data?.name ?? data?.Nome) || `Assinante #${id}`}</h1>
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
            <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Assinante</h2>
            <div className="flex items-center gap-2">
              <Link
                href="/assinantes"
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Voltar"
                title="Voltar"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <Link
                href={`/assinantes/${id}/editar`}
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Editar"
                title="Editar"
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </Link>
              <button
                onClick={fetchData}
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Atualizar"
                title="Atualizar"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faRotateRight} spin={loading} />
              </button>
            </div>
          </div>
          {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
          <ReadOnlyForm assinante={data} />
        </div>
      </section>
    </Protected>
  );
}

function ReadOnlyField({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs" style={{ color: "var(--muted)" }}>{label}</label>
      <div className="rounded border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
        {value ?? <span className="opacity-60">-</span>}
      </div>
    </div>
  );
}

function ReadOnlyForm({ assinante }: { assinante: any }) {
  const pick = (obj: any, keys: string[]): any =>
    keys.find((k) => obj && obj[k] !== undefined)
      ? obj[keys.find((k) => obj && obj[k] !== undefined)!]
      : undefined;

  const plataformas = useMemo(
    () => pick(assinante || {}, ["plataformas_associadas", "plataformasAssociadas"]) || [],
    [assinante]
  );
  const nomeVal = useMemo(() => pick(assinante || {}, ["nome", "name", "Nome"]), [assinante]);
  const emailVal = useMemo(() => pick(assinante || {}, ["email", "Email"]), [assinante]);
  const valorMesVal = useMemo(
    () => pick(assinante || {}, ["valor_por_mes", "valorPorMes", "valorMensal"]),
    [assinante]
  );

  const fmtCurrency = (n?: number) =>
    typeof n === "number" && !Number.isNaN(n)
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n)
      : "-";

  const getInitials = (name?: string) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "A";
  };

  const valorNumber =
    typeof valorMesVal === "number" ? valorMesVal : Number(valorMesVal);

  return (
    <div className="grid gap-6">
      {/* Cabeçalho do perfil */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className={[
              "inline-flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg",
              "bg-gradient-to-br from-fuchsia-500 to-violet-600",
            ].join(" ")}
            aria-hidden
          >
            <span className="text-lg font-semibold">{getInitials(nomeVal)}</span>
          </span>
          <div>
            <div className="text-xl font-semibold" style={{ color: "var(--fg)" }}>
              {nomeVal || "—"}
            </div>
            <div className="text-sm" style={{ color: "var(--muted)" }}>
              {emailVal || "—"}
            </div>
            <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              ID #{assinante?.id ?? "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Estatística principal */}
      <div
        className={[
          "rounded-2xl border p-4",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
          "backdrop-blur-sm",
        ].join(" ")}
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
          Valor por mês
        </div>
        <div className="mt-1 text-2xl font-bold" style={{ color: "var(--fg)" }}>
          {fmtCurrency(valorNumber)}
        </div>
      </div>

      {/* Plataformas associadas */}
      <div>
        <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--fg)" }}>
          Plataformas associadas
        </h3>
        {Array.isArray(plataformas) && plataformas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plataformas.map((p: any) => {
              const precoMensal =
                typeof p?.precoMensal === "number" ? p.precoMensal : Number(p?.precoMensal);
              const precoIndividual =
                typeof p?.precoIndividual === "number"
                  ? p.precoIndividual
                  : Number(p?.precoIndividual);

              return (
                <div
                  key={p.id}
                  className={[
                    "group relative rounded-2xl border p-4 transition-all",
                    "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] hover:shadow-md",
                    "backdrop-blur-sm",
                  ].join(" ")}
                  style={{
                    borderColor: "var(--border)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
                  }}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold" style={{ color: "var(--fg)" }}>
                        {p.nome ?? "Sem nome"}
                      </div>
                      <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                        ID #{p.id}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                        Preço mensal
                      </div>
                      <div className="mt-1 text-lg font-semibold" style={{ color: "var(--fg)" }}>
                        {fmtCurrency(precoMensal)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                        Preço individual
                      </div>
                      <div className="mt-1 text-lg font-semibold" style={{ color: "var(--fg)" }}>
                        {fmtCurrency(precoIndividual)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-2xl border p-6 text-center text-sm"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            Nenhuma plataforma associada
          </div>
        )}
      </div>
    </div>
  );
}
