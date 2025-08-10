"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import {use, useEffect, useMemo, useState} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TIPO_SERVICO_OPTIONS } from "@/lib/tipoServico";
import type { TipoServico } from "@/lib/tipoServico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function EditarPlataformaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = use(params);
  const id = Number(idParam);
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState<number | "">("");
  const [tipo, setTipo] = useState<TipoServico>("STREAMING_VIDEO");
  const [totalVagas, setTotalVagas] = useState<number | "">("");
  const [url, setUrl] = useState("");

  const [initialNome, setInitialNome] = useState("");
  const [initialPreco, setInitialPreco] = useState<number | "">("");
  const [initialTipo, setInitialTipo] = useState<TipoServico>("STREAMING_VIDEO");
  const [initialTotalVagas, setInitialTotalVagas] = useState<number | "">("");
  const [initialUrl, setInitialUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoadingData(true);
        const p = await Api.getPlataforma(id);
        if (!isMounted) return;
        setNome(p?.nome ?? p?.name ?? "");
        setPreco(typeof p?.preco === "number" ? p.preco : p?.preco ? Number(p.preco) : "");
        setTipo(p?.tipo_servico ?? p?.tipoServico ?? "STREAMING_VIDEO");
        setTotalVagas(typeof p?.total_vagas === "number" ? p.total_vagas : p?.totalVagas ? Number(p.totalVagas) : "");
        setUrl(p?.url ?? "");

        setInitialNome(p?.nome ?? p?.name ?? "");
        setInitialPreco(typeof p?.preco === "number" ? p.preco : p?.preco ? Number(p.preco) : "");
        setInitialTipo(p?.tipo_servico ?? p?.tipoServico ?? "STREAMING_VIDEO");
        setInitialTotalVagas(typeof p?.total_vagas === "number" ? p.total_vagas : p?.totalVagas ? Number(p.totalVagas) : "");
        setInitialUrl(p?.url ?? "");
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar plataforma");
      } finally {
        setLoadingData(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const isDirty = useMemo(() => {
    const precoStr = preco === "" ? "" : String(preco);
    const iPrecoStr = initialPreco === "" ? "" : String(initialPreco);
    const vagasStr = totalVagas === "" ? "" : String(totalVagas);
    const iVagasStr = initialTotalVagas === "" ? "" : String(initialTotalVagas);
    return (
      nome !== initialNome ||
      precoStr !== iPrecoStr ||
      tipo !== initialTipo ||
      vagasStr !== iVagasStr ||
      url !== initialUrl
    );
  }, [nome, preco, initialPreco, tipo, initialTipo, totalVagas, initialTotalVagas, url, initialUrl]);

  const closeModal = () => {
    if (isDirty) {
      const ok = confirm("Existem alterações não salvas. Deseja sair sem salvar?");
      if (!ok) return;
    }
    router.push(`/plataformas`);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await Api.atualizarPlataforma(id, {
        nome,
        preco: typeof preco === "string" ? 0 : preco,
        tipo_servico: tipo,
        total_vagas: typeof totalVagas === "string" ? 0 : totalVagas,
        ...(url ? { url } : {}),
      });
      // Redireciona para detalhes após salvar
      router.push(`/plataformas/${id}`);
    } catch (e: any) {
      setError(e?.message || "Erro ao atualizar plataforma");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected>
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={closeModal}>
        <section
          onClick={(e) => e.stopPropagation()}
          className={[
            "group relative w-full max-w-2xl rounded-2xl border p-5 transition-all",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]",
            "backdrop-blur-sm",
          ].join(" ")}
          style={{
            borderColor: "var(--border)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.0))",
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
              <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
                Editar Plataforma
              </h3>
              <Link
                href={`/plataformas/${id}`}
                className="rounded-md border p-2"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                aria-label="Fechar"
                title="Fechar"
                onClick={(e) => {
                  e.preventDefault();
                  closeModal();
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Link>
            </div>

            {error && <p className="mb-2 text-sm text-red-400">{error}</p>}

            {loadingData ? (
              <p className="text-sm opacity-80">Carregando...</p>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>
                      Nome
                    </label>
                    <input
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none transition focus:ring-2 focus:ring-[var(--primary)]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>
                      Preço
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none transition focus:ring-2 focus:ring-[var(--primary)]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>
                      Tipo de serviço
                    </label>
                    <select
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none transition focus:ring-2 focus:ring-[var(--primary)]/30"
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
                    <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>
                      Total de vagas
                    </label>
                    <input
                      required
                      type="number"
                      value={totalVagas}
                      onChange={(e) => setTotalVagas(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none transition focus:ring-2 focus:ring-[var(--primary)]/30"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm" style={{ color: "var(--muted)" }}>
                      URL (opcional)
                    </label>
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--input)] p-3 outline-none transition focus:ring-2 focus:ring-[var(--primary)]/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Link
                    href={`/plataformas/${id}`}
                    className="rounded-md border px-4 py-2"
                    style={{ borderColor: "var(--border)", background: "var(--bg)" }}
                    onClick={(e) => {
                      e.preventDefault();
                      closeModal();
                    }}
                  >
                    Cancelar
                  </Link>
                  <button
                    disabled={loading}
                    className="rounded-md px-4 py-2"
                    style={{ background: "var(--primary)", color: "var(--fg)" }}
                  >
                    {loading ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </Protected>
  );
}
