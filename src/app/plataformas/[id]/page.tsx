"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { tipoServicoToLabel } from "@/lib/tipoServico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPenToSquare, faRotateRight, faCloud } from "@fortawesome/free-solid-svg-icons";

export default function PlataformaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = use(params);
  const id = Number(idParam);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.getPlataforma(id);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar plataforma");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  return (
    <Protected>
        <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>{(data?.nome ?? data?.name ?? data?.Nome) || `Plataforma #${id}`}</h1>
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
            <h2 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Plataforma</h2>
            <div className="flex items-center gap-2">
              <Link
                href="/plataformas"
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Voltar"
                title="Voltar"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <Link
                href={`/plataformas/${id}/editar`}
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
          <ReadOnlyForm plataforma={data} />
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

function ReadOnlyForm({ plataforma }: { plataforma: any }) {
  const pick = (obj: any, keys: string[]): any =>
    keys.find((k) => obj && obj[k] !== undefined)
      ? obj[keys.find((k) => obj && obj[k] !== undefined)!]
      : undefined;

  const nomeVal = pick(plataforma || {}, ["nome", "name", "Nome"]);
  const urlVal = pick(plataforma || {}, ["url", "URL"]);
  const tipoVal = pick(plataforma || {}, ["tipo_servico", "tipoServico", "tipo"]);
  const precoVal = pick(plataforma || {}, ["preco", "precoMensal", "precoTotal"]);
  const totalVagasVal = pick(plataforma || {}, ["total_vagas", "totalVagas"]);
  const vagasDispVal = pick(plataforma || {}, ["vagas_disponiveis", "vagasDisponiveis"]);

  const fmtCurrency = (n?: number) =>
    typeof n === "number" && !Number.isNaN(n)
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n)
      : "-";

  const precoNumber = typeof precoVal === "number" ? precoVal : Number(precoVal);
  const vagasInfo = `${vagasDispVal ?? "-"} / ${totalVagasVal ?? "-"}`;
  const tipoLabel = tipoVal ? tipoServicoToLabel(String(tipoVal)) : "-";

  return (
    <div className="grid gap-6">
      {/* Cabeçalho com avatar/ícone */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className={[
              "inline-flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg",
              "bg-gradient-to-br from-sky-500 to-cyan-600",
            ].join(" ")}
            aria-hidden
          >
            <FontAwesomeIcon icon={faCloud} />
          </span>
          <div>
            <div className="text-xl font-semibold" style={{ color: "var(--fg)" }}>
              {nomeVal || "—"}
            </div>
            {urlVal && (
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                {urlVal}
              </div>
            )}
            <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              ID #{plataforma?.id ?? "—"}
            </div>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span
            className="rounded border px-2 py-1 text-xs"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            {tipoLabel}
          </span>
        </div>
      </div>

      {/* Estatísticas principais */}
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
            Preço
          </div>
          <div className="mt-1 text-2xl font-bold" style={{ color: "var(--fg)" }}>
            {fmtCurrency(precoNumber)}
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
            Vagas
          </div>
          <div className="mt-1 text-lg font-semibold" style={{ color: "var(--fg)" }}>
            {vagasInfo}
          </div>
        </div>
      </div>
    </div>
  );
}
