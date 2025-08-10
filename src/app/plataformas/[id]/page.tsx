"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PlataformaDetalhe({ params }: { params: { id: string } }) {
  const id = Number(params.id);
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
      <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>Plataforma #{id}</h1>
      <section className="theme-transition rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detalhes</h2>
          <div className="flex items-center gap-2">
            <Link href="/plataformas" className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>Voltar</Link>
            <button onClick={fetchData} className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
              {loading ? "Carregando..." : "Atualizar"}
            </button>
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
  const idVal = pick(plataforma || {}, ["id", "Id", "ID"]);
  const nomeVal = pick(plataforma || {}, ["nome", "name", "Nome"]);
  const urlVal = pick(plataforma || {}, ["url", "URL"]);
  const tipoVal = pick(plataforma || {}, ["tipo_servico", "tipoServico", "tipo"]);
  const precoVal = pick(plataforma || {}, ["preco", "precoMensal", "precoTotal"]);
  const totalVagasVal = pick(plataforma || {}, ["total_vagas", "totalVagas"]);
  const vagasDispVal = pick(plataforma || {}, ["vagas_disponiveis", "vagasDisponiveis"]);
  const cadastradoVal = pick(plataforma || {}, ["cadastrado_em", "cadastradoEm", "created_at", "createdAt"]);
  const atualizadoVal = pick(plataforma || {}, ["atualizado_em", "atualizadoEm", "updated_at", "updatedAt"]);

  const fmtCurrency = (n?: number) => (typeof n === "number" ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n) : undefined);
  const fmtDate = (s?: string) => (s ? new Date(s).toLocaleString() : undefined);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="ID" value={idVal} />
        <ReadOnlyField label="Tipo de serviço" value={tipoVal} />
        <ReadOnlyField label="Nome" value={nomeVal} />
        <ReadOnlyField label="URL" value={urlVal} />
        <ReadOnlyField label="Preço" value={fmtCurrency(typeof precoVal === "number" ? precoVal : Number(precoVal))} />
        <ReadOnlyField label="Total de vagas" value={totalVagasVal} />
        <ReadOnlyField label="Vagas disponíveis" value={vagasDispVal} />
        <ReadOnlyField label="Cadastrado em" value={fmtDate(typeof cadastradoVal === "string" ? cadastradoVal : String(cadastradoVal || ""))} />
        <ReadOnlyField label="Atualizado em" value={fmtDate(typeof atualizadoVal === "string" ? atualizadoVal : String(atualizadoVal || ""))} />
      </div>
    </div>
  );
}
