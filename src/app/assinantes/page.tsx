"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faTrash, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AssinantesPage() {
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
      const res = await Api.listarAssinantes({ pagina: 0, quantidade: 10, nome: nome || undefined });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar assinantes");
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
        Assinantes
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
        <ListCards
          data={data}
          onView={(id) => router.push(`/assinantes/${id}`)}
          onEdit={(id) => router.push(`/assinantes/${id}/editar`)}
          onDelete={async (id) => {
            if (!confirm("Confirmar exclusão?")) return;
            try {
              await Api.deleteAssinante(id);
              await fetchData();
            } catch (e: any) {
              alert(e?.message || "Erro ao excluir assinante");
            }
          }}
        />

        {/* Floating create button */}
        <button
          onClick={() => setShowCreate(true)}
          className="theme-transition absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full shadow-lg hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--fg)" }}
          title="Novo assinante"
          aria-label="Novo assinante"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </section>

      {showCreate && (
        <CreateAssinanteModal
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

type Row = { id: number; nome?: string; email?: string; valor_por_mes?: number; valor_total?: number };

function toArray(input: any): Row[] {
  if (Array.isArray(input)) return input as Row[];
  if (input?.content && Array.isArray(input.content)) return input.content as Row[];
  if (input?.items && Array.isArray(input.items)) return input.items as Row[];
  if (input?.data && Array.isArray(input.data)) return input.data as Row[];
  return [];
}

function ListCards({
  data,
  onView,
  onEdit,
  onDelete,
}: {
  data: any;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const rows = useMemo(() => toArray(data), [data]);

  const getInitials = (name?: string) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "A";
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {rows.map((r) => {
        return (
          <section
            key={r.id}
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
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg",
                      "bg-gradient-to-br from-fuchsia-500 to-violet-600",
                    ].join(" ")}
                    aria-hidden
                  >
                    <span className="text-base font-semibold">{getInitials(r.nome)}</span>
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
                      {r.nome || "Sem nome"}
                    </h3>
                    {r.email && (
                      <p className="text-sm" style={{ color: "var(--muted)" }}>
                        {r.email}
                      </p>
                    )}
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      ID #{r.id}
                    </p>
                  </div>
                </div>

                <div className="hidden gap-1 sm:flex">
                  <button
                    className="rounded border p-2"
                    style={{ borderColor: "var(--border)" }}
                    title="Ver"
                    onClick={() => onView(r.id)}
                    aria-label={`Ver assinante ${r.nome ?? r.id}`}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="rounded border p-2"
                    style={{ borderColor: "var(--border)" }}
                    title="Editar"
                    onClick={() => onEdit(r.id)}
                    aria-label={`Editar assinante ${r.nome ?? r.id}`}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    className="rounded border p-2 text-red-400"
                    style={{ borderColor: "var(--border)" }}
                    title="Excluir"
                    onClick={() => onDelete(r.id)}
                    aria-label={`Excluir assinante ${r.nome ?? r.id}`}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 sm:hidden">
                <button
                  className="rounded border px-3 py-2"
                  style={{ borderColor: "var(--border)" }}
                  title="Ver"
                  onClick={() => onView(r.id)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button
                  className="rounded border px-3 py-2"
                  style={{ borderColor: "var(--border)" }}
                  title="Editar"
                  onClick={() => onEdit(r.id)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="rounded border px-3 py-2 text-red-400"
                  style={{ borderColor: "var(--border)" }}
                  title="Excluir"
                  onClick={() => onDelete(r.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </section>
        );
      })}
      {rows.length === 0 && (
        <div
          className="col-span-full rounded border p-6 text-center text-sm"
          style={{ borderColor: "var(--border)" }}
        >
          Nenhum resultado
        </div>
      )}
    </div>
  );
}

function CreateAssinanteModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await Api.cadastrarAssinante({ nome, email });
      onCreated();
    } catch (e: any) {
      setError(e?.message || "Erro ao criar assinante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "var(--overlay)" }}>
      <section
        className={[
          "group relative w-full max-w-md rounded-2xl border p-5 transition-all",
          "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
          "backdrop-blur-sm",
        ].join(" ")}
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
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
            <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Novo Assinante</h3>
            <button
              onClick={onClose}
              className="rounded-md border p-2"
              style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              aria-label="Fechar"
              title="Fechar"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>Nome</label>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none ring-0 transition focus:ring-2 focus:ring-[var(--primary)]/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none ring-0 transition focus:ring-2 focus:ring-[var(--primary)]/30"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border px-4 py-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              >
                Cancelar
              </button>
              <button
                disabled={loading}
                className="rounded-md px-4 py-2"
                style={{ background: "var(--primary)", color: "#ffffff" }}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
