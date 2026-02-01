"use client";

import Protected from "@/components/Protected";
import { Api } from "@/lib/api";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import { tipoServicoToLabel } from "@/lib/tipoServico";

export default function AssociarPlataformasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = React.use(params);
  const id = Number(idParam);
  const router = useRouter();

  const [assinante, setAssinante] = useState<any>(null);
  const [plataformasDisponiveis, setPlataformasDisponiveis] = useState<any[]>([]);
  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filtroNome, setFiltroNome] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar dados do assinante
      const assinanteData = await Api.getAssinante(id);
      setAssinante(assinanteData);

      // Buscar todas as plataformas disponíveis
      const plataformasData = await Api.listarPlataformas({ pagina: 0, quantidade: 100 });
      const plataformas = plataformasData?.content || plataformasData?.lista || [];

      // Filtrar plataformas que já estão associadas
      const plataformasAssociadas = assinanteData?.plataformas_associadas || assinanteData?.plataformasAssociadas || [];
      const idsAssociados = new Set(plataformasAssociadas.map((p: any) => p.id));

      // Filtrar plataformas não associadas e que possuam vagas disponíveis (>0)
      const plataformasNaoAssociadas = plataformas.filter((p: any) => {
        if (idsAssociados.has(p.id)) return false;
        const vagas = Number(p?.vagas_disponiveis ?? p?.vagasDisponiveis ?? p?.vagas ?? 0);
        return vagas > 0;
      });
      setPlataformasDisponiveis(plataformasNaoAssociadas);
    } catch (e: any) {
      setError(e?.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const togglePlataforma = (plataformaId: number) => {
    setPlataformasSelecionadas((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(plataformaId)) {
        newSet.delete(plataformaId);
      } else {
        newSet.add(plataformaId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (plataformasSelecionadas.size === 0) {
      setError("Selecione ao menos uma plataforma");
      return;
    }

    setLoadingSubmit(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await Api.associarPlataformas(id, {
        plataformaIds: Array.from(plataformasSelecionadas),
      });
      setSuccessMessage("Plataformas associadas com sucesso!");
      setTimeout(() => {
        router.push(`/assinantes/${id}`);
      }, 1500);
    } catch (e: any) {
      setError(e?.message || "Erro ao associar plataformas");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const fmtCurrency = (n?: number) =>
    typeof n === "number" && !Number.isNaN(n)
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n)
      : "-";

  const plataformasFiltradas = plataformasDisponiveis.filter((p) =>
    filtroNome === "" || p.nome?.toLowerCase().includes(filtroNome.toLowerCase())
  );

  const nomeAssinante = assinante?.nome || assinante?.name || assinante?.Nome || `Assinante #${id}`;

  return (
    <Protected>
      <h1 className="mb-4 text-2xl font-semibold" style={{ color: "var(--primary)" }}>
        Associar Plataformas
      </h1>
      <section
        className="theme-transition relative rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Selecione as plataformas</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Assinante: <span className="font-medium">{nomeAssinante}</span>
            </p>
          </div>
          <Link
            href={`/assinantes/${id}`}
            className="rounded-md border px-3 py-2"
            style={{ borderColor: "var(--border)", background: "var(--bg)" }}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Voltar
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-md border border-green-500 bg-green-500/10 p-3 text-sm text-green-400">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Carregando...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <input
                type="text"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Filtrar plataformas por nome..."
                className="theme-transition w-full rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm"
              />
            </div>

            {plataformasFiltradas.length === 0 ? (
              <div
                className="rounded-lg border p-6 text-center text-sm"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              >
                {filtroNome
                  ? "Nenhuma plataforma encontrada com esse filtro"
                  : "Todas as plataformas já estão associadas a este assinante"}
              </div>
            ) : (
              <>
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {plataformasFiltradas.map((plataforma) => {
                    const isSelected = plataformasSelecionadas.has(plataforma.id);
                    // Ler preço e vagas com fallbacks para formatos distintos retornados pela API
                    const preco =
                      typeof plataforma?.preco === "number"
                        ? plataforma.preco
                        : typeof plataforma?.precoMensal === "number"
                        ? plataforma.precoMensal
                        : Number(plataforma?.preco ?? plataforma?.precoMensal ?? 0);
                    const vagas = Number(plataforma?.vagas_disponiveis ?? plataforma?.vagasDisponiveis ?? plataforma?.vagas ?? 0);

                    return (
                      <button
                        key={plataforma.id}
                        onClick={() => togglePlataforma(plataforma.id)}
                        className={[
                          "theme-transition relative rounded-lg border p-4 text-left transition-all",
                          isSelected
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-[var(--border)] bg-[var(--bg)] hover:border-purple-500/50",
                        ].join(" ")}
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-semibold">{plataforma.nome}</div>
                            {plataforma.tipoServico && (
                              <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                                {tipoServicoToLabel(plataforma.tipoServico)}
                              </div>
                            )}
                          </div>
                          <div
                            className={[
                              "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                              isSelected
                                ? "border-purple-500 bg-purple-500 text-white"
                                : "border-[var(--border)]",
                            ].join(" ")}
                          >
                            {isSelected && <FontAwesomeIcon icon={faCheck} className="text-xs" />}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div style={{ color: "var(--muted)" }}>Preço</div>
                            <div className="font-medium">{fmtCurrency(preco)}</div>
                          </div>
                          <div>
                            <div style={{ color: "var(--muted)" }}>Vagas disponíveis</div>
                            <div className="font-medium">{Number.isFinite(vagas) ? String(vagas) : "-"}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border)" }}>
                  <div className="text-sm" style={{ color: "var(--muted)" }}>
                    {plataformasSelecionadas.size} plataforma(s) selecionada(s)
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={loadingSubmit || plataformasSelecionadas.size === 0}
                    className={[
                      "rounded-md px-4 py-2 font-medium transition-all",
                      plataformasSelecionadas.size === 0
                        ? "cursor-not-allowed opacity-50"
                        : "hover:opacity-90",
                    ].join(" ")}
                    style={{
                      background: "var(--primary)",
                      color: "white",
                    }}
                  >
                    {loadingSubmit ? (
                      <>
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                        <span className="ml-2">Associando...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Associar Plataformas
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </section>
    </Protected>
  );
}
