"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { tipoServicoToLabel } from "@/lib/tipoServico";

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
      <section className="theme-transition rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detalhes</h2>
          <div className="flex items-center gap-2">
            <Link href="/plataformas" className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>Voltar</Link>
            <Link href={`/plataformas/${id}/editar`} className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
              Editar
            </Link>
          </div>
        </div>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <ReadOnlyForm plataforma={data} />
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
  const pick = (obj: any, keys: string[]): any => keys.find((k) => obj && obj[k] !== undefined) ? obj[keys.find((k) => obj && obj[k] !== undefined)!] : undefined;
  const nomeVal = pick(plataforma || {}, ["nome", "name", "Nome"]);
  const urlVal = pick(plataforma || {}, ["url", "URL"]);
  const tipoVal = pick(plataforma || {}, ["tipo_servico", "tipoServico", "tipo"]);
  const precoVal = pick(plataforma || {}, ["preco", "precoMensal", "precoTotal"]);
  const totalVagasVal = pick(plataforma || {}, ["total_vagas", "totalVagas"]);
  const vagasDispVal = pick(plataforma || {}, ["vagas_disponiveis", "vagasDisponiveis"]);

  const fmtCurrency = (n?: number) => (typeof n === "number" ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n) : undefined);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="Nome" value={nomeVal} />
        <ReadOnlyField label="URL" value={urlVal} />
        <ReadOnlyField label="Tipo de serviço" value={tipoVal ? tipoServicoToLabel(String(tipoVal)) : undefined} />
        <ReadOnlyField label="Preço" value={fmtCurrency(typeof precoVal === "number" ? precoVal : Number(precoVal))} />
        <ReadOnlyField label="Total de vagas" value={totalVagasVal} />
        <ReadOnlyField label="Vagas disponíveis" value={vagasDispVal} />
      </div>
    </div>
  );
}
