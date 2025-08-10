"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
      <section className="theme-transition rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Perfil</h2>
          <div className="flex items-center gap-2">
            <Link href="/assinantes" className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>Voltar</Link>
            <button onClick={fetchData} className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
              {loading ? "Carregando..." : "Atualizar"}
            </button>
          </div>
        </div>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <ReadOnlyForm assinante={data} />
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
  const pick = (obj: any, keys: string[]): any => keys.find((k) => obj && obj[k] !== undefined) ? obj[keys.find((k) => obj && obj[k] !== undefined)!] : undefined;
  const plataformas = useMemo(() => pick(assinante || {}, ["plataformas_associadas", "plataformasAssociadas"]) || [], [assinante]);
  const nomeVal = useMemo(() => pick(assinante || {}, ["nome", "name", "Nome"]), [assinante]);
  const emailVal = useMemo(() => pick(assinante || {}, ["email", "Email"]), [assinante]);
  const valorMesVal = useMemo(() => pick(assinante || {}, ["valor_por_mes", "valorPorMes", "valorMensal"]), [assinante]);

  const fmtCurrency = (n?: number) => (typeof n === "number" ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n) : undefined);

  return (
    <div className="grid gap-6">
      {/* Header with avatar */}
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full border" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
          <FontAwesomeIcon icon={faUser} size="lg" />
        </div>
        <div>
          <div className="text-lg font-semibold">{nomeVal || "—"}</div>
          <div className="text-sm" style={{ color: "var(--muted)" }}>{emailVal || "—"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReadOnlyField label="Nome" value={nomeVal} />
        <ReadOnlyField label="Email" value={emailVal} />
        <ReadOnlyField label="Valor por mês" value={fmtCurrency(typeof valorMesVal === "number" ? valorMesVal : Number(valorMesVal))} />
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Plataformas associadas</h3>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                <th className="px-2 py-2">ID</th>
                <th className="px-2 py-2">Nome</th>
                <th className="px-2 py-2">Preço mensal</th>
                <th className="px-2 py-2">Preço individual</th>
              </tr>
            </thead>
            <tbody>
              {plataformas?.map((p: any) => (
                <tr key={p.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <td className="px-2 py-2">{p.id}</td>
                  <td className="px-2 py-2">{p.nome}</td>
                  <td className="px-2 py-2">{fmtCurrency(p.precoMensal)}</td>
                  <td className="px-2 py-2">{fmtCurrency(p.precoIndividual)}</td>
                </tr>
              ))}
              {(!plataformas || plataformas.length === 0) && (
                <tr>
                  <td className="px-2 py-3 text-center" colSpan={4}>Nenhuma plataforma associada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
