"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRotateRight, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AssinanteDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = React.use(params);
  const id = Number(idParam);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

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

  const handleDesassociar = async (plataformaId: number) => {
    if (!confirm("Deseja realmente desassociar esta plataforma?")) {
      return;
    }

    setRemovingId(plataformaId);
    setError(null);

    try {
      await Api.desassociarPlataforma(id, plataformaId);
      await fetchData(); // Recarregar dados
    } catch (e: any) {
      setError(e?.message || "Erro ao desassociar plataforma");
    } finally {
      setRemovingId(null);
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
                href={`/assinantes/${id}/associar-plataformas`}
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Associar plataformas"
                title="Associar plataformas"
              >
                <FontAwesomeIcon icon={faPlus} />
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
          <ReadOnlyForm assinante={data} onDesassociar={handleDesassociar} removingId={removingId} />
        </div>
      </section>
    </Protected>
  );
}

function ReadOnlyForm({ assinante, onDesassociar, removingId }: { assinante: any; onDesassociar: (id: number) => void; removingId: number | null }) {
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
                    <button
                      onClick={() => onDesassociar(p.id)}
                      disabled={removingId === p.id}
                      className="rounded-md border p-2 text-red-500 transition-all hover:bg-red-500/10 disabled:opacity-50"
                      style={{ borderColor: "var(--border)" }}
                      title="Desassociar plataforma"
                    >
                      {removingId === p.id ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                      ) : (
                        <FontAwesomeIcon icon={faTrash} />
                      )}
                    </button>
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
