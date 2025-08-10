"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { tipoServicoToLabel, TIPO_SERVICO_OPTIONS } from "@/lib/tipoServico";
import type { TipoServico } from "@/lib/tipoServico";

export default function PlataformasPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.listarPlataformas({ pagina: 0, quantidade: 10, nome: nome || undefined });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar plataformas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Protected>
      <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>
        Plataformas
      </h1>
      <section className="theme-transition relative rounded-lg border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lista</h2>
          <div className="flex items-center gap-2">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Filtrar por nome"
              className="theme-transition rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm"
            />
            <button onClick={fetchData} className="theme-transition rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
              {loading ? "Carregando..." : "Buscar"}
            </button>
          </div>
        </div>
        {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
        <PlatformsTable data={data} onView={(id) => router.push(`/plataformas/${id}`)} onEdit={(id) => router.push(`/plataformas/${id}/editar`)} onDelete={async (id) => {
          if (!confirm("Confirmar exclusão?")) return;
          try {
            await Api.deletePlataforma(id);
            await fetchData();
          } catch (e: any) {
            alert(e?.message || "Erro ao excluir plataforma");
          }
        }} />

        {/* Floating create button */}
        <button
          onClick={() => setShowCreate(true)}
          className="theme-transition absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full shadow-lg hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--fg)" }}
          title="Nova plataforma"
          aria-label="Nova plataforma"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </section>
      {showCreate && (
        <CreatePlataformaModal
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            setShowCreate(false);
            await fetchData();
          }}
        />
      )}
    </Protected>
  );
}

type Row = { id: number; nome?: string; preco?: number; tipo_servico?: TipoServico; total_vagas?: number; vagas_disponiveis?: number };

function toArray(input: any): Row[] {
  if (Array.isArray(input)) return input as Row[];
  if (input?.content && Array.isArray(input.content)) return input.content as Row[];
  if (input?.items && Array.isArray(input.items)) return input.items as Row[];
  if (input?.data && Array.isArray(input.data)) return input.data as Row[];
  return [];
}

function PlatformsTable({ data, onView, onEdit, onDelete }: { data: any; onView: (id: number) => void; onEdit: (id: number) => void; onDelete: (id: number) => void }) {
  const rows = useMemo(() => toArray(data), [data]);
  return (
    <div className="overflow-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border)" }}>
            <th className="px-2 py-2">ID</th>
            <th className="px-2 py-2">Nome</th>
            <th className="px-2 py-2">Tipo</th>
            <th className="px-2 py-2">Preço</th>
            <th className="px-2 py-2">Total de vagas</th>
            <th className="px-2 py-2">Vagas disp.</th>
            <th className="px-2 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              <td className="px-2 py-2">{r.id}</td>
              <td className="px-2 py-2">{r.nome}</td>
              <td className="px-2 py-2">{tipoServicoToLabel(r.tipo_servico) ?? "-"}</td>
              <td className="px-2 py-2">{r.preco}</td>
              <td className="px-2 py-2">{r.total_vagas}</td>
              <td className="px-2 py-2">{r.vagas_disponiveis ?? "-"}</td>
              <td className="px-2 py-2">
                <div className="flex items-center gap-2">
                  <button className="rounded border px-2 py-1" style={{ borderColor: "var(--border)" }} title="Ver" onClick={() => onView(r.id)}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button className="rounded border px-2 py-1" style={{ borderColor: "var(--border)" }} title="Editar" onClick={() => onEdit(r.id)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button className="rounded border px-2 py-1 text-red-400" style={{ borderColor: "var(--border)" }} title="Excluir" onClick={() => onDelete(r.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-2 py-4 text-center" colSpan={7}>
                Nenhum resultado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function CreatePlataformaModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState<number | "">("");
  const [tipo, setTipo] = useState<TipoServico>("STREAMING_VIDEO");
  const [totalVagas, setTotalVagas] = useState<number | "">("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await Api.cadastrarPlataforma({
        nome,
        preco: typeof preco === "string" ? 0 : preco,
        tipo_servico: tipo,
        total_vagas: typeof totalVagas === "string" ? 0 : totalVagas,
        ...(url ? { url } : {}),
      });
      onCreated();
    } catch (e: any) {
      setError(e?.message || "Erro ao criar plataforma");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="theme-transition w-full max-w-md rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Nova Plataforma</h3>
          <button onClick={onClose} className="rounded px-2 py-1" style={{ background: "var(--bg)" }}>Fechar</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>Nome</label>
            <input required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full rounded border border-[var(--border)] bg-[var(--input)] p-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>Preço</label>
            <input required type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value === "" ? "" : parseFloat(e.target.value))} className="w-full rounded border border-[var(--border)] bg-[var(--input)] p-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>Tipo de serviço</label>
            <select
              className="w-full rounded border border-[var(--border)] bg-[var(--input)] p-2"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoServico)}
              required
            >
              {TIPO_SERVICO_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>Total de vagas</label>
            <input required type="number" value={totalVagas} onChange={(e) => setTotalVagas(e.target.value === "" ? "" : parseInt(e.target.value, 10))} className="w-full rounded border border-[var(--border)] bg-[var(--input)] p-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>URL (opcional)</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded border border-[var(--border)] bg-[var(--input)] p-2" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded border px-3 py-2" style={{ borderColor: "var(--border)" }}>Cancelar</button>
            <button disabled={loading} className="rounded px-3 py-2" style={{ background: "var(--primary)", color: "var(--fg)" }}>{loading ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
